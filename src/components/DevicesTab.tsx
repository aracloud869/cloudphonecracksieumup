import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Device } from '../types';
import { Translations } from '../languages';

export function formatPlayTime(totalSeconds: number = 0, t?: Translations): string {
  if (!totalSeconds || totalSeconds <= 0) {
    return t?.playTimeZero || 'Chưa có dữ liệu';
  }
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`;
  } else if (minutes > 0) {
    return `${minutes}m ${seconds}s`;
  } else {
    return `${seconds}s`;
  }
}

interface DevicesTabProps {
  devices: Device[];
  onOpenBuyModal: () => void;
  onEnterCloud: (url: string, device?: Device) => void;
  onOpenRenameModal: (device: Device) => void;
  onDeleteDevice: (id: number) => void;
  onDeleteInactiveDevices: () => void;
  defaultUrl: string;
  t: Translations;
}

export const DevicesTab: React.FC<DevicesTabProps> = ({
  devices,
  onOpenBuyModal,
  onEnterCloud,
  onOpenRenameModal,
  onDeleteDevice,
  onDeleteInactiveDevices,
  defaultUrl,
  t,
}) => {
  const inactiveCount = (devices || []).filter(
    (d) => d.status === 'inactive' || d.status === 'offline' || !d.url || !d.url.trim()
  ).length;

  return (
    <div id="tab-devices" className="tab-content active">
      <div className="header-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
        <h2 className="header-title" style={{ margin: 0 }}>{t.devicesTitle} ({devices.length})</h2>
        
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={onDeleteInactiveDevices}
            style={{
              background: inactiveCount > 0 ? 'rgba(239, 68, 68, 0.15)' : 'var(--input-bg)',
              color: inactiveCount > 0 ? '#ef4444' : 'var(--text-sub)',
              border: inactiveCount > 0 ? '1px solid rgba(239, 68, 68, 0.3)' : '1px solid var(--input-border)',
              padding: '8px 12px',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.82rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            <i className="fas fa-trash-alt"></i> {t.deleteInactiveBtn}
            {inactiveCount > 0 && (
              <span style={{
                background: '#dc2626',
                color: 'white',
                borderRadius: '10px',
                padding: '2px 6px',
                fontSize: '0.72rem',
                fontWeight: 800,
              }}>
                {inactiveCount}
              </span>
            )}
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="btn-add-device"
            onClick={onOpenBuyModal}
          >
            <i className="fas fa-plus"></i> {t.addDeviceBtn}
          </motion.button>
        </div>
      </div>

      <div id="device-list">
        {!devices || devices.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            id="empty-state"
            style={{ textAlign: 'center', marginTop: '60px', color: '#9ca3af' }}
          >
            <i className="fas fa-mobile-alt" style={{ fontSize: '3.5rem', opacity: 0.3, marginBottom: '8px' }}></i>
            <p style={{ marginTop: '12px', fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-main)' }}>{t.emptyDevicesTitle}</p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-sub)' }}>{t.emptyDevicesDesc}</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            {devices.map((device, idx) => {
              const isInactive = device.status === 'inactive' || device.status === 'offline' || !device.url || !device.url.trim();

              return (
                <motion.div
                  key={device.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.2, delay: idx * 0.04 }}
                  whileHover={{ y: -3 }}
                  className="device-card"
                  style={{
                    borderLeft: isInactive ? '4px solid #f43f5e' : '4px solid var(--accent-blue)',
                    background: 'var(--bg-card)',
                  }}
                >
                  <div className="dev-top">
                    <div
                      className="dev-icon"
                      style={{
                        background: isInactive
                          ? 'rgba(244, 63, 94, 0.15)'
                          : 'rgba(37, 99, 235, 0.12)',
                        color: isInactive ? '#f43f5e' : 'var(--accent-blue)',
                        border: isInactive
                          ? '1px solid rgba(244, 63, 94, 0.3)'
                          : '1px solid rgba(37, 99, 235, 0.25)',
                      }}
                    >
                      <i className="fas fa-gamepad"></i>
                    </div>
                    <div className="dev-info">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <h4 className="dev-name" style={{ margin: 0, color: 'var(--text-main)' }}>{device.name}</h4>
                        <span style={{
                          fontSize: '0.72rem',
                          fontWeight: 900,
                          padding: '2px 9px',
                          borderRadius: '10px',
                          background: isInactive ? 'rgba(244, 63, 94, 0.18)' : 'rgba(16, 185, 129, 0.18)',
                          color: isInactive ? '#ef4444' : '#10b981',
                          border: isInactive ? '1px solid rgba(244, 63, 94, 0.3)' : '1px solid rgba(16, 185, 129, 0.3)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '5px',
                        }}>
                          <span className="pulse-dot" style={{ background: isInactive ? '#f43f5e' : '#10b981' }}></span>
                          {isInactive ? t.inactiveStatus : 'RIG ONLINE (120 FPS)'}
                        </span>
                      </div>

                      <div className="dev-status text-muted" style={{ marginTop: '5px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700, fontSize: '0.78rem' }}>
                          ⚡ {device.android || 'Android 12 ULTRA'} • {device.ram || '16GB RAM'}
                        </span>
                        <span style={{
                          fontSize: '0.72rem',
                          color: '#38bdf8',
                          fontWeight: 800,
                          background: 'rgba(56, 189, 248, 0.12)',
                          padding: '2px 8px',
                          borderRadius: '8px',
                          border: '1px solid rgba(56, 189, 248, 0.25)',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <i className="fas fa-clock" style={{ fontSize: '0.68rem' }}></i> {t.playTimeLabel || 'Đã chơi:'} {formatPlayTime(device.playTime, t)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="dev-actions">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="btn-act btn-enter"
                      onClick={() => onEnterCloud(device.url || defaultUrl, device)}
                      style={{
                        background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
                        color: '#060911',
                        fontWeight: 900,
                        boxShadow: '0 0 16px rgba(0, 240, 255, 0.35)',
                      }}
                    >
                      <i className="fas fa-play" style={{ marginRight: '6px' }}></i> {t.enterDeviceBtn}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="btn-act"
                      style={{
                        background: 'rgba(168, 85, 247, 0.15)',
                        color: '#c084fc',
                        border: '1px solid rgba(168, 85, 247, 0.3)',
                        borderRadius: '12px',
                        padding: '10px 0',
                        fontWeight: 800,
                        cursor: 'pointer'
                      }}
                      onClick={() => onOpenRenameModal(device)}
                    >
                      <i className="fas fa-edit" style={{ marginRight: '4px' }}></i> {t.renameDeviceBtn}
                    </motion.button>

                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      className="btn-act btn-del"
                      onClick={() => onDeleteDevice(device.id)}
                    >
                      <i className="fas fa-trash" style={{ marginRight: '4px' }}></i> {t.deleteDeviceBtn}
                    </motion.button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
};


