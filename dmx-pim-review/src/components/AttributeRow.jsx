function isUrl(v) {
  return typeof v === 'string' && v.startsWith('http');
}

function TextOrLink({ text }) {
  if (isUrl(text)) {
    return (
      <a className="val-link" href={text} target="_blank" rel="noopener noreferrer">
        {text}
      </a>
    );
  }
  return <span className="val-text">{text}</span>;
}

function ValueDisplay({ attr }) {
  const { propertyType, value } = attr;

  if (value === null || value === undefined) {
    return <span className="val-empty">—</span>;
  }

  if (propertyType === 'yes/no') {
    return (
      <span className={`val-bool ${value === true ? 'val-bool-yes' : 'val-bool-no'}`}>
        {value === true ? 'Có' : 'Không'}
      </span>
    );
  }

  if (propertyType === 'image') {
    return (
      <div className="val-image">
        <img
          src={value}
          alt=""
          className="img-thumb"
          onError={e => { e.currentTarget.style.display = 'none'; }}
        />
        <a className="val-link val-image-url" href={value} target="_blank" rel="noopener noreferrer">{value}</a>
      </div>
    );
  }

  if (propertyType === 'options' || propertyType === 'multi select') {
    const raw = Array.isArray(value) ? value : [value];
    if (raw.length === 0) return <span className="val-empty">—</span>;
    // Unwrap {value, isPim, optionCode} objects — only display the .value string
    const arr = raw.map(item =>
      item && typeof item === 'object' && 'value' in item ? item.value : item
    );
    if (arr.length === 1) {
      const s = arr[0] === null || arr[0] === undefined ? '—' : String(arr[0]);
      return <TextOrLink text={s} />;
    }
    return (
      <ul className="val-list">
        {arr.map((item, i) => {
          const s = item === null || item === undefined ? '—' : String(item);
          return <li key={i}><TextOrLink text={s} /></li>;
        })}
      </ul>
    );
  }

  if (propertyType === 'textarea') {
    const lines = String(value).split('\n').filter(Boolean);
    if (lines.length > 1) {
      return (
        <ul className="val-list">
          {lines.map((line, i) => <li key={i}><TextOrLink text={line} /></li>)}
        </ul>
      );
    }
    return <TextOrLink text={String(value)} />;
  }

  return <TextOrLink text={String(value)} />;
}

const STATUS_CONFIG = {
  matched:   { label: '✓ Matched',    cls: 'badge-green' },
  new_attr:  { label: '⚠ New attr',   cls: 'badge-orange' },
  new_value: { label: '★ Giá trị mới', cls: 'badge-purple' },
  missing:   { label: '✗ Missing',    cls: 'badge-red' },
};

export default function AttributeRow({ attr }) {
  const badgeCfg = STATUS_CONFIG[attr.status] || STATUS_CONFIG.missing;
  const isSubRow = attr.isSubRow === true;

  return (
    <tr className={`attr-row${isSubRow ? ' row-subrow' : ''}${attr.status === 'missing' ? ' row-missing' : ''}`}>
      <td className="col-code">
        {!isSubRow && <code className="attr-code">{attr.fieldKey}</code>}
        {!isSubRow && attr.cmsCode && <span className="attr-cms">CMS #{attr.cmsCode}</span>}
      </td>

      <td className="col-attr">
        {!isSubRow && <span className="attr-label">{attr.label}</span>}
        {attr.optionCode && <span className="attr-cms">opt: {attr.optionCode}</span>}
      </td>

      <td className="col-value">
        <ValueDisplay attr={attr} />
      </td>

      <td className="col-status">
        <span className={`badge ${badgeCfg.cls}`}>{badgeCfg.label}</span>
      </td>

      <td className="col-action">
        {attr.status === 'new_value' && (
          <span className="action-text action-declare">Cần khai báo giá trị mới cho thuộc tính</span>
        )}
        {attr.status === 'matched' && (
          <span className="action-text action-import">Import mã giá trị thuộc tính có sẵn</span>
        )}
      </td>
    </tr>
  );
}
