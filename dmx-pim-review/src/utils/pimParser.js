function itemStatus(item) {
  const code = item?.optionCode ?? null;
  if (item?.isPim === true && code !== null) return 'matched';
  if (code === null) return 'new_value';
  return 'new_attr';
}

function scalarStatus(field, optionCode) {
  if (field.isPim === true && optionCode !== null) return 'matched';
  if (optionCode === null) return 'new_value';
  return 'new_attr';
}

export function parsePimData(json) {
  const attributes = [];
  const sections = ['general', 'content', 'specs'];

  sections.forEach(section => {
    const sectionData = json[section];
    if (!sectionData || typeof sectionData !== 'object') return;

    Object.entries(sectionData).forEach(([fieldKey, field]) => {
      // Primitive scalar fields (e.g. month_warranty: 36)
      if (field === null || typeof field !== 'object') {
        const value = field ?? null;
        attributes.push({
          key: `${fieldKey}__${section}`,
          fieldKey,
          label: fieldKey,
          propertyType: 'text',
          value,
          isPim: null,
          cmsCode: null,
          optionCode: null,
          section,
          status: value === null ? 'missing' : 'new_value',
          flagged: false,
          _wasEmpty: value === null,
          _edited: false,
        });
        return;
      }

      const rawValue = field.value ?? null;
      const isEmpty =
        rawValue === null ||
        rawValue === undefined ||
        (Array.isArray(rawValue) && rawValue.length === 0);

      // Array of option objects → expand one row per item
      if (
        !isEmpty &&
        Array.isArray(rawValue) &&
        rawValue.some(i => i && typeof i === 'object')
      ) {
        rawValue.forEach((item, idx) => {
          const val   = item?.value ?? null;
          const code  = item?.optionCode ?? null;
          const isFirst = idx === 0;
          attributes.push({
            key: `${fieldKey}__${section}__${idx}`,
            fieldKey,
            // Show label + cmsCode only on first sub-row to avoid repetition
            label:        isFirst ? (field.label || fieldKey) : '',
            cmsCode:      isFirst ? (field.cmsCode ?? null) : null,
            propertyType: field.propertyType || 'options',
            value:        val,
            isPim:        item?.isPim ?? null,
            optionCode:   code,
            section,
            status:       val === null ? 'missing' : itemStatus(item),
            isSubRow:     !isFirst,
            flagged:      false,
            _wasEmpty:    val === null,
            _edited:      false,
          });
        });
        return;
      }

      // Scalar / textarea / non-object-array value
      const optionCode = field.optionCode ?? null;
      const status = isEmpty
        ? 'missing'
        : scalarStatus(field, optionCode);

      attributes.push({
        key: `${fieldKey}__${section}`,
        fieldKey,
        label: field.label || fieldKey,
        propertyType: field.propertyType || 'text',
        value: rawValue,
        isPim: field.isPim ?? null,
        cmsCode: field.cmsCode ?? null,
        optionCode,
        section,
        status,
        isSubRow: false,
        flagged: false,
        _wasEmpty: isEmpty,
        _edited: false,
      });
    });
  });

  return attributes;
}

export const SECTION_META = {
  general: { title: 'Thông tin chung', icon: '📋', color: '#0071e3' },
  content: { title: 'Thông tin nội dung', icon: '📝', color: '#34c759' },
  specs: { title: 'Thông số kỹ thuật', icon: '⚙️', color: '#ff9500' },
};
