#!/usr/bin/env node
/**
 * Validate that every field in the PIM JSON is correctly mapped by pimParser:
 *   - attrCode  : ${fieldKey}_${section}
 *   - label     : field.label (or fieldKey for primitives)
 *   - value     : field.value with option-object unwrapping
 *
 * Mirrors the exact logic of pimParser.js + AttributeRow ValueDisplay.
 * Exit code 0 = all OK, 1 = issues found.
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { resolve, dirname } from 'path';

const __dir = dirname(fileURLToPath(import.meta.url));
const JSON_PATH = resolve(__dir, '../../data/test_maylanh_PIM.json');

const json = JSON.parse(readFileSync(JSON_PATH, 'utf8'));

const SECTIONS = ['general', 'content', 'specs'];

const issues = [];
const rows = [];

SECTIONS.forEach(section => {
  const sectionData = json[section];
  if (!sectionData || typeof sectionData !== 'object') {
    issues.push({ severity: 'ERROR', section, fieldKey: '(section)', msg: 'Section missing or not an object in JSON' });
    return;
  }

  Object.entries(sectionData).forEach(([fieldKey, field]) => {
    const attrCode = `${fieldKey}_${section}`;

    // ── Primitive scalar (e.g. month_warranty: 36) ──────────────────────────
    // Parser now handles these as text rows — no longer a skip
    if (field === null || typeof field !== 'object') {
      const value = field ?? null;
      const status = value === null ? 'missing' : 'new_attr';
      rows.push({ attrCode, label: fieldKey, displayValue: value === null ? '—' : String(value), status, note: 'primitive field' });
      return;
    }

    // ── Normal object field ──────────────────────────────────────────────────
    const rawValue = field.value ?? null;
    const label = field.label ?? fieldKey;

    if (!('label' in field)) {
      issues.push({ severity: 'WARN', section, fieldKey, attrCode, msg: 'No label — display falls back to fieldKey' });
    }

    // Unwrap option-object arrays {value, isPim, optionCode}[]
    let displayValue;
    if (Array.isArray(rawValue)) {
      if (rawValue.length === 0) {
        displayValue = '—';
      } else {
        const unwrapped = rawValue.map(item =>
          item && typeof item === 'object' && 'value' in item ? item.value : item
        );
        // Check for any option objects still lacking a .value key
        rawValue.forEach((item, idx) => {
          if (item && typeof item === 'object' && !('value' in item)) {
            issues.push({
              severity: 'WARN',
              section, fieldKey, attrCode,
              msg: `options[${idx}] is an object without a .value key — will render undefined`,
            });
          }
        });
        displayValue = unwrapped.length === 1 ? String(unwrapped[0]) : unwrapped.map(String);
      }
    } else {
      displayValue = rawValue === null ? '—' : String(rawValue);
    }

    const isEmpty =
      rawValue === null ||
      rawValue === undefined ||
      (Array.isArray(rawValue) && rawValue.length === 0);

    const status = isEmpty ? 'missing' : field.isPim === true ? 'matched' : 'new_attr';

    rows.push({ attrCode, label, displayValue, status });
  });
});

// ── Output ────────────────────────────────────────────────────────────────────

const errors = issues.filter(i => i.severity === 'ERROR');
const warns  = issues.filter(i => i.severity === 'WARN');

const byStatus = { matched: 0, new_attr: 0, missing: 0 };
rows.forEach(r => { byStatus[r.status] = (byStatus[r.status] || 0) + 1; });

console.log('\n╔══════════════════════════════════════════════════════════════╗');
console.log('║            DMX PIM Data Validation Report                   ║');
console.log('╚══════════════════════════════════════════════════════════════╝\n');
console.log(`Total rows parsed   : ${rows.length}`);
console.log(`  ✓ matched         : ${byStatus.matched}`);
console.log(`  ⚠ new_attr        : ${byStatus.new_attr}`);
console.log(`  ✗ missing         : ${byStatus.missing}`);
console.log(`❌ ERRORS           : ${errors.length}`);
console.log(`ℹ  WARNINGS         : ${warns.length}\n`);

if (errors.length) {
  console.log('── ERRORS ──────────────────────────────────────────────────────');
  errors.forEach(e => console.log(`  [${e.section}] ${e.fieldKey}\n    → ${e.msg}`));
  console.log();
}

if (warns.length) {
  console.log('── WARNINGS ────────────────────────────────────────────────────');
  warns.forEach(w => console.log(`  [${w.section}] ${w.attrCode}: ${w.msg}`));
  console.log();
}

console.log('── All rows (attrCode | label | status) ────────────────────────');
rows.forEach(r => {
  const val = Array.isArray(r.displayValue) ? r.displayValue.join('; ') : r.displayValue;
  const valTrunc = val && val.length > 60 ? val.slice(0, 57) + '...' : (val ?? '—');
  const statusIcon = r.status === 'matched' ? '✓' : r.status === 'new_attr' ? '⚠' : '✗';
  console.log(`  ${statusIcon} ${r.attrCode.padEnd(55)} ${r.label.padEnd(35)} ${valTrunc}`);
});

console.log();
if (errors.length === 0 && warns.length === 0) {
  console.log('✅ All data maps correctly — 0 issues.\n');
  process.exit(0);
} else {
  console.log(`❌ ${errors.length} error(s), ${warns.length} warning(s). See above.\n`);
  process.exit(errors.length > 0 ? 1 : 0);
}
