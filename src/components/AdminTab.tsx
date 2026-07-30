import React, { useState } from 'react';
import { Device, GameApp, Announcement, DeviceType, GuideItem, BugReport } from '../types';
import { GAME_CATEGORIES } from '../defaultData';
import { 
  saveGameToCloud, 
  deleteGameFromCloud, 
  saveDevicesToCloud,
  saveAnnouncementToCloud,
  deleteAnnouncementFromCloud,
  saveDeviceTypesToCloud,
  saveGuidesToCloud,
  saveBugReportToCloud,
  deleteBugReportFromCloud
} from '../firebaseConfig';
import { Translations } from '../languages';
import { formatPlayTime } from './DevicesTab';

interface AdminTabProps {
  devices: Device[];
  onUpdateDevice: (updatedDevice: Device) => void;
  onAddDevice: (device: Partial<Device>) => void;
  onDeleteDevice: (id: number) => void;
  onDeleteInactiveDevices: () => void;
  defaultUrl: string;
  onUpdateDefaultUrl: (url: string) => void;
  deviceTypes?: DeviceType[];
  onAddDeviceType?: (dt: DeviceType) => void;
  onUpdateDeviceType?: (dt: DeviceType) => void;
  onDeleteDeviceType?: (dtId: string) => void;
  games: GameApp[];
  categories?: { value: string; label: string }[];
  onAddCategory?: (cat: { value: string; label: string }) => void;
  onDeleteCategory?: (val: string) => void;
  onAddGame: (game: GameApp) => void;
  onUpdateGame: (game: GameApp) => void;
  onDeleteGame: (gameId: string) => void;
  announcements?: Announcement[];
  onAddAnnouncement?: (announcement: Announcement) => void;
  onUpdateAnnouncement?: (announcement: Announcement) => void;
  onDeleteAnnouncement?: (announcementId: string) => void;
  guides?: GuideItem[];
  onAddGuide?: (guide: GuideItem) => void;
  onUpdateGuide?: (guide: GuideItem) => void;
  onDeleteGuide?: (guideId: string) => void;
  bugReports?: BugReport[];
  onReplyBugReport?: (reportId: string, replyText: string) => void;
  onDeleteBugReport?: (reportId: string) => void;
  showToast: (msg: string) => void;
  t?: Translations;
}

export const AdminTab: React.FC<AdminTabProps> = ({
  devices,
  onUpdateDevice,
  onAddDevice,
  onDeleteDevice,
  onDeleteInactiveDevices,
  defaultUrl,
  onUpdateDefaultUrl,
  deviceTypes = [],
  onAddDeviceType,
  onUpdateDeviceType,
  onDeleteDeviceType,
  games,
  categories,
  onAddCategory,
  onDeleteCategory,
  onAddGame,
  onUpdateGame,
  onDeleteGame,
  announcements = [],
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  guides = [],
  onAddGuide,
  onUpdateGuide,
  onDeleteGuide,
  bugReports = [],
  onReplyBugReport,
  onDeleteBugReport,
  showToast,
  t,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'device_types' | 'devices' | 'games' | 'announcements' | 'guides' | 'bug_reports'>('device_types');

  // Bug Report reply inputs map
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  // Guides state
  const [newGuideTitle, setNewGuideTitle] = useState('');
  const [newGuideNote, setNewGuideNote] = useState('');
  const [newGuideLink, setNewGuideLink] = useState('');
  const [newGuideVideoUrl, setNewGuideVideoUrl] = useState('');
  const [editingGuide, setEditingGuide] = useState<GuideItem | null>(null);

  // Device Types state
  const [newTypeName, setNewTypeName] = useState('');
  const [newTypeRam, setNewTypeRam] = useState('8GB RAM');
  const [newTypeAndroid, setNewTypeAndroid] = useState('Android 12');
  const [newTypeUrl, setNewTypeUrl] = useState('');
  const [newTypeBadge, setNewTypeBadge] = useState('Mới');
  const [newTypeDesc, setNewTypeDesc] = useState('');
  const [newTypeOpenMode, setNewTypeOpenMode] = useState<'iframe' | 'external'>('iframe');
  const [newTypeUseProxy, setNewTypeUseProxy] = useState<boolean>(true);
  const [editingDeviceType, setEditingDeviceType] = useState<DeviceType | null>(null);

  // Device edit state
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);
  const [newDefaultUrlInput, setNewDefaultUrlInput] = useState(defaultUrl);

  // New Device state
  const [newDevName, setNewDevName] = useState('');
  const [newDevUrl, setNewDevUrl] = useState('');
  const [newDevRam, setNewDevRam] = useState('8GB');
  const [newDevAndroid, setNewDevAndroid] = useState('Android 12');
  const [newDevOpenMode, setNewDevOpenMode] = useState<'iframe' | 'external'>('iframe');
  const [newDevUseProxy, setNewDevUseProxy] = useState<boolean>(true);

  // Handle Add New Device Type
  const handleAddDeviceTypeSubmit = async () => {
    if (!newTypeName.trim()) {
      showToast('Vui lòng nhập tên loại thiết bị!');
      return;
    }
    const dt: DeviceType = {
      id: `devtype_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      name: newTypeName.trim(),
      ram: newTypeRam,
      android: newTypeAndroid,
      url: newTypeUrl.trim() || defaultUrl,
      badge: newTypeBadge.trim() || undefined,
      desc: newTypeDesc.trim() || undefined,
      openMode: newTypeOpenMode,
      useProxy: newTypeUseProxy,
      created_at: Date.now(),
    };

    if (onAddDeviceType) {
      onAddDeviceType(dt);
    } else {
      await saveDeviceTypesToCloud([...deviceTypes, dt]);
    }

    setNewTypeName('');
    setNewTypeUrl('');
    setNewTypeDesc('');
    setNewTypeBadge('Mới');
    setNewTypeOpenMode('iframe');
    setNewTypeUseProxy(true);
    showToast('🎉 Đã thêm loại thiết bị mới thành công!');
  };

  const handleSaveEditingType = async (dt: DeviceType) => {
    if (!dt.name.trim()) {
      showToast('Tên loại thiết bị không được để trống!');
      return;
    }
    if (onUpdateDeviceType) {
      onUpdateDeviceType(dt);
    } else {
      const updated = deviceTypes.map(item => item.id === dt.id ? dt : item);
      await saveDeviceTypesToCloud(updated);
    }
    setEditingDeviceType(null);
    showToast('Đã cập nhật loại thiết bị!');
  };

  const handleDeleteTypeClick = async (dtId: string) => {
    if (onDeleteDeviceType) {
      onDeleteDeviceType(dtId);
    } else {
      const updated = deviceTypes.filter(item => item.id !== dtId);
      await saveDeviceTypesToCloud(updated);
    }
    showToast('🗑️ Đã xóa loại thiết bị!');
  };

  // Game add state
  const [newGameName, setNewGameName] = useState('');
  const [newGameDesc, setNewGameDesc] = useState('');
  const [newGameUrl, setNewGameUrl] = useState('');
  const [newGameIcon, setNewGameIcon] = useState('');
  const [newGameTag, setNewGameTag] = useState('RPG');
  const [isUploading, setIsUploading] = useState(false);

  // Category state & handler
  const categoriesList = categories && categories.length > 0 ? categories : GAME_CATEGORIES;
  const [newCatLabel, setNewCatLabel] = useState('');

  const handleAddCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const label = newCatLabel.trim();
    if (!label) return;
    if (onAddCategory) {
      onAddCategory({ value: label, label });
    }
    setNewCatLabel('');
  };

  // Game edit state
  const [editingGame, setEditingGame] = useState<GameApp | null>(null);

  // Announcement add state
  const [annTitle, setAnnTitle] = useState('');
  const [annContent, setAnnContent] = useState('');
  const [annType, setAnnType] = useState<'update' | 'event' | 'info' | 'alert'>('update');
  const [annIsImportant, setAnnIsImportant] = useState(false);

  // Save edited device
  const handleSaveDevice = async (device: Device) => {
    onUpdateDevice(device);
    setEditingDevice(null);
    showToast(`Đã cập nhật link device "${device.name}"!`);
    await saveDevicesToCloud(devices.map(d => d.id === device.id ? device : d));
  };

  // Add new device
  const handleCreateCustomDevice = async () => {
    if (!newDevName.trim()) {
      showToast('Vui lòng nhập tên thiết bị!');
      return;
    }
    const devUrl = newDevUrl.trim() || defaultUrl;
    onAddDevice({
      name: newDevName.trim(),
      url: devUrl,
      ram: newDevRam,
      android: newDevAndroid,
      openMode: newDevOpenMode,
      useProxy: newDevUseProxy,
    });
    setNewDevName('');
    setNewDevUrl('');
    setNewDevOpenMode('iframe');
    setNewDevUseProxy(true);
    showToast('Đã thêm thiết bị mới!');
  };

  // Save default URL
  const handleSaveDefaultUrl = () => {
    if (!newDefaultUrlInput.trim()) {
      showToast('URL mặc định không được để trống!');
      return;
    }
    onUpdateDefaultUrl(newDefaultUrlInput.trim());
    showToast('Đã lưu URL Mặc Định mới cho thiết bị!');
  };

  // Handle Add New Game & Upload to Firebase
  const handleAddGameSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGameName.trim() || !newGameUrl.trim()) {
      showToast('Vui lòng nhập Tên và URL ứng dụng!');
      return;
    }

    setIsUploading(true);
    try {
      const newGame: GameApp = {
        id: `game_${Date.now()}_${Math.floor(Math.random()*1000)}`,
        name: newGameName.trim(),
        desc: newGameDesc.trim() || 'Ứng dụng Cloud',
        url: newGameUrl.trim(),
        icon: newGameIcon.trim() || 'https://cdn-icons-png.flaticon.com/512/3081/3081329.png',
        tag: newGameTag.trim() || 'App',
        created_at: Date.now(),
      };

      // Add locally first
      onAddGame(newGame);

      // Upload to Firebase Firestore for all users
      const cloudSuccess = await saveGameToCloud(newGame);

      if (cloudSuccess) {
        showToast('🎉 Đã thêm & tự động upload lên Cloud (Firestore) cho người dùng khác!');
      } else {
        showToast('Đã thêm ứng dụng vào danh sách cục bộ!');
      }

      // Reset form
      setNewGameName('');
      setNewGameDesc('');
      setNewGameUrl('');
      setNewGameIcon('');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Edit Game & Sync
  const handleSaveEditGame = async () => {
    if (!editingGame) return;
    onUpdateGame(editingGame);
    setIsUploading(true);
    try {
      const cloudSuccess = await saveGameToCloud(editingGame);
      if (cloudSuccess) {
        showToast('Đã cập nhật & đồng bộ game lên Cloud!');
      } else {
        showToast('Đã cập nhật game cục bộ!');
      }
    } finally {
      setIsUploading(false);
      setEditingGame(null);
    }
  };

  // Handle Delete Game
  const handleDeleteGameClick = async (game: GameApp) => {
    if (game.id) {
      onDeleteGame(game.id);
      await deleteGameFromCloud(game.id);
      showToast(`🗑️ Đã xoá ứng dụng "${game.name}"!`);
    }
  };

  // Handle Add Announcement
  const handleAddAnnouncementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!annTitle.trim() || !annContent.trim()) {
      showToast('Vui lòng nhập Tiêu đề và Nội dung thông báo!');
      return;
    }

    setIsUploading(true);
    try {
      const newAnn: Announcement = {
        id: `ann_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        title: annTitle.trim(),
        content: annContent.trim(),
        type: annType,
        isImportant: annIsImportant,
        date: new Date().toISOString().split('T')[0],
        created_at: Date.now(),
      };

      if (onAddAnnouncement) {
        onAddAnnouncement(newAnn);
      }

      const cloudSuccess = await saveAnnouncementToCloud(newAnn);

      if (cloudSuccess) {
        showToast(t?.announcementAddedToast || '🎉 Đã đăng thông báo mới cho tất cả người dùng!');
      } else {
        showToast('Đã lưu thông báo cục bộ!');
      }

      setAnnTitle('');
      setAnnContent('');
      setAnnIsImportant(false);
      setAnnType('update');
    } finally {
      setIsUploading(false);
    }
  };

  // Handle Delete Announcement
  const handleDeleteAnnouncementClick = async (ann: Announcement) => {
    if (ann.id) {
      if (onDeleteAnnouncement) {
        onDeleteAnnouncement(ann.id);
      }
      await deleteAnnouncementFromCloud(ann.id);
      showToast(t?.deleteAnnouncementToast || '🗑️ Đã xoá thông báo!');
    }
  };

  // Handle Add Guide
  const handleAddGuideSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuideTitle.trim()) {
      showToast('Vui lòng nhập Tên mục Hướng Dẫn!');
      return;
    }

    const gItem: GuideItem = {
      id: `guide_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      title: newGuideTitle.trim(),
      note: newGuideNote.trim(),
      link: newGuideLink.trim() || 'https://cloudphone.app',
      videoUrl: newGuideVideoUrl.trim() || 'https://www.youtube.com/embed/dQw4w9WgXcQ',
      created_at: Date.now(),
    };

    if (onAddGuide) {
      onAddGuide(gItem);
    }

    const updatedGuides = [...guides, gItem];
    await saveGuidesToCloud(updatedGuides);

    setNewGuideTitle('');
    setNewGuideNote('');
    setNewGuideLink('');
    setNewGuideVideoUrl('');
    showToast('🎉 Đã thêm mục hướng dẫn mới & đồng bộ cho tất cả người dùng!');
  };

  // Handle Save Edit Guide
  const handleSaveEditGuide = async () => {
    if (!editingGuide) return;
    if (!editingGuide.title.trim()) {
      showToast('Tên hướng dẫn không được để trống!');
      return;
    }

    if (onUpdateGuide) {
      onUpdateGuide(editingGuide);
    }

    const updatedGuides = guides.map((g) => (g.id === editingGuide.id ? editingGuide : g));
    await saveGuidesToCloud(updatedGuides);
    setEditingGuide(null);
    showToast('Đã cập nhật mục hướng dẫn thành công!');
  };

  // Handle Delete Guide
  const handleDeleteGuideClick = async (guideId: string) => {
    if (onDeleteGuide) {
      onDeleteGuide(guideId);
    }
    const updatedGuides = guides.filter((g) => g.id !== guideId);
    await saveGuidesToCloud(updatedGuides);
    showToast('🗑️ Đã xóa mục hướng dẫn!');
  };

  // Handle Reply Bug Report
  const handleReplySubmit = async (reportId: string) => {
    const text = replyInputs[reportId];
    if (!text || !text.trim()) {
      showToast('Vui lòng nhập nội dung trả lời!');
      return;
    }
    if (onReplyBugReport) {
      onReplyBugReport(reportId, text.trim());
    } else {
      const existing = bugReports.find((r) => r.id === reportId);
      if (existing) {
        const updated: BugReport = {
          ...existing,
          status: 'replied',
          adminReply: text.trim(),
          repliedAt: Date.now(),
        };
        await saveBugReportToCloud(updated);
      }
    }
    setReplyInputs((prev) => ({ ...prev, [reportId]: '' }));
    showToast('✉️ Đã gửi câu trả lời tới người dùng!');
  };

  // Handle Delete Bug Report
  const handleDeleteBugClick = async (reportId: string) => {
    if (onDeleteBugReport) {
      onDeleteBugReport(reportId);
    } else {
      await deleteBugReportFromCloud(reportId);
    }
    showToast('🗑️ Đã xóa báo lỗi!');
  };

  return (
    <div id="tab-admin" className="tab-content active">
      <div className="header-area">
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h2 className="header-title" style={{ color: '#dc2626' }}>
            <i className="fas fa-user-shield"></i> Admin Control
          </h2>
        </div>
        <span style={{ background: '#fee2e2', color: '#dc2626', padding: '4px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 800 }}>
          0869125253 Active
        </span>
      </div>

      {/* Sub tabs inside Admin */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <button
          onClick={() => setActiveSubTab('device_types')}
          style={{
            flex: 1,
            minWidth: '100px',
            padding: '10px 6px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            background: activeSubTab === 'device_types' ? '#2563eb' : '#e5e7eb',
            color: activeSubTab === 'device_types' ? 'white' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: activeSubTab === 'device_types' ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
          }}
        >
          <i className="fas fa-mobile-alt"></i> Loại TB
        </button>
        <button
          onClick={() => setActiveSubTab('devices')}
          style={{
            flex: 1,
            minWidth: '100px',
            padding: '10px 6px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            background: activeSubTab === 'devices' ? '#2563eb' : '#e5e7eb',
            color: activeSubTab === 'devices' ? 'white' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: activeSubTab === 'devices' ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
          }}
        >
          <i className="fas fa-link"></i> Link TB
        </button>
        <button
          onClick={() => setActiveSubTab('games')}
          style={{
            flex: 1,
            minWidth: '100px',
            padding: '10px 6px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            background: activeSubTab === 'games' ? '#2563eb' : '#e5e7eb',
            color: activeSubTab === 'games' ? 'white' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: activeSubTab === 'games' ? '0 4px 12px rgba(37,99,235,0.25)' : 'none'
          }}
        >
          <i className="fas fa-cloud-upload-alt"></i> Games & App
        </button>
        <button
          onClick={() => setActiveSubTab('announcements')}
          style={{
            flex: 1,
            minWidth: '100px',
            padding: '10px 6px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            background: activeSubTab === 'announcements' ? '#dc2626' : '#e5e7eb',
            color: activeSubTab === 'announcements' ? 'white' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: activeSubTab === 'announcements' ? '0 4px 12px rgba(220,38,38,0.25)' : 'none'
          }}
        >
          <i className="fas fa-bullhorn"></i> Thông Báo
        </button>
        <button
          onClick={() => setActiveSubTab('guides')}
          style={{
            flex: 1,
            minWidth: '100px',
            padding: '10px 6px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            background: activeSubTab === 'guides' ? '#0284c7' : '#e5e7eb',
            color: activeSubTab === 'guides' ? 'white' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: activeSubTab === 'guides' ? '0 4px 12px rgba(2,132,199,0.25)' : 'none'
          }}
        >
          <i className="fas fa-book-open"></i> Hướng Dẫn
        </button>
        <button
          onClick={() => setActiveSubTab('bug_reports')}
          style={{
            flex: 1,
            minWidth: '100px',
            padding: '10px 6px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 800,
            fontSize: '0.82rem',
            cursor: 'pointer',
            background: activeSubTab === 'bug_reports' ? '#ef4444' : '#e5e7eb',
            color: activeSubTab === 'bug_reports' ? 'white' : '#374151',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '4px',
            boxShadow: activeSubTab === 'bug_reports' ? '0 4px 12px rgba(239,68,68,0.25)' : 'none'
          }}
        >
          <i className="fas fa-bug"></i> Báo Lỗi ({bugReports.filter(r => r.status === 'pending').length})
        </button>
      </div>

      {/* SUB-TAB 0: DEVICE TYPES MANAGEMENT */}
      {activeSubTab === 'device_types' && (
        <div>
          {/* Form to Add New Device Type */}
          <div className="info-card" style={{ borderLeft: '4px solid #2563eb', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800 }}>
              <i className="fas fa-plus-circle" style={{ color: '#2563eb', marginRight: '6px' }}></i>
              Thêm Loại Thiết Bị Mới (Device Type)
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginBottom: '12px', lineHeight: '1.4' }}>
              Tạo các loại thiết bị khác nhau với cấu hình & link mở riêng. Khi người dùng chọn Mua Device, hệ thống sẽ hiển thị danh sách này.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Tên Loại Thiết Bị:</label>
                <input
                  className="search-input"
                  style={{ marginBottom: 0, marginTop: '2px' }}
                  placeholder="vd: Cloud Phone PRO MAX, Cloud Phone Gaming 128GB..."
                  value={newTypeName}
                  onChange={(e) => setNewTypeName(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>RAM:</label>
                  <select
                    value={newTypeRam}
                    onChange={(e) => setNewTypeRam(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '2px' }}
                  >
                    <option value="4GB RAM">4GB RAM</option>
                    <option value="8GB RAM">8GB RAM</option>
                    <option value="12GB RAM">12GB RAM</option>
                    <option value="16GB RAM">16GB RAM</option>
                    <option value="32GB RAM MAX">32GB RAM MAX</option>
                  </select>
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Android HĐH:</label>
                  <select
                    value={newTypeAndroid}
                    onChange={(e) => setNewTypeAndroid(e.target.value)}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '2px' }}
                  >
                    <option value="Android 11">Android 11</option>
                    <option value="Android 12">Android 12</option>
                    <option value="Android 13">Android 13</option>
                    <option value="Android 14">Android 14</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Link Mở Ứng Dụng (URL Riêng Cho Loại Này):</label>
                <input
                  className="search-input"
                  style={{ marginBottom: 0, marginTop: '2px', fontFamily: 'monospace', fontSize: '0.85rem' }}
                  placeholder="https://... (để trống sẽ dùng link mặc định)"
                  value={newTypeUrl}
                  onChange={(e) => setNewTypeUrl(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Nhãn / Badge:</label>
                  <input
                    className="search-input"
                    style={{ marginBottom: 0, marginTop: '2px' }}
                    placeholder="vd: Phổ Biến, VIP, Mới..."
                    value={newTypeBadge}
                    onChange={(e) => setNewTypeBadge(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Mô Tả Ngắn:</label>
                <input
                  className="search-input"
                  style={{ marginBottom: 0, marginTop: '2px' }}
                  placeholder="vd: Cấu hình mượt mà, chuyên game đồ họa cao..."
                  value={newTypeDesc}
                  onChange={(e) => setNewTypeDesc(e.target.value)}
                />
              </div>

              {/* Open Mode & Proxy Selectors */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '160px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Chế Độ Mở Màn Hình:</label>
                  <select
                    value={newTypeOpenMode}
                    onChange={(e) => setNewTypeOpenMode(e.target.value as 'iframe' | 'external')}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '2px', fontWeight: 700 }}
                  >
                    <option value="iframe">📱 Mở trong Iframe (Trong App)</option>
                    <option value="external">🚀 Mở ngoài (Tab / Cửa sổ mới)</option>
                  </select>
                </div>

                <div style={{ flex: 1, minWidth: '160px' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#334155' }}>Tự Động Kết Hợp Proxy App:</label>
                  <select
                    value={newTypeUseProxy ? 'true' : 'false'}
                    onChange={(e) => setNewTypeUseProxy(e.target.value === 'true')}
                    style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e2e8f0', marginTop: '2px', fontWeight: 700 }}
                  >
                    <option value="true">🟢 Bật (Mở Qua Proxy App)</option>
                    <option value="false">🔴 Tắt (Mở Thẳng Link Gốc)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleAddDeviceTypeSubmit}
                style={{
                  background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '4px',
                  fontSize: '0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                <i className="fas fa-plus"></i> Thêm Loại Thiết Bị Mới
              </button>
            </div>
          </div>

          {/* Existing Device Types List */}
          <h4 style={{ margin: '16px 0 10px 0', color: '#0f172a', fontSize: '1rem', fontWeight: 800 }}>
            Danh Sách Loại Thiết Bị Hiện Có ({deviceTypes.length})
          </h4>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {deviceTypes.length === 0 ? (
              <p style={{ color: '#94a3b8', fontSize: '0.88rem' }}>Chưa có loại thiết bị nào. Vui lòng thêm loại mới phía trên.</p>
            ) : (
              deviceTypes.map((dt) => {
                const isEditing = editingDeviceType?.id === dt.id;
                const currentDt = isEditing ? editingDeviceType : dt;

                return (
                  <div key={dt.id} className="info-card" style={{ borderLeft: '4px solid #3b82f6', background: 'white' }}>
                    {isEditing ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <input
                          className="search-input"
                          style={{ marginBottom: 0 }}
                          value={currentDt.name}
                          onChange={(e) => setEditingDeviceType({ ...currentDt, name: e.target.value })}
                          placeholder="Tên loại thiết bị"
                        />
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <input
                            className="search-input"
                            style={{ marginBottom: 0, flex: 1 }}
                            value={currentDt.ram}
                            onChange={(e) => setEditingDeviceType({ ...currentDt, ram: e.target.value })}
                            placeholder="RAM"
                          />
                          <input
                            className="search-input"
                            style={{ marginBottom: 0, flex: 1 }}
                            value={currentDt.android}
                            onChange={(e) => setEditingDeviceType({ ...currentDt, android: e.target.value })}
                            placeholder="Android"
                          />
                        </div>
                        <input
                          className="search-input"
                          style={{ marginBottom: 0, fontFamily: 'monospace', fontSize: '0.85rem' }}
                          value={currentDt.url}
                          onChange={(e) => setEditingDeviceType({ ...currentDt, url: e.target.value })}
                          placeholder="Link URL riêng"
                        />
                        <input
                          className="search-input"
                          style={{ marginBottom: 0 }}
                          value={currentDt.badge || ''}
                          onChange={(e) => setEditingDeviceType({ ...currentDt, badge: e.target.value })}
                          placeholder="Badge (Mới/VIP...)"
                        />
                        <input
                          className="search-input"
                          style={{ marginBottom: 0 }}
                          value={currentDt.desc || ''}
                          onChange={(e) => setEditingDeviceType({ ...currentDt, desc: e.target.value })}
                          placeholder="Mô tả"
                        />

                        <div style={{ display: 'flex', gap: '6px' }}>
                          <select
                            value={currentDt.openMode || (currentDt.openExternal ? 'external' : 'iframe')}
                            onChange={(e) => setEditingDeviceType({ ...currentDt, openMode: e.target.value as 'iframe' | 'external' })}
                            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}
                          >
                            <option value="iframe">📱 Mở Iframe</option>
                            <option value="external">🚀 Mở Ngoài Tab</option>
                          </select>

                          <select
                            value={currentDt.useProxy !== false ? 'true' : 'false'}
                            onChange={(e) => setEditingDeviceType({ ...currentDt, useProxy: e.target.value === 'true' })}
                            style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '0.8rem', fontWeight: 700 }}
                          >
                            <option value="true">🟢 Bật Proxy</option>
                            <option value="false">🔴 Tắt Proxy</option>
                          </select>
                        </div>

                        <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                          <button
                            onClick={() => handleSaveEditingType(currentDt)}
                            style={{
                              flex: 1,
                              background: '#16a34a',
                              color: 'white',
                              border: 'none',
                              padding: '8px',
                              borderRadius: '8px',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Lưu Loại TB
                          </button>
                          <button
                            onClick={() => setEditingDeviceType(null)}
                            style={{
                              background: '#e5e7eb',
                              color: '#374151',
                              border: 'none',
                              padding: '8px 14px',
                              borderRadius: '8px',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <h4 style={{ margin: 0, fontWeight: 800, fontSize: '0.98rem' }}>{dt.name}</h4>
                            {dt.badge && (
                              <span style={{ fontSize: '0.7rem', fontWeight: 800, padding: '2px 6px', borderRadius: '6px', background: '#dbeafe', color: '#1e40af' }}>
                                {dt.badge}
                              </span>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <button
                              onClick={() => setEditingDeviceType(dt)}
                              style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                            >
                              <i className="fas fa-edit"></i> Sửa
                            </button>
                            <button
                              onClick={() => handleDeleteTypeClick(dt.id)}
                              style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                            >
                              <i className="fas fa-trash"></i> Xóa
                            </button>
                          </div>
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#2563eb', fontWeight: 700, marginBottom: '4px' }}>
                          <i className="fas fa-microchip" style={{ marginRight: '4px' }}></i>{dt.ram} • {dt.android}
                        </div>

                        {dt.desc && (
                          <p style={{ margin: '0 0 6px 0', fontSize: '0.82rem', color: '#64748b' }}>
                            {dt.desc}
                          </p>
                        )}

                        <div style={{ fontSize: '0.75rem', color: '#10b981', fontFamily: 'monospace', wordBreak: 'break-all', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <i className="fas fa-link"></i> {dt.url}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* SUB-TAB 1: DEVICE LINKS MANAGEMENT */}
      {activeSubTab === 'devices' && (
        <div>
          {/* Default URL Configuration */}
          <div className="info-card" style={{ borderLeft: '4px solid #2563eb' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem' }}>
              <i className="fas fa-globe" style={{ color: '#2563eb', marginRight: '6px' }}></i>
              URL Mặc Định Khi Tạo Thiết Bị
            </h3>
            <p className="text-muted" style={{ marginBottom: '10px', fontSize: '0.85rem' }}>
              Thiết bị mới tạo sẽ mở đường dẫn link này:
            </p>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                className="search-input"
                style={{ marginBottom: 0, fontSize: '0.88rem', fontFamily: 'monospace' }}
                value={newDefaultUrlInput}
                onChange={(e) => setNewDefaultUrlInput(e.target.value)}
                placeholder="https://..."
              />
              <button
                onClick={handleSaveDefaultUrl}
                style={{
                  background: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '0 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  whiteSpace: 'nowrap'
                }}
              >
                Lưu
              </button>
            </div>
          </div>

          {/* Add Custom Device Directly */}
          <div className="info-card">
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.05rem' }}>
              <i className="fas fa-plus-circle" style={{ color: '#16a34a', marginRight: '6px' }}></i>
              Thêm Thiết Bị Mới
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <input
                className="search-input"
                style={{ marginBottom: 0 }}
                placeholder="Tên thiết bị (vd: Cluster VIP #99)"
                value={newDevName}
                onChange={(e) => setNewDevName(e.target.value)}
              />
              <input
                className="search-input"
                style={{ marginBottom: 0, fontFamily: 'monospace' }}
                placeholder="Link mở ứng dụng (để trống để dùng URL Mặc Định)"
                value={newDevUrl}
                onChange={(e) => setNewDevUrl(e.target.value)}
              />
              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={newDevRam}
                  onChange={(e) => setNewDevRam(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
                >
                  <option value="4GB">4GB RAM</option>
                  <option value="8GB">8GB RAM</option>
                  <option value="16GB">16GB RAM PRO</option>
                  <option value="32GB">32GB RAM MAX</option>
                </select>
                <select
                  value={newDevAndroid}
                  onChange={(e) => setNewDevAndroid(e.target.value)}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb' }}
                >
                  <option value="Android 11">Android 11</option>
                  <option value="Android 12">Android 12</option>
                  <option value="Android 13">Android 13</option>
                  <option value="Android 14">Android 14</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <select
                  value={newDevOpenMode}
                  onChange={(e) => setNewDevOpenMode(e.target.value as 'iframe' | 'external')}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', fontWeight: 700 }}
                >
                  <option value="iframe">📱 Mở Trong Iframe</option>
                  <option value="external">🚀 Mở Ngoài Tab</option>
                </select>

                <select
                  value={newDevUseProxy ? 'true' : 'false'}
                  onChange={(e) => setNewDevUseProxy(e.target.value === 'true')}
                  style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', fontWeight: 700 }}
                >
                  <option value="true">🟢 Bật Proxy App</option>
                  <option value="false">🔴 Tắt Proxy (Mở Thẳng)</option>
                </select>
              </div>
              <button
                onClick={handleCreateCustomDevice}
                style={{
                  background: '#16a34a',
                  color: 'white',
                  border: 'none',
                  padding: '10px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  cursor: 'pointer',
                  marginTop: '4px'
                }}
              >
                <i className="fas fa-plus"></i> Tạo Thiết Bị Custom
              </button>
            </div>
          </div>

          {/* List & Edit Device Links */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', margin: '16px 0 10px 0', flexWrap: 'wrap', gap: '8px' }}>
            <h4 style={{ margin: 0, color: '#374151', fontSize: '1rem', fontWeight: 800 }}>
              Danh Sách Thiết Bị & Link Chỉnh Sửa ({devices.length})
            </h4>
            <button
              onClick={onDeleteInactiveDevices}
              style={{
                background: '#fee2e2',
                color: '#dc2626',
                border: '1px solid #fca5a5',
                padding: '6px 12px',
                borderRadius: '10px',
                fontWeight: 800,
                fontSize: '0.82rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <i className="fas fa-trash-alt"></i> Xóa TB Không Hoạt Động
            </button>
          </div>

          {devices.length === 0 ? (
            <p style={{ color: '#9ca3af' }}>Chưa có thiết bị nào.</p>
          ) : (
            devices.map((device) => {
              const isEditing = editingDevice?.id === device.id;
              const currentDev = isEditing ? editingDevice : device;
              const isInactive = device.status === 'inactive' || device.status === 'offline' || !device.url || !device.url.trim();

              return (
                <div key={device.id} className="card" style={{ borderLeft: isInactive ? '4px solid #ef4444' : '4px solid #10b981', padding: '14px' }}>
                  {!isEditing ? (
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <strong style={{ fontSize: '1.05rem', color: '#0f1724' }}>{device.name}</strong>
                            <span style={{
                              fontSize: '0.72rem',
                              fontWeight: 800,
                              padding: '2px 8px',
                              borderRadius: '8px',
                              background: isInactive ? '#fee2e2' : '#dcfce7',
                              color: isInactive ? '#dc2626' : '#15803d',
                            }}>
                              {isInactive ? '● Không hoạt động' : '● Hoạt động'}
                            </span>
                          </div>
                          <div style={{ fontSize: '0.82rem', color: '#6b7280', marginTop: '2px', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                            <span>{device.android} • {device.ram}</span>
                            <span style={{ fontSize: '0.72rem', color: '#0284c7', fontWeight: 700, background: '#f0f9ff', padding: '2px 8px', borderRadius: '6px' }}>
                              <i className="fas fa-history"></i> {t?.playTimeLabel || 'Play time:'} {formatPlayTime(device.playTime, t)}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px' }}>
                          <button
                            onClick={() => setEditingDevice({ ...device })}
                            style={{
                              background: '#fef3c7',
                              color: '#d97706',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fas fa-edit"></i> Sửa
                          </button>
                          <button
                            onClick={() => onDeleteDevice(device.id)}
                            style={{
                              background: '#fee2e2',
                              color: '#dc2626',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontWeight: 800,
                              fontSize: '0.82rem',
                              cursor: 'pointer'
                            }}
                          >
                            <i className="fas fa-trash"></i> Xóa
                          </button>
                        </div>
                      </div>
                      <div
                        style={{
                          marginTop: '8px',
                          background: '#f8fafc',
                          padding: '8px 10px',
                          borderRadius: '8px',
                          fontSize: '0.8rem',
                          fontFamily: 'monospace',
                          color: '#2563eb',
                          wordBreak: 'break-all'
                        }}
                      >
                        🔗 {device.url || defaultUrl}
                      </div>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <div style={{ fontWeight: 800, color: '#d97706' }}>
                        <i className="fas fa-edit"></i> Chỉnh sửa thiết bị #{device.id}
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>Tên thiết bị:</label>
                        <input
                          className="search-input"
                          style={{ marginBottom: 0, marginTop: '4px' }}
                          value={currentDev.name}
                          onChange={(e) => setEditingDevice({ ...currentDev, name: e.target.value })}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>
                          Trạng Thái Hoạt Động:
                        </label>
                        <select
                          value={currentDev.status || 'active'}
                          onChange={(e) => setEditingDevice({ ...currentDev, status: e.target.value as 'active' | 'inactive' })}
                          style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', marginTop: '4px', fontWeight: 700 }}
                        >
                          <option value="active">🟢 Hoạt động (Active)</option>
                          <option value="inactive">🔴 Không hoạt động / Lỗi (Inactive)</option>
                        </select>
                      </div>

                      <div>
                        <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#4b5563' }}>
                          Link mở ứng dụng (URL when opened):
                        </label>
                        <textarea
                          rows={3}
                          className="search-input"
                          style={{ marginBottom: 0, marginTop: '4px', fontFamily: 'monospace', fontSize: '0.82rem' }}
                          value={currentDev.url}
                          onChange={(e) => setEditingDevice({ ...currentDev, url: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          className="search-input"
                          style={{ marginBottom: 0, flex: 1 }}
                          value={currentDev.ram}
                          placeholder="RAM"
                          onChange={(e) => setEditingDevice({ ...currentDev, ram: e.target.value })}
                        />
                        <input
                          className="search-input"
                          style={{ marginBottom: 0, flex: 1 }}
                          value={currentDev.android}
                          placeholder="Android"
                          onChange={(e) => setEditingDevice({ ...currentDev, android: e.target.value })}
                        />
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563' }}>Chế Độ Mở Màn Hình:</label>
                          <select
                            value={currentDev.openMode || (currentDev.openExternal ? 'external' : 'iframe')}
                            onChange={(e) => setEditingDevice({ ...currentDev, openMode: e.target.value as 'iframe' | 'external' })}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', marginTop: '2px', fontWeight: 700 }}
                          >
                            <option value="iframe">📱 Mở Trong Iframe</option>
                            <option value="external">🚀 Mở Ngoài Tab</option>
                          </select>
                        </div>

                        <div style={{ flex: 1 }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#4b5563' }}>Tự Động Kết Hợp Proxy App:</label>
                          <select
                            value={currentDev.useProxy !== false ? 'true' : 'false'}
                            onChange={(e) => setEditingDevice({ ...currentDev, useProxy: e.target.value === 'true' })}
                            style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', marginTop: '2px', fontWeight: 700 }}
                          >
                            <option value="true">🟢 Bật Proxy App</option>
                            <option value="false">🔴 Tắt Proxy (Mở Thẳng)</option>
                          </select>
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                        <button
                          onClick={() => handleSaveDevice(currentDev)}
                          style={{
                            flex: 1,
                            background: '#16a34a',
                            color: 'white',
                            border: 'none',
                            padding: '10px',
                            borderRadius: '8px',
                            fontWeight: 800,
                            cursor: 'pointer'
                          }}
                        >
                          <i className="fas fa-save"></i> Lưu Thay Đổi
                        </button>
                        <button
                          onClick={() => setEditingDevice(null)}
                          style={{
                            background: '#e5e7eb',
                            color: '#374151',
                            border: 'none',
                            padding: '10px 16px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            cursor: 'pointer'
                          }}
                        >
                          Hủy
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      )}

      {/* SUB-TAB 2: EXPLORE APPS & AUTO UPLOAD */}
      {activeSubTab === 'games' && (
        <div>
          {/* Quản Lý Thể Loại / Category Management */}
          <div className="info-card" style={{ borderLeft: '4px solid #2563eb', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#1d4ed8', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fas fa-tags"></i> Quản Lý Thể Loại Game / App ({categoriesList.length})
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
              Thêm hoặc quản lý các thể loại game. Thể loại mới sẽ xuất hiện ở thanh lọc Khám Phá và trong danh sách chọn khi thêm/sửa Game.
            </p>

            <form onSubmit={handleAddCategorySubmit} style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              <input
                className="search-input"
                style={{ marginBottom: 0, flex: 1 }}
                placeholder="Nhập tên thể loại mới (vd: MOBA, Tải Nhiều, Sinh Tồn...)"
                value={newCatLabel}
                onChange={(e) => setNewCatLabel(e.target.value)}
                required
              />
              <button
                type="submit"
                style={{
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  padding: '0 16px',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                + Thêm Thể Loại
              </button>
            </form>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxHeight: '140px', overflowY: 'auto' }}>
              {categoriesList.map((cat) => (
                <div
                  key={cat.value}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#f1f5f9',
                    border: '1px solid #cbd5e1',
                    borderRadius: '16px',
                    padding: '4px 10px',
                    fontSize: '0.8rem',
                    fontWeight: 700,
                    color: '#334155',
                  }}
                >
                  <span>{cat.label}</span>
                  {onDeleteCategory && (
                    <button
                      type="button"
                      onClick={() => onDeleteCategory(cat.value)}
                      title="Xóa thể loại này"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#ef4444',
                        cursor: 'pointer',
                        padding: '0 2px',
                        fontSize: '0.85rem',
                        fontWeight: 900,
                        lineHeight: 1,
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Add Game Form */}
          <div className="info-card" style={{ borderLeft: '4px solid #16a34a' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: '#15803d' }}>
              <i className="fas fa-cloud-upload-alt" style={{ marginRight: '6px' }}></i>
              Thêm Ứng Dụng Mới & Tự Động Upload (Firestore)
            </h3>
            <p className="text-muted" style={{ fontSize: '0.85rem', marginBottom: '12px' }}>
              Ứng dụng thêm ở đây sẽ xuất hiện ở mục Khám Phá và được tự động đồng bộ cho người dùng khác!
            </p>

            <form onSubmit={handleAddGameSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>Tên Game / Ứng Dụng (*)</label>
                <input
                  className="search-input"
                  style={{ marginBottom: 0, marginTop: '4px' }}
                  placeholder="Vd: Liên Quân Mobile, Robox, App Khám Phá..."
                  value={newGameName}
                  onChange={(e) => setNewGameName(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>Mô tả ngắn</label>
                <input
                  className="search-input"
                  style={{ marginBottom: 0, marginTop: '4px' }}
                  placeholder="Vd: Game Moba 5v5 | Hot 2026"
                  value={newGameDesc}
                  onChange={(e) => setNewGameDesc(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>URL / Link Mở (*)</label>
                <input
                  className="search-input"
                  style={{ marginBottom: 0, marginTop: '4px', fontFamily: 'monospace' }}
                  placeholder="https://..."
                  value={newGameUrl}
                  onChange={(e) => setNewGameUrl(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>URL Ảnh Icon / Logo</label>
                <input
                  className="search-input"
                  style={{ marginBottom: 0, marginTop: '4px' }}
                  placeholder="https://... (để trống nếu không có)"
                  value={newGameIcon}
                  onChange={(e) => setNewGameIcon(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: '#374151' }}>Thể Loại / Tag (*)</label>
                <select
                  value={newGameTag}
                  onChange={(e) => setNewGameTag(e.target.value)}
                  style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #e5e7eb', marginTop: '4px', fontWeight: 700 }}
                >
                  {categoriesList.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <input
                  className="search-input"
                  style={{ marginTop: '6px', marginBottom: 0 }}
                  value={newGameTag}
                  onChange={(e) => setNewGameTag(e.target.value)}
                  placeholder="Hoặc tự gõ tên thể loại / tag tùy chỉnh..."
                />
              </div>

              <button
                type="submit"
                disabled={isUploading}
                style={{
                  background: isUploading ? '#9ca3af' : 'linear-gradient(135deg, #16a34a, #15803d)',
                  color: 'white',
                  border: 'none',
                  padding: '12px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  cursor: isUploading ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  marginTop: '6px',
                  boxShadow: '0 4px 12px rgba(22,163,74,0.3)'
                }}
              >
                {isUploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Đang Upload Lên Cloud...
                  </>
                ) : (
                  <>
                    <i className="fas fa-upload"></i> Thêm & Upload Lên Firebase Cloud
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List Games in Khám Phá */}
          <h4 style={{ margin: '16px 0 10px 0', color: '#374151', fontSize: '1rem', fontWeight: 800 }}>
            Quản Lý Danh Sách Game / App Khám Phá ({games.length})
          </h4>

          {games.map((game, idx) => {
            const isEditing = editingGame?.id === game.id;

            return (
              <div key={game.id || idx} className="card" style={{ padding: '12px' }}>
                {!isEditing ? (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                      <img
                        src={game.icon}
                        alt={game.name}
                        style={{ width: '48px', height: '48px', borderRadius: '10px', objectFit: 'cover' }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://cdn-icons-png.flaticon.com/512/3081/3081329.png';
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <strong style={{ display: 'block', fontSize: '0.98rem', color: '#0f1724', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {game.name} <span style={{ fontSize: '0.75rem', background: '#e0e7ff', color: '#3730a3', padding: '2px 6px', borderRadius: '6px' }}>{game.tag || 'Game'}</span>
                        </strong>
                        <span className="text-muted" style={{ fontSize: '0.8rem', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {game.desc}
                        </span>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => setEditingGame({ ...game })}
                        style={{ background: '#e0e7ff', color: '#3730a3', border: 'none', padding: '6px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Sửa
                      </button>
                      <button
                        onClick={() => handleDeleteGameClick(game)}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '6px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer' }}
                      >
                        Xóa
                      </button>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ fontWeight: 800, color: '#2563eb' }}>Chỉnh Sửa Game "{game.name}"</div>
                    <input
                      className="search-input"
                      style={{ marginBottom: 0 }}
                      value={editingGame.name}
                      onChange={(e) => setEditingGame({ ...editingGame, name: e.target.value })}
                      placeholder="Tên game"
                    />
                    <input
                      className="search-input"
                      style={{ marginBottom: 0 }}
                      value={editingGame.desc}
                      onChange={(e) => setEditingGame({ ...editingGame, desc: e.target.value })}
                      placeholder="Mô tả"
                    />
                    <input
                      className="search-input"
                      style={{ marginBottom: 0, fontFamily: 'monospace' }}
                      value={editingGame.url}
                      onChange={(e) => setEditingGame({ ...editingGame, url: e.target.value })}
                      placeholder="URL"
                    />
                    <input
                      className="search-input"
                      style={{ marginBottom: 0 }}
                      value={editingGame.icon}
                      onChange={(e) => setEditingGame({ ...editingGame, icon: e.target.value })}
                      placeholder="Icon URL"
                    />

                    <div>
                      <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151' }}>Thể Loại / Tag (*)</label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '2px' }}>
                        <select
                          value={categoriesList.some(c => c.value.toLowerCase() === (editingGame.tag || '').toLowerCase()) ? editingGame.tag : '__custom__'}
                          onChange={(e) => {
                            if (e.target.value !== '__custom__') {
                              setEditingGame({ ...editingGame, tag: e.target.value });
                            }
                          }}
                          style={{ width: '100%', padding: '8px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', fontWeight: 700, fontSize: '0.85rem' }}
                        >
                          {categoriesList.map((cat) => (
                            <option key={cat.value} value={cat.value}>
                              {cat.label}
                            </option>
                          ))}
                          <option value="__custom__">-- Thể loại tùy chỉnh --</option>
                        </select>
                        <input
                          className="search-input"
                          style={{ marginBottom: 0 }}
                          value={editingGame.tag || ''}
                          onChange={(e) => setEditingGame({ ...editingGame, tag: e.target.value })}
                          placeholder="Nhập hoặc đổi tên thể loại / tag..."
                        />
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                      <button
                        onClick={handleSaveEditGame}
                        style={{ flex: 1, background: '#16a34a', color: 'white', border: 'none', padding: '8px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Lưu & Upload
                      </button>
                      <button
                        onClick={() => setEditingGame(null)}
                        style={{ background: '#e5e7eb', color: '#374151', border: 'none', padding: '8px 12px', borderRadius: '8px', fontWeight: 700, cursor: 'pointer' }}
                      >
                        Hủy
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* SUB-TAB 3: ANNOUNCEMENTS MANAGEMENT */}
      {activeSubTab === 'announcements' && (
        <div>
          {/* Create Announcement Form */}
          <div className="info-card" style={{ borderLeft: '4px solid #dc2626' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#dc2626' }}>
              <i className="fas fa-bullhorn" style={{ marginRight: '8px' }}></i>
              Thêm Thông Báo Trang Chủ Mới
            </h3>
            <p className="text-muted" style={{ marginBottom: '14px', fontSize: '0.85rem' }}>
              Thông báo khi tạo sẽ tự động đồng bộ và hiển thị trên trang chủ của tất cả người dùng.
            </p>

            <form onSubmit={handleAddAnnouncementSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Tiêu đề thông báo *
                </label>
                <input
                  type="text"
                  className="search-input"
                  style={{ marginBottom: 0 }}
                  placeholder="Ví dụ: Cập nhật hệ thống v3.0, Sự kiện đua top..."
                  value={annTitle}
                  onChange={(e) => setAnnTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                  Nội dung chi tiết *
                </label>
                <textarea
                  className="search-input"
                  rows={3}
                  style={{ marginBottom: 0, resize: 'vertical', fontFamily: 'inherit' }}
                  placeholder="Nhập nội dung chi tiết thông báo hoặc cập nhật..."
                  value={annContent}
                  onChange={(e) => setAnnContent(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ flex: 1, minWidth: '140px' }}>
                  <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>
                    Phân loại
                  </label>
                  <select
                    className="search-input"
                    style={{ marginBottom: 0, cursor: 'pointer' }}
                    value={annType}
                    onChange={(e) => setAnnType(e.target.value as any)}
                  >
                    <option value="update">🔄 Cập nhật hệ thống</option>
                    <option value="event">🎁 Sự kiện quà tặng</option>
                    <option value="alert">⚠️ Cảnh báo quan trọng</option>
                    <option value="info">📢 Tin tức thông thường</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '18px' }}>
                  <input
                    type="checkbox"
                    id="ann_important"
                    checked={annIsImportant}
                    onChange={(e) => setAnnIsImportant(e.target.checked)}
                    style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                  />
                  <label htmlFor="ann_important" style={{ fontSize: '0.85rem', fontWeight: 700, color: '#dc2626', cursor: 'pointer' }}>
                    <i className="fas fa-star" style={{ color: '#eab308' }}></i> Ghim / Đánh dấu quan trọng
                  </label>
                </div>
              </div>

              <button
                type="submit"
                disabled={isUploading}
                style={{
                  marginTop: '6px',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(220, 38, 38, 0.3)'
                }}
              >
                {isUploading ? (
                  <>
                    <i className="fas fa-spinner fa-spin"></i> Đang đăng thông báo...
                  </>
                ) : (
                  <>
                    <i className="fas fa-paper-plane"></i> Đăng Thông Báo Ngay
                  </>
                )}
              </button>
            </form>
          </div>

          {/* List of active announcements */}
          <h4 style={{ margin: '18px 0 10px 0', color: '#374151', fontSize: '1rem', fontWeight: 800 }}>
            <i className="fas fa-list-ul" style={{ color: '#2563eb', marginRight: '6px' }}></i>
            Danh Sách Thông Báo Hiện Tại ({announcements.length})
          </h4>

          {announcements.length === 0 ? (
            <div className="info-card" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
              Chưa có thông báo nào. Hãy đăng thông báo mới ở biểu mẫu trên.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {announcements.map((ann) => (
                <div
                  key={ann.id}
                  className="info-card"
                  style={{
                    margin: 0,
                    padding: '14px',
                    borderRadius: '12px',
                    borderLeft: ann.isImportant ? '4px solid #ef4444' : '4px solid #2563eb'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px', flexWrap: 'wrap' }}>
                        {ann.isImportant && (
                          <span style={{ background: '#ef4444', color: 'white', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', fontWeight: 800 }}>
                            QUAN TRỌNG
                          </span>
                        )}
                        <span style={{ background: '#e0e7ff', color: '#3730a3', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '6px', fontWeight: 700 }}>
                          {ann.type || 'info'}
                        </span>
                        <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{ann.date}</span>
                      </div>
                      <strong style={{ display: 'block', fontSize: '0.95rem', color: '#111827', marginBottom: '4px' }}>
                        {ann.title}
                      </strong>
                      <p style={{ margin: 0, fontSize: '0.85rem', color: '#4b5563', whiteSpace: 'pre-line' }}>
                        {ann.content}
                      </p>
                    </div>

                    <button
                      onClick={() => handleDeleteAnnouncementClick(ann)}
                      style={{
                        background: '#fee2e2',
                        color: '#dc2626',
                        border: 'none',
                        padding: '6px 10px',
                        borderRadius: '8px',
                        fontWeight: 700,
                        fontSize: '0.78rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      <i className="fas fa-trash-alt"></i> Xóa
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 4: GUIDES MANAGEMENT */}
      {activeSubTab === 'guides' && (
        <div>
          {/* Form to Add New Guide */}
          <div className="info-card" style={{ borderLeft: '4px solid #0284c7', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: '#0369a1' }}>
              <i className="fas fa-plus-circle" style={{ marginRight: '6px' }}></i>
              Thêm Mục Hướng Dẫn Mới
            </h3>
            <p style={{ margin: '0 0 14px 0', fontSize: '0.82rem', color: '#64748b' }}>
              Tạo các mục hướng dẫn chi tiết cho người dùng. Mọi người dùng sẽ lập tức nhìn thấy các cập nhật này.
            </p>

            <form onSubmit={handleAddGuideSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Tên Mục Hướng Dẫn <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <input
                  type="text"
                  value={newGuideTitle}
                  onChange={(e) => setNewGuideTitle(e.target.value)}
                  placeholder="Ví dụ: Cách Dùng Thiết bị Pro, Cách dùng thiết bị Vpn..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                  }}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Ghi Chú Hướng Dẫn
                </label>
                <textarea
                  value={newGuideNote}
                  onChange={(e) => setNewGuideNote(e.target.value)}
                  placeholder="Nhập ghi chú hoặc lời khuyên sử dụng cho mục này..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Đường Link Hướng Dẫn
                </label>
                <input
                  type="url"
                  value={newGuideLink}
                  onChange={(e) => setNewGuideLink(e.target.value)}
                  placeholder="https://..."
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 800, color: '#334155', marginBottom: '4px' }}>
                  Link Video Hướng Dẫn (YouTube Embed hoặc Video Direct URL)
                </label>
                <input
                  type="text"
                  value={newGuideVideoUrl}
                  onChange={(e) => setNewGuideVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... hoặc embed link"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '10px',
                    border: '1.5px solid #cbd5e1',
                    fontSize: '0.88rem',
                  }}
                />
              </div>

              <button
                type="submit"
                style={{
                  padding: '12px',
                  background: 'linear-gradient(135deg, #0284c7, #0369a1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 12px rgba(2, 132, 199, 0.25)',
                }}
              >
                <i className="fas fa-plus"></i> Thêm Mục Hướng Dẫn
              </button>
            </form>
          </div>

          {/* List & Edit Existing Guides */}
          <h4 style={{ margin: '18px 0 10px 0', color: '#374151', fontSize: '1rem', fontWeight: 800 }}>
            <i className="fas fa-list" style={{ color: '#0284c7', marginRight: '6px' }}></i>
            Danh Sách Mục Hướng Dẫn Hiện Tại ({guides.length})
          </h4>

          {guides.length === 0 ? (
            <div className="info-card" style={{ textAlign: 'center', padding: '20px', color: '#6b7280' }}>
              Chưa có mục hướng dẫn nào. Hãy tạo mục hướng dẫn đầu tiên ở trên.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {guides.map((guide) => {
                const isEditing = editingGuide?.id === guide.id;

                if (isEditing && editingGuide) {
                  return (
                    <div
                      key={guide.id}
                      className="info-card"
                      style={{
                        padding: '16px',
                        borderRadius: '16px',
                        border: '2px solid #0284c7',
                        background: '#f0f9ff',
                      }}
                    >
                      <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: 850, color: '#0369a1' }}>
                        Chỉnh Sửa Mục: {editingGuide.title}
                      </h4>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>Tên Mục Hướng Dẫn:</label>
                          <input
                            type="text"
                            value={editingGuide.title}
                            onChange={(e) => setEditingGuide({ ...editingGuide, title: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              marginTop: '2px',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>Ghi Chú:</label>
                          <textarea
                            value={editingGuide.note}
                            onChange={(e) => setEditingGuide({ ...editingGuide, note: e.target.value })}
                            rows={3}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              marginTop: '2px',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>Đường Link:</label>
                          <input
                            type="text"
                            value={editingGuide.link}
                            onChange={(e) => setEditingGuide({ ...editingGuide, link: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              marginTop: '2px',
                            }}
                          />
                        </div>

                        <div>
                          <label style={{ fontSize: '0.8rem', fontWeight: 800, color: '#334155' }}>URL Video:</label>
                          <input
                            type="text"
                            value={editingGuide.videoUrl}
                            onChange={(e) => setEditingGuide({ ...editingGuide, videoUrl: e.target.value })}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              borderRadius: '8px',
                              border: '1px solid #cbd5e1',
                              marginTop: '2px',
                            }}
                          />
                        </div>

                        <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                          <button
                            onClick={handleSaveEditGuide}
                            style={{
                              flex: 1,
                              padding: '10px',
                              background: '#0284c7',
                              color: 'white',
                              border: 'none',
                              borderRadius: '10px',
                              fontWeight: 800,
                              cursor: 'pointer',
                            }}
                          >
                            <i className="fas fa-save"></i> Lưu Thay Đổi
                          </button>
                          <button
                            onClick={() => setEditingGuide(null)}
                            style={{
                              padding: '10px 16px',
                              background: '#e2e8f0',
                              color: '#334155',
                              border: 'none',
                              borderRadius: '10px',
                              fontWeight: 700,
                              cursor: 'pointer',
                            }}
                          >
                            Hủy
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <div
                    key={guide.id}
                    className="info-card"
                    style={{
                      margin: 0,
                      padding: '16px',
                      borderRadius: '16px',
                      borderLeft: '4px solid #0284c7',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '12px' }}>
                      <div style={{ flex: 1 }}>
                        <h4 style={{ margin: '0 0 6px 0', fontSize: '1.05rem', fontWeight: 850, color: '#0f172a' }}>
                          <i className="fas fa-bookmark" style={{ color: '#0284c7', marginRight: '6px' }}></i>
                          {guide.title}
                        </h4>

                        <div style={{ background: '#f8fafc', padding: '8px 12px', borderRadius: '10px', marginBottom: '8px', fontSize: '0.82rem', color: '#475569' }}>
                          <strong>Ghi chú:</strong> {guide.note || '(Chưa có)'}
                        </div>

                        <div style={{ fontSize: '0.8rem', color: '#2563eb', marginBottom: '4px', wordBreak: 'break-all' }}>
                          <i className="fas fa-link" style={{ marginRight: '4px' }}></i>
                          {guide.link}
                        </div>

                        <div style={{ fontSize: '0.78rem', color: '#64748b', wordBreak: 'break-all' }}>
                          <i className="fas fa-video" style={{ marginRight: '4px' }}></i>
                          {guide.videoUrl}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <button
                          onClick={() => setEditingGuide(guide)}
                          style={{
                            background: '#e0f2fe',
                            color: '#0369a1',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <i className="fas fa-edit"></i> Đổi tên / Sửa
                        </button>

                        <button
                          onClick={() => handleDeleteGuideClick(guide.id)}
                          style={{
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: 'none',
                            padding: '6px 12px',
                            borderRadius: '8px',
                            fontWeight: 700,
                            fontSize: '0.78rem',
                            cursor: 'pointer',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <i className="fas fa-trash-alt"></i> Xóa
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* SUB-TAB 5: BUG REPORTS MANAGEMENT */}
      {activeSubTab === 'bug_reports' && (
        <div>
          <div className="info-card" style={{ borderLeft: '4px solid #ef4444', marginBottom: '16px' }}>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', fontWeight: 800, color: '#ef4444' }}>
              <i className="fas fa-bug" style={{ marginRight: '6px' }}></i>
              {t?.viewBugReportsAdminTitle || 'Xem & Quản Lý Báo Lỗi Người Dùng'}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0, lineHeight: '1.4' }}>
              Danh sách phản hồi lỗi do người dùng gửi tới. Admin có thể nhập tin nhắn trả lời trực tiếp để người dùng nhận phản hồi ngay trong tab Báo Lỗi!
            </p>
          </div>

          {bugReports.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 16px', background: 'white', borderRadius: '18px', border: '1px dashed #cbd5e1' }}>
              <i className="fas fa-check-circle" style={{ fontSize: '2.5rem', color: '#10b981', marginBottom: '12px' }}></i>
              <p style={{ margin: 0, fontWeight: 700, color: '#334155', fontSize: '0.95rem' }}>Tuyệt vời! Hiện tại không có báo lỗi nào từ người dùng.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {bugReports.map((report) => (
                <div key={report.id} className="info-card" style={{ borderLeft: report.status === 'replied' ? '4px solid #10b981' : '4px solid #f59e0b', background: 'white' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>
                          <i className="fas fa-exclamation-circle" style={{ color: '#ef4444', marginRight: '4px' }}></i>
                          {report.targetName}
                        </span>
                        {(report.userEmail || report.userName) && (
                          <span style={{ fontSize: '0.72rem', background: '#e0f2fe', color: '#0369a1', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                            <i className="fas fa-user" style={{ marginRight: '4px' }}></i>
                            {report.userEmail || report.userName}
                          </span>
                        )}
                        <span style={{
                          fontSize: '0.7rem',
                          fontWeight: 800,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: report.status === 'replied' ? '#dcfce7' : '#fef3c7',
                          color: report.status === 'replied' ? '#15803d' : '#b45309'
                        }}>
                          {report.status === 'replied' ? '● Đã trả lời' : '● Đang chờ xử lý'}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>
                        Ngày gửi: {new Date(report.createdAt).toLocaleString()}
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteBugClick(report.id)}
                      style={{ background: '#fee2e2', color: '#dc2626', border: 'none', padding: '4px 10px', borderRadius: '8px', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      <i className="fas fa-trash"></i> Xóa báo lỗi
                    </button>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '10px', marginBottom: '12px', fontSize: '0.85rem', color: '#334155', border: '1px solid #e2e8f0' }}>
                    <strong style={{ color: '#0f172a' }}>Nội dung mô tả lỗi:</strong>
                    <div style={{ marginTop: '4px', whiteSpace: 'pre-wrap' }}>{report.description}</div>
                  </div>

                  {/* Previous Admin Reply */}
                  {report.adminReply && (
                    <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', padding: '10px 12px', borderRadius: '10px', marginBottom: '12px' }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#1e40af', marginBottom: '4px' }}>
                        <i className="fas fa-reply" style={{ marginRight: '4px' }}></i> Câu trả lời từ Admin:
                      </div>
                      <div style={{ fontSize: '0.82rem', color: '#1e293b', fontWeight: 600 }}>
                        {report.adminReply}
                      </div>
                      {report.repliedAt && (
                        <div style={{ fontSize: '0.65rem', color: '#64748b', textAlign: 'right', marginTop: '4px' }}>
                          Trả lời lúc: {new Date(report.repliedAt).toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Input form to reply */}
                  <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                    <input
                      className="search-input"
                      style={{ marginBottom: 0, flex: 1, fontSize: '0.82rem' }}
                      placeholder={t?.adminReplyPlaceholder || "Nhập câu trả lời cho người dùng..."}
                      value={replyInputs[report.id] || ''}
                      onChange={(e) => setReplyInputs({ ...replyInputs, [report.id]: e.target.value })}
                      onKeyDown={(e) => { if (e.key === 'Enter') handleReplySubmit(report.id); }}
                    />
                    <button
                      onClick={() => handleReplySubmit(report.id)}
                      style={{
                        background: '#2563eb',
                        color: 'white',
                        border: 'none',
                        padding: '0 16px',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.82rem',
                        cursor: 'pointer',
                        whiteSpace: 'nowrap',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <i className="fas fa-paper-plane"></i> {t?.replyBtn || 'Gửi Trả Lời'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
