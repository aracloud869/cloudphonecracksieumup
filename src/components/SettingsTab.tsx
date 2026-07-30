import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LANGUAGES, getLanguage } from '../languages';
import { User } from '../firebaseConfig';

interface SettingsTabProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  onLogout: () => void;
  isAdminUnlocked: boolean;
  onGoToAdmin: () => void;
  onLockAdmin: () => void;
  showToast: (msg: string) => void;
  langCode: string;
  onSelectLanguage: (code: string) => void;
  onOpenBugReportModal?: () => void;
  onOpenGuidesModal?: (guideId?: string) => void;
  currentUser?: User | null;
  onOpenAuthModal?: () => void;
  bgUrl?: string;
  onChangeBgUrl?: (newUrl: string) => void;
}

const BG_PRESETS = [
  { id: 'none', label: 'Mặc Định', url: '', thumb: 'https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&w=200&q=80' },
  { id: 'space', label: 'Vũ Trụ', url: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1600&q=80', thumb: 'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=200&q=80' },
  { id: 'abstract', label: 'Đen Sang Trọng', url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80', thumb: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80' },
  { id: 'cyber', label: 'Cyber GIF', url: 'https://i.gifer.com/fetch/w300-preview/a9/a97f223f6631be1d355aaebbc20a32e1.gif', thumb: 'https://i.gifer.com/fetch/w300-preview/a9/a97f223f6631be1d355aaebbc20a32e1.gif' },
  { id: 'rain', label: 'Rainy GIF', url: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z1ZHMyOTlycWd2dnhuNjQycXNwdTVhbjB4azQ3YmszdjMxaThxMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKMt1VVNkHV2PaE/giphy.gif', thumb: 'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExM3Z1ZHMyOTlycWd2dnhuNjQycXNwdTVhbjB4azQ3YmszdjMxaThxMyZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKMt1VVNkHV2PaE/giphy.gif' },
  { id: 'sunset', label: 'Sunset Pastel', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80', thumb: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=200&q=80' }
];

export const SettingsTab: React.FC<SettingsTabProps> = ({
  darkMode,
  onToggleDarkMode,
  onLogout,
  isAdminUnlocked,
  onGoToAdmin,
  onLockAdmin,
  showToast,
  langCode,
  onSelectLanguage,
  onOpenBugReportModal,
  onOpenGuidesModal,
  currentUser,
  onOpenAuthModal,
  bgUrl = '',
  onChangeBgUrl,
}) => {
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const [inputUrl, setInputUrl] = useState(bgUrl);

  const currentLang = getLanguage(langCode);
  const t = currentLang.translations;

  const handleSelectLanguage = (code: string) => {
    onSelectLanguage(code);
    const selected = getLanguage(code);
    showToast(selected.translations.languageChangedToast);
    setIsLangModalOpen(false);
  };

  const handleLogoutClick = async () => {
    try {
      await onLogout();
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  const handleApplyBgUrl = (urlToApply: string) => {
    setInputUrl(urlToApply);
    if (onChangeBgUrl) {
      onChangeBgUrl(urlToApply);
      showToast(urlToApply ? 'Đã cập nhật hình nền web mới!' : 'Đã đặt lại hình nền mặc định');
    }
  };

  return (
    <div id="tab-settings" className="tab-content active" style={{ paddingBottom: '32px' }}>
      <div className="header-area">
        <h2 className="header-title">{t.settingsTitle}</h2>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="info-card"
        style={{ padding: 0, overflow: 'hidden', backdropFilter: 'blur(12px)', borderRadius: '20px' }}
      >
        {/* User Firebase Account Row */}
        <div
          style={{
            padding: '18px',
            borderBottom: '1px solid var(--border-color, #e5e7eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: currentUser
              ? 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(29, 78, 216, 0.12))'
              : 'transparent',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '16px',
                background: currentUser ? 'linear-gradient(135deg, #2563eb, #1d4ed8)' : '#f1f5f9',
                color: currentUser ? '#ffffff' : '#64748b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.25rem',
                fontWeight: 800,
                boxShadow: currentUser ? '0 6px 16px rgba(37, 99, 235, 0.35)' : 'none',
              }}
            >
              {currentUser ? (
                currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')
              ) : (
                <i className="fas fa-user"></i>
              )}
            </div>

            <div>
              <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--text-main)' }}>
                {currentUser ? (currentUser.displayName || currentUser.email) : 'Tài Khoản Người Dùng'}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                {currentUser ? currentUser.email : 'Đăng nhập để đồng bộ thiết bị & lưu hình nền cloud'}
              </div>
            </div>
          </div>

          <div>
            {currentUser ? (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogoutClick}
                style={{
                  padding: '8px 16px',
                  borderRadius: '12px',
                  background: '#fee2e2',
                  color: '#dc2626',
                  fontWeight: 800,
                  fontSize: '0.82rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 2px 8px rgba(220, 38, 38, 0.15)',
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Đăng Xuất</span>
              </motion.button>
            ) : (
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onOpenAuthModal}
                style={{
                  padding: '8px 18px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.84rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Đăng Nhập</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* CUSTOM BACKGROUND SETTINGS SECTION */}
        <div
          style={{
            padding: '18px',
            borderBottom: '1px solid var(--border-color, #e5e7eb)',
            background: darkMode ? 'rgba(30, 41, 59, 0.4)' : 'rgba(248, 250, 252, 0.6)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <i className="fas fa-image" style={{ color: '#8b5cf6', fontSize: '1.2rem', width: '26px' }}></i>
            <div>
              <div style={{ fontWeight: 750, fontSize: '0.95rem', color: 'var(--text-main)' }}>
                Tùy Chỉnh Hình Nền Web (Ảnh / GIF)
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>
                Nhập link URL ảnh hoặc GIF động để làm background cho ứng dụng
              </div>
            </div>
          </div>

          {/* URL Input Row */}
          <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <input
                type="url"
                placeholder="Dán URL ảnh hoặc GIF (https://...)"
                value={inputUrl}
                onChange={(e) => setInputUrl(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleApplyBgUrl(inputUrl);
                }}
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color, #cbd5e1)',
                  background: darkMode ? '#0f172a' : '#ffffff',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
              {inputUrl && (
                <button
                  type="button"
                  onClick={() => {
                    setInputUrl('');
                    handleApplyBgUrl('');
                  }}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#9ca3af',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                  }}
                >
                  <i className="fas fa-times-circle"></i>
                </button>
              )}
            </div>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => handleApplyBgUrl(inputUrl)}
              style={{
                padding: '0 16px',
                borderRadius: '12px',
                background: '#8b5cf6',
                color: '#ffffff',
                fontWeight: 750,
                fontSize: '0.82rem',
                border: 'none',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)',
              }}
            >
              Áp Dụng
            </motion.button>
          </div>

          {/* Presets Gallery */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-sub)', marginBottom: '8px' }}>
              Mẫu Hình Nền Đề Xuất (GIF & Ảnh):
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
              {BG_PRESETS.map((preset) => {
                const isActive = (bgUrl === preset.url) || (!bgUrl && preset.id === 'none');
                return (
                  <motion.div
                    key={preset.id}
                    whileTap={{ scale: 0.96 }}
                    onClick={() => handleApplyBgUrl(preset.url)}
                    style={{
                      height: '64px',
                      borderRadius: '12px',
                      backgroundImage: preset.url ? `url("${preset.thumb}")` : 'none',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: darkMode ? '#1e293b' : '#e2e8f0',
                      border: isActive ? '2px solid #8b5cf6' : '1px solid var(--border-color, #cbd5e1)',
                      position: 'relative',
                      overflow: 'hidden',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'flex-end',
                      padding: '6px',
                      boxShadow: isActive ? '0 0 12px rgba(139, 92, 246, 0.4)' : 'none',
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 80%)',
                      }}
                    />
                    <span
                      style={{
                        position: 'relative',
                        zIndex: 1,
                        color: '#ffffff',
                        fontSize: '0.72rem',
                        fontWeight: 750,
                        textShadow: '0 1px 3px rgba(0,0,0,0.8)',
                      }}
                    >
                      {preset.label}
                    </span>
                    {isActive && (
                      <i
                        className="fas fa-check-circle"
                        style={{
                          position: 'absolute',
                          top: '6px',
                          right: '6px',
                          color: '#8b5cf6',
                          fontSize: '0.9rem',
                          zIndex: 2,
                          background: '#ffffff',
                          borderRadius: '50%',
                        }}
                      ></i>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Language Selection Row */}
        <motion.div
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsLangModalOpen(true)}
          style={{
            padding: '16px',
            borderBottom: '1px solid var(--border-color, #e5e7eb)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            transition: 'background 0.2s',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-globe" style={{ color: '#2563eb', width: '26px', fontSize: '1.2rem' }}></i>
            <span style={{ fontWeight: 600 }}>{t.languageLabel}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-main)' }}>
              {currentLang.flag} {currentLang.nativeName}
            </span>
            <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: '#9ca3af' }}></i>
          </div>
        </motion.div>

        {/* Bug Report Row */}
        {onOpenBugReportModal && (
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={onOpenBugReportModal}
            style={{
              padding: '16px',
              borderBottom: '1px solid var(--border-color, #e5e7eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'background 0.2s',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-bug" style={{ color: '#ef4444', width: '26px', fontSize: '1.2rem' }}></i>
              <div>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.bugReportTitle || 'Báo Lỗi & Phản Hồi'}</span>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-sub)' }}>Gửi báo lỗi & xem câu trả lời từ Admin</div>
              </div>
            </div>
            <i className="fas fa-chevron-right" style={{ fontSize: '0.8rem', color: '#9ca3af' }}></i>
          </motion.div>
        )}

        {/* Dark Mode Row */}
        <div
          style={{
            padding: '16px',
            borderBottom: isAdminUnlocked || currentUser ? '1px solid var(--border-color, #e5e7eb)' : 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fas fa-moon" style={{ color: '#2563eb', width: '26px', fontSize: '1.2rem' }}></i>
            <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{t.darkMode}</span>
          </div>

          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={onToggleDarkMode}
            style={{
              padding: '6px 16px',
              borderRadius: '12px',
              background: darkMode ? '#2563eb' : 'var(--input-bg)',
              color: darkMode ? '#ffffff' : 'var(--text-main)',
              fontWeight: 800,
              border: darkMode ? 'none' : '1px solid var(--input-border)',
              cursor: 'pointer',
              boxShadow: darkMode ? '0 2px 8px rgba(37, 99, 235, 0.4)' : 'none',
            }}
          >
            {darkMode ? t.on : t.off}
          </motion.button>
        </div>

        {/* Admin Mode Controls - ONLY visible when admin is already unlocked */}
        {isAdminUnlocked && (
          <div
            style={{
              padding: '16px',
              borderBottom: currentUser ? '1px solid var(--border-color, #e5e7eb)' : 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              background: 'rgba(239, 68, 68, 0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-user-shield" style={{ color: '#ef4444', width: '26px', fontSize: '1.2rem' }}></i>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                  {t.adminMode}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onGoToAdmin}
                style={{
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: '#ef4444',
                  color: 'white',
                  fontWeight: 700,
                  border: 'none',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {t.openAdmin}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onLockAdmin}
                style={{
                  padding: '6px 10px',
                  borderRadius: '8px',
                  background: '#f3f4f6',
                  color: '#4b5563',
                  fontWeight: 600,
                  border: '1px solid #d1d5db',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                }}
              >
                {t.lockAdmin}
              </motion.button>
            </div>
          </div>
        )}

        {/* Optional Clean Logout Row at bottom if user is logged in */}
        {currentUser && (
          <motion.div
            whileTap={{ scale: 0.98 }}
            onClick={handleLogoutClick}
            style={{
              padding: '16px',
              color: '#ef4444',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontWeight: 750,
              background: 'rgba(239, 68, 68, 0.03)',
            }}
          >
            <i className="fas fa-sign-out-alt" style={{ width: '26px', fontSize: '1.1rem' }}></i>
            <span>{t.logout}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Language Selection Modal */}
      <AnimatePresence>
        {isLangModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 3000,
              backdropFilter: 'blur(6px)',
              padding: '16px',
            }}
            onClick={() => setIsLangModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 12 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 350, damping: 28 }}
              style={{
                width: '100%',
                maxWidth: '420px',
                maxHeight: '80vh',
                background: darkMode ? '#1f2937' : '#ffffff',
                color: darkMode ? '#ffffff' : '#111827',
                borderRadius: '24px',
                padding: '20px',
                boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
                display: 'flex',
                flexDirection: 'column',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 850 }}>
                  {t.languageLabel}
                </h3>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsLangModalOpen(false)}
                  style={{
                    border: 'none',
                    background: 'none',
                    fontSize: '1.2rem',
                    color: darkMode ? '#9ca3af' : '#6b7280',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fas fa-times"></i>
                </motion.button>
              </div>

              <div style={{ overflowY: 'auto', flex: 1, paddingRight: '4px' }}>
                {LANGUAGES.map((lang) => {
                  const isSelected = lang.code === langCode;
                  return (
                    <motion.div
                      key={lang.code}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleSelectLanguage(lang.code)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '12px 14px',
                        borderRadius: '14px',
                        marginBottom: '6px',
                        background: isSelected
                          ? darkMode
                            ? 'rgba(37, 99, 235, 0.25)'
                            : '#eff6ff'
                          : 'transparent',
                        border: isSelected
                          ? '1.5px solid #2563eb'
                          : '1px solid transparent',
                        cursor: 'pointer',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontSize: '1.5rem' }}>{lang.flag}</span>
                        <div>
                          <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>
                            {lang.nativeName}
                          </div>
                          <div style={{ fontSize: '0.78rem', color: darkMode ? '#9ca3af' : '#6b7280' }}>
                            {lang.name}
                          </div>
                        </div>
                      </div>

                      {isSelected && (
                        <i className="fas fa-check-circle" style={{ color: '#2563eb', fontSize: '1.2rem' }}></i>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


