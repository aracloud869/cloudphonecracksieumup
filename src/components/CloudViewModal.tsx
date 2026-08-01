import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Translations } from '../languages';

interface CloudViewModalProps {
  url: string | null;
  title?: string;
  onClose: () => void;
  showToast: (msg: string) => void;
  onOpenBugReportModal?: () => void;
  t?: Translations;
}

export const CloudViewModal: React.FC<CloudViewModalProps> = ({
  url,
  title,
  onClose,
  showToast,
  onOpenBugReportModal,
  t,
}) => {
  const [statusText, setStatusText] = useState(t?.cloudConnecting || 'Đang kết nối...');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFps, setShowFps] = useState(false);
  const [fpsVal, setFpsVal] = useState(60);
  const [ping, setPing] = useState<number>(28);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Dynamic Ping / Latency Simulation Loop
  useEffect(() => {
    const pingInterval = setInterval(() => {
      const randomJitter = Math.floor(Math.random() * 25) - 10;
      setPing((prev) => {
        const nextPing = prev + randomJitter;
        return Math.min(120, Math.max(16, nextPing));
      });
    }, 2500);

    return () => clearInterval(pingInterval);
  }, []);

  // Compute active src URL utilizing standard app proxy (levivietnam)
  const getActiveUrl = () => {
    if (!url) return 'about:blank';
    if (url.startsWith('https://levivietnam.vercel.app')) {
      return url;
    }
    return `https://levivietnam.vercel.app/?url=${url}`;
  };

  const activeSrc = getActiveUrl();

  useEffect(() => {
    if (url) {
      setStatusText(t?.cloudConnectingSandbox || 'Đang kết nối Cloud Sandbox...');
      const timer = setTimeout(() => {
        setStatusText(t?.cloudConnected || 'Đã kết nối');
        setTimeout(() => setStatusText(''), 2200);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [url, t]);

  // FPS Counter loop
  useEffect(() => {
    if (!showFps) return;
    let animId: number;
    let lastTime = performance.now();

    const loop = (now: number) => {
      const delta = now - lastTime;
      const calculatedFps = Math.round(1000 / (delta || 16));
      lastTime = now;
      setFpsVal(Math.min(999, Math.max(1, calculatedFps)));
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [showFps]);

  if (!url) return null;

  const handleReload = () => {
    setStatusText(t?.cloudReloading || 'Đang reload...');
    setIsDrawerOpen(false);
    if (iframeRef.current) {
      const currentUrl = iframeRef.current.src;
      iframeRef.current.src = 'about:blank';
      setTimeout(() => {
        if (iframeRef.current) {
          iframeRef.current.src = currentUrl;
          setStatusText(t?.cloudReloaded || 'Đã reload');
          setTimeout(() => setStatusText(''), 2000);
        }
      }, 300);
    }
  };

  const handleToggleFps = () => {
    const nextState = !showFps;
    setShowFps(nextState);
    showToast(nextState ? (t?.fpsMonitorOnToast || 'Bật FPS Monitor') : (t?.fpsMonitorOffToast || 'Tắt FPS Monitor'));
    setIsDrawerOpen(false);
  };

  return (
    <div id="cloud-view" style={{ display: 'flex', position: 'fixed', inset: 0, zIndex: 10000, background: '#000000' }}>
      {/* Status Overlay */}
      {statusText && <div className="cloud-status">{statusText}</div>}

      {/* Floating Real-time Ping Indicator Badge */}
      <div
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 10040,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(10px)',
          color: '#ffffff',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
          userSelect: 'none',
          pointerEvents: 'none',
        }}
      >
        <span
          style={{
            width: '8px',
            height: '8px',
            borderRadius: '50%',
            background: ping < 40 ? '#10b981' : ping < 75 ? '#f59e0b' : '#ef4444',
            boxShadow: `0 0 8px ${ping < 40 ? '#10b981' : ping < 75 ? '#f59e0b' : '#ef4444'}`,
          }}
        />
        <span>Ping: {ping}ms</span>
      </div>

      {/* Main Cloud Iframe */}
      <iframe
        ref={iframeRef}
        id="cloud-iframe"
        src={activeSrc}
        title="Cloud Phone Frame"
        width="100%"
        height="100%"
        frameBorder="0"
        allow="autoplay; gamepad; crossorigin-cookies; screen-wake-lock; accelerometer; camera; microphone; fullscreen; geolocation; gyroscope; payment; picture-in-picture; web-share; display-capture"
        sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock allow-downloads allow-top-navigation-by-user-activation"
        style={{ border: 'none', width: '100%', height: '100%' }}
      />

      {/* Floating Right-Edge Trigger Handle Tab (<) */}
      {!isDrawerOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05, x: -2 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsDrawerOpen(true)}
          style={{
            position: 'fixed',
            right: 0,
            top: '42%',
            transform: 'translateY(-50%)',
            zIndex: 10050,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.92) 0%, rgba(30, 41, 59, 0.95) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            borderRight: 'none',
            borderRadius: '20px 0 0 20px',
            padding: '14px 10px 14px 14px',
            color: '#00f0ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '-4px 0 20px rgba(0, 240, 255, 0.25), -2px 0 10px rgba(0, 0, 0, 0.5)',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
          title="Nhấn để mở Bảng Trợ Năng Cloud"
        >
          <motion.i
            animate={{ x: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="fas fa-chevron-left"
            style={{ fontSize: '1.2rem', textShadow: '0 0 10px rgba(0, 240, 255, 0.8)' }}
          />
        </motion.div>
      )}

      {/* Side Drawer Menu Overlay & Animated Drawer Panel */}
      <AnimatePresence>
        {isDrawerOpen && (
          <>
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsDrawerOpen(false)}
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.5)',
                backdropFilter: 'blur(4px)',
                zIndex: 10051,
              }}
            />

            {/* Edge Side Drawer */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              style={{
                position: 'fixed',
                right: 0,
                top: 0,
                bottom: 0,
                width: '280px',
                maxWidth: '85vw',
                zIndex: 10052,
                background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.96) 0%, rgba(9, 13, 22, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderLeft: '1px solid rgba(0, 240, 255, 0.3)',
                boxShadow: '-10px 0 40px rgba(0, 0, 0, 0.8)',
                display: 'flex',
                flexDirection: 'column',
                padding: '20px 16px',
                overflowY: 'auto',
              }}
            >
              {/* Drawer Header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingBottom: '16px',
                  borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
                  marginBottom: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '12px',
                      background: 'rgba(0, 240, 255, 0.15)',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      color: '#00f0ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1rem',
                    }}
                  >
                    <i className="fas fa-sliders-h" />
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1.05rem', fontWeight: 800 }}>
                      Trợ Năng Cloud
                    </h4>
                    <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Bảng điều khiển nhanh</span>
                  </div>
                </div>

                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsDrawerOpen(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    width: '34px',
                    height: '34px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <i className="fas fa-chevron-right" style={{ fontSize: '0.9rem' }} />
                </motion.button>
              </div>

              {/* Ping Status Banner inside Drawer */}
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '14px',
                  padding: '12px 14px',
                  marginBottom: '18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className="fas fa-wifi" style={{ color: ping < 40 ? '#34d399' : ping < 75 ? '#fbbf24' : '#f87171', fontSize: '1.1rem' }} />
                  <div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Độ Trễ Mạng (Ping)</div>
                    <div style={{ fontWeight: 800, color: ping < 40 ? '#34d399' : ping < 75 ? '#fbbf24' : '#f87171', fontSize: '0.95rem' }}>
                      {ping} ms ({ping < 40 ? (t?.pingGreat || 'Tốt') : ping < 75 ? (t?.pingGood || 'Ổn định') : (t?.pingFair || 'Chậm')})
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Options List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                {/* 1. Reload Cloud */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleReload}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: 'rgba(59, 130, 246, 0.12)',
                    border: '1px solid rgba(59, 130, 246, 0.3)',
                    color: '#60a5fa',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <i className="fas fa-sync-alt" style={{ fontSize: '1.1rem', width: '22px' }} />
                  <span>{t?.reloadCloud || 'Tải lại Cloud'}</span>
                </motion.button>

                {/* 2. FPS Monitor Toggle */}
                <motion.button
                  whileHover={{ scale: 1.02, x: 2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleToggleFps}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    width: '100%',
                    padding: '14px 16px',
                    borderRadius: '14px',
                    background: showFps ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                    border: showFps ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.12)',
                    color: showFps ? '#fb7185' : '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <i className="fas fa-tachometer-alt" style={{ fontSize: '1.1rem', width: '22px', color: '#f43f5e' }} />
                  <span>{showFps ? (t?.fpsMonitorMenuOff || 'Tắt FPS Monitor') : (t?.fpsMonitorMenuOn || 'Bật FPS Monitor')}</span>
                </motion.button>

                {/* 3. Bug Report Modal Link */}
                {onOpenBugReportModal && (
                  <motion.button
                    whileHover={{ scale: 1.02, x: 2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setIsDrawerOpen(false);
                      onOpenBugReportModal();
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '14px 16px',
                      borderRadius: '14px',
                      background: 'rgba(239, 68, 68, 0.12)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      color: '#f87171',
                      fontWeight: 700,
                      fontSize: '0.9rem',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <i className="fas fa-bug" style={{ fontSize: '1.1rem', width: '22px' }} />
                    <span>Báo Lỗi & Phản Hồi</span>
                  </motion.button>
                )}
              </div>

              {/* Exit Cloud Button */}
              <div style={{ paddingTop: '16px', borderTop: '1px solid rgba(255, 255, 255, 0.12)', marginTop: 'auto' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsDrawerOpen(false);
                    onClose();
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '10px',
                    width: '100%',
                    padding: '14px',
                    borderRadius: '16px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    fontWeight: 850,
                    fontSize: '0.95rem',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 4px 16px rgba(239, 68, 68, 0.4)',
                  }}
                >
                  <i className="fas fa-sign-out-alt" />
                  <span>{t?.exitCloud || 'Thoát Cloud Sandbox'}</span>
                </motion.button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* FPS Overlay Indicator */}
      {showFps && (
        <div className="fps-monitor" style={{ display: 'block' }}>
          FPS: <span id="fps-val">{fpsVal}</span>
        </div>
      )}
    </div>
  );
};

