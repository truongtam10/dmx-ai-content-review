import { useState } from 'react';

export default function TopBar() {
  const [toast, setToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setToast(true);
      setTimeout(() => setToast(false), 2200);
    });
  };

  return (
    <>
      <header className="topbar">
        <div className="topbar-left">
          <span className="topbar-logo">DMX · PIM</span>
          <span className="topbar-sep">›</span>
          <span className="topbar-breadcrumb">Review nội dung sản phẩm</span>
        </div>
        <div className="topbar-right">
          <button className="btn-share" onClick={handleShare}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" />
              <circle cx="6" cy="12" r="3" />
              <circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Chia sẻ
          </button>
        </div>
      </header>
      {toast && <div className="topbar-toast">✓ Đã sao chép URL</div>}
    </>
  );
}
