import { useState } from 'react';

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

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    });
  };
  return (
    <button className={`btn-copy${copied ? ' btn-copy-done' : ''}`} onClick={handleCopy} title="Copy">
      {copied
        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
      }
    </button>
  );
}

export default function AttributeRow({ attr }) {
  const badgeCfg = STATUS_CONFIG[attr.status] || STATUS_CONFIG.missing;
  const isSubRow = attr.isSubRow === true;

  return (
    <tr className={`attr-row${isSubRow ? ' row-subrow' : ''}${attr.status === 'missing' ? ' row-missing' : ''}`}>
      <td className="col-code">
        {!isSubRow && (
          <div className="code-row">
            <code className="attr-code">{attr.fieldKey}</code>
            <CopyButton text={attr.fieldKey} />
          </div>
        )}
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
        {attr.propertyType === 'text' ? (
          <span>-</span>
        ) : (
          <span className={`badge ${badgeCfg.cls}`}>{badgeCfg.label}</span>
        )}
      </td>

      <td className="col-action">
        {attr.propertyType === 'text' ? (
          <span>-</span>
        ) : (
          <>
            {attr.status === 'new_value' && (
              <span className="action-text action-declare">Cần khai báo giá trị mới cho thuộc tính</span>
            )}
            {attr.status === 'matched' && (
              <span className="action-text action-import">Import mã giá trị thuộc tính có sẵn</span>
            )}
          </>
        )}
      </td>
    </tr>
  );
}
