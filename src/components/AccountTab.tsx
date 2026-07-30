import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, dangNhapUser, dangKyUser, logoutUser } from '../firebaseConfig';
import { BugReport, Device } from '../types';
import { Translations } from '../languages';

interface AccountTabProps {
  currentUser: User | null;
  bugReports: BugReport[];
  userDevices: Device[];
  onSubmitReport: (targetName: string, description: string) => void;
  showToast: (msg: string) => void;
  t?: Translations;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  currentUser,
  bugReports,
  userDevices,
  onSubmitReport,
  showToast,
  t,
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Bug report states inside Account Tab
  const [targetName, setTargetName] = useState('');
  const [description, setDescription] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'profile' | 'bugreport'>('profile');

  // Filter user's bug reports
  const userReports = currentUser
    ? bugReports.filter((r) => r.userId === currentUser.uid || (r.userEmail && r.userEmail === currentUser.email))
    : [];

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setIsLoading(true);
      setErrorMsg('');
      if (authMode === 'login') {
        await dangNhapUser(email.trim(), password);
        showToast(`🎉 Đăng nhập thành công!`);
      } else {
        await dangKyUser(email.trim(), password);
        showToast(`🎉 Đăng ký tài khoản mới thành công!`);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Email hoặc mật khẩu không chính xác!');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Email này đã được sử dụng!');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Mật khẩu quá yếu! Vui lòng sử dụng ít nhất 6 ký tự.');
      } else {
        setErrorMsg(err.message || 'Thao tác thất bại. Vui lòng kiểm tra lại!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleBugReportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !description.trim()) return;
    onSubmitReport(targetName.trim(), description.trim());
    setTargetName('');
    setDescription('');
    showToast('🎉 Đã gửi báo lỗi tới Admin thành công!');
  };

  const handleLogout = async () => {
    try {
      await logoutUser();
      showToast('🎉 Đã đăng xuất tài khoản thành công!');
    } catch (err: any) {
      console.error('Logout error:', err);
      showToast('Đã đăng xuất tài khoản');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
      transition={{ duration: 0.25 }}
      style={{ width: '100%' }}
    >
      <div style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 850, margin: '0 0 4px 0', color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
          {currentUser ? 'Tài Khoản Của Tôi' : 'Đăng Nhập / Đăng Ký'}
        </h2>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-sub)' }}>
          {currentUser ? 'Đồng bộ thiết bị Cloud Phone & gửi báo lỗi hệ thống' : 'Tạo tài khoản để lưu giữ danh sách thiết bị & hỗ trợ 24/7'}
        </p>
      </div>

      {!currentUser ? (
        /* ================= AUTH FORM INTERFACE ================= */
        <div style={{
          background: 'var(--bg-card)',
          borderRadius: '24px',
          padding: '24px',
          border: '1px solid var(--border-color)',
          boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
          maxWidth: '520px',
          margin: '0 auto'
        }}>
          {/* Header Banner */}
          <div style={{
            textAlign: 'center',
            marginBottom: '22px',
            padding: '20px 16px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08), rgba(14, 165, 233, 0.08))',
            borderRadius: '20px',
            border: '1px solid rgba(37, 99, 235, 0.15)'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '18px',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              margin: '0 auto 12px auto',
              boxShadow: '0 8px 20px rgba(37, 99, 235, 0.35)'
            }}>
              <i className="fas fa-user-shield"></i>
            </div>
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 850, color: 'var(--text-main)' }}>
              {authMode === 'login' ? 'Mời Bạn Đăng Nhập' : 'Tạo Tài Khoản Cloud Phone'}
            </h3>
            <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-sub)', lineHeight: '1.4' }}>
              Truy cập thiết bị Cloud từ mọi nơi, lưu giữ cài đặt & nhận phản hồi từ Admin
            </p>
          </div>

          {/* Mode Tabs Switcher */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px',
            padding: '5px',
            background: 'var(--bg-body)',
            borderRadius: '16px',
            marginBottom: '20px',
            border: '1px solid var(--border-color)',
          }}>
            <button
              onClick={() => { setAuthMode('login'); setErrorMsg(''); }}
              style={{
                padding: '11px',
                borderRadius: '12px',
                border: 'none',
                background: authMode === 'login' ? '#2563eb' : 'transparent',
                color: authMode === 'login' ? '#ffffff' : 'var(--text-sub)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: authMode === 'login' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
              }}
            >
              <i className="fas fa-sign-in-alt" style={{ marginRight: '6px' }}></i>
              Đăng Nhập
            </button>

            <button
              onClick={() => { setAuthMode('register'); setErrorMsg(''); }}
              style={{
                padding: '11px',
                borderRadius: '12px',
                border: 'none',
                background: authMode === 'register' ? '#2563eb' : 'transparent',
                color: authMode === 'register' ? '#ffffff' : 'var(--text-sub)',
                fontWeight: 800,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: authMode === 'register' ? '0 4px 12px rgba(37, 99, 235, 0.3)' : 'none'
              }}
            >
              <i className="fas fa-user-plus" style={{ marginRight: '6px' }}></i>
              Đăng Ký Mới
            </button>
          </div>

          {/* Form inputs */}
          <form onSubmit={handleAuthSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {authMode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                  Họ & Tên
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '14px',
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-body)',
                    color: 'var(--text-main)',
                    fontSize: '0.88rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Địa chỉ Email
              </label>
              <input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                Mật Khẩu
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '11px 14px',
                  borderRadius: '14px',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  fontSize: '0.88rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {errorMsg && (
              <div style={{
                fontSize: '0.8rem',
                color: '#dc2626',
                background: '#fee2e2',
                padding: '10px 14px',
                borderRadius: '12px',
                fontWeight: 600,
                lineHeight: '1.4'
              }}>
                <i className="fas fa-exclamation-circle" style={{ marginRight: '6px' }}></i>
                {errorMsg}
              </div>
            )}

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={isLoading}
              style={{
                width: '100%',
                padding: '13px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.95rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '6px',
                boxShadow: '0 6px 20px rgba(37, 99, 235, 0.35)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
            >
              {isLoading ? (
                <span>Đang xử lý...</span>
              ) : (
                <>
                  <i className={authMode === 'login' ? "fas fa-sign-in-alt" : "fas fa-user-plus"}></i>
                  <span>{authMode === 'login' ? 'Xác Nhận Đăng Nhập' : 'Tạo Tài Khoản Mới'}</span>
                </>
              )}
            </motion.button>
          </form>
        </div>
      ) : (
        /* ================= LOGGED IN USER DASHBOARD ================= */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* User Profile Header Card */}
          <div style={{
            background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
            borderRadius: '24px',
            padding: '24px',
            color: '#ffffff',
            boxShadow: '0 12px 30px rgba(37, 99, 235, 0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '20px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.8rem',
                  fontWeight: 850,
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}>
                  {currentUser.displayName
                    ? currentUser.displayName.charAt(0).toUpperCase()
                    : (currentUser.email ? currentUser.email.charAt(0).toUpperCase() : 'U')}
                </div>

                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: 850, color: '#ffffff' }}>
                    {currentUser.displayName || currentUser.email}
                  </h3>
                  <div style={{ fontSize: '0.85rem', opacity: 0.9, display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fas fa-envelope"></i>
                    <span>{currentUser.email}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                    <span style={{ fontSize: '0.72rem', background: 'rgba(255, 255, 255, 0.25)', padding: '3px 10px', borderRadius: '10px', fontWeight: 800 }}>
                      <i className="fas fa-check-circle" style={{ marginRight: '4px' }}></i>
                      Tài Khoản Đã Xác Minh
                    </span>
                    <span style={{ fontSize: '0.72rem', background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '10px', fontWeight: 800 }}>
                      PRO MEMBER
                    </span>
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                style={{
                  padding: '9px 16px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  color: '#ffffff',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                  fontWeight: 800,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  backdropFilter: 'blur(8px)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <i className="fas fa-sign-out-alt"></i>
                <span>Đăng Xuất</span>
              </motion.button>
            </div>
          </div>

          {/* Sub Navigation Switcher inside Account */}
          <div style={{
            display: 'flex',
            gap: '10px',
            borderBottom: '2px solid var(--border-color)',
            paddingBottom: '8px'
          }}>
            <button
              onClick={() => setActiveSubTab('profile')}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeSubTab === 'profile' ? 'var(--bg-card)' : 'transparent',
                color: activeSubTab === 'profile' ? '#2563eb' : 'var(--text-sub)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeSubTab === 'profile' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <i className="fas fa-mobile-alt"></i>
              <span>Thiết Bị Của Tôi ({userDevices.length})</span>
            </button>

            <button
              onClick={() => setActiveSubTab('bugreport')}
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                border: 'none',
                background: activeSubTab === 'bugreport' ? 'var(--bg-card)' : 'transparent',
                color: activeSubTab === 'bugreport' ? '#ef4444' : 'var(--text-sub)',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                boxShadow: activeSubTab === 'bugreport' ? '0 2px 8px rgba(0,0,0,0.06)' : 'none'
              }}
            >
              <i className="fas fa-exclamation-triangle"></i>
              <span>Gửi Báo Lỗi & Phản Hồi Admin ({userReports.length})</span>
            </button>
          </div>

          {/* SUB-TAB 1: DEVICES */}
          {activeSubTab === 'profile' && (
            <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
              <h4 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-cloud" style={{ color: '#2563eb' }}></i>
                <span>Danh Sách Thiết Bị Cloud Đã Đồng Bộ</span>
              </h4>

              {userDevices.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 16px', color: 'var(--text-sub)', background: 'var(--bg-body)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                  <i className="fas fa-mobile-alt" style={{ fontSize: '2rem', opacity: 0.4, marginBottom: '8px', display: 'block' }}></i>
                  <span>Bạn chưa mua hoặc khởi tạo thiết bị nào. Vui lòng chọn mua máy tại trang chính!</span>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                  {userDevices.map((dev) => (
                    <div key={dev.id} style={{ padding: '14px', borderRadius: '16px', background: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                      <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-main)', marginBottom: '4px' }}>
                        {dev.name}
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                        RAM: {dev.ram} | Android: {dev.android}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <i className="fas fa-circle" style={{ fontSize: '0.5rem' }}></i>
                        Sẵn Sàng Sử Dụng
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* SUB-TAB 2: BUG REPORT & ADMIN REPLIES */}
          {activeSubTab === 'bugreport' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Form Input Section */}
              <form onSubmit={handleBugReportSubmit} style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ef4444', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-bug"></i>
                  <span>Gửi Báo Lỗi Cho Admin</span>
                </div>

                <div style={{ marginBottom: '14px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Tên thiết bị / App / Game bạn gặp sự cố
                  </label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder="Ví dụ: Cloud Phone Pro, Genshin Impact, Mất kết nối..."
                    required
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-color)',
                      background: 'var(--bg-body)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    Mô tả chi tiết sự cố
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Mô tả nguyên nhân hoặc dấu hiệu bị lỗi để Admin kiểm tra và hỗ trợ..."
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '11px 14px',
                      borderRadius: '14px',
                      border: '1.5px solid var(--border-color)',
                      background: 'var(--bg-body)',
                      color: 'var(--text-main)',
                      fontSize: '0.88rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '13px',
                    borderRadius: '14px',
                    border: 'none',
                    background: 'linear-gradient(135deg, #ef4444, #dc2626)',
                    color: '#ffffff',
                    fontWeight: 800,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)'
                  }}
                >
                  <i className="fas fa-paper-plane"></i>
                  <span>Gửi Báo Lỗi Ngay</span>
                </motion.button>
              </form>

              {/* Admin Replies Section */}
              <div style={{ background: 'var(--bg-card)', padding: '20px', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ margin: '0 0 14px 0', fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-comments" style={{ color: '#2563eb' }}></i>
                  <span>Lịch Sử Báo Lỗi & Phản Hồi Từ Admin ({userReports.length})</span>
                </h4>

                {userReports.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '28px 16px', color: 'var(--text-sub)', background: 'var(--bg-body)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                    <i className="fas fa-inbox" style={{ fontSize: '1.8rem', opacity: 0.4, marginBottom: '8px', display: 'block' }}></i>
                    <span>Bạn chưa có lịch sử báo lỗi nào.</span>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {userReports.map((report) => (
                      <div key={report.id} style={{ padding: '14px', borderRadius: '16px', background: 'var(--bg-body)', border: '1px solid var(--border-color)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                          <span style={{ fontWeight: 800, color: '#ef4444', fontSize: '0.9rem' }}>
                            <i className="fas fa-mobile-alt" style={{ marginRight: '6px' }}></i>
                            {report.targetName}
                          </span>
                          <span style={{
                            fontSize: '0.7rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '8px',
                            background: report.status === 'replied' ? '#dcfce7' : '#fef3c7',
                            color: report.status === 'replied' ? '#15803d' : '#b45309'
                          }}>
                            {report.status === 'replied' ? 'Đã trả lời' : 'Đang chờ xử lý'}
                          </span>
                        </div>

                        <p style={{ margin: '0 0 8px 0', fontSize: '0.85rem', color: 'var(--text-main)' }}>
                          {report.description}
                        </p>

                        <div style={{ fontSize: '0.7rem', color: 'var(--text-sub)', textAlign: 'right' }}>
                          {new Date(report.createdAt).toLocaleString()}
                        </div>

                        {report.adminReply && (
                          <div style={{ marginTop: '10px', padding: '12px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '12px', border: '1px solid #bfdbfe' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: '#1e40af', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <i className="fas fa-user-shield"></i>
                              <span>Trả Lời Từ Admin:</span>
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#1e293b', fontWeight: 600 }}>
                              {report.adminReply}
                            </div>
                            {report.repliedAt && (
                              <div style={{ fontSize: '0.68rem', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>
                                {new Date(report.repliedAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
};
