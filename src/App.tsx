import React, { useState, useEffect, useCallback } from 'react';
import { Device, GameApp, Announcement, DeviceType, GuideItem, BugReport, TabType } from './types';
import { DEFAULT_CLOUD_URL, INITIAL_GAMES, INITIAL_ANNOUNCEMENTS, INITIAL_DEVICE_TYPES, INITIAL_GUIDES, GAME_CATEGORIES } from './defaultData';
import { 
  auth,
  onAuthStateChanged,
  User,
  logoutUser,
  saveUserDevicesToCloud,
  subscribeUserDevices,
  subscribeCloudGames, 
  subscribeCloudAnnouncements, 
  subscribeCloudDevices, 
  saveDevicesToCloud,
  subscribeCloudDeviceTypes,
  saveDeviceTypesToCloud,
  subscribeCloudCategories,
  saveCategoriesToCloud,
  subscribeCloudGuides,
  subscribeCloudBugReports,
  saveBugReportToCloud,
  deleteBugReportFromCloud,
  saveUserBgUrlToCloud,
  subscribeUserBgUrl,
  saveAppTitleToCloud,
  subscribeCloudAppTitle
} from './firebaseConfig';
import { getLanguage } from './languages';
import { Splash } from './components/Splash';
import { BottomNav } from './components/BottomNav';
import { HomeTab } from './components/HomeTab';
import { DevicesTab } from './components/DevicesTab';
import { ExploreTab } from './components/ExploreTab';
import { AccountTab } from './components/AccountTab';
import { SettingsTab } from './components/SettingsTab';
import { AdminTab } from './components/AdminTab';
import { CloudViewModal } from './components/CloudViewModal';
import {
  BuyDeviceModal,
  LoadingModal,
  GameListModal,
  RenameDeviceModal,
  GuidesModal,
  LaunchLoadingModal,
  BugReportModal,
  UserGuidePromptModal,
  AuthModal,
  LaunchTargetInfo,
} from './components/Modals';

export default function App() {
  const [showSplash, setShowSplash] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Language State
  const [langCode, setLangCode] = useState<string>(
    () => localStorage.getItem('app_language') || 'vi'
  );

  const handleSelectLanguage = useCallback((code: string) => {
    setLangCode(code);
    localStorage.setItem('app_language', code);
  }, []);

  const currentLang = getLanguage(langCode);
  const t = currentLang.translations;

  // Dark Mode State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('dark-mode-enabled') === 'yes';
  });


  // Admin Mode State (Persisted in LocalStorage)
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    return localStorage.getItem('cloudphone_admin_unlocked') === 'true';
  });

  // Default URL State
  const [defaultUrl, setDefaultUrl] = useState<string>(() => {
    return localStorage.getItem('cloud_default_url') || DEFAULT_CLOUD_URL;
  });

  // Devices State
  const [devices, setDevices] = useState<Device[]>(() => {
    const saved = localStorage.getItem('cloud_devices');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved devices:', e);
      }
    }
    return [];
  });

  // Device Types State
  const [deviceTypes, setDeviceTypes] = useState<DeviceType[]>(() => {
    const saved = localStorage.getItem('cloud_device_types');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved device types:', e);
      }
    }
    return INITIAL_DEVICE_TYPES;
  });

  // Explore Games State
  const [games, setGames] = useState<GameApp[]>(() => {
    const saved = localStorage.getItem('cloud_games');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved games:', e);
      }
    }
    return INITIAL_GAMES;
  });

  // Game Categories State
  const [categories, setCategories] = useState<{ value: string; label: string }[]>(() => {
    const saved = localStorage.getItem('cloud_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved categories:', e);
      }
    }
    return GAME_CATEGORIES;
  });

  // Home Announcements State
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('cloud_announcements');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error('Failed to parse saved announcements:', e);
      }
    }
    return INITIAL_ANNOUNCEMENTS;
  });

  // App Panel Title State (Default: 'Cloud Gaming Ultra Platform')
  const [appTitle, setAppTitle] = useState<string>(() => {
    return localStorage.getItem('cloud_app_title') || 'Cloud Gaming Ultra Platform';
  });

  // Guides State
  const [guides, setGuides] = useState<GuideItem[]>(() => {
    const saved = localStorage.getItem('cloud_guides');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter((g: any) => !['guide_gaming_ultra', 'guide_pro', 'guide_vpn'].includes(g.id));
        }
      } catch (e) {
        console.error('Failed to parse saved guides:', e);
      }
    }
    return INITIAL_GUIDES;
  });

  // Bug Reports State
  const [bugReports, setBugReports] = useState<BugReport[]>(() => {
    const saved = localStorage.getItem('cloud_bug_reports');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch (e) {
        console.error('Failed to parse saved bug reports:', e);
      }
    }
    return [];
  });

  // Active Device ID (for tracking total play time)
  const [activeDeviceId, setActiveDeviceId] = useState<number | null>(() => {
    const saved = localStorage.getItem('active_device_id');
    return saved ? parseInt(saved, 10) : null;
  });

  // Modals & Active Views (with Session Auto-Restore on reload)
  const [activeCloudUrl, setActiveCloudUrlState] = useState<string | null>(() => {
    return localStorage.getItem('active_cloud_url') || null;
  });

  // Full-screen Loading overlay before opening devices/apps
  const [launchTarget, setLaunchTarget] = useState<LaunchTargetInfo | null>(null);

  const setActiveCloudUrl = useCallback((url: string | null) => {
    setActiveCloudUrlState(url);
    if (url) {
      localStorage.setItem('active_cloud_url', url);
    } else {
      localStorage.removeItem('active_cloud_url');
      localStorage.removeItem('active_device_id');
      setActiveDeviceId(null);
    }
  }, []);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [isLoadingModalOpen, setIsLoadingModalOpen] = useState(false);
  const [isGameListModalOpen, setIsGameListModalOpen] = useState(false);
  const [renamingDevice, setRenamingDevice] = useState<Device | null>(null);
  const [isGuidesModalOpen, setIsGuidesModalOpen] = useState(false);
  const [selectedGuideId, setSelectedGuideId] = useState<string | undefined>(undefined);
  const [isBugReportModalOpen, setIsBugReportModalOpen] = useState(false);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Custom Website Background URL State
  const [bgUrl, setBgUrl] = useState<string>(() => {
    return localStorage.getItem('custom_bg_url') || '';
  });

  const handleUpdateBgUrl = useCallback((newUrl: string) => {
    setBgUrl(newUrl);
    if (newUrl) {
      localStorage.setItem('custom_bg_url', newUrl);
    } else {
      localStorage.removeItem('custom_bg_url');
    }
    if (currentUser) {
      saveUserBgUrlToCloud(currentUser.uid, newUrl);
    }
  }, [currentUser]);

  useEffect(() => {
    if (!currentUser) return;
    const unsub = subscribeUserBgUrl(currentUser.uid, (cloudBgUrl) => {
      if (cloudBgUrl !== undefined) {
        setBgUrl(cloudBgUrl);
        if (cloudBgUrl) {
          localStorage.setItem('custom_bg_url', cloudBgUrl);
        } else {
          localStorage.removeItem('custom_bg_url');
        }
      }
    });
    return () => unsub();
  }, [currentUser]);

  // Toast Helper
  const showToast = useCallback((msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2800);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  // Dark Mode Sync Effect
  useEffect(() => {
    const theme = darkMode ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', theme);
    document.body.setAttribute('data-theme', theme);
    document.body.className = theme;
  }, [darkMode]);

  // Onboarding User Guide Prompt State (Disabled by default as requested)
  const [isUserGuidePromptOpen, setIsUserGuidePromptOpen] = useState<boolean>(false);

  // Save devices to LocalStorage & User Cloud (if logged in)
  const saveDevices = useCallback((newDevices: Device[]) => {
    setDevices(newDevices);
    localStorage.setItem('cloud_devices', JSON.stringify(newDevices));
    if (currentUser) {
      saveUserDevicesToCloud(currentUser.uid, newDevices);
    }
  }, [currentUser]);

  // Save device types to LocalStorage & Cloud Firestore
  const saveDeviceTypes = useCallback((newTypes: DeviceType[]) => {
    setDeviceTypes(newTypes);
    localStorage.setItem('cloud_device_types', JSON.stringify(newTypes));
    saveDeviceTypesToCloud(newTypes);
  }, []);

  const handleAddDeviceType = useCallback(
    (dt: DeviceType) => {
      const updated = [...deviceTypes, dt];
      saveDeviceTypes(updated);
    },
    [deviceTypes, saveDeviceTypes]
  );

  const handleUpdateDeviceType = useCallback(
    (dt: DeviceType) => {
      const updated = deviceTypes.map((item) => (item.id === dt.id ? dt : item));
      saveDeviceTypes(updated);
    },
    [deviceTypes, saveDeviceTypes]
  );

  const handleDeleteDeviceType = useCallback(
    (dtId: string) => {
      const updated = deviceTypes.filter((item) => item.id !== dtId);
      saveDeviceTypes(updated);
    },
    [deviceTypes, saveDeviceTypes]
  );

  // Save games to LocalStorage
  const saveGames = useCallback((newGames: GameApp[]) => {
    setGames(newGames);
    localStorage.setItem('cloud_games', JSON.stringify(newGames));
  }, []);

  // Dark Mode Class Manager
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
      localStorage.setItem('dark-mode-enabled', 'yes');
    } else {
      document.body.classList.remove('dark-mode');
      localStorage.setItem('dark-mode-enabled', 'no');
    }
  }, [darkMode]);

  // Firebase Real-time Devices Subscription (User-specific or Global Admin)
  useEffect(() => {
    if (currentUser) {
      const unsubscribe = subscribeUserDevices(currentUser.uid, (userDevices) => {
        if (userDevices && Array.isArray(userDevices)) {
          setDevices(userDevices);
          localStorage.setItem('cloud_devices', JSON.stringify(userDevices));
        }
      });
      return () => unsubscribe();
    } else {
      const unsubscribe = subscribeCloudDevices((cloudDevices, cloudDefaultUrl) => {
        if (cloudDefaultUrl) {
          setDefaultUrl(cloudDefaultUrl);
          localStorage.setItem('cloud_default_url', cloudDefaultUrl);
        }
      });
      return () => unsubscribe();
    }
  }, [currentUser]);

  // Firebase Real-time Device Types Subscription
  useEffect(() => {
    const unsubscribe = subscribeCloudDeviceTypes((cloudTypes) => {
      if (cloudTypes && Array.isArray(cloudTypes) && cloudTypes.length > 0) {
        setDeviceTypes(cloudTypes);
        localStorage.setItem('cloud_device_types', JSON.stringify(cloudTypes));
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase Real-time Categories Subscription
  useEffect(() => {
    const unsubscribe = subscribeCloudCategories((cloudCats) => {
      if (cloudCats && Array.isArray(cloudCats) && cloudCats.length > 0) {
        setCategories(cloudCats);
        localStorage.setItem('cloud_categories', JSON.stringify(cloudCats));
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase Real-time Games Subscription
  useEffect(() => {
    const unsubscribe = subscribeCloudGames((cloudGames) => {
      setGames(() => {
        const map = new Map<string, GameApp>();
        // Seed default initial games
        INITIAL_GAMES.forEach((g) => map.set(g.id || g.name, g));
        // Apply cloud games snapshot (adds new ones, overwrites updated ones, removes deleted ones)
        if (cloudGames && Array.isArray(cloudGames)) {
          cloudGames.forEach((g: any) => {
            if (g.isDeleted) {
              map.delete(g.id || g.name);
            } else {
              map.set(g.id || g.name, g);
            }
          });
        }
        const combined = Array.from(map.values());
        localStorage.setItem('cloud_games', JSON.stringify(combined));
        return combined;
      });
    });

    return () => unsubscribe();
  }, []);

  // Firebase Real-time Announcements Subscription
  useEffect(() => {
    const unsubscribe = subscribeCloudAnnouncements((cloudAnnouncements) => {
      setAnnouncements(() => {
        const map = new Map<string, Announcement>();
        // Seed default initial announcements
        INITIAL_ANNOUNCEMENTS.forEach((a) => map.set(a.id, a));
        // Apply cloud announcements snapshot
        if (cloudAnnouncements && Array.isArray(cloudAnnouncements)) {
          cloudAnnouncements.forEach((a: any) => {
            if (a.isDeleted) {
              map.delete(a.id);
            } else {
              map.set(a.id, a);
            }
          });
        }
        const combined = Array.from(map.values());
        localStorage.setItem('cloud_announcements', JSON.stringify(combined));
        return combined;
      });
    });

    return () => unsubscribe();
  }, []);

  // Handle App Title update
  const handleUpdateAppTitle = useCallback((newTitle: string) => {
    setAppTitle(newTitle);
    localStorage.setItem('cloud_app_title', newTitle);
    saveAppTitleToCloud(newTitle);
    showToast(`🎉 Đã cập nhật tên app: "${newTitle}"`);
  }, [showToast]);

  // Firebase Real-time App Title Subscription
  useEffect(() => {
    const unsubscribe = subscribeCloudAppTitle((cloudTitle) => {
      if (cloudTitle) {
        setAppTitle(cloudTitle);
        localStorage.setItem('cloud_app_title', cloudTitle);
      }
    });

    return () => unsubscribe();
  }, []);

  // Firebase Real-time Guides Subscription
  useEffect(() => {
    const unsubscribe = subscribeCloudGuides((cloudGuides) => {
      setGuides(() => {
        const map = new Map<string, GuideItem>();
        // Seed default initial guides
        INITIAL_GUIDES.forEach((g) => map.set(g.id, g));
        // Apply cloud guides snapshot
        if (cloudGuides && Array.isArray(cloudGuides)) {
          cloudGuides.forEach((g: any) => {
            if (g.isDeleted || ['guide_gaming_ultra', 'guide_pro', 'guide_vpn'].includes(g.id)) {
              map.delete(g.id);
            } else {
              map.set(g.id, g);
            }
          });
        }
        const combined = Array.from(map.values()).filter((g) => !['guide_gaming_ultra', 'guide_pro', 'guide_vpn'].includes(g.id));
        localStorage.setItem('cloud_guides', JSON.stringify(combined));
        return combined;
      });
    });

    return () => unsubscribe();
  }, []);

  // Firebase Real-time Bug Reports Subscription
  useEffect(() => {
    const unsubscribe = subscribeCloudBugReports((cloudReports) => {
      if (cloudReports && Array.isArray(cloudReports)) {
        setBugReports(cloudReports);
        localStorage.setItem('cloud_bug_reports', JSON.stringify(cloudReports));
      }
    });

    return () => unsubscribe();
  }, []);

  // Active Device Play Time Tracker (Increments total play time in seconds)
  useEffect(() => {
    if (!activeCloudUrl || !activeDeviceId) return;

    const interval = setInterval(() => {
      setDevices((prevDevices) => {
        const updated = prevDevices.map((d) => {
          if (d.id === activeDeviceId) {
            const currentPlay = d.playTime || 0;
            return { ...d, playTime: currentPlay + 1 };
          }
          return d;
        });
        localStorage.setItem('cloud_devices', JSON.stringify(updated));
        return updated;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [activeCloudUrl, activeDeviceId]);

  // Guide Handlers
  const handleOpenGuidesModal = useCallback((guideId?: string) => {
    setSelectedGuideId(guideId);
    setIsGuidesModalOpen(true);
  }, []);

  const handleConfirmKnowGuide = useCallback(() => {
    localStorage.setItem('has_learned_how_to_use', 'true');
    setIsUserGuidePromptOpen(false);
  }, []);

  const handleConfirmNeedGuide = useCallback(() => {
    setIsUserGuidePromptOpen(false);
    handleOpenGuidesModal();
  }, [handleOpenGuidesModal]);

  const handleAddGuide = useCallback((guide: GuideItem) => {
    setGuides((prev) => {
      const updated = [...prev, guide];
      localStorage.setItem('cloud_guides', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleUpdateGuide = useCallback((updatedGuide: GuideItem) => {
    setGuides((prev) => {
      const updated = prev.map((g) => (g.id === updatedGuide.id ? updatedGuide : g));
      localStorage.setItem('cloud_guides', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleDeleteGuide = useCallback((guideId: string) => {
    setGuides((prev) => {
      const updated = prev.filter((g) => g.id !== guideId);
      localStorage.setItem('cloud_guides', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Announcement Handlers
  const handleAddAnnouncement = useCallback((newAnn: Announcement) => {
    setAnnouncements((prev) => {
      const updated = [newAnn, ...prev.filter((a) => a.id !== newAnn.id)];
      localStorage.setItem('cloud_announcements', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleUpdateAnnouncement = useCallback((updatedAnn: Announcement) => {
    setAnnouncements((prev) => {
      const updated = prev.map((a) => (a.id === updatedAnn.id ? updatedAnn : a));
      localStorage.setItem('cloud_announcements', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const handleDeleteAnnouncement = useCallback((annId: string) => {
    setAnnouncements((prev) => {
      const updated = prev.filter((a) => a.id !== annId);
      localStorage.setItem('cloud_announcements', JSON.stringify(updated));
      return updated;
    });
  }, []);

  // Bug Report Handlers
  const handleSubmitBugReport = useCallback(
    (targetName: string, description: string) => {
      const newReport: BugReport = {
        id: `bug_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        targetName,
        description,
        createdAt: Date.now(),
        status: 'pending',
        userId: currentUser?.uid,
        userEmail: currentUser?.email || '',
        userName: currentUser?.displayName || currentUser?.email || '',
      };
      setBugReports((prev) => {
        const updated = [newReport, ...prev];
        localStorage.setItem('cloud_bug_reports', JSON.stringify(updated));
        return updated;
      });
      saveBugReportToCloud(newReport);
      showToast(t?.bugSubmittedToast || '🎉 Đã gửi báo lỗi thành công tới Admin!');
      setIsBugReportModalOpen(false);
    },
    [currentUser, showToast, t]
  );

  const handleReplyBugReport = useCallback(
    (reportId: string, replyText: string) => {
      setBugReports((prev) => {
        const updated = prev.map((r) => {
          if (r.id === reportId) {
            const item: BugReport = {
              ...r,
              status: 'replied',
              adminReply: replyText,
              repliedAt: Date.now(),
            };
            saveBugReportToCloud(item);
            return item;
          }
          return r;
        });
        localStorage.setItem('cloud_bug_reports', JSON.stringify(updated));
        return updated;
      });
      showToast('✉️ Đã gửi câu trả lời tới người dùng!');
    },
    [showToast]
  );

  const handleDeleteBugReport = useCallback(
    (reportId: string) => {
      setBugReports((prev) => {
        const updated = prev.filter((r) => r.id !== reportId);
        localStorage.setItem('cloud_bug_reports', JSON.stringify(updated));
        return updated;
      });
      deleteBugReportFromCloud(reportId);
      showToast('🗑️ Đã xóa báo lỗi!');
    },
    [showToast]
  );

  // SECRET CODE ACTIVATION FUNCTION
  const activateAdminMode = useCallback(() => {
    setIsAdminUnlocked(true);
    localStorage.setItem('cloudphone_admin_unlocked', 'true');
    showToast(t.adminUnlockedToast);
    setCurrentTab('admin');
  }, [showToast, t]);

  // Lock Admin Mode
  const lockAdminMode = useCallback(() => {
    setIsAdminUnlocked(false);
    localStorage.removeItem('cloudphone_admin_unlocked');
    showToast(t.adminLockedToast);
    setCurrentTab('settings');
  }, [showToast, t]);

  // Add Device
  const handleAddDevice = useCallback(
    (props: Partial<Device> = {}) => {
      const id = Date.now();
      const newDevice: Device = {
        id,
        name: props.name || `Cluster VIP #${devices.length + 1}`,
        ram: props.ram || '8GB',
        android: props.android || 'Android 12',
        url: props.url || defaultUrl,
        deviceTypeId: props.deviceTypeId,
        openMode: props.openMode || (props.openExternal ? 'external' : 'iframe'),
        useProxy: props.useProxy !== undefined ? props.useProxy : true,
        created_at: Date.now(),
        status: props.status || 'active',
      };
      const updated = [...devices, newDevice];
      saveDevices(updated);
      showToast(t.deviceBoughtToast);
    },
    [devices, defaultUrl, saveDevices, showToast, t]
  );

  // Update Single Device
  const handleUpdateDevice = useCallback(
    (updated: Device) => {
      const next = devices.map((d) => (d.id === updated.id ? updated : d));
      saveDevices(next);
    },
    [devices, saveDevices]
  );

  // Delete Device
  const handleDeleteDevice = useCallback(
    (id: number) => {
      const next = devices.filter((d) => d.id !== id);
      saveDevices(next);
      showToast(t.deviceDeletedToast);
    },
    [devices, saveDevices, showToast, t]
  );

  // Delete Inactive / Broken Devices
  const handleDeleteInactiveDevices = useCallback(() => {
    const inactiveList = devices.filter(
      (d) => d.status === 'inactive' || d.status === 'offline' || !d.url || !d.url.trim()
    );

    if (inactiveList.length === 0) {
      showToast(t.noInactiveDevicesToast);
      return;
    }

    const activeDevices = devices.filter(
      (d) => d.status !== 'inactive' && d.status !== 'offline' && d.url && d.url.trim()
    );
    saveDevices(activeDevices);
    showToast(t.inactiveDevicesDeletedToast);
  }, [devices, saveDevices, showToast, t]);

  // Rename Device
  const handleSaveRename = useCallback(
    (deviceId: number, newName: string) => {
      const next = devices.map((d) =>
        d.id === deviceId ? { ...d, name: newName } : d
      );
      saveDevices(next);
    },
    [devices, saveDevices]
  );

  // Update Default URL
  const handleUpdateDefaultUrl = useCallback(
    (url: string) => {
      setDefaultUrl(url);
      localStorage.setItem('cloud_default_url', url);
      saveDevicesToCloud(devices, url);
    },
    [devices]
  );

  // Add Game to Khám Phá
  const handleAddGame = useCallback(
    (game: GameApp) => {
      const next = [game, ...games];
      saveGames(next);
    },
    [games, saveGames]
  );

  // Update Game
  const handleUpdateGame = useCallback(
    (updated: GameApp) => {
      const next = games.map((g) => (g.id === updated.id ? updated : g));
      saveGames(next);
    },
    [games, saveGames]
  );

  // Delete Game
  const handleDeleteGame = useCallback(
    (gameId: string) => {
      const next = games.filter((g) => g.id !== gameId);
      saveGames(next);
    },
    [games, saveGames]
  );

  // Add Category
  const handleAddCategory = useCallback(
    (cat: { value: string; label: string }) => {
      setCategories((prev) => {
        if (
          prev.some(
            (c) =>
              c.value.toLowerCase() === cat.value.toLowerCase() ||
              c.label.toLowerCase() === cat.label.toLowerCase()
          )
        ) {
          return prev;
        }
        const updated = [...prev, cat];
        localStorage.setItem('cloud_categories', JSON.stringify(updated));
        saveCategoriesToCloud(updated);
        return updated;
      });
      showToast(`🎉 Đã thêm thể loại: ${cat.label}`);
    },
    [showToast]
  );

  // Delete Category
  const handleDeleteCategory = useCallback(
    (val: string) => {
      setCategories((prev) => {
        const updated = prev.filter(
          (c) =>
            c.value.toLowerCase() !== val.toLowerCase() &&
            c.label.toLowerCase() !== val.toLowerCase()
        );
        localStorage.setItem('cloud_categories', JSON.stringify(updated));
        saveCategoriesToCloud(updated);
        return updated;
      });
      showToast('🗑️ Đã xóa thể loại');
    },
    [showToast]
  );

  // Buy Process Simulation
  const handleConfirmBuy = useCallback(
    (selectedType?: DeviceType) => {
      setIsBuyModalOpen(false);
      setIsLoadingModalOpen(true);

      setTimeout(() => {
        setIsLoadingModalOpen(false);
        if (selectedType) {
          handleAddDevice({
            name: `${selectedType.name} #${devices.length + 1}`,
            ram: selectedType.ram,
            android: selectedType.android,
            url: selectedType.url || defaultUrl,
            deviceTypeId: selectedType.id,
            openMode: selectedType.openMode || (selectedType.openExternal ? 'external' : 'iframe'),
            useProxy: selectedType.useProxy !== undefined ? selectedType.useProxy : true,
          });
        } else {
          handleAddDevice();
        }
        setCurrentTab('devices');
      }, 2200);
    },
    [handleAddDevice, devices.length, defaultUrl]
  );

  // Open Cloud Device with Ping-based Loading screen
  const handleEnterCloud = useCallback(
    (url: string, device?: Device) => {
      let rawUrl = url || defaultUrl;
      if (!rawUrl) return;

      const useProxy = device?.useProxy !== undefined ? device.useProxy : true;
      const openMode = device?.openMode || (device?.openExternal ? 'external' : 'iframe');

      if (device) {
        setActiveDeviceId(device.id);
        localStorage.setItem('active_device_id', device.id.toString());
      }

      setLaunchTarget({
        name: device?.name || 'Cloud Phone Device',
        url: rawUrl,
        device,
        openMode,
        useProxy,
        type: 'device',
      });
    },
    [defaultUrl]
  );

  // Open Game / Cloud URL with Ping-based Loading screen
  const handleOpenGame = useCallback(
    (gameOrUrl: GameApp | string) => {
      const url = typeof gameOrUrl === 'string' ? gameOrUrl : gameOrUrl.url || '';
      const name = typeof gameOrUrl === 'string' ? 'Ứng Dụng / Game Cloud' : gameOrUrl.name;
      if (!url) return;

      setLaunchTarget({
        name,
        url,
        openMode: 'iframe',
        useProxy: true,
        type: 'app',
      });
    },
    []
  );

  // Called when 100% loading completes in LaunchLoadingModal
  const handleLaunchComplete = useCallback(
    (targetInfo: LaunchTargetInfo) => {
      setLaunchTarget(null);

      let rawUrl = targetInfo.url;
      const useProxy = targetInfo.useProxy !== undefined ? targetInfo.useProxy : true;

      let targetUrl = rawUrl;
      if (useProxy) {
        if (!targetUrl.startsWith('https://levivietnam.vercel.app')) {
          targetUrl = `https://levivietnam.vercel.app/?url=${encodeURIComponent(targetUrl)}`;
        }
      } else {
        if (targetUrl.startsWith('https://levivietnam.vercel.app/?url=')) {
          targetUrl = decodeURIComponent(targetUrl.replace('https://levivietnam.vercel.app/?url=', ''));
        }
      }

      if (targetInfo.openMode === 'external') {
        window.open(targetUrl, '_blank');
        showToast('🚀 Đã mở ngoài tab mới!');
      } else {
        setActiveCloudUrl(targetUrl);
      }
    },
    [setActiveCloudUrl, showToast]
  );

  return (
    <div id="app" data-theme={darkMode ? 'dark' : 'light'} className={darkMode ? 'dark' : 'light'}>
      {/* Custom Background Image/GIF Overlay */}
      {bgUrl && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 0,
            backgroundImage: `url("${bgUrl}")`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            opacity: darkMode ? 0.35 : 0.22,
            pointerEvents: 'none',
            transition: 'background-image 0.5s ease-in-out, opacity 0.3s ease',
          }}
        />
      )}

      {/* Splash Screen */}
      {showSplash && <Splash onFinish={() => setShowSplash(false)} />}

      {/* Main Content Area */}
      <div id="content">
        {currentTab === 'home' && (
          <HomeTab
            onGoToDevices={() => setCurrentTab('devices')}
            isAdminUnlocked={isAdminUnlocked}
            onGoToAdmin={() => setCurrentTab('admin')}
            announcements={announcements}
            onOpenGuidesModal={handleOpenGuidesModal}
            appTitle={appTitle}
            onUpdateAppTitle={handleUpdateAppTitle}
            t={t}
          />
        )}

        {currentTab === 'devices' && (
          <DevicesTab
            devices={devices}
            onOpenBuyModal={() => setIsBuyModalOpen(true)}
            onEnterCloud={handleEnterCloud}
            onOpenRenameModal={(dev) => setRenamingDevice(dev)}
            onDeleteDevice={handleDeleteDevice}
            onDeleteInactiveDevices={handleDeleteInactiveDevices}
            defaultUrl={defaultUrl}
            t={t}
          />
        )}

        {currentTab === 'explore' && (
          <ExploreTab
            games={games}
            categories={categories}
            onOpenGame={handleOpenGame}
            onShowAllGames={() => setIsGameListModalOpen(true)}
            t={t}
          />
        )}

        {currentTab === 'account' && (
          <AccountTab
            currentUser={currentUser}
            bugReports={bugReports}
            userDevices={devices}
            onSubmitReport={handleSubmitBugReport}
            showToast={showToast}
            t={t}
          />
        )}

        {currentTab === 'settings' && (
          <SettingsTab
            darkMode={darkMode}
            onToggleDarkMode={() => setDarkMode(!darkMode)}
            onLogout={async () => {
              try {
                await logoutUser();
                setCurrentUser(null);
                showToast('🎉 Đã đăng xuất tài khoản thành công!');
              } catch (err: any) {
                console.error('Logout error:', err);
                setCurrentUser(null);
                showToast('Đã đăng xuất tài khoản');
              }
            }}
            isAdminUnlocked={isAdminUnlocked}
            onGoToAdmin={() => setCurrentTab('admin')}
            onLockAdmin={lockAdminMode}
            showToast={showToast}
            langCode={langCode}
            onSelectLanguage={handleSelectLanguage}
            onOpenBugReportModal={() => setIsBugReportModalOpen(true)}
            onOpenGuidesModal={handleOpenGuidesModal}
            currentUser={currentUser}
            onOpenAuthModal={() => setIsAuthModalOpen(true)}
            bgUrl={bgUrl}
            onChangeBgUrl={handleUpdateBgUrl}
          />
        )}

        {currentTab === 'admin' && isAdminUnlocked && (
          <AdminTab
            devices={devices}
            onUpdateDevice={handleUpdateDevice}
            onAddDevice={handleAddDevice}
            onDeleteDevice={handleDeleteDevice}
            onDeleteInactiveDevices={handleDeleteInactiveDevices}
            defaultUrl={defaultUrl}
            onUpdateDefaultUrl={handleUpdateDefaultUrl}
            deviceTypes={deviceTypes}
            onAddDeviceType={handleAddDeviceType}
            onUpdateDeviceType={handleUpdateDeviceType}
            onDeleteDeviceType={handleDeleteDeviceType}
            games={games}
            categories={categories}
            onAddCategory={handleAddCategory}
            onDeleteCategory={handleDeleteCategory}
            onAddGame={handleAddGame}
            onUpdateGame={handleUpdateGame}
            onDeleteGame={handleDeleteGame}
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            guides={guides}
            onAddGuide={handleAddGuide}
            onUpdateGuide={handleUpdateGuide}
            onDeleteGuide={handleDeleteGuide}
            bugReports={bugReports}
            onReplyBugReport={handleReplyBugReport}
            onDeleteBugReport={handleDeleteBugReport}
            showToast={showToast}
            t={t}
          />
        )}
      </div>

      {/* Bottom Navigation */}
      <BottomNav
        currentTab={currentTab}
        onSelectTab={(tab) => setCurrentTab(tab)}
        isAdminUnlocked={isAdminUnlocked}
        t={t}
      />

      {/* Cloud View Overlay */}
      {activeCloudUrl && (
        <CloudViewModal
          url={activeCloudUrl}
          title="Cloud Phone Sandbox"
          onClose={() => setActiveCloudUrl(null)}
          showToast={showToast}
          onOpenBugReportModal={() => setIsBugReportModalOpen(true)}
          t={t}
        />
      )}

      {/* Modals */}
      <BuyDeviceModal
        isOpen={isBuyModalOpen}
        onClose={() => setIsBuyModalOpen(false)}
        onConfirm={handleConfirmBuy}
        deviceTypes={deviceTypes}
        t={t}
      />

      <LoadingModal isOpen={isLoadingModalOpen} t={t} />

      <GameListModal
        isOpen={isGameListModalOpen}
        onClose={() => setIsGameListModalOpen(false)}
        games={games}
        categories={categories}
        onOpenGame={handleOpenGame}
        t={t}
      />

      <RenameDeviceModal
        device={renamingDevice}
        onClose={() => setRenamingDevice(null)}
        onSaveRename={handleSaveRename}
        onActivateAdmin={activateAdminMode}
        showToast={showToast}
        t={t}
      />

      <GuidesModal
        isOpen={isGuidesModalOpen}
        onClose={() => setIsGuidesModalOpen(false)}
        guides={guides}
        initialGuideId={selectedGuideId}
        showToast={showToast}
        t={t}
      />

      <BugReportModal
        isOpen={isBugReportModalOpen}
        onClose={() => setIsBugReportModalOpen(false)}
        onSubmitReport={handleSubmitBugReport}
        bugReports={bugReports}
        currentUser={currentUser}
        onOpenAuthModal={() => {
          setIsBugReportModalOpen(false);
          setIsAuthModalOpen(true);
        }}
        t={t}
      />

      {/* Auth Modal (Login / Register with Firebase) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        showToast={showToast}
        t={t}
      />

      {/* Onboarding Guide Prompt Modal */}
      <UserGuidePromptModal
        isOpen={isUserGuidePromptOpen}
        onConfirmKnow={handleConfirmKnowGuide}
        onConfirmNeedGuide={handleConfirmNeedGuide}
        t={t}
      />

      {/* Ping-based Launch Loading Screen Overlay */}
      <LaunchLoadingModal
        targetInfo={launchTarget}
        onClose={() => setLaunchTarget(null)}
        onComplete={handleLaunchComplete}
        t={t}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div
          id="pro-toast"
          style={{
            position: 'fixed',
            left: '50%',
            bottom: '100px',
            transform: 'translateX(-50%)',
            background: 'rgba(15, 23, 42, 0.95)',
            color: '#fff',
            padding: '12px 20px',
            borderRadius: '14px',
            zIndex: 9000,
            fontWeight: 700,
            fontSize: '0.9rem',
            boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
            border: '1px solid rgba(255,255,255,0.15)',
            maxWidth: '90%',
            textAlign: 'center',
            animation: 'fadeSlide 0.2s ease-out',
          }}
        >
          {toastMessage}
        </div>
      )}
    </div>
  );
}
