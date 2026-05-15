export default function ProductHeader({ attributes }) {
  const byKey = (fieldKey) => attributes.find(a => a.fieldKey === fieldKey);

  const productName = byKey('product_name')?.value || '—';
  const itemCode = byKey('item_code')?.value || '—';
  const brandCode = byKey('brand_code')?.value || '—';
  const urlSlug = byKey('url')?.value || '—';
  const tags = byKey('tags')?.value;

  const matched  = attributes.filter(a => a.status === 'matched' && !a.flagged).length;
  const newValue = attributes.filter(a => a.status === 'new_value').length;
  const newAttr  = attributes.filter(a => a.status === 'new_attr').length;
  const flagged  = attributes.filter(a => a.flagged).length;

  return (
    <div className="product-header">
      <div className="product-header-main">
        <div className="product-info">
          <h1 className="product-name">{productName}</h1>
          <div className="product-meta">
            <span className="meta-item">
              <span className="meta-label">Model</span>
              <span className="meta-value">{itemCode}</span>
            </span>
            <span className="meta-dot">·</span>
            <span className="meta-item">
              <span className="meta-label">Thương hiệu</span>
              <span className="meta-value">{brandCode}</span>
            </span>
          </div>
          <div className="product-url-row">
            <span className="meta-label">URL</span>
            <code className="url-slug">/{urlSlug}</code>
          </div>
          {Array.isArray(tags) && tags.length > 0 && (
            <div className="product-tags">
              {tags.map((tag, i) => (
                <span key={i} className="tag-pill">{tag}</span>
              ))}
            </div>
          )}
        </div>

        <div className="summary-chips">
          <div className="summary-chip chip-green">
            <svg className="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="9 12 11 14 15 10"/></svg>
            <span className="chip-count">{matched}</span>
            <span className="chip-label">Matched</span>
          </div>
          <div className="summary-chip chip-purple">
            <svg className="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.75 2.25L22 18l-2.25.75L19 21l-.75-2.25L16 18l2.25-.75z"/></svg>
            <span className="chip-count">{newValue}</span>
            <span className="chip-label">Giá trị mới</span>
          </div>
          <div className="summary-chip chip-orange">
            <svg className="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span className="chip-count">{newAttr}</span>
            <span className="chip-label">New Attr</span>
          </div>
          {flagged > 0 && (
            <div className="summary-chip chip-yellow">
              <svg className="chip-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
              <span className="chip-count">{flagged}</span>
              <span className="chip-label">Flagged</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
