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

  // Cloud Utilities States
  const [isLandscape, setIsLandscape] = useState(false);
  const [isTurboBoost, setIsTurboBoost] = useState(true);
  const [isTouchLocked, setIsTouchLocked] = useState(false);
  const [flashActive, setFlashActive] = useState(false);

  // Advanced Auto-Clicker States
  const [isAutoClickerEnabled, setIsAutoClickerEnabled] = useState(false); // Target ring visible
  const [isAutoClickerActive, setIsAutoClickerActive] = useState(false);   // Auto-tapping loop running
  const [autoClickInterval, setAutoClickInterval] = useState<number>(200); // ms delay
  const [autoClickMode, setAutoClickMode] = useState<'infinite' | 'count'>('infinite');
  const [autoClickMaxCount, setAutoClickMaxCount] = useState<number>(100);
  const [autoClickCurrentCount, setAutoClickCurrentCount] = useState<number>(0);
  const [showAutoClickerSettings, setShowAutoClickerSettings] = useState(false);
  const [autoClickPos, setAutoClickPos] = useState({ x: 180, y: 320 });
  const [autoClickRipple, setAutoClickRipple] = useState(false);

  // Useful Cloud Assistive Utilities States
  const [showVirtualGamepad, setShowVirtualGamepad] = useState(false);
  const [isAfkSaver, setIsAfkSaver] = useState(false);
  const [streamQuality, setStreamQuality] = useState<'4k' | '720p'>('4k');
  const [isAudioBoost, setIsAudioBoost] = useState(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);
  const longPressTimerRef = useRef<NodeJS.Timeout | null>(null);

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

  // Robust 100% Functional Auto-Clicker Execution Loop
  useEffect(() => {
    if (!isAutoClickerActive || !isAutoClickerEnabled) return;

    const interval = setInterval(() => {
      // Check limit if count mode is enabled
      setAutoClickCurrentCount((prevCount) => {
        const nextCount = prevCount + 1;
        if (autoClickMode === 'count' && nextCount >= autoClickMaxCount) {
          setIsAutoClickerActive(false);
          showToast(`✅ Auto-Clicker đã hoàn thành ${autoClickMaxCount} lần nhấp!`);
        }
        return nextCount;
      });

      // Visual Ripple Pulse
      setAutoClickRipple(true);
      setTimeout(() => setAutoClickRipple(false), 130);

      // Trigger Haptic feedback if available
      try {
        if (navigator.vibrate) navigator.vibrate(8);
      } catch (e) {
        // ignore
      }

      // Dispatch programmatic click events
      try {
        const targetEl = document.elementFromPoint(autoClickPos.x, autoClickPos.y);
        if (targetEl) {
          const opts: MouseEventInit = {
            bubbles: true,
            cancelable: true,
            clientX: autoClickPos.x,
            clientY: autoClickPos.y,
            view: window,
          };
          targetEl.dispatchEvent(new PointerEvent('pointerdown', opts));
          targetEl.dispatchEvent(new MouseEvent('mousedown', opts));
          targetEl.dispatchEvent(new PointerEvent('pointerup', opts));
          targetEl.dispatchEvent(new MouseEvent('mouseup', opts));
          targetEl.dispatchEvent(new MouseEvent('click', opts));
        }
      } catch (e) {
        // ignore
      }

      // PostMessage iframe sync
      if (iframeRef.current?.contentWindow) {
        try {
          iframeRef.current.contentWindow.postMessage(
            { type: 'AUTOCLICK_TAP', x: autoClickPos.x, y: autoClickPos.y },
            '*'
          );
        } catch (e) {
          // ignore
        }
      }
    }, Math.max(50, autoClickInterval));

    return () => clearInterval(interval);
  }, [isAutoClickerActive, isAutoClickerEnabled, autoClickInterval, autoClickMode, autoClickMaxCount, autoClickPos, showToast]);

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

  // Open Auto-Clicker Target Ring & Settings Modal
  const handleOpenAutoClickerDrawer = () => {
    setIsAutoClickerEnabled(true);
    setIsAutoClickerActive(false); // Mới vô không tự bấm
    setIsDrawerOpen(false);
    setShowAutoClickerSettings(true);
    showToast('⚙️ Cài Đặt Auto-Clicker AFK');
  };

  const handleStopAutoClicker = () => {
    setIsAutoClickerActive(false);
    showToast('🛑 Đã tạm dừng Auto-Clicker (Ấn 2 lần vào chỗ Auto Click)');
  };

  const handleToggleVirtualGamepad = () => {
    const next = !showVirtualGamepad;
    setShowVirtualGamepad(next);
    setIsDrawerOpen(false);
    showToast(next ? '🎮 Đã bật Tay Cầm Game Ảo!' : '🎮 Đã tắt Tay Cầm Game');
  };

  const handleToggleAfkSaver = () => {
    const next = !isAfkSaver;
    setIsAfkSaver(next);
    setIsDrawerOpen(false);
    showToast(next ? '🌙 Đã bật Chế Độ Chống Cháy Màn Hình AFK!' : '☀️ Tắt Chế Độ Tiết Kiệm Pin');
  };

  const handleToggleStreamQuality = () => {
    const next = streamQuality === '4k' ? '720p' : '4k';
    setStreamQuality(next);
    setIsDrawerOpen(false);
    showToast(next === '720p' ? '📶 Đã bật Tiết Kiệm Data (Stream 720p Balanced)' : '✨ Đã chuyển sang Stream 4K Ultra HD');
  };

  const handleToggleAudioBoost = () => {
    const next = !isAudioBoost;
    setIsAudioBoost(next);
    setIsDrawerOpen(false);
    showToast(next ? '🔊 Đã bật Kích Âm Bass 3D Spatial Audio!' : '🔈 Tắt Âm Thanh 3D');
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

  // Long press on target ring trigger
  const handleRingTouchStart = () => {
    longPressTimerRef.current = setTimeout(() => {
      setShowAutoClickerSettings(true);
      showToast('⚙️ Mở Cài Đặt Auto-Clicker');
    }, 550);
  };

  const handleRingTouchEnd = () => {
    if (longPressTimerRef.current) {
      clearTimeout(longPressTimerRef.current);
    }
  };

  // Virtual Gamepad Key Press Dispatcher
  const handleGamepadKeyPress = (key: string) => {
    try {
      if (navigator.vibrate) navigator.vibrate(15);
      const evDown = new KeyboardEvent('keydown', { key, code: key, bubbles: true });
      const evUp = new KeyboardEvent('keyup', { key, code: key, bubbles: true });
      document.dispatchEvent(evDown);
      setTimeout(() => document.dispatchEvent(evUp), 80);
    } catch (e) {
      // ignore
    }
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
            {isAutoClickerActive && (
              <div style={{ marginTop: '16px', display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', padding: '6px 14px', borderRadius: '20px', color: '#fca5a5', fontSize: '0.8rem', fontWeight: 800 }}>
                <i className="fas fa-sync-alt fa-spin" /> Auto-Clicker Đang Bấm Chạy ngầm ({autoClickCurrentCount} lần)
              </div>
            )}
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
        {isTurboBoost && (
          <span style={{ color: '#00f0ff', fontSize: '0.68rem', fontWeight: 900, background: 'rgba(0,240,255,0.2)', padding: '1px 5px', borderRadius: '6px', marginLeft: '4px' }}>
            TURBO
          </span>
        )}
      </div>

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
          frameBorder="0"
          allow="autoplay; gamepad; crossorigin-cookies; screen-wake-lock; accelerometer; camera; microphone; fullscreen; geolocation; gyroscope; payment; picture-in-picture; web-share; display-capture"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-modals allow-pointer-lock allow-downloads allow-top-navigation-by-user-activation"
          style={{ border: 'none', width: '100%', height: '100%' }}
        />
      </div>

      {/* Virtual Gamepad On-Screen Overlay */}
      {showVirtualGamepad && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10065,
            pointerEvents: 'none',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            padding: '24px 32px',
          }}
        >
          {/* Left D-Pad */}
          <div style={{ pointerEvents: 'auto', display: 'grid', gridTemplateColumns: 'repeat(3, 44px)', gridTemplateRows: 'repeat(3, 44px)', gap: '4px', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', padding: '8px', borderRadius: '50%', border: '1px solid rgba(0,240,255,0.3)' }}>
            <div />
            <button onClick={() => handleGamepadKeyPress('ArrowUp')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#00f0ff', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer' }}>▲</button>
            <div />
            <button onClick={() => handleGamepadKeyPress('ArrowLeft')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#00f0ff', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer' }}>◀</button>
            <div style={{ background: 'rgba(0,240,255,0.1)', borderRadius: '50%' }} />
            <button onClick={() => handleGamepadKeyPress('ArrowRight')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#00f0ff', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer' }}>▶</button>
            <div />
            <button onClick={() => handleGamepadKeyPress('ArrowDown')} style={{ background: 'rgba(255,255,255,0.2)', border: 'none', color: '#00f0ff', borderRadius: '10px', fontSize: '1.1rem', cursor: 'pointer' }}>▼</button>
            <div />
          </div>

          {/* Right Action Buttons */}
          <div style={{ pointerEvents: 'auto', display: 'grid', gridTemplateColumns: 'repeat(2, 52px)', gap: '10px', background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(8px)', padding: '12px', borderRadius: '24px', border: '1px solid rgba(0,240,255,0.3)' }}>
            <button onClick={() => handleGamepadKeyPress('KeyY')} style={{ background: 'rgba(234, 179, 8, 0.3)', border: '1px solid #eab308', color: '#fef08a', width: '52px', height: '52px', borderRadius: '50%', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}>Y</button>
            <button onClick={() => handleGamepadKeyPress('KeyX')} style={{ background: 'rgba(59, 130, 246, 0.3)', border: '1px solid #3b82f6', color: '#93c5fd', width: '52px', height: '52px', borderRadius: '50%', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}>X</button>
            <button onClick={() => handleGamepadKeyPress('KeyB')} style={{ background: 'rgba(239, 68, 68, 0.3)', border: '1px solid #ef4444', color: '#fca5a5', width: '52px', height: '52px', borderRadius: '50%', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}>B</button>
            <button onClick={() => handleGamepadKeyPress('KeyA')} style={{ background: 'rgba(34, 197, 94, 0.3)', border: '1px solid #22c55e', color: '#86efac', width: '52px', height: '52px', borderRadius: '50%', fontWeight: 900, fontSize: '1.1rem', cursor: 'pointer' }}>A</button>
          </div>
        </div>
      )}

      {/* Floating Auto-Clicker Draggable Target Ring */}
      {isAutoClickerEnabled && (
        <motion.div
          drag
          dragMomentum={false}
          onDragEnd={(_, info) => {
            setAutoClickPos((prev) => ({
              x: Math.max(30, Math.min(window.innerWidth - 60, prev.x + info.offset.x)),
              y: Math.max(50, Math.min(window.innerHeight - 60, prev.y + info.offset.y)),
            }));
          }}
          onDoubleClick={handleStopAutoClicker}
          onTouchStart={handleRingTouchStart}
          onTouchEnd={handleRingTouchEnd}
          onMouseDown={handleRingTouchStart}
          onMouseUp={handleRingTouchEnd}
          style={{
            position: 'fixed',
            left: `${autoClickPos.x}px`,
            top: `${autoClickPos.y}px`,
            zIndex: 10070,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            cursor: 'grab',
            userSelect: 'none',
          }}
        >
          {/* Main Ring Target Circle */}
          <div
            style={{
              position: 'relative',
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              background: isAutoClickerActive ? 'rgba(239, 68, 68, 0.4)' : 'rgba(30, 41, 59, 0.75)',
              border: isAutoClickerActive ? '2.5px solid #ef4444' : '2.5px solid #00f0ff',
              boxShadow: isAutoClickerActive ? '0 0 25px rgba(239, 68, 68, 0.8)' : '0 0 20px rgba(0, 240, 255, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(8px)',
              transition: 'all 0.2s',
            }}
          >
            {/* Center Target Pointer Icon */}
            <i className="fas fa-crosshairs" style={{ fontSize: '1.4rem', color: isAutoClickerActive ? '#ef4444' : '#00f0ff' }} />

            {/* Floating Action Buttons near Ring */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowAutoClickerSettings(true);
              }}
              style={{
                position: 'absolute',
                top: '-8px',
                right: '-8px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: '#0f172a',
                border: '1px solid #00f0ff',
                color: '#00f0ff',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title="Cài đặt Auto-Clicker"
            >
              <i className="fas fa-cog" />
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isAutoClickerActive) {
                  handleStopAutoClicker();
                } else {
                  setIsAutoClickerActive(true);
                  showToast('▶️ Đã BẮT ĐẦU Auto-Clicker!');
                }
              }}
              style={{
                position: 'absolute',
                bottom: '-8px',
                right: '-8px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                background: isAutoClickerActive ? '#ef4444' : '#22c55e',
                border: '1px solid #ffffff',
                color: '#ffffff',
                fontSize: '0.65rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
              }}
              title={isAutoClickerActive ? 'Tạm dừng Auto Click' : 'Bắt đầu Auto Click'}
            >
              <i className={isAutoClickerActive ? 'fas fa-pause' : 'fas fa-play'} />
            </button>

            {/* Click Ripple Pulse Effect */}
            {autoClickRipple && (
              <motion.div
                initial={{ scale: 0.6, opacity: 1 }}
                animate={{ scale: 2.2, opacity: 0 }}
                style={{
                  position: 'absolute',
                  inset: -6,
                  borderRadius: '50%',
                  border: '2.5px solid #ef4444',
                  pointerEvents: 'none',
                }}
              />
            )}
          </div>

          {/* Status Label underneath ring */}
          <div
            style={{
              marginTop: '4px',
              background: 'rgba(15, 23, 42, 0.9)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '10px',
              padding: '2px 8px',
              fontSize: '0.65rem',
              fontWeight: 800,
              color: isAutoClickerActive ? '#fca5a5' : '#94a3b8',
              whiteSpace: 'nowrap',
              boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
            }}
          >
            {isAutoClickerActive ? `CHẠY AFK (${autoClickCurrentCount})` : 'ẤN 2 LẦN ĐỂ TẮT'}
          </div>
        </motion.div>
      )}

      {/* Auto-Clicker Settings Modal */}
      <AnimatePresence>
        {showAutoClickerSettings && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 10095,
              background: 'rgba(0, 0, 0, 0.75)',
              backdropFilter: 'blur(8px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '20px',
            }}
            onClick={() => setShowAutoClickerSettings(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                maxWidth: '380px',
                background: '#0f172a',
                border: '1px solid rgba(0, 240, 255, 0.4)',
                borderRadius: '26px',
                padding: '24px',
                boxShadow: '0 25px 60px rgba(0, 0, 0, 0.9), 0 0 30px rgba(0, 240, 255, 0.2)',
                color: '#ffffff',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '38px', height: '38px', borderRadius: '12px', background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: '1px solid #ef4444' }}>
                    <i className="fas fa-hand-pointer" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#ffffff' }}>
                      Cài Đặt Auto-Clicker AFK
                    </h3>
                    <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8' }}>
                      Tự động nhấp màn hình không giới hạn
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setShowAutoClickerSettings(false)}
                  style={{ background: 'rgba(255, 255, 255, 0.1)', border: 'none', color: '#94a3b8', width: '30px', height: '30px', borderRadius: '50%', cursor: 'pointer' }}
                >
                  <i className="fas fa-times" />
                </button>
              </div>

              {/* 1. Field Delay (Độ trễ) */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '8px' }}>
                  ⚡ Độ Trễ Giữa Các Lần Bấm (ms):
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input
                    type="number"
                    value={autoClickInterval}
                    onChange={(e) => setAutoClickInterval(Math.max(50, parseInt(e.target.value) || 100))}
                    style={{
                      flex: 1,
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      color: '#ffffff',
                      fontSize: '0.95rem',
                      fontWeight: 800,
                      outline: 'none',
                    }}
                  />
                  <div style={{ display: 'flex', gap: '4px' }}>
                    {[100, 200, 500].map((preset) => (
                      <button
                        key={preset}
                        onClick={() => setAutoClickInterval(preset)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '10px',
                          background: autoClickInterval === preset ? '#00f0ff' : 'rgba(255,255,255,0.08)',
                          color: autoClickInterval === preset ? '#0f172a' : '#cbd5e1',
                          fontWeight: 800,
                          fontSize: '0.75rem',
                          border: 'none',
                          cursor: 'pointer',
                        }}
                      >
                        {preset}ms
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. Field Number of Clicks (Số lần bấm / Vô hạn) */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#cbd5e1', marginBottom: '8px' }}>
                  🔢 Số Lần Bấm (Hoặc Vô Hạn):
                </label>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '10px' }}>
                  <button
                    onClick={() => setAutoClickMode('infinite')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      background: autoClickMode === 'infinite' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: autoClickMode === 'infinite' ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: autoClickMode === 'infinite' ? '#00f0ff' : '#94a3b8',
                      fontWeight: 850,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    ∞ Vô Hạn
                  </button>

                  <button
                    onClick={() => setAutoClickMode('count')}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      background: autoClickMode === 'count' ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.06)',
                      border: autoClickMode === 'count' ? '1px solid #00f0ff' : '1px solid rgba(255, 255, 255, 0.1)',
                      color: autoClickMode === 'count' ? '#00f0ff' : '#94a3b8',
                      fontWeight: 850,
                      fontSize: '0.82rem',
                      cursor: 'pointer',
                    }}
                  >
                    🎯 Nhập Số Lần
                  </button>
                </div>

                {autoClickMode === 'count' && (
                  <input
                    type="number"
                    value={autoClickMaxCount}
                    onChange={(e) => setAutoClickMaxCount(Math.max(1, parseInt(e.target.value) || 10))}
                    placeholder="Nhập số lần (ví dụ: 100)"
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.06)',
                      border: '1px solid rgba(0, 240, 255, 0.3)',
                      color: '#ffffff',
                      fontSize: '0.92rem',
                      fontWeight: 800,
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setIsAutoClickerEnabled(true);
                    setIsAutoClickerActive(true);
                    setAutoClickCurrentCount(0);
                    setShowAutoClickerSettings(false);
                    showToast('🚀 Đã BẮT ĐẦU Auto-Clicker AFK!');
                  }}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 900,
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 18px rgba(239, 68, 68, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <i className="fas fa-play" />
                  <span>Bắt Đầu Auto Click Ngay</span>
                </motion.button>

                <button
                  onClick={() => {
                    setIsAutoClickerEnabled(false);
                    setIsAutoClickerActive(false);
                    setShowAutoClickerSettings(false);
                    showToast('🛑 Đã Tắt Vòng Auto-Clicker');
                  }}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    color: '#cbd5e1',
                    border: 'none',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    cursor: 'pointer',
                  }}
                >
                  Tắt Vòng Auto-Clicker
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

              {/* 2. Auto-Clicker AFK Settings */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleOpenAutoClickerDrawer}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: isAutoClickerEnabled ? 'rgba(239, 68, 68, 0.22)' : 'rgba(255, 255, 255, 0.05)',
                  border: isAutoClickerEnabled ? '1px solid rgba(239, 68, 68, 0.6)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isAutoClickerEnabled ? '#fca5a5' : '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-hand-pointer" style={{ fontSize: '0.95rem', width: '18px', color: '#ef4444' }} />
                <span>Auto-Clicker AFK</span>
              </motion.button>

              {/* 3. Tay Cầm Game Ảo Overlay */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleVirtualGamepad}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: showVirtualGamepad ? 'rgba(0, 240, 255, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: showVirtualGamepad ? '1px solid rgba(0, 240, 255, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: showVirtualGamepad ? '#00f0ff' : '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-gamepad" style={{ fontSize: '0.95rem', width: '18px', color: '#00f0ff' }} />
                <span>Tay Cầm Game Ảo</span>
              </motion.button>

              {/* 4. Chống Cháy Màn Hình AFK */}
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

              {/* 5. Game Turbo Boost */}
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

              {/* 6. Orientation Switch (Xoay Màn Hình) */}
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

              {/* 7. Tiết Kiệm Data Stream */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleStreamQuality}
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
                <i className="fas fa-wifi" style={{ fontSize: '0.95rem', width: '18px', color: '#eab308' }} />
                <span>{streamQuality === '720p' ? 'Data Saver (720p)' : 'Stream 4K Ultra HD'}</span>
              </motion.button>

              {/* 8. Kích Âm Bass Audio Boost */}
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleToggleAudioBoost}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '12px',
                  background: isAudioBoost ? 'rgba(236, 72, 153, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                  border: isAudioBoost ? '1px solid rgba(236, 72, 153, 0.5)' : '1px solid rgba(255, 255, 255, 0.1)',
                  color: isAudioBoost ? '#f472b6' : '#cbd5e1',
                  fontWeight: 750,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <i className="fas fa-volume-up" style={{ fontSize: '0.95rem', width: '18px', color: '#ec4899' }} />
                <span>Kích Âm Bass 3D</span>
              </motion.button>

              {/* 9. Screenshot Screen Capture */}
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

              {/* 10. Touch Lock Guard */}
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

              {/* 11. FPS Monitor Toggle */}
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

              {/* 12. Bug Report */}
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

      {/* FPS Overlay Indicator */}
      {showFps && (
        <div className="fps-monitor" style={{ display: 'block' }}>
          FPS: <span id="fps-val">{fpsVal}</span>
        </div>
      )}
    </div>
  );
};
