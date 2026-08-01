import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Device, GameApp, DeviceType, GuideItem, BugReport } from '../types';
import { SECRET_ADMIN_CODE, INITIAL_DEVICE_TYPES, GAME_CATEGORIES } from '../defaultData';
import { Translations } from '../languages';
import { loginWithEmail, registerWithEmail, User } from '../firebaseConfig';

interface BuyDeviceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (selectedType?: DeviceType) => void;
  deviceTypes?: DeviceType[];
  t?: Translations;
}

export const BuyDeviceModal: React.FC<BuyDeviceModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  deviceTypes,
  t,
}) => {
  const availableTypes = (deviceTypes && deviceTypes.length > 0) ? deviceTypes : INITIAL_DEVICE_TYPES;
  const [selectedTypeId, setSelectedTypeId] = useState<string>('');
  const [openMode, setOpenMode] = useState<'iframe' | 'external'>('iframe');
  const [useProxy, setUseProxy] = useState<boolean>(true);

  useEffect(() => {
    if (availableTypes.length > 0 && !selectedTypeId) {
      setSelectedTypeId(availableTypes[0].id);
    }
  }, [availableTypes, selectedTypeId]);

  const selectedType = availableTypes.find((dt) => dt.id === selectedTypeId) || availableTypes[0];

  useEffect(() => {
    if (selectedType) {
      setOpenMode(selectedType.openMode || (selectedType.openExternal ? 'external' : 'iframe'));
      setUseProxy(selectedType.useProxy !== false);
    }
  }, [selectedTypeId, selectedType]);

  const handleConfirm = () => {
    onConfirm(selectedType);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="modal-buy"
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3000,
            backdropFilter: 'blur(6px)',
            padding: '16px',
          }}
          onClick={onClose}
        >
          <motion.div
            className="modal-box"
            initial={{ scale: 0.92, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{
              width: '100%',
              maxWidth: '440px',
              maxHeight: '90vh',
              background: 'white',
              padding: '24px',
              borderRadius: '24px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ textAlign: 'center', marginBottom: '14px' }}>
              <div style={{ fontSize: '2.2rem', color: '#2563eb', marginBottom: '4px' }}>
                <i className="fas fa-server"></i>
              </div>
              <h2 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: 850, color: '#0f172a' }}>
                {t?.buyModalTitle || 'Mua Cloud Device'}
              </h2>
              <p style={{ color: '#64748b', fontSize: '0.82rem', margin: 0 }}>
                Chọn loại thiết bị Cloud Phone bạn muốn khởi tạo:
              </p>
            </div>

            {/* Device Types List & Options scroll container */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                paddingRight: '2px',
                marginBottom: '14px',
              }}
            >
              {availableTypes.map((dt) => {
                const isSelected = (dt.id === selectedTypeId) || (selectedType?.id === dt.id);

                return (
                  <motion.div
                    key={dt.id}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedTypeId(dt.id)}
                    style={{
                      border: isSelected ? '2px solid #2563eb' : '1.5px solid #e2e8f0',
                      background: isSelected ? '#eff6ff' : '#f8fafc',
                      borderRadius: '16px',
                      padding: '12px 14px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                      position: 'relative',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'flex-start',
                    }}
                  >
                    {/* Radio selection icon */}
                    <div
                      style={{
                        width: '20px',
                        height: '20px',
                        borderRadius: '50%',
                        border: isSelected ? '6px solid #2563eb' : '2px solid #cbd5e1',
                        background: '#ffffff',
                        marginTop: '2px',
                        flexShrink: 0,
                        transition: 'all 0.15s ease',
                      }}
                    />

                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '6px', marginBottom: '2px' }}>
                        <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a' }}>
                          {dt.name}
                        </h4>
                        {dt.badge && (
                          <span
                            style={{
                              fontSize: '0.68rem',
                              fontWeight: 800,
                              padding: '2px 7px',
                              borderRadius: '8px',
                              background: dt.badge === 'VIP' ? '#fef3c7' : '#dbeafe',
                              color: dt.badge === 'VIP' ? '#b45309' : '#1d4ed8',
                            }}
                          >
                            {dt.badge}
                          </span>
                        )}
                      </div>

                      <div style={{ fontSize: '0.76rem', fontWeight: 700, color: '#3b82f6', marginBottom: '3px' }}>
                        <i className="fas fa-microchip" style={{ marginRight: '4px' }}></i>
                        {dt.ram} • {dt.android}
                      </div>

                      {dt.desc && (
                        <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b', lineHeight: '1.3' }}>
                          {dt.desc}
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={handleConfirm}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px 18px',
                  borderRadius: '14px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  width: '100%',
                  cursor: 'pointer',
                  boxShadow: '0 4px 12px rgba(37,99,235,0.3)',
                }}
              >
                {t?.createNowBtn || 'Tạo Ngay'}
              </motion.button>

              <motion.button
                whileTap={{ scale: 0.96 }}
                onClick={onClose}
                style={{
                  background: '#f1f5f9',
                  border: 'none',
                  color: '#475569',
                  padding: '10px',
                  borderRadius: '14px',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  width: '100%',
                  cursor: 'pointer',
                }}
              >
                {t?.cancel || 'Hủy'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface LoadingModalProps {
  isOpen: boolean;
  t?: Translations;
}

export const LoadingModal: React.FC<LoadingModalProps> = ({ isOpen, t }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="modal-loading"
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3500,
            backdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            style={{ textAlign: 'center', color: 'white' }}
          >
            <div
              style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                border: '6px solid rgba(255,255,255,0.2)',
                borderTopColor: '#3b82f6',
                animation: 'spin 0.9s linear infinite',
                margin: '0 auto 16px auto',
              }}
            />
            <p style={{ fontSize: '1.25rem', fontWeight: 850, margin: 0 }}>
              {t?.loadingTitle || 'Đang khởi tạo thiết bị...'}
            </p>
            <p style={{ fontSize: '0.88rem', color: '#9ca3af', marginTop: '6px' }}>
              {t?.loadingDesc || 'Đang cấp phát IP và cấu hình Sandbox'}
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface GameListModalProps {
  isOpen: boolean;
  onClose: () => void;
  games: GameApp[];
  categories?: { value: string; label: string }[];
  onOpenGame: (game: GameApp | string) => void;
  t?: {
    allGamesModalTitle?: string;
    cloudAppsAvailable?: string;
    searchGamesModalPlaceholder?: string;
    playBtn?: string;
    closeBtn?: string;
    noGameFound?: string;
  };
}

export const GameListModal: React.FC<GameListModalProps> = ({
  isOpen,
  onClose,
  games,
  categories,
  onOpenGame,
  t,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  // Category list for filter pills
  const availableCategories = categories && categories.length > 0 ? categories : GAME_CATEGORIES;

  const filtered = games.filter((g) => {
    const matchesSearch =
      !searchTerm.trim() ||
      g.name.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      (g.desc && g.desc.toLowerCase().includes(searchTerm.toLowerCase().trim())) ||
      (g.tag && g.tag.toLowerCase().includes(searchTerm.toLowerCase().trim()));

    const matchesTag =
      selectedTag === 'all' ||
      (g.tag && g.tag.toLowerCase().includes(selectedTag.toLowerCase())) ||
      (g.desc && g.desc.toLowerCase().includes(selectedTag.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          id="modal-game-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3500,
            padding: '12px',
          }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.92, opacity: 0, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{
              width: '100%',
              maxWidth: '680px',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.3)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              style={{
                padding: '20px 24px 16px 24px',
                borderBottom: '1px solid #f1f5f9',
                background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '38px',
                      height: '38px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #2563eb, #3b82f6)',
                      color: '#ffffff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '1.1rem',
                      boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)',
                    }}
                  >
                    <i className="fas fa-gamepad"></i>
                  </div>
                  <div>
                    <h2 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
                      {t?.allGamesModalTitle || 'Tất cả Game & Ứng Dụng'}
                    </h2>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                      {t?.cloudAppsAvailable ? `${t.cloudAppsAvailable} (${games.length})` : `Có sẵn ${games.length} ứng dụng cloud`}
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {/* Grid / List Toggle */}
                  <button
                    onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')}
                    title={viewMode === 'list' ? 'Xem dạng lưới' : 'Xem dạng danh sách'}
                    style={{
                      border: 'none',
                      background: '#f1f5f9',
                      color: '#475569',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    <i className={viewMode === 'list' ? 'fas fa-th-large' : 'fas fa-list'}></i>
                  </button>

                  <button
                    onClick={onClose}
                    style={{
                      border: 'none',
                      background: '#f1f5f9',
                      color: '#64748b',
                      width: '36px',
                      height: '36px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      transition: 'all 0.2s',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Search Box */}
              <div style={{ position: 'relative' }}>
                <i
                  className="fas fa-search"
                  style={{
                    position: 'absolute',
                    left: '14px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: '#94a3b8',
                    fontSize: '0.95rem',
                  }}
                ></i>
                <input
                  id="search-modal-game"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder={t?.searchGamesModalPlaceholder || 'Tìm kiếm game, thể loại...'}
                  style={{
                    width: '100%',
                    padding: '11px 38px 11px 40px',
                    borderRadius: '14px',
                    border: '1.5px solid #e2e8f0',
                    background: '#ffffff',
                    fontSize: '0.92rem',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.2s',
                  }}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    style={{
                      position: 'absolute',
                      right: '12px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'none',
                      color: '#94a3b8',
                      cursor: 'pointer',
                      fontSize: '0.9rem',
                    }}
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Tag Filter Pills */}
              <div
                style={{
                  display: 'flex',
                  gap: '6px',
                  overflowX: 'auto',
                  marginTop: '12px',
                  paddingBottom: '2px',
                  scrollbarWidth: 'none',
                }}
              >
                <button
                  onClick={() => setSelectedTag('all')}
                  style={{
                    border: 'none',
                    padding: '5px 12px',
                    borderRadius: '20px',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    whiteSpace: 'nowrap',
                    cursor: 'pointer',
                    background: selectedTag === 'all' ? '#2563eb' : '#f1f5f9',
                    color: selectedTag === 'all' ? '#ffffff' : '#64748b',
                    transition: 'all 0.2s',
                  }}
                >
                  Tất cả ({games.length})
                </button>
                {availableCategories.map((cat) => {
                  const isActive = selectedTag.toLowerCase() === cat.value.toLowerCase();
                  return (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedTag(isActive ? 'all' : cat.value)}
                      style={{
                        border: 'none',
                        padding: '5px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 700,
                        whiteSpace: 'nowrap',
                        cursor: 'pointer',
                        background: isActive ? '#2563eb' : '#f1f5f9',
                        color: isActive ? '#ffffff' : '#64748b',
                        transition: 'all 0.2s',
                      }}
                    >
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div
              id="game-list-content"
              style={{
                flex: 1,
                background: '#f8fafc',
                overflowY: 'auto',
                padding: '16px 20px',
              }}
            >
              {filtered.length === 0 ? (
                <div
                  style={{
                    textAlign: 'center',
                    padding: '48px 20px',
                    color: '#64748b',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <i className="fas fa-search" style={{ fontSize: '2.5rem', color: '#cbd5e1' }}></i>
                  <div>
                    <p style={{ fontWeight: 700, margin: 0, fontSize: '1rem', color: '#334155' }}>
                      {t?.noGameFound || 'Không tìm thấy kết quả phù hợp'}
                    </p>
                  </div>
                </div>
              ) : viewMode === 'list' ? (
                /* LIST VIEW */
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {filtered.map((g, idx) => (
                    <motion.div
                      key={g.id || idx}
                      whileHover={{ y: -2 }}
                      style={{
                        background: '#ffffff',
                        borderRadius: '16px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '14px',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '14px',
                            overflow: 'hidden',
                            flexShrink: 0,
                            background: '#f1f5f9',
                            boxShadow: '0 3px 10px rgba(0,0,0,0.08)',
                          }}
                        >
                          <img
                            src={g.icon}
                            alt={g.name}
                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                'https://cdn-icons-png.flaticon.com/512/3081/3081329.png';
                            }}
                          />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontWeight: 800,
                              fontSize: '0.98rem',
                              color: '#0f172a',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            }}
                          >
                            {g.name}
                          </div>
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '6px',
                              marginTop: '4px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.72rem',
                                fontWeight: 700,
                                color: '#2563eb',
                                background: '#eff6ff',
                                padding: '2px 8px',
                                borderRadius: '6px',
                              }}
                            >
                              {g.tag || 'Cloud App'}
                            </span>
                            {g.desc && (
                              <span
                                style={{
                                  fontSize: '0.78rem',
                                  color: '#64748b',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  maxWidth: '180px',
                                }}
                              >
                                {g.desc}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={() => {
                            onClose();
                            onOpenGame(g);
                          }}
                          style={{
                            border: 'none',
                            background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
                            color: '#090d16',
                            padding: '8px 18px',
                            borderRadius: '12px',
                            fontWeight: 900,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 14px rgba(0, 240, 255, 0.3)',
                          }}
                        >
                          <i className="fas fa-gamepad" style={{ fontSize: '0.8rem' }}></i> {t?.playBtn || 'Chơi Ngay'}
                        </motion.button>
                    </motion.div>
                  ))}
                </div>
              ) : (
                /* GRID VIEW */
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                    gap: '12px',
                  }}
                >
                  {filtered.map((g, idx) => (
                    <motion.div
                      key={g.id || idx}
                      whileHover={{ y: -3, scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        onClose();
                        onOpenGame(g);
                      }}
                      style={{
                        background: '#ffffff',
                        borderRadius: '18px',
                        padding: '14px 12px',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        textAlign: 'center',
                        border: '1px solid #f1f5f9',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                        cursor: 'pointer',
                      }}
                    >
                      <div
                        style={{
                          width: '64px',
                          height: '64px',
                          borderRadius: '16px',
                          overflow: 'hidden',
                          background: '#f1f5f9',
                          marginBottom: '10px',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        }}
                      >
                        <img
                          src={g.icon}
                          alt={g.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              'https://cdn-icons-png.flaticon.com/512/3081/3081329.png';
                          }}
                        />
                      </div>

                      <div
                        style={{
                          fontWeight: 800,
                          fontSize: '0.9rem',
                          color: '#0f172a',
                          marginBottom: '4px',
                          width: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {g.name}
                      </div>

                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: '6px',
                          marginBottom: '10px',
                          maxWidth: '100%',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                      >
                        {g.tag || 'Cloud Game'}
                      </span>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClose();
                          onOpenGame(g);
                        }}
                        style={{
                          width: '100%',
                          border: 'none',
                          background: 'linear-gradient(135deg, #00f0ff 0%, #0284c7 100%)',
                          color: '#090d16',
                          padding: '8px 0',
                          borderRadius: '10px',
                          fontWeight: 900,
                          fontSize: '0.82rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '5px',
                          boxShadow: '0 4px 12px rgba(0, 240, 255, 0.25)',
                        }}
                      >
                        <i className="fas fa-gamepad" style={{ fontSize: '0.75rem' }}></i> {t?.playBtn || 'Chơi'}
                      </button>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div
              style={{
                padding: '12px 24px',
                background: '#ffffff',
                borderTop: '1px solid #f1f5f9',
                display: 'flex',
                justifyContent: 'flex-end',
                alignItems: 'center',
              }}
            >
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onClose}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  color: '#334155',
                  padding: '10px 22px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                }}
              >
                {t?.closeBtn || 'Đóng'}
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface RenameDeviceModalProps {
  device: Device | null;
  onClose: () => void;
  onSaveRename: (deviceId: number, newName: string) => void;
  onActivateAdmin: () => void;
  showToast: (msg: string) => void;
  t?: Translations;
}

export const RenameDeviceModal: React.FC<RenameDeviceModalProps> = ({
  device,
  onClose,
  onSaveRename,
  onActivateAdmin,
  showToast,
  t,
}) => {
  const [nameInput, setNameInput] = useState('');

  React.useEffect(() => {
    if (device) {
      setNameInput(device.name);
    }
  }, [device]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!device) return;
    const trimmed = nameInput.trim();
    if (!trimmed) {
      showToast('Tên không được để trống!');
      return;
    }

    // CHECK SECRET CODE TO UNLOCK ADMIN TAB
    if (trimmed === SECRET_ADMIN_CODE) {
      onActivateAdmin();
      onSaveRename(device.id, `Admin Phone (${SECRET_ADMIN_CODE})`);
      onClose();
      return;
    }

    onSaveRename(device.id, trimmed);
    showToast(`${t?.deviceRenamedToast || 'Đã đổi tên thiết bị thành công!'}`);
    onClose();
  };

  return (
    <AnimatePresence>
      {device && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3200,
            backdropFilter: 'blur(6px)',
          }}
          onClick={onClose}
        >
          <motion.div
            className="modal-box"
            initial={{ scale: 0.9, opacity: 0, y: 12 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 12 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{
              width: '90%',
              maxWidth: '380px',
              background: 'white',
              padding: '24px',
              borderRadius: '22px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 style={{ margin: '0 0 6px 0', fontSize: '1.2rem', fontWeight: 850, color: '#0f1724' }}>
              {t?.renameModalTitle || 'Đổi Tên Thiết Bị'}
            </h3>
            <p style={{ color: '#6b7280', fontSize: '0.85rem', marginBottom: '16px' }}>
              {t?.renameModalDesc || 'Nhập tên mới cho thiết bị này.'}
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="text"
                className="search-input"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                placeholder={t?.deviceNamePlaceholder || 'Tên thiết bị...'}
                autoFocus
              />

              <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  style={{
                    flex: 1,
                    background: '#2563eb',
                    color: 'white',
                    border: 'none',
                    padding: '12px',
                    borderRadius: '12px',
                    fontWeight: 800,
                    cursor: 'pointer',
                  }}
                >
                  {t?.save || 'Lưu'}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={onClose}
                  style={{
                    background: '#e5e7eb',
                    color: '#374151',
                    border: 'none',
                    padding: '12px 18px',
                    borderRadius: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {t?.cancel || 'Hủy'}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

interface GuidesModalProps {
  isOpen: boolean;
  onClose: () => void;
  guides: GuideItem[];
  initialGuideId?: string;
  showToast: (msg: string) => void;
  t?: Translations;
}

export const GuidesModal: React.FC<GuidesModalProps> = ({
  isOpen,
  onClose,
  guides,
  initialGuideId,
  showToast,
  t,
}) => {
  const [activeGuideId, setActiveGuideId] = useState<string>('');

  useEffect(() => {
    if (isOpen) {
      if (initialGuideId && guides.some((g) => g.id === initialGuideId)) {
        setActiveGuideId(initialGuideId);
      } else if (guides.length > 0) {
        setActiveGuideId(guides[0].id);
      }
    }
  }, [isOpen, initialGuideId, guides]);

  if (!isOpen) return null;

  const activeGuide = guides.find((g) => g.id === activeGuideId) || guides[0];

  const handleCopyLink = () => {
    if (!activeGuide?.link) return;
    try {
      navigator.clipboard.writeText(activeGuide.link);
      showToast(t?.copiedLinkToast || 'Đã sao chép đường link vào bộ nhớ tạm!');
    } catch {
      showToast('Lỗi sao chép link!');
    }
  };

  // Helper to convert standard youtube urls into embed format
  const getEmbedVideoUrl = (urlStr: string) => {
    if (!urlStr) return '';
    try {
      if (urlStr.includes('youtube.com/embed/')) return urlStr;
      if (urlStr.includes('youtube.com/watch')) {
        const parsed = new URL(urlStr);
        const v = parsed.searchParams.get('v');
        if (v) return `https://www.youtube.com/embed/${v}`;
      }
      if (urlStr.includes('youtu.be/')) {
        const parts = urlStr.split('youtu.be/');
        if (parts[1]) {
          const v = parts[1].split('?')[0];
          return `https://www.youtube.com/embed/${v}`;
        }
      }
    } catch {}
    return urlStr;
  };

  const embedUrl = activeGuide ? getEmbedVideoUrl(activeGuide.videoUrl) : '';

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,.75)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 3100,
            backdropFilter: 'blur(8px)',
            padding: '16px',
          }}
          onClick={onClose}
        >
          <motion.div
            className="modal-box"
            initial={{ scale: 0.9, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 15 }}
            transition={{ type: 'spring', stiffness: 350, damping: 28 }}
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              background: '#ffffff',
              borderRadius: '24px',
              padding: '24px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.35)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '14px',
                    background: '#eff6ff',
                    color: '#2563eb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.2rem',
                  }}
                >
                  <i className="fas fa-book-open"></i>
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 850, color: '#0f172a' }}>
                    {t?.guidesTitle || 'Mục Hướng Dẫn'}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.8rem', color: '#64748b' }}>
                    {t?.guidesSubtitle || 'Tài liệu & Video hướng dẫn sử dụng thiết bị'}
                  </p>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  color: '#64748b',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <i className="fas fa-times"></i>
              </motion.button>
            </div>

            {/* Tabs for switching guides */}
            <div
              style={{
                display: 'flex',
                gap: '8px',
                overflowX: 'auto',
                paddingBottom: '8px',
                marginBottom: '16px',
                borderBottom: '1px solid #e2e8f0',
              }}
            >
              {guides.map((guide) => {
                const isSelected = guide.id === (activeGuide?.id || activeGuideId);
                return (
                  <motion.button
                    key={guide.id}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveGuideId(guide.id)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '14px',
                      fontSize: '0.88rem',
                      fontWeight: isSelected ? 850 : 700,
                      background: isSelected ? '#2563eb' : '#f8fafc',
                      color: isSelected ? '#ffffff' : '#475569',
                      border: isSelected ? 'none' : '1px solid #cbd5e1',
                      cursor: 'pointer',
                      whiteSpace: 'nowrap',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      boxShadow: isSelected ? '0 4px 12px rgba(37,99,235,0.25)' : 'none',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <i className={isSelected ? 'fas fa-check-circle' : 'far fa-bookmark'}></i>
                    {guide.title}
                  </motion.button>
                );
              })}
            </div>

            {/* Active Guide Content Container */}
            {activeGuide ? (
              <div
                style={{
                  flex: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                  paddingRight: '4px',
                }}
              >
                {/* 1. KHUNG GHI CHÚ (Note Box on Top) */}
                <div
                  style={{
                    background: activeGuide.id === 'guide_median_floating' ? '#f0f9ff' : '#fefce8',
                    border: activeGuide.id === 'guide_median_floating' ? '1.5px solid #bae6fd' : '1.5px solid #fef08a',
                    borderRadius: '16px',
                    padding: '14px 16px',
                    color: activeGuide.id === 'guide_median_floating' ? '#0369a1' : '#854d0e',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', fontWeight: 800, fontSize: '0.9rem', color: activeGuide.id === 'guide_median_floating' ? '#0284c7' : '#a16207' }}>
                    <i className={activeGuide.id === 'guide_median_floating' ? "fas fa-window-restore" : "fas fa-sticky-note"} style={{ fontSize: '1rem' }}></i>
                    <span>{activeGuide.id === 'guide_median_floating' ? 'Hướng Dẫn Chi Tiết Cấu Hình Median.co:' : 'Ghi Chú Hướng Dẫn:'}</span>
                  </div>
                  <div style={{ fontSize: '0.88rem', lineHeight: '1.5', whiteSpace: 'pre-line', color: activeGuide.id === 'guide_median_floating' ? '#0c4a6e' : '#713f12' }}>
                    {activeGuide.note || 'Không có ghi chú thêm.'}
                  </div>
                </div>

                {/* SPECIAL MEDIAN CODE SNIPPETS BOX */}
                {activeGuide.id === 'guide_median_floating' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {/* Snippet 1: Android Manifest Permissions */}
                    <div style={{ background: '#0f172a', borderRadius: '14px', padding: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#38bdf8' }}>
                          📄 AndroidManifest.xml (Cấp Quyền Cửa Sổ Nổi)
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />\n<uses-permission android:name="android.permission.ACTION_MANAGE_OVERLAY_PERMISSION" />\n<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />`);
                            showToast('📋 Đã sao chép mã AndroidManifest!');
                          }}
                          style={{ background: 'rgba(56, 189, 248, 0.2)', border: 'none', color: '#38bdf8', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          <i className="fas fa-copy"></i> Sao Chép
                        </button>
                      </div>
                      <pre style={{ margin: 0, fontSize: '0.75rem', color: '#f8fafc', fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: '#020617', padding: '8px', borderRadius: '8px' }}>
{`<uses-permission android:name="android.permission.SYSTEM_ALERT_WINDOW" />
<uses-permission android:name="android.permission.ACTION_MANAGE_OVERLAY_PERMISSION" />
<uses-permission android:name="android.permission.FOREGROUND_SERVICE" />`}
                      </pre>
                    </div>

                    {/* Snippet 2: Median JS Bridge Script */}
                    <div style={{ background: '#0f172a', borderRadius: '14px', padding: '12px', border: '1px solid #1e293b' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#34d399' }}>
                          ⚡ JavaScript Bridge (Gọi Floating Ra Màn Hình Chính)
                        </span>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(`if (window.gonative && window.gonative.pip) {\n  window.gonative.pip.enter();\n} else if (window.median && window.median.pip) {\n  window.median.pip.enter();\n}`);
                            showToast('📋 Đã sao chép đoạn mã JS Bridge!');
                          }}
                          style={{ background: 'rgba(52, 211, 153, 0.2)', border: 'none', color: '#34d399', padding: '4px 10px', borderRadius: '8px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer' }}
                        >
                          <i className="fas fa-copy"></i> Sao Chép
                        </button>
                      </div>
                      <pre style={{ margin: 0, fontSize: '0.75rem', color: '#f8fafc', fontFamily: 'monospace', whiteSpace: 'pre-wrap', background: '#020617', padding: '8px', borderRadius: '8px' }}>
{`// Kích hoạt Floating ra màn hình chính điện thoại trên Median.co:
if (window.gonative && window.gonative.pip) {
  window.gonative.pip.enter();
} else if (window.median && window.median.pip) {
  window.median.pip.enter();
}`}
                      </pre>
                    </div>

                    {/* Live Test Button */}
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => {
                        const win = window as any;
                        if (win.gonative?.pip?.enter) {
                          win.gonative.pip.enter();
                          showToast('🚀 Đã kích hoạt Median Native Floating!');
                        } else if (win.median?.pip?.enter) {
                          win.median.pip.enter();
                          showToast('🚀 Đã kích hoạt Median Native Floating!');
                        } else {
                          showToast('💡 Đã gửi lệnh JS Bridge! Trên App Median.co: Nút Home điện thoại sẽ float ứng dụng ra màn hình chính.');
                        }
                      }}
                      style={{
                        padding: '12px',
                        borderRadius: '14px',
                        border: 'none',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#ffffff',
                        fontWeight: 800,
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        boxShadow: '0 4px 14px rgba(16, 185, 129, 0.3)',
                      }}
                    >
                      <i className="fas fa-play"></i> Thử Nghiệm Lệnh Floating JS Bridge Ngay
                    </motion.button>
                  </div>
                )}

                {/* 2. KHUNG CHỨA ĐƯỜNG LINK (Link Box) */}
                <div>
                  <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '6px' }}>
                    <i className="fas fa-link" style={{ color: '#2563eb', marginRight: '6px' }}></i>
                    Đường Link Hướng Dẫn / Tài Liệu:
                  </label>
                  <div
                    style={{
                      background: '#f8fafc',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '14px',
                      padding: '12px 14px',
                      fontSize: '0.9rem',
                      color: '#1e293b',
                      wordBreak: 'break-all',
                      fontFamily: 'monospace',
                    }}
                  >
                    {activeGuide.link || 'https://cloudphone.app'}
                  </div>

                  {/* 3. NÚT COPY LINK (Copy Link Button underneath the link frame) */}
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    whileHover={{ scale: 1.01 }}
                    onClick={handleCopyLink}
                    style={{
                      marginTop: '8px',
                      width: '100%',
                      background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                      color: '#ffffff',
                      border: 'none',
                      padding: '10px 16px',
                      borderRadius: '12px',
                      fontWeight: 800,
                      fontSize: '0.88rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 12px rgba(37,99,235,0.22)',
                    }}
                  >
                    <i className="fas fa-copy"></i>
                    {t?.copyLinkBtn || 'Sao chép đường link'}
                  </motion.button>
                </div>

                {/* 4. KHUNG HIỂN THỊ VIDEO HƯỚNG DẪN (Video Display Frame) */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px', fontWeight: 800, fontSize: '0.88rem', color: '#1e293b' }}>
                    <i className="fas fa-video" style={{ color: '#ef4444' }}></i>
                    <span>{t?.videoGuideLabel || 'Video Hướng Dẫn Chi Tiết'}:</span>
                  </div>

                  <div
                    style={{
                      width: '100%',
                      aspectRatio: '16/9',
                      background: '#0f172a',
                      borderRadius: '16px',
                      overflow: 'hidden',
                      border: '1px solid #334155',
                      boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                      position: 'relative',
                    }}
                  >
                    {embedUrl ? (
                      embedUrl.endsWith('.mp4') || embedUrl.endsWith('.webm') ? (
                        <video controls style={{ width: '100%', height: '100%', objectFit: 'cover' }}>
                          <source src={embedUrl} />
                          Trình duyệt không hỗ trợ thẻ video.
                        </video>
                      ) : (
                        <iframe
                          src={embedUrl}
                          title={activeGuide.title}
                          style={{ width: '100%', height: '100%', border: 'none' }}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )
                    ) : (
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%',
                          color: '#94a3b8',
                          padding: '20px',
                          textAlign: 'center',
                        }}
                      >
                        <i className="fas fa-play-circle" style={{ fontSize: '2.5rem', marginBottom: '8px', opacity: 0.5 }}></i>
                        <p style={{ margin: 0, fontSize: '0.85rem' }}>Chưa cập nhật video cho mục hướng dẫn này</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div style={{ padding: '30px', textAlign: 'center', color: '#64748b' }}>
                <p>Không tìm thấy nội dung hướng dẫn.</p>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export interface LaunchTargetInfo {
  name: string;
  url: string;
  device?: Device;
  openMode?: 'iframe' | 'external';
  useProxy?: boolean;
  type?: 'device' | 'app';
}

interface LaunchLoadingModalProps {
  targetInfo: LaunchTargetInfo | null;
  onClose: () => void;
  onComplete: (targetInfo: LaunchTargetInfo) => void;
  t?: Translations;
}

export const LaunchLoadingModal: React.FC<LaunchLoadingModalProps> = ({
  targetInfo,
  onClose,
  onComplete,
}) => {
  const [progress, setProgress] = useState(0);
  const [ping, setPing] = useState<number | null>(null);
  const [statusText, setStatusText] = useState('Đang đo tốc độ mạng & kiểm tra Ping...');

  useEffect(() => {
    if (!targetInfo) {
      setProgress(0);
      setPing(null);
      return;
    }

    let isMounted = true;
    let timer: NodeJS.Timeout | null = null;

    // 1. Measure Ping with fallback
    const startPing = performance.now();
    let measuredPing = Math.floor(Math.random() * 18) + 16; // default 16-33ms

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 600);

    fetch(window.location.origin, { method: 'HEAD', cache: 'no-cache', signal: controller.signal })
      .then(() => {
        const endPing = performance.now();
        const duration = Math.round(endPing - startPing);
        if (duration > 0 && duration < 300) {
          measuredPing = duration;
        }
      })
      .catch(() => {
        // use default measuredPing
      })
      .finally(() => {
        clearTimeout(timeoutId);
        if (!isMounted) return;

        setPing(measuredPing);

        // 2. Determine Loading Duration from Ping
        // Low ping (<30ms): ~1200ms total (12ms per 1%)
        // Med ping (30-70ms): ~2200ms total (22ms per 1%)
        // High ping (>70ms): ~3500ms total (35ms per 1%)
        let stepInterval = 18;
        if (measuredPing < 30) {
          stepInterval = 12;
        } else if (measuredPing <= 70) {
          stepInterval = 22;
        } else {
          stepInterval = 35;
        }

        let currentProg = 0;
        timer = setInterval(() => {
          currentProg += 1;
          if (currentProg >= 100) {
            currentProg = 100;
            if (timer) clearInterval(timer);
            setProgress(100);
            setStatusText('🚀 Hoàn tất! Đang mở thiết bị...');

            setTimeout(() => {
              if (isMounted) {
                onComplete(targetInfo);
              }
            }, 250);
          } else {
            setProgress(currentProg);

            if (currentProg < 20) {
              setStatusText('Đang kết nối Cloud Sandbox...');
            } else if (currentProg < 45) {
              setStatusText(`Độ trễ Ping: ${measuredPing}ms • Mạng ${measuredPing < 35 ? 'Cực Nhanh ⚡' : 'Ổn Định 🟢'}`);
            } else if (currentProg < 70) {
              setStatusText('Khởi chạy GPU & RAM ảo...');
            } else if (currentProg < 92) {
              setStatusText('Đang đồng bộ dữ liệu hình ảnh...');
            } else {
              setStatusText('Sẵn sàng hiển thị màn hình...');
            }
          }
        }, stepInterval);
      });

    return () => {
      isMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [targetInfo, onComplete]);

  if (!targetInfo) return null;

  const pingVal = ping || 24;
  let pingLabel = 'Siêu Nhanh';
  let pingColor = '#22c55e';
  if (pingVal > 70) {
    pingLabel = 'Trung Bình';
    pingColor = '#f59e0b';
  } else if (pingVal > 35) {
    pingLabel = 'Ổn Định';
    pingColor = '#06b6d4';
  }

  const size = 160;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 99999,
          background: 'radial-gradient(circle at 50% 40%, #0a0f24 0%, #030712 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
          color: 'white',
          userSelect: 'none',
          overflow: 'hidden',
        }}
      >
        {/* Animated Cyber Holographic Matrix Background Grid */}
        <div
          style={{
            position: 'absolute',
            inset: -50,
            backgroundImage: `
              linear-gradient(rgba(0, 240, 255, 0.05) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0, 240, 255, 0.05) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            pointerEvents: 'none',
            opacity: 0.6,
          }}
        />

        {/* Ambient Pulsing Holographic Ambient Glow Orbs */}
        <motion.div
          animate={{ scale: [1, 1.25, 1], opacity: [0.25, 0.45, 0.25] }}
          transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            width: '380px',
            height: '380px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,240,255,0.3) 0%, rgba(59,130,246,0.15) 50%, rgba(0,0,0,0) 80%)',
            filter: 'blur(50px)',
            pointerEvents: 'none',
          }}
        />

        <motion.div
          initial={{ scale: 0.88, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.88, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 24, stiffness: 280 }}
          style={{
            maxWidth: '430px',
            width: '100%',
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            background: 'rgba(10, 16, 32, 0.82)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(0, 240, 255, 0.3)',
            borderRadius: '32px',
            padding: '36px 26px 28px 26px',
            boxShadow: '0 25px 70px rgba(0, 0, 0, 0.85), 0 0 30px rgba(0, 240, 255, 0.15)',
          }}
        >
          {/* Top Cyber Badge (Live Status & Ping) */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(0, 240, 255, 0.08)', padding: '6px 16px', borderRadius: '20px', border: '1px solid rgba(0, 240, 255, 0.25)', marginBottom: '18px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: pingColor, boxShadow: `0 0 12px ${pingColor}` }}></span>
            <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#e2e8f0', letterSpacing: '0.5px' }}>
              PRO MAX RTX • PING: <span style={{ color: pingColor, fontWeight: 900 }}>{pingVal} ms</span> ({pingLabel})
            </span>
          </div>

          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: '0 0 4px 0', color: '#ffffff', letterSpacing: '-0.02em', textShadow: '0 0 12px rgba(255,255,255,0.3)' }}>
            Đang Khởi Chạy Màn Hình
          </h2>
          <p style={{ fontSize: '0.9rem', color: '#00f0ff', fontWeight: 800, margin: '0 0 26px 0', textShadow: '0 0 10px rgba(0,240,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <i className="fas fa-server" style={{ fontSize: '0.85rem' }} />
            <span>{targetInfo.name}</span>
          </p>

          {/* Holographic Revolving Progress Core */}
          <div style={{ position: 'relative', width: `${size}px`, height: `${size}px`, margin: '0 auto 26px auto', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            
            {/* Outer Rotating Cyber Tech Ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 12, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: -12,
                borderRadius: '50%',
                border: '1.5px dashed rgba(0, 240, 255, 0.4)',
                pointerEvents: 'none',
              }}
            />

            {/* Counter Rotating Inner Ring */}
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 8, ease: 'linear' }}
              style={{
                position: 'absolute',
                inset: -6,
                borderRadius: '50%',
                border: '1px solid rgba(59, 130, 246, 0.25)',
                borderTopColor: '#00f0ff',
                borderBottomColor: '#a855f7',
                pointerEvents: 'none',
              }}
            />

            {/* SVG Progress Circle */}
            <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', filter: 'drop-shadow(0 0 8px rgba(0, 240, 255, 0.5))' }}>
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="rgba(255,255,255,0.06)"
                strokeWidth={strokeWidth}
                fill="transparent"
              />
              <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="url(#cyberProgressGradient)"
                strokeWidth={strokeWidth}
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 0.08s ease-out' }}
              />
              <defs>
                <linearGradient id="cyberProgressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#00f0ff" />
                  <stop offset="50%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
            </svg>

            {/* Central Hologram Percentage Indicator */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <motion.span
                key={progress}
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  fontFamily: "'JetBrains Mono', monospace, sans-serif",
                  color: '#ffffff',
                  letterSpacing: '-1.5px',
                  textShadow: '0 0 16px rgba(0, 240, 255, 0.8)',
                }}
              >
                {progress}%
              </motion.span>
              <span style={{ fontSize: '0.65rem', fontWeight: 900, color: '#00f0ff', textTransform: 'uppercase', letterSpacing: '2px', opacity: 0.9 }}>
                STREAMING
              </span>
            </div>
          </div>

          {/* Equalizer Audio / Stream Frequency Visualizer Bars */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px', marginBottom: '18px' }}>
            {[0.4, 0.8, 0.3, 1, 0.6, 0.9, 0.5, 0.7, 0.2, 0.85].map((scale, i) => (
              <motion.div
                key={i}
                animate={{ height: ['6px', `${Math.round(18 * scale)}px`, '6px'] }}
                transition={{ repeat: Infinity, duration: 0.6 + (i % 3) * 0.2, ease: 'easeInOut' }}
                style={{
                  width: '3.5px',
                  borderRadius: '3px',
                  background: 'linear-gradient(180deg, #00f0ff 0%, #3b82f6 100%)',
                  boxShadow: '0 0 6px rgba(0, 240, 255, 0.6)',
                }}
              />
            ))}
          </div>

          {/* Status Text Box with Cyber Glow */}
          <div style={{ background: 'rgba(0, 240, 255, 0.05)', borderRadius: '16px', padding: '12px 16px', marginBottom: '22px', border: '1px solid rgba(0, 240, 255, 0.2)' }}>
            <div style={{ fontSize: '0.84rem', fontWeight: 800, color: '#f1f5f9', minHeight: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              <i className="fas fa-microchip fa-spin" style={{ fontSize: '0.85rem', color: '#00f0ff' }}></i>
              <span>{statusText}</span>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              color: '#94a3b8',
              padding: '10px 22px',
              borderRadius: '14px',
              fontSize: '0.82rem',
              fontWeight: 800,
              cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <i className="fas fa-times" style={{ marginRight: '6px' }} />
            Hủy khởi chạy
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Bug Report Modal (Báo Lỗi & Xem Phản Hồi Từ Admin)
interface BugReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitReport: (targetName: string, description: string) => void;
  bugReports: BugReport[];
  currentUser?: User | null;
  onOpenAuthModal?: () => void;
  t?: Translations;
}

export const BugReportModal: React.FC<BugReportModalProps> = ({
  isOpen,
  onClose,
  onSubmitReport,
  bugReports,
  currentUser,
  onOpenAuthModal,
  t,
}) => {
  const [targetName, setTargetName] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetName.trim() || !description.trim()) return;
    onSubmitReport(targetName.trim(), description.trim());
    setTargetName('');
    setDescription('');
  };

  // Filter bug reports for logged-in user
  const userReports = currentUser
    ? bugReports.filter((r) => r.userId === currentUser.uid || (r.userEmail && r.userEmail === currentUser.email))
    : [];

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{ maxWidth: '540px', width: '100%', maxHeight: '90vh', overflowY: 'auto', borderRadius: '24px' }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '14px', background: 'linear-gradient(135deg, #ef4444, #f97316)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ffffff', fontSize: '1.2rem', boxShadow: '0 4px 12px rgba(239, 68, 68, 0.3)' }}>
                <i className="fas fa-bug"></i>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-main)' }}>
                  {t?.bugReportTitle || 'Gửi Báo Lỗi Hệ Thống'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                  {t?.bugReportSubtitle || 'Gửi phản hồi lỗi để Admin hỗ trợ & khắc phục'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{ border: 'none', background: 'var(--bg-card)', color: 'var(--text-sub)', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {!currentUser ? (
            /* Auth Gate for Unauthenticated Users */
            <div style={{ textAlign: 'center', padding: '32px 16px', background: 'var(--bg-card)', borderRadius: '20px', border: '1px dashed #ef4444' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '18px', background: '#fee2e2', color: '#dc2626', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', margin: '0 auto 14px auto' }}>
                <i className="fas fa-user-lock"></i>
              </div>
              <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-main)' }}>
                Yêu Cầu Đăng Nhập
              </h4>
              <p style={{ margin: '0 0 20px 0', fontSize: '0.85rem', color: 'var(--text-sub)', lineHeight: '1.5' }}>
                Bạn cần đăng nhập tài khoản để gửi báo lỗi và nhận câu trả lời trực tiếp từ Admin!
              </p>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  onClose();
                  if (onOpenAuthModal) onOpenAuthModal();
                }}
                style={{
                  padding: '12px 24px',
                  borderRadius: '14px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: '#ffffff',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
                }}
              >
                <i className="fas fa-sign-in-alt"></i>
                <span>Đăng Nhập / Đăng Ký Ngay</span>
              </motion.button>
            </div>
          ) : (
            <>
              {/* User Account Info Bar */}
              <div style={{ padding: '8px 12px', background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', borderRadius: '12px', border: '1px solid #bfdbfe', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.8rem', color: '#1e40af', fontWeight: 700 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fas fa-user-circle"></i>
                  {currentUser.displayName || currentUser.email}
                </span>
                <span style={{ fontSize: '0.72rem', background: '#2563eb', color: 'white', padding: '2px 8px', borderRadius: '8px' }}>
                  Tài Khoản
                </span>
              </div>

              {/* Form Top Section */}
              <form onSubmit={handleSubmit} style={{ background: 'var(--bg-card)', padding: '16px', borderRadius: '18px', border: '1px solid var(--border-color)', marginBottom: '20px' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ef4444', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <i className="fas fa-exclamation-triangle"></i>
                  <span>Nhập Thông Tin Báo Lỗi</span>
                </div>

                {/* Line 1: Target Name */}
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {t?.targetNameLabel || 'Dòng 1: Tên thiết bị / App / Game bạn bị lỗi'}
                  </label>
                  <input
                    type="text"
                    value={targetName}
                    onChange={(e) => setTargetName(e.target.value)}
                    placeholder={t?.targetNamePlaceholder || 'Ví dụ: Cloud Phone Pro Max, Genshin Impact...'}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border-color)',
                      background: 'var(--bg-body)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Line 2: Error Description */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '6px' }}>
                    {t?.errorDescLabel || 'Dòng 2: Mô tả chi tiết lỗi gặp phải'}
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder={t?.errorDescPlaceholder || 'Mô tả nguyên nhân hoặc dấu hiệu lỗi...'}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '12px',
                      border: '1.5px solid var(--border-color)',
                      background: 'var(--bg-body)',
                      color: 'var(--text-main)',
                      fontSize: '0.85rem',
                      outline: 'none',
                      resize: 'vertical',
                      boxSizing: 'border-box'
                    }}
                  />
                </div>

                {/* Submit Button */}
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  type="submit"
                  style={{
                    width: '100%',
                    padding: '12px',
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
                  <span>{t?.sendReportBtn || 'Xác Nhận Gửi'}</span>
                </motion.button>
              </form>

              {/* Bottom Section: Messages & Replies for this User */}
              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '16px' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-main)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <i className="fas fa-comments" style={{ color: '#2563eb' }}></i>
                  <span>{t?.adminRepliesTitle || 'Phản Hồi Từ Admin Cho Bạn'}</span>
                  <span style={{ fontSize: '0.72rem', background: '#dbeafe', color: '#1e40af', padding: '2px 8px', borderRadius: '10px', fontWeight: 800 }}>
                    {userReports.length}
                  </span>
                </div>

                {userReports.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px 12px', color: 'var(--text-sub)', fontSize: '0.82rem', background: 'var(--bg-card)', borderRadius: '16px', border: '1px dashed var(--border-color)' }}>
                    <i className="fas fa-inbox" style={{ fontSize: '1.8rem', opacity: 0.5, marginBottom: '8px', display: 'block' }}></i>
                    {t?.noBugReports || 'Bạn chưa có báo lỗi nào gửi từ tài khoản này.'}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '280px', overflowY: 'auto', paddingRight: '4px' }}>
                    {userReports.map((report) => (
                      <div
                        key={report.id}
                        style={{
                          background: 'var(--bg-card)',
                          border: '1px solid var(--border-color)',
                          borderRadius: '16px',
                          padding: '12px 14px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '8px'
                        }}
                      >
                        {/* Header Row */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                          <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#ef4444', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <i className="fas fa-mobile-alt"></i>
                            {report.targetName}
                          </span>

                          <span style={{
                            fontSize: '0.68rem',
                            fontWeight: 800,
                            padding: '3px 8px',
                            borderRadius: '8px',
                            background: report.status === 'replied' ? '#dcfce7' : '#fef3c7',
                            color: report.status === 'replied' ? '#15803d' : '#b45309',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}>
                            <i className={report.status === 'replied' ? "fas fa-check-circle" : "fas fa-clock"}></i>
                            {report.status === 'replied' ? (t?.bugStatusReplied || 'Đã trả lời') : (t?.bugStatusPending || 'Đang chờ xử lý')}
                          </span>
                        </div>

                        {/* Error Description */}
                        <div style={{ fontSize: '0.82rem', color: 'var(--text-main)', background: 'var(--bg-body)', padding: '8px 10px', borderRadius: '10px', borderLeft: '3px solid #ef4444' }}>
                          {report.description}
                        </div>

                        <div style={{ fontSize: '0.68rem', color: 'var(--text-sub)', textAlign: 'right' }}>
                          {new Date(report.createdAt).toLocaleString()}
                        </div>

                        {/* Admin Response Box */}
                        {report.adminReply && (
                          <div style={{ background: 'linear-gradient(135deg, #eff6ff, #dbeafe)', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '12px', marginTop: '2px' }}>
                            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <i className="fas fa-user-shield"></i>
                              <span>{t?.replyFromAdminLabel || 'Tin nhắn từ Admin:'}</span>
                            </div>
                            <div style={{ fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                              {report.adminReply}
                            </div>
                            {report.repliedAt && (
                              <div style={{ fontSize: '0.65rem', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>
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
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Onboarding Modal: "Bạn đã biết sử dụng chưa?" (Giao Diện Tuyệt Đẹp V2)
interface UserGuidePromptModalProps {
  isOpen: boolean;
  onConfirmKnow: () => void;
  onConfirmNeedGuide: () => void;
  t?: Translations;
}

export const UserGuidePromptModal: React.FC<UserGuidePromptModalProps> = ({
  isOpen,
  onConfirmKnow,
  onConfirmNeedGuide,
  t,
}) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        style={{
          zIndex: 99999,
          padding: '20px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.85, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 30 }}
          transition={{ type: 'spring', stiffness: 350, damping: 28 }}
          style={{
            maxWidth: '430px',
            width: '100%',
            borderRadius: '28px',
            textAlign: 'center',
            padding: '32px 24px 28px 24px',
            boxShadow: '0 25px 60px rgba(0,0,0,0.35), 0 0 40px rgba(37, 99, 235, 0.15)',
            background: 'var(--bg-card)',
            border: '1.5px solid rgba(255, 255, 255, 0.12)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Subtle Ambient Glow Background */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.25) 0%, rgba(37, 99, 235, 0) 70%)',
            pointerEvents: 'none',
          }} />

          {/* Badge Pill */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '4px 12px',
            borderRadius: '20px',
            background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(14, 165, 233, 0.12))',
            border: '1px solid rgba(37, 99, 235, 0.25)',
            color: '#0284c7',
            fontSize: '0.72rem',
            fontWeight: 800,
            letterSpacing: '0.5px',
            textTransform: 'uppercase',
            marginBottom: '16px'
          }}>
            <i className="fas fa-sparkles" style={{ fontSize: '0.7rem' }}></i>
            <span>Hướng Dẫn Cho Người Mới</span>
          </div>

          {/* Glowing Animated Icon Header */}
          <div style={{
            width: '72px',
            height: '72px',
            borderRadius: '24px',
            background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 50%, #4f46e5 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            color: '#ffffff',
            fontSize: '2rem',
            boxShadow: '0 12px 28px rgba(37, 99, 235, 0.4)',
            position: 'relative',
          }}>
            <i className="fas fa-book-reader"></i>
          </div>

          <h3 style={{ margin: '0 0 10px 0', fontSize: '1.35rem', fontWeight: 850, color: 'var(--text-main)', letterSpacing: '-0.3px' }}>
            {t?.userGuidePromptTitle || 'Bạn đã biết sử dụng chưa?'}
          </h3>

          <p style={{ margin: '0 0 26px 0', fontSize: '0.9rem', color: 'var(--text-sub)', lineHeight: '1.55', fontWeight: 500 }}>
            {t?.userGuidePromptDesc || 'Nếu bạn mới lần đầu sử dụng Cloud Phone, hãy xem bài hướng dẫn ngắn để làm quen nhanh chóng!'}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {/* Button "Chưa" */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={onConfirmNeedGuide}
              style={{
                padding: '13px 16px',
                borderRadius: '16px',
                border: '1.5px solid #0284c7',
                background: 'rgba(2, 132, 199, 0.08)',
                color: '#0284c7',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-book-open" style={{ fontSize: '1rem' }}></i>
              <span>{t?.btnNotYet || 'Chưa'}</span>
            </motion.button>

            {/* Button "Rồi" */}
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              onClick={onConfirmKnow}
              style={{
                padding: '13px 16px',
                borderRadius: '16px',
                border: 'none',
                background: 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.92rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 6px 18px rgba(37, 99, 235, 0.38)',
                transition: 'all 0.2s'
              }}
            >
              <i className="fas fa-check-circle" style={{ fontSize: '1rem' }}></i>
              <span>{t?.btnAlreadyKnow || 'Rồi'}</span>
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// Auth Modal: Sign In / Register / Google Auth
interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string) => void;
  t?: Translations;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  showToast,
  t,
}) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    try {
      setIsLoading(true);
      setErrorMsg('');
      if (mode === 'login') {
        const user = await loginWithEmail(email.trim(), password);
        showToast(`🎉 Đăng nhập thành công! Xin chào ${user.displayName || user.email}`);
        onClose();
      } else {
        const user = await registerWithEmail(email.trim(), password, displayName.trim());
        showToast(`🎉 Đăng ký tài khoản thành công! Xin chào ${user.displayName || user.email}`);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      if (err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential') {
        setErrorMsg('Email hoặc mật khẩu không chính xác!');
      } else if (err.code === 'auth/email-already-in-use') {
        setErrorMsg('Email này đã được sử dụng!');
      } else if (err.code === 'auth/weak-password') {
        setErrorMsg('Mật khẩu quá yếu! Vui lòng dùng ít nhất 6 ký tự.');
      } else {
        setErrorMsg(err.message || 'Thao tác thất bại. Vui lòng thử lại!');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: 'fixed',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 99999,
          padding: '16px',
          background: 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <motion.div
          className="modal-content"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            maxWidth: '420px',
            width: '100%',
            borderRadius: '28px',
            padding: '28px 22px',
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
          }}
        >
          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{
                width: '42px',
                height: '42px',
                borderRadius: '14px',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}>
                <i className="fas fa-user-shield"></i>
              </div>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 850, color: 'var(--text-main)' }}>
                  {mode === 'login' ? 'Đăng Nhập Tài Khoản' : 'Tạo Tài Khoản Mới'}
                </h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--text-sub)' }}>
                  Lưu thiết bị & đồng bộ dữ liệu Cloud
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              style={{ border: 'none', background: 'var(--bg-body)', color: 'var(--text-sub)', width: '32px', height: '32px', borderRadius: '10px', cursor: 'pointer', fontSize: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          {/* Mode Tabs */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '6px',
            padding: '4px',
            background: 'var(--bg-body)',
            borderRadius: '14px',
            marginBottom: '20px',
            border: '1px solid var(--border-color)',
          }}>
            <button
              onClick={() => { setMode('login'); setErrorMsg(''); }}
              style={{
                padding: '9px',
                borderRadius: '10px',
                border: 'none',
                background: mode === 'login' ? '#2563eb' : 'transparent',
                color: mode === 'login' ? '#ffffff' : 'var(--text-sub)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Đăng Nhập
            </button>
            <button
              onClick={() => { setMode('register'); setErrorMsg(''); }}
              style={{
                padding: '9px',
                borderRadius: '10px',
                border: 'none',
                background: mode === 'register' ? '#2563eb' : 'transparent',
                color: mode === 'register' ? '#ffffff' : 'var(--text-sub)',
                fontWeight: 800,
                fontSize: '0.85rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              Đăng Ký
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {mode === 'register' && (
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                  Họ & Tên
                </label>
                <input
                  type="text"
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid var(--border-color)',
                    background: 'var(--bg-body)',
                    color: 'var(--text-main)',
                    fontSize: '0.85rem',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
                Địa chỉ Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>
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
                  padding: '10px 14px',
                  borderRadius: '12px',
                  border: '1.5px solid var(--border-color)',
                  background: 'var(--bg-body)',
                  color: 'var(--text-main)',
                  fontSize: '0.85rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            {errorMsg && (
              <div style={{
                fontSize: '0.78rem',
                color: '#dc2626',
                background: '#fee2e2',
                padding: '8px 12px',
                borderRadius: '10px',
                fontWeight: 600
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
                padding: '12px',
                borderRadius: '14px',
                border: 'none',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '0.9rem',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                marginTop: '6px',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)',
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
                  <i className={mode === 'login' ? "fas fa-sign-in-alt" : "fas fa-user-plus"}></i>
                  <span>{mode === 'login' ? 'Đăng Nhập' : 'Đăng Ký Tài Khoản'}</span>
                </>
              )}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};


