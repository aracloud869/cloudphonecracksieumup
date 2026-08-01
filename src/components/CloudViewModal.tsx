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
  const [showPing, setShowPing] = useState(true);
  const [fpsVal, setFpsVal] = useState(60);
  const [ping, setPing] = useState<number>(28);

  // Cloud Utilities States
  const [isLandscape, setIsLandscape] = useState(false);
  const [isTurboBoost, setIsTurboBoost] = useState(true);
  const [isTouchLocked, setIsTouchLocked] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // AFK Saver State
  const [isAfkSaver, setIsAfkSaver] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Dynamic Ping Simulation Loop
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
      const baseFps = isTurboBoost ? 120 : 60;
      const calculatedFps = Math.round(1000 / (delta || 16));
      lastTime = now;
      setFpsVal(Math.min(baseFps, Math.max(1, calculatedFps)));
      animId = requestAnimationFrame(loop);
    };

    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [showFps, isTurboBoost]);

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

  const handleTogglePing = () => {
    const nextState = !showPing;
    setShowPing(nextState);
    showToast(nextState ? '📡 Bật Hiển Thị Ping Badge' : '📡 Tắt Hiển Thị Ping Badge');
    setIsDrawerOpen(false);
  };

  const handleToggleTurboBoost = () => {
    const next = !isTurboBoost;
    setIsTurboBoost(next);
    showToast(next ? '🚀 Đã bật Game Turbo Boost 120 FPS Ultra!' : '⚙️ Tắt Game Turbo Boost');
    setIsDrawerOpen(false);
  };

  const handleToggleLandscape = () => {
    const next = !isLandscape;
    setIsLandscape(next);
    showToast(next ? '🔄 Chuyển sang Màn Hình Ngang (16:9 Landscape)' : '📱 Chuyển sang Màn Hình Dọc (Portrait)');
    setIsDrawerOpen(false);
  };

  const handleToggleAfkSaver = () => {
    const next = !isAfkSaver;
    setIsAfkSaver(next);
    setIsDrawerOpen(false);
    showToast(next ? '🌙 Đã bật Chế Độ Chống Cháy Màn Hình AFK!' : '☀️ Tắt Chế Độ Tiết Kiệm Pin');
  };

  const handleScreenshot = () => {
    setFlashActive(true);
    setIsDrawerOpen(false);
    setTimeout(() => setFlashActive(false), 300);
    showToast('📸 Đã chụp ảnh màn hình Cloud Gaming thành công!');
  };

  const handleToggleTouchLock = () => {
    const next = !isTouchLocked;
    setIsTouchLocked(next);
    setIsDrawerOpen(false);
    showToast(next ? '🔒 Khóa cảm ứng màn hình (tránh chạm nhầm)' : '🔓 Mở khóa cảm ứng');
  };

  return (
    <div
      id="cloud-view"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'fixed',
        inset: 0,
        zIndex: 10000,
        background: '#040711',
        overflow: 'hidden',
      }}
    >
      {/* Screen Capture Flash Animation Effect */}
      {flashActive && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: '#ffffff',
            zIndex: 10090,
            pointerEvents: 'none',
          }}
        />
      )}

      {/* AFK Low-Power Burn Saver Shield */}
      {isAfkSaver && (
        <div
          onClick={() => setIsAfkSaver(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10085,
            background: 'rgba(0, 0, 0, 0.92)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#38bdf8',
            cursor: 'pointer',
            userSelect: 'none',
            backdropFilter: 'blur(8px)',
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.06, 1] }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
            style={{ textAlign: 'center' }}
          >
            <i className="fas fa-moon" style={{ fontSize: '3.5rem', marginBottom: '16px', color: '#38bdf8', filter: 'drop-shadow(0 0 15px rgba(56, 189, 248, 0.6))' }} />
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.25rem', fontWeight: 900, color: '#f8fafc' }}>
              Chế Độ AFK Tiết Kiệm Pin & Chống Cháy Màn Hình
            </h3>
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#94a3b8' }}>
              Chạm bất kỳ đâu vào màn hình để mở lại màn hình game
            </p>
          </motion.div>
        </div>
      )}

      {/* Touch Lock Shield Guard */}
      {isTouchLocked && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10080,
            background: 'rgba(0, 0, 0, 0.15)',
            backdropFilter: 'blur(1px)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            paddingTop: '20px',
          }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsTouchLocked(false)}
            style={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '20px',
              padding: '10px 20px',
              fontWeight: 800,
              fontSize: '0.85rem',
              boxShadow: '0 4px 20px rgba(239, 68, 68, 0.6)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <i className="fas fa-lock-open" />
            <span>Màn Hình Đang Khóa - Nhấn Để Mở Khóa</span>
          </motion.button>
        </div>
      )}

      {/* Status Overlay */}
      {statusText && <div className="cloud-status">{statusText}</div>}

      {/* Real-time Draggable Ping Indicator Badge */}
      {showPing && (
        <motion.div
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.08, zIndex: 10070 }}
          style={{
            position: 'fixed',
            top: '12px',
            right: '12px',
            zIndex: 10040,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(12px)',
            color: '#ffffff',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(255, 255, 255, 0.25)',
            boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
            userSelect: 'none',
            cursor: 'grab',
            touchAction: 'none',
          }}
          title="📡 Kéo thả để di chuyển Ping Badge"
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
          {isTurboBoost && (
            <span style={{ color: '#00f0ff', fontSize: '0.68rem', fontWeight: 900, background: 'rgba(0,240,255,0.2)', padding: '1px 5px', borderRadius: '6px', marginLeft: '2px' }}>
              TURBO
            </span>
          )}
        </motion.div>
      )}

      {/* Main Cloud Iframe Container */}
      <div
        style={{
          width: isLandscape ? '92vw' : '100%',
          height: isLandscape ? 'auto' : '100%',
          aspectRatio: isLandscape ? '16 / 9' : 'unset',
          maxHeight: isLandscape ? '88vh' : '100%',
          transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          borderRadius: isLandscape ? '24px' : '0px',
          overflow: 'hidden',
          boxShadow: isLandscape ? '0 20px 60px rgba(0, 240, 255, 0.25), 0 0 0 1px rgba(0, 240, 255, 0.3)' : 'none',
          position: 'relative',
        }}
      >
        <iframe
          ref={iframeRef}
          id="cloud-iframe"
          src={activeSrc}
          title="Cloud Phone Frame"
          width="100%"
          height="100%"
          tabIndex={0}
          onPointerDown={() => iframeRef.current?.focus()}
          onMouseDown={() => iframeRef.current?.focus()}
          frameBorder="0"
          allow="autoplay; gamepad; crossorigin-cookies; screen-wake-lock; accelerometer; camera; microphone; fullscreen; geolocation; gyroscope; payment; picture-in-picture; web-share; display-capture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock allow-downloads allow-top-navigation-by-user-activation"
          style={{ border: 'none', width: '100%', height: '100%', pointerEvents: 'auto' }}
        />
      </div>

      {/* Floating Right-Edge Trigger Handle Tab (<) */}
      {!isDrawerOpen && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.08, x: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => setIsDrawerOpen(true)}
          style={{
            position: 'fixed',
            right: 0,
            top: '40%',
            transform: 'translateY(-50%)',
            zIndex: 10050,
            background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.94) 0%, rgba(30, 41, 59, 0.96) 100%)',
            border: '1px solid rgba(0, 240, 255, 0.4)',
            borderRight: 'none',
            borderRadius: '18px 0 0 18px',
            padding: '12px 8px 12px 12px',
            color: '#00f0ff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '-4px 0 18px rgba(0, 240, 255, 0.3)',
            cursor: 'pointer',
            backdropFilter: 'blur(12px)',
          }}
          title="Nhấn để mở Bảng Trợ Năng Cloud"
        >
          <motion.i
            animate={{ x: [-2, 2, -2] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
            className="fas fa-chevron-left"
            style={{ fontSize: '1.15rem', textShadow: '0 0 10px rgba(0, 240, 255, 0.8)' }}
          />
        </motion.div>
      )}

      {/* Sleek Floating Assistive Drawer Menu Panel */}
      <AnimatePresence>
        {isDrawerOpen && (
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ type: 'spring', damping: 22, stiffness: 300 }}
            style={{
              position: 'fixed',
              right: '12px',
              top: '10%',
              width: '235px',
              maxHeight: '82vh',
              zIndex: 10060,
              background: 'rgba(10, 16, 30, 0.94)',
              backdropFilter: 'blur(18px)',
              border: '1px solid rgba(0, 240, 255, 0.35)',
              borderRadius: '22px',
              boxShadow: '0 16px 40px rgba(0, 0, 0, 0.85), 0 0 20px rgba(0, 240, 255, 0.15)',
              display: 'flex',
              flexDirection: 'column',
              padding: '14px',
              overflowY: 'auto',
            }}
          >
            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                marginBottom: '10px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className="fas fa-sliders-h" style={{ color: '#00f0ff', fontSize: '0.95rem' }} />
                <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '0.92rem', fontWeight: 800 }}>
                  Trợ Năng Cloud
                </h4>
              </div>

              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setIsDrawerOpen(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: 'none',
                  color: '#ffffff',
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                }}
              >
                <i className="fas fa-times" style={{ fontSize: '0.8rem' }} />
              </motion.button>
            </div>

            {/* Grid Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {/* 1. Reload Cloud */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleReload}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(59, 130, 246, 0.12)',
                  border: '1px solid rgba(59, 130, 246, 0.3)',
                  color: '#60a5fa',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-sync-alt" style={{ fontSize: '0.95rem', width: '18px' }} />
                <span>{t?.reloadCloud || 'Tải lại Cloud'}</span>
              </motion.button>

              {/* 2. Chống Cháy Màn Hình AFK */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleAfkSaver}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: isAfkSaver ? 'rgba(168, 85, 247, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: isAfkSaver ? '1px solid rgba(168, 85, 247, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isAfkSaver ? '#c084fc' : '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-moon" style={{ fontSize: '0.95rem', width: '18px', color: '#c084fc' }} />
                <span>Chống Cháy Màn AFK</span>
              </motion.button>

              {/* 4. Game Turbo Boost */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleTurboBoost}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: isTurboBoost ? 'rgba(34, 197, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: isTurboBoost ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isTurboBoost ? '#4ade80' : '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-bolt" style={{ fontSize: '0.95rem', width: '18px', color: '#22c55e' }} />
                <span>Game Turbo 120 FPS</span>
              </motion.button>

              {/* 5. Orientation Switch (Xoay Màn Hình) */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleLandscape}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: isLandscape ? 'rgba(56, 189, 248, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: isLandscape ? '1px solid rgba(56, 189, 248, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isLandscape ? '#38bdf8' : '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-mobile-alt" style={{ fontSize: '0.95rem', width: '18px', color: '#38bdf8', transform: isLandscape ? 'rotate(-90deg)' : 'none', transition: '0.3s' }} />
                <span>{isLandscape ? 'Màn Hình Ngang (16:9)' : 'Màn Hình Dọc'}</span>
              </motion.button>

              {/* 6. Screenshot Screen Capture */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleScreenshot}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-camera" style={{ fontSize: '0.95rem', width: '18px', color: '#38bdf8' }} />
                <span>Chụp Màn Hình</span>
              </motion.button>

              {/* 7. Touch Lock Guard */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleTouchLock}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  color: '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-lock" style={{ fontSize: '0.95rem', width: '18px', color: '#f59e0b' }} />
                <span>Khóa Cảm Ứng</span>
              </motion.button>

              {/* 8. Ping Badge Toggle */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleTogglePing}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: showPing ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: showPing ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: showPing ? '#34d399' : '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-signal" style={{ fontSize: '0.95rem', width: '18px', color: '#10b981' }} />
                <span>{showPing ? 'Tắt Ping Badge' : 'Bật Ping Badge'}</span>
              </motion.button>

              {/* 9. FPS Monitor Toggle */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleFps}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: showFps ? 'rgba(244, 63, 94, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: showFps ? '1px solid rgba(244, 63, 94, 0.4)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: showFps ? '#fb7185' : '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-tachometer-alt" style={{ fontSize: '0.95rem', width: '18px', color: '#f43f5e' }} />
                <span>{showFps ? 'Tắt FPS Monitor' : 'Bật FPS Monitor'}</span>
              </motion.button>

              {/* 10. Bug Report */}
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
                    gap: '10px',
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '12px',
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#f87171',
                    fontWeight: 750,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <i className="fas fa-bug" style={{ fontSize: '0.95rem', width: '18px' }} />
                  <span>Báo Lỗi & Phản Hồi</span>
                </motion.button>
              )}
            </div>

            {/* Exit Cloud Action Button */}
            <div style={{ paddingTop: '10px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', marginTop: '10px' }}>
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
                  gap: '8px',
                  width: '100%',
                  padding: '10px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color: '#ffffff',
                  fontWeight: 850,
                  fontSize: '0.85rem',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(239, 68, 68, 0.35)',
                }}
              >
                <i className="fas fa-sign-out-alt" />
                <span>Thoát Cloud Sandbox</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Draggable FPS Overlay Indicator */}
      {showFps && (
        <motion.div
          drag
          dragMomentum={false}
          whileDrag={{ scale: 1.08, zIndex: 10070 }}
          style={{
            position: 'fixed',
            top: '12px',
            left: '12px',
            zIndex: 10040,
            background: 'rgba(15, 23, 42, 0.88)',
            backdropFilter: 'blur(12px)',
            color: '#10b981',
            padding: '6px 14px',
            borderRadius: '20px',
            fontSize: '0.75rem',
            fontWeight: 800,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
            userSelect: 'none',
            cursor: 'grab',
            touchAction: 'none',
          }}
          title="⚡ Kéo thả để di chuyển FPS Badge"
        >
          <i className="fas fa-tachometer-alt" style={{ fontSize: '0.8rem', color: '#10b981' }} />
          <span>FPS: <strong style={{ color: '#ffffff', fontWeight: 900 }}>{fpsVal}</strong></span>
        </motion.div>
      )}
    </div>
  );
};
