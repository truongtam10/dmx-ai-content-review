import { useState } from 'react';
import AttributeRow from './AttributeRow';

function hasValue(v) {
  return v !== null && v !== undefined && !(Array.isArray(v) && v.length === 0);
}

export default function SectionBlock({ title, icon, color, attributes }) {
  const [collapsed, setCollapsed] = useState(false);

  if (!attributes || attributes.length === 0) return null;

  const visible = attributes.filter(a => hasValue(a.value));

  if (visible.length === 0) return null;

  const matched  = visible.filter(a => a.status === 'matched' && a.propertyType !== 'text').length;
  const newValue = visible.filter(a => a.status === 'new_value' && a.propertyType !== 'text').length;
  const newAttr  = visible.filter(a => a.status === 'new_attr' && a.propertyType !== 'text').length;
  const total    = visible.length;

  return (
    <div className="section-block">
      <div
        className="section-header"
        style={{ borderLeftColor: color }}
        onClick={() => setCollapsed(c => !c)}
        role="button"
        aria-expanded={!collapsed}
      >
        <div className="section-title-row">
          <span className="section-icon">{icon}</span>
          <h2 className="section-title">{title}</h2>
          <div className="section-pills">
            {matched > 0 && <span className="section-badge s-matched">{matched} matched</span>}
            {newValue > 0 && <span className="section-badge s-newval">{newValue} giá trị mới</span>}
            {newAttr > 0 && <span className="section-badge s-new">{newAttr} new attr</span>}
          </div>
          <span className="section-total">{total} thuộc tính</span>
          <span className="section-chevron" style={{ transform: collapsed ? 'rotate(-90deg)' : 'rotate(0deg)' }}>
            ▾
          </span>
        </div>
      </div>

      {!collapsed && (
        <div className="table-wrapper">
          <table className="attr-table">
            <thead>
              <tr>
                <th className="th-code">Mã thuộc tính</th>
                <th className="th-attr">Thuộc tính</th>
                <th className="th-value">Giá trị</th>
                <th className="th-status">Trạng thái</th>
                <th className="th-action">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {visible.map(attr => (
                <AttributeRow key={attr.key} attr={attr} />
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
