export default function ProductHeader({ attributes }) {
  const byKey = (fieldKey) => attributes.find(a => a.fieldKey === fieldKey);

  const productName = byKey('product_name')?.value || '—';
  const itemCode = byKey('item_code')?.value || '—';
  const brandCode = byKey('brand_code')?.value || '—';
  const urlSlug = byKey('url')?.value || '—';
  const tags = byKey('tags')?.value;

  const matched = attributes.filter(a => a.status === 'matched' && !a.flagged).length;
  const newAttr = attributes.filter(a => a.status === 'new_attr').length;
  const missing = attributes.filter(a => a.status === 'missing').length;
  const flagged = attributes.filter(a => a.flagged).length;

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
            <span className="chip-count">{matched}</span>
            <span className="chip-label">Matched</span>
          </div>
          <div className="summary-chip chip-orange">
            <span className="chip-count">{newAttr}</span>
            <span className="chip-label">New attr</span>
          </div>
          <div className="summary-chip chip-red">
            <span className="chip-count">{missing}</span>
            <span className="chip-label">Missing</span>
          </div>
          {flagged > 0 && (
            <div className="summary-chip chip-yellow">
              <span className="chip-count">{flagged}</span>
              <span className="chip-label">Flagged</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
