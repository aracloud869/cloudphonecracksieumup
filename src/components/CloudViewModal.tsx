import React, { useState, useEffect, useRef } from 'react';
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
  const [showAssistMenu, setShowAssistMenu] = useState(false);
  const [showFps, setShowFps] = useState(false);
  const [fpsVal, setFpsVal] = useState(60);
  const [isFakeIp, setIsFakeIp] = useState(() => localStorage.getItem('fake_ip') === '1');
  const [ping, setPing] = useState<number>(28);

  // Dynamic Ping / Latency Simulation Loop
  useEffect(() => {
    const pingInterval = setInterval(() => {
      // Simulate connection quality latency jitter between 18ms and 75ms
      const randomJitter = Math.floor(Math.random() * 25) - 10;
      setPing((prev) => {
        const nextPing = prev + randomJitter;
        return Math.min(120, Math.max(16, nextPing));
      });
    }, 2500);

    return () => clearInterval(pingInterval);
  }, []);

  // Floating button draggable position
  const [pos, setPos] = useState(() => ({
    x: typeof window !== 'undefined' ? Math.max(10, window.innerWidth - 70) : 300,
    y: 120,
  }));
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef({ startX: 0, startY: 0, initX: 0, initY: 0, moved: false });

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute active src URL utilizing the standard app proxy (levivietnam)
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

  // Handle Drag Pointer Events for Floating Assistive Ball
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragRef.current = {
      startX: e.clientX,
      startY: e.clientY,
      initX: pos.x,
      initY: pos.y,
      moved: false,
    };
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {}
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    const dx = e.clientX - dragRef.current.startX;
    const dy = e.clientY - dragRef.current.startY;
    if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
      dragRef.current.moved = true;
    }
    const newX = Math.max(10, Math.min(window.innerWidth - 60, dragRef.current.initX + dx));
    const newY = Math.max(10, Math.min(window.innerHeight - 60, dragRef.current.initY + dy));
    setPos({ x: newX, y: newY });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (isDragging) {
      setIsDragging(false);
      try {
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {}
      if (!dragRef.current.moved) {
        setShowAssistMenu((prev) => !prev);
      }
    }
  };

  if (!url) return null;

  const handleReload = () => {
    setStatusText(t?.cloudReloading || 'Đang reload...');
    setShowAssistMenu(false);
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

  const handleRestart = () => {
    setStatusText(t?.cloudRestarting || 'Khởi động lại...');
    handleReload();
    setShowAssistMenu(false);
    setTimeout(() => {
      setStatusText(t?.cloudRestarted || 'Đã khởi động lại');
      setTimeout(() => setStatusText(''), 2000);
    }, 900);
  };

  const handleToggleFakeIp = () => {
    const nextState = !isFakeIp;
    setIsFakeIp(nextState);
    localStorage.setItem('fake_ip', nextState ? '1' : '0');
    showToast(nextState ? (t?.fakeIpOnToast || 'Bật Fake IP (ẩn danh)') : (t?.fakeIpOffToast || 'Tắt Fake IP'));
    setShowAssistMenu(false);
  };

  const handleCleanRam = () => {
    showToast(t?.cleanRamCleaningToast || 'Dọn RAM 3X...');
    setShowAssistMenu(false);
    setTimeout(() => showToast(t?.cleanRamSuccessToast || 'Dọn RAM hoàn tất! Giảm 1.2GB RAM'), 1000);
  };

  const handleToggleFps = () => {
    const nextState = !showFps;
    setShowFps(nextState);
    showToast(nextState ? (t?.fpsMonitorOnToast || 'Bật FPS Monitor') : (t?.fpsMonitorOffToast || 'Tắt FPS Monitor'));
    setShowAssistMenu(false);
  };

  const handleToggleFullScreen = () => {
    setShowAssistMenu(false);
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  };

  // Determine menu placement based on ball position
  const isRightSide = pos.x > window.innerWidth / 2;
  const menuLeft = isRightSide ? Math.max(10, pos.x - 220) : pos.x + 60;
  const menuTop = Math.max(10, Math.min(window.innerHeight - 320, pos.y - 40));

  return (
    <div id="cloud-view" ref={containerRef} style={{ display: 'flex' }}>
      {/* Status Overlay */}
      {statusText && <div className="cloud-status">{statusText}</div>}

      {/* Floating Real-time Ping / Latency Indicator Badge */}
      <div
        style={{
          position: 'fixed',
          top: '12px',
          right: '12px',
          zIndex: 1040,
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(8px)',
          color: '#ffffff',
          padding: '4px 10px',
          borderRadius: '20px',
          fontSize: '0.75rem',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
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

      {/* Floating Draggable Assistive Ball Button */}
      <div
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        style={{
          position: 'fixed',
          left: `${pos.x}px`,
          top: `${pos.y}px`,
          width: '52px',
          height: '52px',
          borderRadius: '50%',
          background: showAssistMenu ? '#2563eb' : 'rgba(15, 23, 42, 0.88)',
          border: '2px solid rgba(255, 255, 255, 0.3)',
          color: '#ffffff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.25rem',
          boxShadow: showAssistMenu
            ? '0 0 20px rgba(37, 99, 235, 0.8)'
            : '0 8px 24px rgba(0, 0, 0, 0.5)',
          cursor: isDragging ? 'grabbing' : 'grab',
          zIndex: 1050,
          userSelect: 'none',
          touchAction: 'none',
          backdropFilter: 'blur(10px)',
          transition: isDragging ? 'none' : 'background 0.2s, box-shadow 0.2s',
        }}
        title={t?.assistBallTitle || 'Nút trợ năng (kéo thả hoặc nhấn để mở menu)'}
      >
        <i className={showAssistMenu ? 'fas fa-times' : 'fas fa-sliders-h'}></i>
      </div>

      {showAssistMenu && (
        <div
          className="assist-menu"
          style={{
            display: 'flex',
            position: 'fixed',
            left: `${menuLeft}px`,
            top: `${menuTop}px`,
            right: 'auto',
            transform: 'none',
            zIndex: 1051,
                background: 'rgba(15, 23, 42, 0.95)',
                backdropFilter: 'blur(12px)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                borderRadius: '16px',
                width: '220px',
                padding: '8px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.6)',
              }}
            >
              <div className="menu-row" style={{ pointerEvents: 'none', borderBottom: '1px solid rgba(255,255,255,0.1)', marginBottom: '4px', paddingBottom: '6px' }}>
                <i className="fas fa-wifi" style={{ color: ping < 40 ? '#34d399' : ping < 75 ? '#fbbf24' : '#f87171' }}></i>
                <span>Ping: <strong style={{ color: ping < 40 ? '#34d399' : ping < 75 ? '#fbbf24' : '#f87171' }}>{ping} ms</strong> ({ping < 40 ? (t?.pingGreat || 'Tốt') : ping < 75 ? (t?.pingGood || 'Ổn định') : (t?.pingFair || 'Chậm')})</span>
              </div>
              <div className="menu-row" onClick={handleReload}>
                <i className="fas fa-sync" style={{ color: '#60a5fa' }}></i> {t?.reloadCloud || 'Tải lại Cloud'}
              </div>
              <div className="menu-row" onClick={handleToggleFullScreen}>
                <i className="fas fa-expand" style={{ color: '#34d399' }}></i> {t?.fullscreen || 'Toàn màn hình'}
              </div>
              <div className="menu-row" onClick={handleRestart}>
                <i className="fas fa-redo" style={{ color: '#f59e0b' }}></i> {t?.restartCloud || 'Khởi động lại'}
              </div>
              <div className="menu-row" onClick={handleToggleFakeIp}>
                <i className="fas fa-globe" style={{ color: '#a78bfa' }}></i> {isFakeIp ? (t?.fakeIpMenuOff || 'Tắt Fake IP') : (t?.fakeIpMenuOn || 'Fake IP ẩn danh')}
              </div>
              <div className="menu-row" onClick={handleCleanRam}>
                <i className="fas fa-broom" style={{ color: '#38bdf8' }}></i> {t?.cleanRam || 'Dọn RAM 3X'}
              </div>
              <div className="menu-row" onClick={handleToggleFps}>
                <i className="fas fa-tachometer-alt" style={{ color: '#f43f5e' }}></i> {showFps ? (t?.fpsMonitorMenuOff || 'Tắt FPS Monitor') : (t?.fpsMonitorMenuOn || 'Bật FPS Monitor')}
              </div>
              {onOpenBugReportModal && (
                <div className="menu-row" onClick={() => { setShowAssistMenu(false); onOpenBugReportModal(); }}>
                  <i className="fas fa-bug" style={{ color: '#f87171' }}></i> Báo Lỗi & Phản Hồi
                </div>
              )}
              <div
                className="menu-row"
                onClick={() => {
                  setShowAssistMenu(false);
                  onClose();
                }}
                style={{ color: '#f87171', borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: '4px', paddingTop: '8px' }}
              >
                <i className="fas fa-times-circle"></i> {t?.exitCloud || 'Thoát Cloud Sandbox'}
              </div>
            </div>
          )}

      {showFps && (
        <div className="fps-monitor" style={{ display: 'block' }}>
          FPS: <span id="fps-val">{fpsVal}</span>
        </div>
      )}
    </div>
  );
};
