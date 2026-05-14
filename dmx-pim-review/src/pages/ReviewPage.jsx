import { useState } from 'react';
import { usePimData } from '../hooks/usePimData';
import { SECTION_META } from '../utils/pimParser';
import ProductHeader from '../components/ProductHeader';
import SectionBlock from '../components/SectionBlock';
import FooterBar from '../components/FooterBar';
import ApproveModal from '../components/ApproveModal';

const SECTIONS = ['general', 'content', 'specs'];

export default function ReviewPage() {
  const { attributes, loading, error } = usePimData();
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg, duration = 3500) => {
    setToast(msg);
    setTimeout(() => setToast(null), duration);
  };

  const handleApprove = () => {
    const id = 'P-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    setShowModal(false);
    showToast(`✅ Đã tạo sản phẩm · product_id: ${id}`, 4500);
  };

  if (loading) {
    return (
      <div className="fullscreen-center">
        <div className="spinner" />
        <p className="loading-text">Đang tải dữ liệu PIM...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fullscreen-center">
        <div className="error-icon">⚠</div>
        <p className="error-title">Không thể tải dữ liệu</p>
        <p className="error-detail">{error}</p>
        <p className="error-hint">Đảm bảo file <code>public/data/test_maylanh_PIM.json</code> tồn tại.</p>
      </div>
    );
  }

  return (
    <>
      <main className="main-content">
        <ProductHeader attributes={attributes} />

        {SECTIONS.map(section => {
          const meta = SECTION_META[section];
          return (
            <SectionBlock
              key={section}
              title={meta.title}
              icon={meta.icon}
              color={meta.color}
              attributes={attributes.filter(a => a.section === section)}
            />
          );
        })}
      </main>

      <FooterBar
        attributes={attributes}
        onReject={() => showToast('↩ Đã trả lại — chờ chỉnh sửa thêm')}
        onApprove={() => setShowModal(true)}
      />

      {showModal && (
        <ApproveModal
          attributes={attributes}
          onClose={() => setShowModal(false)}
          onConfirm={handleApprove}
        />
      )}

      {toast && (
        <div className="global-toast" key={toast}>
          {toast}
        </div>
      )}
    </>
  );
}
