# Validate PIM Data

Runs the PIM data validator to check that every field in `data/test_maylanh_PIM.json` maps correctly to the rendered table (attrCode, label, value).

## What it checks

- **PRIMITIVE_FIELD**: fields that are raw primitives (e.g. `month_warranty: 36`) — the parser skips these, causing missing rows
- **OPTION_OBJECT_VALUE**: `options`-type values that are `{value, isPim, optionCode}` objects — must unwrap `.value`, not `JSON.stringify`
- **NO_LABEL / NO_VALUE**: fields missing expected keys

## Steps

1. Run the validation script and show the report:

```bash
cd "$CLAUDE_PROJECT_DIR/dmx-pim-review" && node scripts/validate-pim-data.js
```

2. If issues are found, report them grouped by severity (ERROR / FIX_NEEDED / WARN) and suggest which files to fix:
   - **Parser skips primitives** → fix `src/utils/pimParser.js` (handle non-object fields)
   - **Option object rendering** → fix `src/components/AttributeRow.jsx` `ValueDisplay` (unwrap `.value` from array items)

3. After fixes are applied, re-run this skill to confirm 0 issues remain.
