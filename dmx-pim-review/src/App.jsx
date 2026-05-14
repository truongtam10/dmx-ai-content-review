import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom';
import { useState } from 'react';
import ReviewPage from './pages/ReviewPage';
import EditorPage from './pages/EditorPage';

export default function App() {
  const [shareToast, setShareToast] = useState(false);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setShareToast(true);
      setTimeout(() => setShareToast(false), 2200);
    });
  };

  return (
    <BrowserRouter>
      <header className="topbar">
        <div className="topbar-left">
          <span className="topbar-logo">DMX · PIM</span>
          <span className="topbar-sep">›</span>
          <nav className="topbar-nav">
            <NavLink to="/" end className={({ isActive }) => 'topbar-navlink' + (isActive ? ' active' : '')}>
              Review
            </NavLink>
            <NavLink to="/editor" className={({ isActive }) => 'topbar-navlink' + (isActive ? ' active' : '')}>
              Editor
            </NavLink>
          </nav>
        </div>
        <div className="topbar-right">
          <button className="btn-share" onClick={handleShare}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
            </svg>
            Chia sẻ
          </button>
        </div>
      </header>
      {shareToast && <div className="topbar-toast">✓ Đã sao chép URL</div>}

      <div className="app">
        <Routes>
          <Route path="/" element={<ReviewPage />} />
          <Route path="/editor" element={<EditorPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
