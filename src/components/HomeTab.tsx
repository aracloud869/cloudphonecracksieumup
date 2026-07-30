import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Translations } from '../languages';
import { Announcement } from '../types';

interface HomeTabProps {
  onGoToDevices: () => void;
  isAdminUnlocked: boolean;
  onGoToAdmin: () => void;
  announcements?: Announcement[];
  onOpenGuidesModal?: (guideId?: string) => void;
  appTitle?: string;
  onUpdateAppTitle?: (newTitle: string) => void;
  t: Translations;
}

export const HomeTab: React.FC<HomeTabProps> = ({
  onGoToDevices,
  isAdminUnlocked,
  onGoToAdmin,
  announcements = [],
  onOpenGuidesModal,
  appTitle = 'Cloud Gaming Ultra Platform',
  onUpdateAppTitle,
  t,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(appTitle);

  const handleSaveTitle = () => {
    if (titleInput.trim() && onUpdateAppTitle) {
      onUpdateAppTitle(titleInput.trim());
    }
    setIsEditingTitle(false);
  };

  // Sort announcements: important first, then newer first
  const sortedAnnouncements = [...announcements].sort((a, b) => {
    if (a.isImportant && !b.isImportant) return -1;
    if (!a.isImportant && b.isImportant) return 1;
    return (b.created_at || 0) - (a.created_at || 0);
  });

  const getTypeStyle = (type?: string) => {
    switch (type) {
      case 'update':
        return { bg: '#dbeafe', color: '#1e40af', icon: 'fas fa-sync-alt', label: t.typeUpdate || 'Cập nhật' };
      case 'event':
        return { bg: '#f3e8ff', color: '#6b21a8', icon: 'fas fa-gift', label: t.typeEvent || 'Sự kiện' };
      case 'alert':
        return { bg: '#fee2e2', color: '#991b1b', icon: 'fas fa-exclamation-triangle', label: t.typeAlert || 'Cảnh báo' };
      default:
        return { bg: '#e0f2fe', color: '#075985', icon: 'fas fa-bullhorn', label: t.typeInfo || 'Tin tức' };
    }
  };

  return (
    <div id="tab-home" className="tab-content active">
      <div className="header-area">
        <h2 className="header-title">{t.homeTitle}</h2>
        {isAdminUnlocked && (
          <motion.button
            whileTap={{ scale: 0.94 }}
            whileHover={{ scale: 1.02 }}
            onClick={onGoToAdmin}
            style={{
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              color: 'white',
              border: 'none',
              padding: '6px 14px',
              borderRadius: '20px',
              fontWeight: 800,
              fontSize: '0.85rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)'
            }}
          >
            <i className="fas fa-user-shield"></i> {t.adminTab}
          </motion.button>
        )}
      </div>

      {/* Hero Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15) 0%, rgba(168, 85, 247, 0.2) 100%)',
          border: '1px solid rgba(0, 240, 255, 0.35)',
          padding: '24px',
          borderRadius: '24px',
          color: 'white',
          marginBottom: '20px',
          boxShadow: '0 12px 35px rgba(0, 240, 255, 0.15)',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)', color: '#060911', padding: '3px 12px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 900 }}>
                ⚡ 120 FPS ULTRA
              </span>
              <span style={{ background: 'rgba(168, 85, 247, 0.25)', color: '#c084fc', border: '1px solid rgba(168, 85, 247, 0.4)', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                RTX 4090 RIG
              </span>
              {isAdminUnlocked && (
                <span style={{ background: '#f43f5e', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 800 }}>
                  ADMIN MODE
                </span>
              )}
            </div>

            {isAdminUnlocked && !isEditingTitle && (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setTitleInput(appTitle);
                  setIsEditingTitle(true);
                }}
                style={{
                  background: 'rgba(0, 240, 255, 0.2)',
                  border: '1px solid rgba(0, 240, 255, 0.4)',
                  color: '#00f0ff',
                  padding: '4px 10px',
                  borderRadius: '12px',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px'
                }}
              >
                <i className="fas fa-edit"></i> Sửa tên App
              </motion.button>
            )}
          </div>

          {isEditingTitle ? (
            <div style={{ marginBottom: '12px', background: 'rgba(15, 23, 42, 0.75)', padding: '12px', borderRadius: '14px', border: '1px solid rgba(0, 240, 255, 0.4)' }}>
              <label style={{ fontSize: '0.75rem', color: '#00f0ff', fontWeight: 800, display: 'block', marginBottom: '4px' }}>
                Đổi Tên App (Hiển Thị Cho Tất Cả Người Dùng):
              </label>
              <input
                type="text"
                value={titleInput}
                onChange={(e) => setTitleInput(e.target.value)}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  borderRadius: '10px',
                  border: '1px solid #00f0ff',
                  background: '#0f172a',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '1rem',
                  marginBottom: '8px',
                  boxSizing: 'border-box'
                }}
                placeholder="Nhập tên app..."
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={handleSaveTitle}
                  style={{
                    background: '#10b981',
                    color: 'white',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 800,
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  <i className="fas fa-check"></i> Lưu Tên
                </button>
                <button
                  onClick={() => setIsEditingTitle(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: 'none',
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    fontSize: '0.8rem'
                  }}
                >
                  Hủy
                </button>
              </div>
            </div>
          ) : (
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.55rem', fontWeight: 900, background: 'linear-gradient(135deg, #ffffff 0%, #00f0ff 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              {appTitle}
            </h3>
          )}

          <p style={{ margin: 0, fontSize: '0.92rem', color: '#94a3b8', lineHeight: '1.5' }}>
            Chơi mọi tựa game AAA & Mobile với tốc độ siêu mượt 120 FPS, không cần tải về, phản hồi dưới 15ms.
          </p>

          <motion.button
            whileTap={{ scale: 0.95 }}
            whileHover={{ scale: 1.03 }}
            onClick={onGoToDevices}
            style={{
              marginTop: '18px',
              padding: '11px 24px',
              background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
              color: '#060911',
              fontWeight: 900,
              borderRadius: '22px',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 0 20px rgba(0, 240, 255, 0.4)'
            }}
          >
            <i className="fas fa-cloud"></i> Vào Cloud ngay
          </motion.button>
        </div>
      </motion.div>

      {/* Announcements & Updates Section */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <div>
            <h4 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: 850, display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-bell" style={{ color: 'var(--accent-blue)' }}></i>
              {t.announcementsTitle || 'Thông Báo & Cập Nhật'}
            </h4>
            <p style={{ margin: '2px 0 0 0', color: 'var(--text-sub)', fontSize: '0.8rem' }}>
              {t.announcementsSubtitle || 'Thông tin mới nhất từ quản trị viên'}
            </p>
          </div>
          {isAdminUnlocked && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={onGoToAdmin}
              style={{
                background: 'rgba(37, 99, 235, 0.12)',
                color: 'var(--accent-blue)',
                border: '1px solid rgba(37, 99, 235, 0.3)',
                padding: '4px 10px',
                borderRadius: '12px',
                fontSize: '0.75rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <i className="fas fa-plus-circle"></i> {t.addAnnouncementBtn || 'Thêm thông báo'}
            </motion.button>
          )}
        </div>

        {sortedAnnouncements.length === 0 ? (
          <div className="info-card" style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
            <i className="fas fa-inbox" style={{ fontSize: '2rem', marginBottom: '8px', opacity: 0.5 }}></i>
            <p style={{ margin: 0, fontSize: '0.9rem' }}>{t.noAnnouncements || 'Chưa có thông báo nào từ Admin'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <AnimatePresence>
              {sortedAnnouncements.map((ann, idx) => {
                const typeInfo = getTypeStyle(ann.type);
                return (
                  <motion.div
                    key={ann.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    whileHover={{ y: -2 }}
                    className="info-card"
                    style={{
                      margin: 0,
                      padding: '16px',
                      borderRadius: '16px',
                      borderLeft: ann.isImportant ? '5px solid #ef4444' : '5px solid #2563eb',
                      position: 'relative',
                      background: ann.isImportant ? 'var(--bg-important-card)' : 'var(--bg-card)',
                      borderColor: ann.isImportant ? 'var(--border-important)' : 'var(--border-card)',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                      {/* Important badge */}
                      {ann.isImportant && (
                        <span
                          style={{
                            background: '#ef4444',
                            color: 'white',
                            padding: '2px 8px',
                            borderRadius: '10px',
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '4px',
                          }}
                        >
                          <i className="fas fa-star"></i> {t.importantBadge || 'QUAN TRỌNG'}
                        </span>
                      )}

                      {/* Category badge */}
                      <span
                        style={{
                          background: typeInfo.bg,
                          color: typeInfo.color,
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <i className={typeInfo.icon}></i> {typeInfo.label}
                      </span>

                      {/* Admin source badge */}
                      <span
                        style={{
                          background: '#2563eb',
                          color: 'white',
                          padding: '2px 8px',
                          borderRadius: '10px',
                          fontSize: '0.7rem',
                          fontWeight: 700,
                        }}
                      >
                        {t.fromAdminBadge || 'ADMIN'}
                      </span>

                      {/* Date badge */}
                      <span style={{ marginLeft: 'auto', fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                        <i className="far fa-clock" style={{ marginRight: '4px' }}></i>
                        {ann.date}
                      </span>
                    </div>

                    <h4 style={{ margin: '0 0 6px 0', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800, lineHeight: '1.3' }}>
                      {ann.title}
                    </h4>
                    <p style={{ margin: 0, color: 'var(--text-sub)', fontSize: '0.88rem', lineHeight: '1.5', whiteSpace: 'pre-line' }}>
                      {ann.content}
                    </p>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Featured Services */}
      <h4 style={{ margin: '0 0 12px 0', color: 'var(--text-main)', fontSize: '1rem', fontWeight: 800 }}>
        {t.featuredServices}
      </h4>

      <motion.div whileHover={{ y: -2 }} className="info-card">
        <h3>
          <i className="fas fa-rocket" style={{ color: '#facc15', marginRight: '8px' }}></i>
          {t.boostTitle}
        </h3>
        <p className="text-muted" style={{ margin: '6px 0 0 0' }}>
          {t.boostDesc}
        </p>
      </motion.div>

      <motion.div whileHover={{ y: -2 }} className="info-card">
        <h3>
          <i className="fas fa-shield-alt" style={{ color: '#22c55e', marginRight: '8px' }}></i>
          {t.securityTitle}
        </h3>
        <p className="text-muted" style={{ margin: '6px 0 0 0' }}>
          {t.securityDesc}
        </p>
      </motion.div>

      {isAdminUnlocked && (
        <motion.div whileHover={{ y: -2 }} className="info-card" style={{ borderLeft: '4px solid #ef4444', background: 'var(--bg-card)' }}>
          <h3 style={{ color: '#ef4444' }}>
            <i className="fas fa-user-shield" style={{ marginRight: '8px' }}></i>
            {t.adminUnlockedTitle}
          </h3>
          <p className="text-muted" style={{ margin: '6px 0 0 0' }}>
            {t.adminUnlockedDesc}
          </p>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onGoToAdmin}
            style={{
              marginTop: '10px',
              background: '#ef4444',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '8px',
              fontWeight: 700,
              cursor: 'pointer'
            }}
          >
            {t.goToAdminBtn}
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};



