export default function FooterBar({ attributes, onReject, onApprove }) {
  const missing = attributes.filter(a => a.status === 'missing').length;
  const newAttr = attributes.filter(a => a.status === 'new_attr').length;
  const flagged = attributes.filter(a => a.flagged).length;
  const canApprove = missing === 0 && flagged === 0;

  const reasons = [];
  if (missing > 0) reasons.push(`${missing} missing`);
  if (flagged > 0) reasons.push(`${flagged} flagged`);

  return (
    <footer className="footer-bar">
      <div className="footer-summary">
        {missing > 0 && (
          <span className="footer-stat footer-missing">
            <span className="footer-dot dot-red" />
            {missing} missing
          </span>
        )}
        {newAttr > 0 && (
          <span className="footer-stat footer-new">
            <span className="footer-dot dot-orange" />
            {newAttr} new attr cần xử lý
          </span>
        )}
        {flagged > 0 && (
          <span className="footer-stat footer-flagged">
            <span className="footer-dot dot-yellow" />
            {flagged} flagged
          </span>
        )}
        {missing === 0 && flagged === 0 && (
          <span className="footer-stat footer-ok">
            <span className="footer-dot dot-green" />
            Sẵn sàng duyệt
          </span>
        )}
      </div>

      <div className="footer-actions">
        <button className="btn-reject" onClick={onReject}>
          ↩ Trả lại
        </button>
        <button
          className="btn-approve"
          onClick={onApprove}
          disabled={!canApprove}
          title={!canApprove ? `Còn ${reasons.join(' và ')} chưa resolve` : 'Duyệt và tạo sản phẩm'}
        >
          ✓ Duyệt &amp; Tạo sản phẩm
        </button>
      </div>
    </footer>
  );
}
