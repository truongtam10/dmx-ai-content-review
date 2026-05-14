import { useEffect } from 'react';

export default function ApproveModal({ attributes, onClose, onConfirm }) {
  const matched = attributes.filter(a => a.status === 'matched').length;
  const newAttr = attributes.filter(a => a.status === 'new_attr').length;
  const handEntered = attributes.filter(a => a._edited).length;
  const total = attributes.length;

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-card" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">Xác nhận duyệt sản phẩm</h3>
          <button className="modal-close" onClick={onClose} aria-label="Đóng">×</button>
        </div>

        <div className="modal-body">
          <p className="modal-subtitle">Tóm tắt trước khi tạo sản phẩm ({total} thuộc tính):</p>
          <div className="modal-stats">
            <div className="stat-row">
              <span className="stat-dot dot-green" />
              <span className="stat-label">Matched — đã khớp với PIM</span>
              <span className="stat-value">{matched}</span>
            </div>
            <div className="stat-row">
              <span className="stat-dot dot-orange" />
              <span className="stat-label">New attr — chưa có trong PIM</span>
              <span className="stat-value">{newAttr}</span>
            </div>
            <div className="stat-row">
              <span className="stat-dot dot-blue" />
              <span className="stat-label">Đã nhập tay (từ trạng thái missing)</span>
              <span className="stat-value">{handEntered}</span>
            </div>
          </div>

          <div className="modal-notice">
            <span className="notice-icon">ℹ</span>
            <span>Sau khi duyệt, sản phẩm sẽ được tạo và không thể hoàn tác.</span>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={onClose}>Huỷ</button>
          <button className="btn-confirm" onClick={onConfirm}>
            ✓ Duyệt &amp; Tạo sản phẩm
          </button>
        </div>
      </div>
    </div>
  );
}
