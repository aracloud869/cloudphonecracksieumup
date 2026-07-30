export interface Translations {
  // Bottom Nav
  homeTab: string;
  devicesTab: string;
  exploreTab: string;
  accountTab?: string;
  settingsTab: string;
  adminTab: string;

  // Settings
  settingsTitle: string;
  vipAccount: string;
  languageLabel: string;
  darkMode: string;
  adminMode: string;
  openAdmin: string;
  lockAdmin: string;
  logout: string;
  confirmLogout: string;
  languageChangedToast: string;
  on: string;
  off: string;

  // Home Tab
  homeTitle: string;
  heroSub: string;
  heroBtn: string;
  featuredServices: string;
  boostTitle: string;
  boostDesc: string;
  securityTitle: string;
  securityDesc: string;
  adminUnlockedTitle: string;
  adminUnlockedDesc: string;
  goToAdminBtn: string;

  // Announcements
  announcementsTitle?: string;
  announcementsSubtitle?: string;
  addAnnouncementBtn?: string;
  announcementTitleLabel?: string;
  announcementContentLabel?: string;
  announcementTypeLabel?: string;
  announcementImportantLabel?: string;
  noAnnouncements?: string;
  typeUpdate?: string;
  typeEvent?: string;
  typeInfo?: string;
  typeAlert?: string;
  deleteAnnouncementToast?: string;
  announcementAddedToast?: string;
  fromAdminBadge?: string;
  importantBadge?: string;

  // Explore Tab
  exploreTitle: string;
  searchPlaceholder: string;
  allGamesTitle: string;
  allGamesDesc: string;
  viewBtn: string;
  discordTitle: string;
  discordDesc: string;
  eventTitle: string;
  eventDesc: string;
  noGameFound: string;

  // Devices Tab
  devicesTitle: string;
  deleteInactiveBtn: string;
  addDeviceBtn: string;
  emptyDevicesTitle: string;
  emptyDevicesDesc: string;
  enterDeviceBtn: string;
  renameDeviceBtn: string;
  deleteDeviceBtn: string;
  activeStatus: string;
  inactiveStatus: string;

  // All Games Modal
  allGamesModalTitle: string;
  searchGamesModalPlaceholder: string;
  playBtn: string;
  closeBtn: string;
  cloudAppsAvailable: string;

  // Cloud Iframe Menu & Statuses
  cloudConnecting: string;
  cloudConnectingSandbox: string;
  cloudConnected: string;
  cloudReloading: string;
  cloudReloaded: string;
  cloudRestarting: string;
  cloudRestarted: string;
  assistBallTitle: string;
  reloadCloud: string;
  fullscreen: string;
  restartCloud: string;
  fakeIpOnToast: string;
  fakeIpOffToast: string;
  fakeIpMenuOn: string;
  fakeIpMenuOff: string;
  cleanRam: string;
  cleanRamCleaningToast: string;
  cleanRamSuccessToast: string;
  fpsMonitorOnToast: string;
  fpsMonitorOffToast: string;
  fpsMonitorMenuOn: string;
  fpsMonitorMenuOff: string;
  exitCloud: string;

  pingGreat?: string;
  pingGood?: string;
  pingFair?: string;
  latencyLabel?: string;

  guidesTitle?: string;
  guidesSubtitle?: string;
  copyLinkBtn?: string;
  copiedLinkToast?: string;
  videoGuideLabel?: string;
  manageGuides?: string;

  // Play Time
  playTimeLabel?: string;
  playTimeZero?: string;

  // Onboarding / User Guide Prompt
  userGuidePromptTitle?: string;
  userGuidePromptDesc?: string;
  btnNotYet?: string;
  btnAlreadyKnow?: string;

  // Bug Reports
  reportBugBtn?: string;
  bugReportTitle?: string;
  bugReportSubtitle?: string;
  targetNameLabel?: string;
  targetNamePlaceholder?: string;
  errorDescLabel?: string;
  errorDescPlaceholder?: string;
  sendReportBtn?: string;
  adminRepliesTitle?: string;
  noBugReports?: string;
  bugReportSentToast?: string;
  bugSubmittedToast?: string;
  adminReplyPlaceholder?: string;
  replyBtn?: string;
  bugStatusPending?: string;
  bugStatusReplied?: string;
  deleteBugReportBtn?: string;
  deleteBugToast?: string;
  adminReplySentToast?: string;
  viewBugReportsAdminTitle?: string;
  replyFromAdminLabel?: string;
  loginToReportWarning?: string;

  // Modals
  buyModalTitle: string;
  buyModalDesc: string;
  createNowBtn: string;
  loadingTitle: string;
  loadingDesc: string;
  renameModalTitle: string;
  renameModalDesc: string;
  deviceNamePlaceholder: string;

  // Notification / Push Toasts
  deviceBoughtToast: string;
  deviceRenamedToast: string;
  deviceDeletedToast: string;
  inactiveDevicesDeletedToast: string;
  noInactiveDevicesToast: string;
  adminUnlockedToast: string;
  adminLockedToast: string;

  // Common
  save: string;
  cancel: string;
}

export interface LanguageOption {
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  translations: Translations;
}

export const LANGUAGES: LanguageOption[] = [
  {
    code: 'vi',
    name: 'Tiếng Việt',
    nativeName: 'Tiếng Việt',
    flag: '🇻🇳',
    translations: {
      homeTab: 'Trang Chủ',
      devicesTab: 'Thiết Bị',
      exploreTab: 'Khám Phá',
      settingsTab: 'Cài Đặt',
      adminTab: 'Admin',

      settingsTitle: 'Cài Đặt',
      vipAccount: 'Tài khoản VIP',
      languageLabel: 'Ngôn ngữ',
      darkMode: 'Chế độ tối (Dark Mode)',
      adminMode: 'Chế độ Admin',
      openAdmin: 'Mở Admin',
      lockAdmin: 'Khóa',
      logout: 'Đăng xuất',
      confirmLogout: 'Bạn có chắc muốn đăng xuất?',
      languageChangedToast: 'Đã chuyển sang Tiếng Việt 🇻🇳',
      on: 'Bật',
      off: 'Tắt',

      homeTitle: 'Trang Chủ',
      heroSub: 'Treo game 24/7 • No lag • FPS cao • Không nóng máy',
      heroBtn: 'Tới thiết bị',
      featuredServices: 'Dịch vụ nổi bật',
      boostTitle: 'Tăng tốc Cloud 3X',
      boostDesc: 'Tối ưu FPS khi chơi game trên cloud.',
      securityTitle: 'Bảo mật cấp hệ thống',
      securityDesc: 'Mã hoá đường truyền + ẩn IP + sandbox isolation.',
      adminUnlockedTitle: 'Quản trị Admin đã mở',
      adminUnlockedDesc: 'Bạn có quyền chỉnh sửa liên kết thiết bị, thêm/sửa game ở mục Khám Phá và tự động upload cho tất cả người dùng!',
      goToAdminBtn: 'Đến Trang Admin',

      announcementsTitle: 'Thông Báo & Cập Nhật',
      announcementsSubtitle: 'Thông tin mới nhất từ quản trị viên',
      addAnnouncementBtn: 'Thêm Thông Báo',
      announcementTitleLabel: 'Tiêu đề thông báo',
      announcementContentLabel: 'Nội dung thông báo',
      announcementTypeLabel: 'Phân loại',
      announcementImportantLabel: 'Đánh dấu quan trọng (Ghim lên đầu)',
      noAnnouncements: 'Chưa có thông báo nào từ Admin',
      typeUpdate: 'Cập nhật',
      typeEvent: 'Sự kiện',
      typeInfo: 'Tin tức',
      typeAlert: 'Cảnh báo',
      deleteAnnouncementToast: '🗑️ Đã xoá thông báo!',
      announcementAddedToast: '🎉 Đã đăng thông báo mới cho tất cả người dùng!',
      fromAdminBadge: 'ADMIN',
      importantBadge: 'QUAN TRỌNG',

      exploreTitle: 'Khám Phá',
      searchPlaceholder: 'Tìm game hoặc ứng dụng...',
      allGamesTitle: 'Tất cả Game Cloud',
      allGamesDesc: 'Danh sách đầy đủ + tìm kiếm nâng cao.',
      viewBtn: 'Xem',
      discordTitle: 'Tham gia Discord',
      discordDesc: 'Nhóm cộng đồng hỗ trợ nhanh nhất.',
      eventTitle: 'Sự kiện Cloud Phone',
      eventDesc: 'Nhận quà mỗi ngày khi đăng nhập vào thiết bị.',
      noGameFound: 'Không tìm thấy ứng dụng phù hợp',

      devicesTitle: 'Thiết Bị',
      deleteInactiveBtn: 'Xóa TB Không HĐ',
      addDeviceBtn: 'Mua Device',
      emptyDevicesTitle: 'Chưa có thiết bị nào',
      emptyDevicesDesc: 'Bấm "Mua Device" để bắt đầu sử dụng Cloud Phone',
      enterDeviceBtn: 'Vào Device',
      renameDeviceBtn: 'Đổi tên',
      deleteDeviceBtn: 'Xóa',
      activeStatus: 'Hoạt động',
      inactiveStatus: 'Không hoạt động',

      allGamesModalTitle: 'Tất cả Game & Ứng Dụng',
      searchGamesModalPlaceholder: 'Tìm kiếm game, thể loại...',
      playBtn: 'Chơi',
      closeBtn: 'Đóng',
      cloudAppsAvailable: 'Có sẵn ứng dụng cloud',

      cloudConnecting: 'Đang kết nối...',
      cloudConnectingSandbox: 'Đang kết nối Cloud Sandbox...',
      cloudConnected: 'Đã kết nối',
      cloudReloading: 'Đang reload...',
      cloudReloaded: 'Đã reload',
      cloudRestarting: 'Khởi động lại...',
      cloudRestarted: 'Đã khởi động lại',
      assistBallTitle: 'Nút trợ năng (kéo thả hoặc nhấn để mở menu)',
      reloadCloud: 'Tải lại Cloud',
      fullscreen: 'Toàn màn hình',
      restartCloud: 'Khởi động lại',
      fakeIpOnToast: 'Bật Fake IP (ẩn danh)',
      fakeIpOffToast: 'Tắt Fake IP',
      fakeIpMenuOn: 'Fake IP ẩn danh',
      fakeIpMenuOff: 'Tắt Fake IP',
      cleanRam: 'Dọn RAM 3X',
      cleanRamCleaningToast: 'Dọn RAM 3X...',
      cleanRamSuccessToast: 'Dọn RAM hoàn tất! Giảm 1.2GB RAM',
      fpsMonitorOnToast: 'Bật FPS Monitor',
      fpsMonitorOffToast: 'Tắt FPS Monitor',
      fpsMonitorMenuOn: 'Bật FPS Monitor',
      fpsMonitorMenuOff: 'Tắt FPS Monitor',
      exitCloud: 'Thoát Cloud Sandbox',
      pingGreat: 'Xuất sắc',
      pingGood: 'Tốt',
      pingFair: 'Trung bình',
      latencyLabel: 'Độ trễ',
      guidesTitle: 'Hướng Dẫn Sử Dụng',
      guidesSubtitle: 'Video & tài liệu hướng dẫn chi tiết từng tính năng',
      copyLinkBtn: 'Sao chép đường link',
      copiedLinkToast: 'Đã sao chép đường link vào bộ nhớ tạm!',
      videoGuideLabel: 'Video Hướng Dẫn Chi Tiết',
      manageGuides: 'Quản lý Hướng Dẫn',

      playTimeLabel: 'Thời gian đã sử dụng:',
      playTimeZero: 'Chưa có dữ liệu',

      userGuidePromptTitle: 'Bạn đã biết sử dụng chưa?',
      userGuidePromptDesc: 'Nếu bạn là người mới, hãy xem hướng dẫn chi tiết để trải nghiệm Cloud Phone tốt nhất!',
      btnNotYet: 'Chưa',
      btnAlreadyKnow: 'Rồi',

      reportBugBtn: 'Báo Lỗi',
      bugReportTitle: 'Gửi Báo Lỗi Hệ Thống',
      bugReportSubtitle: 'Gửi phản hồi lỗi để Admin hỗ trợ & khắc phục',
      targetNameLabel: 'Dòng 1: Tên thiết bị / App / Game bạn bị lỗi',
      targetNamePlaceholder: 'Ví dụ: Cloud Phone Pro Max, Genshin Impact...',
      errorDescLabel: 'Dòng 2: Mô tả chi tiết lỗi gặp phải',
      errorDescPlaceholder: 'Mô tả nguyên nhân hoặc dấu hiệu lỗi...',
      sendReportBtn: 'Xác Nhận Gửi',
      adminRepliesTitle: 'Mục Tin Nhắn & Phản Hồi Từ Admin',
      noBugReports: 'Bạn chưa có báo lỗi nào',
      bugReportSentToast: '🎉 Đã gửi báo lỗi thành công tới Admin!',
      adminReplyPlaceholder: 'Nhập câu trả lời cho người dùng...',
      replyBtn: 'Gửi Trả Lời',
      bugStatusPending: 'Đang chờ xử lý',
      bugStatusReplied: 'Đã trả lời',
      deleteBugReportBtn: 'Xóa báo lỗi',
      deleteBugToast: '🗑️ Đã xóa báo lỗi!',
      adminReplySentToast: '✉️ Đã gửi câu trả lời tới người dùng!',
      viewBugReportsAdminTitle: 'Xem & Quản Lý Báo Lỗi Người Dùng',
      replyFromAdminLabel: 'Tin nhắn từ Admin:',

      buyModalTitle: 'Mua Cloud Device',
      buyModalDesc: 'Tạo thiết bị Cloud Phone PRO MAX mới với 8GB RAM, Android 12 cao cấp.',
      createNowBtn: 'Tạo Ngay',
      loadingTitle: 'Đang khởi tạo thiết bị...',
      loadingDesc: 'Đang cấp phát IP và cấu hình Sandbox',
      renameModalTitle: 'Đổi Tên Thiết Bị',
      renameModalDesc: 'Nhập tên mới cho thiết bị này.',
      deviceNamePlaceholder: 'Tên thiết bị...',

      deviceBoughtToast: '🎉 Đã thêm thiết bị mới thành công!',
      deviceRenamedToast: 'Đã đổi tên thiết bị thành công!',
      deviceDeletedToast: 'Đã xoá thiết bị!',
      inactiveDevicesDeletedToast: 'Đã xoá thiết bị không hoạt động!',
      noInactiveDevicesToast: 'Không có thiết bị không hoạt động nào!',
      adminUnlockedToast: 'Mở chế độ Admin thành công!',
      adminLockedToast: 'Đã khóa chế độ Admin!',

      save: 'Lưu',
      cancel: 'Hủy',
    },
  },
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    flag: '🇺🇸',
    translations: {
      homeTab: 'Home',
      devicesTab: 'Devices',
      exploreTab: 'Explore',
      settingsTab: 'Settings',
      adminTab: 'Admin',

      settingsTitle: 'Settings',
      vipAccount: 'VIP Account',
      languageLabel: 'Language',
      darkMode: 'Dark Mode',
      adminMode: 'Admin Mode',
      openAdmin: 'Open Admin',
      lockAdmin: 'Lock',
      logout: 'Log Out',
      confirmLogout: 'Are you sure you want to log out?',
      languageChangedToast: 'Switched to English 🇺🇸',
      on: 'On',
      off: 'Off',

      homeTitle: 'Home',
      heroSub: '24/7 AFK Gaming • No Lag • High FPS • Cool Device',
      heroBtn: 'Go to Devices',
      featuredServices: 'Featured Services',
      boostTitle: 'Cloud Speedup 3X',
      boostDesc: 'FPS optimization for cloud gaming.',
      securityTitle: 'System-Grade Security',
      securityDesc: 'Encrypted connection + IP mask + sandbox isolation.',
      adminUnlockedTitle: 'Admin Access Granted',
      adminUnlockedDesc: 'You can edit device links, manage games, and deploy updates instantly!',
      goToAdminBtn: 'Go to Admin Page',

      announcementsTitle: 'Announcements & Updates',
      announcementsSubtitle: 'Latest updates from administrator',
      addAnnouncementBtn: 'Add Announcement',
      announcementTitleLabel: 'Announcement Title',
      announcementContentLabel: 'Announcement Content',
      announcementTypeLabel: 'Category',
      announcementImportantLabel: 'Mark as Important (Pin to top)',
      noAnnouncements: 'No announcements from Admin yet',
      typeUpdate: 'Update',
      typeEvent: 'Event',
      typeInfo: 'News',
      typeAlert: 'Alert',
      deleteAnnouncementToast: '🗑️ Announcement deleted!',
      announcementAddedToast: '🎉 New announcement published for all users!',
      fromAdminBadge: 'ADMIN',
      importantBadge: 'IMPORTANT',

      exploreTitle: 'Explore',
      searchPlaceholder: 'Search games or apps...',
      allGamesTitle: 'All Cloud Games',
      allGamesDesc: 'Full library & advanced search.',
      viewBtn: 'View',
      discordTitle: 'Join Discord',
      discordDesc: 'Fastest support community.',
      eventTitle: 'Cloud Phone Events',
      eventDesc: 'Claim daily rewards when logging into devices.',
      noGameFound: 'No matching apps found',

      devicesTitle: 'Devices',
      deleteInactiveBtn: 'Clear Inactive',
      addDeviceBtn: 'Buy Device',
      emptyDevicesTitle: 'No devices yet',
      emptyDevicesDesc: 'Click "Buy Device" to start using Cloud Phone',
      enterDeviceBtn: 'Enter Device',
      renameDeviceBtn: 'Rename',
      deleteDeviceBtn: 'Delete',
      activeStatus: 'Active',
      inactiveStatus: 'Inactive',

      allGamesModalTitle: 'All Games & Apps',
      searchGamesModalPlaceholder: 'Search games, tags...',
      playBtn: 'Play',
      closeBtn: 'Close',
      cloudAppsAvailable: 'Available cloud apps',

      cloudConnecting: 'Connecting...',
      cloudConnectingSandbox: 'Connecting to Cloud Sandbox...',
      cloudConnected: 'Connected',
      cloudReloading: 'Reloading...',
      cloudReloaded: 'Reloaded',
      cloudRestarting: 'Restarting...',
      cloudRestarted: 'Restarted',
      assistBallTitle: 'Assistive Touch (drag or tap to open menu)',
      reloadCloud: 'Reload Cloud',
      fullscreen: 'Full Screen',
      restartCloud: 'Restart Cloud',
      fakeIpOnToast: 'Fake IP Enabled (Anonymous)',
      fakeIpOffToast: 'Fake IP Disabled',
      fakeIpMenuOn: 'Anonymous Fake IP',
      fakeIpMenuOff: 'Disable Fake IP',
      cleanRam: 'Clean RAM 3X',
      cleanRamCleaningToast: 'Cleaning RAM 3X...',
      cleanRamSuccessToast: 'RAM Cleaned! Freed 1.2GB RAM',
      fpsMonitorOnToast: 'FPS Monitor Enabled',
      fpsMonitorOffToast: 'FPS Monitor Disabled',
      fpsMonitorMenuOn: 'Enable FPS Monitor',
      fpsMonitorMenuOff: 'Disable FPS Monitor',
      exitCloud: 'Exit Cloud Sandbox',
      pingGreat: 'Great',
      pingGood: 'Good',
      pingFair: 'Fair',
      latencyLabel: 'Latency',

      playTimeLabel: 'Play time:',
      playTimeZero: 'No play time yet',

      userGuidePromptTitle: 'Do you know how to use it yet?',
      userGuidePromptDesc: 'If you are new, check out the detailed user guide for the best Cloud Phone experience!',
      btnNotYet: 'Not yet',
      btnAlreadyKnow: 'Already know',

      reportBugBtn: 'Report Bug',
      bugReportTitle: 'System Bug Report',
      bugReportSubtitle: 'Submit bug reports for Admin support',
      targetNameLabel: 'Line 1: Device / App / Game name with error',
      targetNamePlaceholder: 'e.g. Cloud Phone Pro Max, Genshin Impact...',
      errorDescLabel: 'Line 2: Detailed error description',
      errorDescPlaceholder: 'Describe the issue or symptoms encountered...',
      sendReportBtn: 'Submit Report',
      adminRepliesTitle: 'Admin Messages & Responses',
      noBugReports: 'No bug reports submitted yet',
      bugReportSentToast: '🎉 Bug report submitted to Admin!',
      adminReplyPlaceholder: 'Enter reply to user...',
      replyBtn: 'Send Reply',
      bugStatusPending: 'Pending',
      bugStatusReplied: 'Replied',
      deleteBugReportBtn: 'Delete report',
      deleteBugToast: '🗑️ Bug report deleted!',
      adminReplySentToast: '✉️ Reply sent to user!',
      viewBugReportsAdminTitle: 'View & Manage User Bug Reports',
      replyFromAdminLabel: 'Message from Admin:',

      buyModalTitle: 'Buy Cloud Device',
      buyModalDesc: 'Create a new Cloud Phone PRO MAX device with 8GB RAM, Android 12.',
      createNowBtn: 'Create Now',
      loadingTitle: 'Initializing Device...',
      loadingDesc: 'Allocating IP & configuring Sandbox',
      renameModalTitle: 'Rename Device',
      renameModalDesc: 'Enter a new name for this device.',
      deviceNamePlaceholder: 'Device name...',

      deviceBoughtToast: '🎉 New Cloud device added successfully!',
      deviceRenamedToast: 'Device renamed successfully!',
      deviceDeletedToast: 'Device deleted!',
      inactiveDevicesDeletedToast: 'Cleared inactive devices!',
      noInactiveDevicesToast: 'No inactive devices found!',
      adminUnlockedToast: 'Admin mode unlocked successfully!',
      adminLockedToast: 'Admin mode locked!',

      save: 'Save',
      cancel: 'Cancel',
    },
  },
  {
    code: 'zh',
    name: 'Chinese',
    nativeName: '中文 (简体)',
    flag: '🇨🇳',
    translations: {
      homeTab: '首页',
      devicesTab: '设备',
      exploreTab: '探索',
      settingsTab: '设置',
      adminTab: '管理员',

      settingsTitle: '设置',
      vipAccount: 'VIP 账户',
      languageLabel: '语言',
      darkMode: '深色模式',
      adminMode: '管理员模式',
      openAdmin: '打开管理员',
      lockAdmin: '锁定',
      logout: '退出登录',
      confirmLogout: '您确定要退出登录吗？',
      languageChangedToast: '已切换至 中文 🇨🇳',
      on: '开启',
      off: '关闭',

      homeTitle: '首页',
      heroSub: '24/7 挂机游戏 • 无卡顿 • 高帧率 • 设备不发热',
      heroBtn: '前往设备',
      featuredServices: '特色服务',
      boostTitle: '云端 3 倍加速',
      boostDesc: '优化云游戏帧率与流畅度。',
      securityTitle: '系统级安全保障',
      securityDesc: '数据加密传输 + IP 隐藏 + 沙盒隔离。',
      adminUnlockedTitle: '管理员权限已开启',
      adminUnlockedDesc: '您可以修改设备链接、添加和编辑游戏！',
      goToAdminBtn: '进入管理员页面',

      exploreTitle: '探索',
      searchPlaceholder: '搜索游戏或应用...',
      allGamesTitle: '所有云端游戏',
      allGamesDesc: '完整游戏库与高级搜索。',
      viewBtn: '查看',
      discordTitle: '加入 Discord',
      discordDesc: '官方玩家社区与快速支持。',
      eventTitle: '云手机福利活动',
      eventDesc: '每日登录设备可领取专属奖励。',
      noGameFound: '未找到相关应用',

      devicesTitle: '设备',
      deleteInactiveBtn: '清理离线设备',
      addDeviceBtn: '购买设备',
      emptyDevicesTitle: '暂无云设备',
      emptyDevicesDesc: '点击“购买设备”开始使用云手机',
      enterDeviceBtn: '进入设备',
      renameDeviceBtn: '重命名',
      deleteDeviceBtn: '删除',
      activeStatus: '运行中',
      inactiveStatus: '已离线',

      allGamesModalTitle: '所有游戏与应用',
      searchGamesModalPlaceholder: '搜索游戏名称、分类...',
      playBtn: '开始',
      closeBtn: '关闭',
      cloudAppsAvailable: '可用云端应用',

      cloudConnecting: '正在连接...',
      cloudConnectingSandbox: '正在连接云端沙盒...',
      cloudConnected: '已连接',
      cloudReloading: '正在刷新...',
      cloudReloaded: '已刷新',
      cloudRestarting: '正在重启...',
      cloudRestarted: '重启完成',
      assistBallTitle: '悬浮辅助球（可拖拽或点击打开菜单）',
      reloadCloud: '刷新云端',
      fullscreen: '全屏模式',
      restartCloud: '重启云手机',
      fakeIpOnToast: '已开启 IP 伪装 (匿名)',
      fakeIpOffToast: '已关闭 IP 伪装',
      fakeIpMenuOn: '匿名 IP 伪装',
      fakeIpMenuOff: '关闭 IP 伪装',
      cleanRam: '3倍 内存清理',
      cleanRamCleaningToast: '正在清理内存...',
      cleanRamSuccessToast: '内存清理完成！释放 1.2GB 内存',
      fpsMonitorOnToast: '已开启帧率显示',
      fpsMonitorOffToast: '已关闭帧率显示',
      fpsMonitorMenuOn: '开启 FPS 显示',
      fpsMonitorMenuOff: '关闭 FPS 显示',
      exitCloud: '退出云沙盒',

      buyModalTitle: '购买云设备',
      buyModalDesc: '创建配置为 8GB 内存、Android 12 的全新 PRO MAX 云手机。',
      createNowBtn: '立即创建',
      loadingTitle: '正在初始化设备...',
      loadingDesc: '正在分配 IP 并配置沙盒环境',
      renameModalTitle: '重命名设备',
      renameModalDesc: '为此设备输入新名称。',
      deviceNamePlaceholder: '设备名称...',

      deviceBoughtToast: '🎉 成功购买并添加新设备！',
      deviceRenamedToast: '设备重命名成功！',
      deviceDeletedToast: '设备已删除！',
      inactiveDevicesDeletedToast: '已清理无响应设备！',
      noInactiveDevicesToast: '没有需要清理的无响应设备！',
      adminUnlockedToast: '管理员模式已解锁！',
      adminLockedToast: '管理员模式已锁定！',

      save: '保存',
      cancel: '取消',
    },
  },
  {
    code: 'ja',
    name: 'Japanese',
    nativeName: '日本語',
    flag: '🇯🇵',
    translations: {
      homeTab: 'ホーム',
      devicesTab: 'デバイス',
      exploreTab: '探索',
      settingsTab: '設定',
      adminTab: '管理者',

      settingsTitle: '設定',
      vipAccount: 'VIP アカウント',
      languageLabel: '言語',
      darkMode: 'ダークモード',
      adminMode: '管理者モード',
      openAdmin: '管理者を開く',
      lockAdmin: 'ロック',
      logout: 'ログアウト',
      confirmLogout: 'ログアウトしてもよろしいですか？',
      languageChangedToast: '日本語に切り替えました 🇯🇵',
      on: 'オン',
      off: 'オフ',

      homeTitle: 'ホーム',
      heroSub: '24時間365日放置ゲー • ラグなし • 高FPS • 発熱なし',
      heroBtn: 'デバイスへ',
      featuredServices: '注目サービス',
      boostTitle: 'クラウド3倍加速',
      boostDesc: 'クラウドゲームのFPSを最適化。',
      securityTitle: 'システム級セキュリティ',
      securityDesc: '暗号化通信 + IP非表示 + サンドボックス孤立。',
      adminUnlockedTitle: '管理者モード有効',
      adminUnlockedDesc: 'デバイスの管理やゲームの追加・編集が可能です！',
      goToAdminBtn: '管理者ページへ',

      exploreTitle: '探索',
      searchPlaceholder: 'ゲームやアプリを検索...',
      allGamesTitle: 'すべてのクラウドゲーム',
      allGamesDesc: '全ゲームライブラリと詳細検索。',
      viewBtn: '見る',
      discordTitle: 'Discordに参加',
      discordDesc: '最速のサポートコミュニティ。',
      eventTitle: 'クラウドスマホイベント',
      eventDesc: 'デバイスログインで毎日特典をゲット。',
      noGameFound: '該当するアプリが見つかりません',

      devicesTitle: 'デバイス',
      deleteInactiveBtn: '停止中削除',
      addDeviceBtn: 'デバイス購入',
      emptyDevicesTitle: 'デバイスがありません',
      emptyDevicesDesc: '「デバイス購入」を押してクラウドスマホを開始',
      enterDeviceBtn: '起動する',
      renameDeviceBtn: '名前変更',
      deleteDeviceBtn: '削除',
      activeStatus: '稼働中',
      inactiveStatus: '停止中',

      allGamesModalTitle: '全ゲーム＆アプリ',
      searchGamesModalPlaceholder: 'ゲーム名・タグ検索...',
      playBtn: 'プレイ',
      closeBtn: '閉じる',
      cloudAppsAvailable: '利用可能なクラウドアプリ',

      cloudConnecting: '接続中...',
      cloudConnectingSandbox: 'クラウドサンドボックスへ接続中...',
      cloudConnected: '接続完了',
      cloudReloading: '再読み込み中...',
      cloudReloaded: '再読み込み完了',
      cloudRestarting: '再起動中...',
      cloudRestarted: '再起動完了',
      assistBallTitle: 'アシスタティブボール (ドラッグまたはタップでメニュー表示)',
      reloadCloud: 'クラウド再読み込み',
      fullscreen: '全画面表示',
      restartCloud: 'クラウド再起動',
      fakeIpOnToast: 'IP偽装（匿名）をオン',
      fakeIpOffToast: 'IP偽装をオフ',
      fakeIpMenuOn: '匿名IP偽装',
      fakeIpMenuOff: 'IP偽装オフ',
      cleanRam: 'メモリ3倍クリア',
      cleanRamCleaningToast: 'メモリを最適化中...',
      cleanRamSuccessToast: 'メモリ解放完了！1.2GB削減',
      fpsMonitorOnToast: 'FPSモニター有効化',
      fpsMonitorOffToast: 'FPSモニター無効化',
      fpsMonitorMenuOn: 'FPSモニター表示',
      fpsMonitorMenuOff: 'FPSモニター非表示',
      exitCloud: 'クラウド終了',

      buyModalTitle: 'クラウドデバイス購入',
      buyModalDesc: '8GB RAM、Android 12搭載のPRO MAX端末を作成します。',
      createNowBtn: '今すぐ作成',
      loadingTitle: 'デバイスを初期化中...',
      loadingDesc: 'IP割り当てとサンドボックス設定中',
      renameModalTitle: 'デバイス名の変更',
      renameModalDesc: '新しい名前を入力してください。',
      deviceNamePlaceholder: 'デバイス名...',

      deviceBoughtToast: '🎉 新しいクラウドデバイスを追加しました！',
      deviceRenamedToast: 'デバイス名を変更しました！',
      deviceDeletedToast: 'デバイスを削除しました！',
      inactiveDevicesDeletedToast: '停止中のデバイスをクリアしました！',
      noInactiveDevicesToast: '停止中のデバイスはありません！',
      adminUnlockedToast: '管理者モードを解除しました！',
      adminLockedToast: '管理者モードをロックしました！',

      save: '保存',
      cancel: 'キャンセル',
    },
  },
  {
    code: 'ko',
    name: 'Korean',
    nativeName: '한국어',
    flag: '🇰🇷',
    translations: {
      homeTab: '홈',
      devicesTab: '디바이스',
      exploreTab: '탐색',
      settingsTab: '설정',
      adminTab: '관리자',

      settingsTitle: '설정',
      vipAccount: 'VIP 계정',
      languageLabel: '언어',
      darkMode: '다크 모드',
      adminMode: '관리자 모드',
      openAdmin: '관리자 열기',
      lockAdmin: '잠금',
      logout: '로그아웃',
      confirmLogout: '로그아웃 하시겠습니까?',
      languageChangedToast: '한국어로 변경되었습니다 🇰🇷',
      on: '켜기',
      off: '끄기',

      homeTitle: '홈',
      heroSub: '24시간 무중단 방치형 게이밍 • 랙 없음 • 고프레임 • 발열 없음',
      heroBtn: '디바이스로 이동',
      featuredServices: '주요 서비스',
      boostTitle: '클라우드 3배 가속',
      boostDesc: '클라우드 게임 FPS 및 성능 최적화.',
      securityTitle: '시스템급 보안',
      securityDesc: '암호화 전송 + IP 숨김 + 샌드박스 격리.',
      adminUnlockedTitle: '관리자 권한 활성화',
      adminUnlockedDesc: '디바이스 링크 설정 및 게임 추가/수정이 가능합니다!',
      goToAdminBtn: '관리자 페이지로 이동',

      exploreTitle: '탐색',
      searchPlaceholder: '게임 또는 앱 검색...',
      allGamesTitle: '모든 클라우드 게임',
      allGamesDesc: '전체 라이브러리 및 상세 검색.',
      viewBtn: '보기',
      discordTitle: '디스코드 커뮤니티',
      discordDesc: '가장 빠른 지원 및 유저 커뮤니티.',
      eventTitle: '클라우드폰 이벤트',
      eventDesc: '매일 디바이스 접속 시 특별 보상 지급.',
      noGameFound: '검색 결과가 없습니다',

      devicesTitle: '디바이스',
      deleteInactiveBtn: '비활성 디바이스 정리',
      addDeviceBtn: '디바이스 구매',
      emptyDevicesTitle: '등록된 디바이스가 없습니다',
      emptyDevicesDesc: '"디바이스 구매"를 눌러 클라우드폰을 시작하세요',
      enterDeviceBtn: '접속하기',
      renameDeviceBtn: '이름 변경',
      deleteDeviceBtn: '삭제',
      activeStatus: '작동 중',
      inactiveStatus: '비활성화',

      allGamesModalTitle: '모든 게임 및 앱',
      searchGamesModalPlaceholder: '게임 이름, 태그 검색...',
      playBtn: '플레이',
      closeBtn: '닫기',
      cloudAppsAvailable: '이용 가능한 클라우드 앱',

      cloudConnecting: '연결 중...',
      cloudConnectingSandbox: '클라우드 샌드박스 연결 중...',
      cloudConnected: '연결 완료',
      cloudReloading: '새로고침 중...',
      cloudReloaded: '새로고침 완료',
      cloudRestarting: '재부팅 중...',
      cloudRestarted: '재부팅 완료',
      assistBallTitle: '플로팅 버턴 (드래그 또는 탭하여 메뉴 열기)',
      reloadCloud: '클라우드 새로고침',
      fullscreen: '전체 화면',
      restartCloud: '클라우드 재부팅',
      fakeIpOnToast: '익명 IP 우회 활성화',
      fakeIpOffToast: '익명 IP 우회 비활성화',
      fakeIpMenuOn: '익명 IP 우회',
      fakeIpMenuOff: 'IP 우회 끄기',
      cleanRam: 'RAM 3배 정리',
      cleanRamCleaningToast: 'RAM 최적화 중...',
      cleanRamSuccessToast: 'RAM 정리 완료! 1.2GB 확보',
      fpsMonitorOnToast: 'FPS 모니터 활성화',
      fpsMonitorOffToast: 'FPS 모니터 비활성화',
      fpsMonitorMenuOn: 'FPS 모니터 켜기',
      fpsMonitorMenuOff: 'FPS 모니터 끄기',
      exitCloud: '클라우드 종료',

      buyModalTitle: '클라우드 디바이스 구매',
      buyModalDesc: '8GB RAM, Android 12 사양의 고성능 클라우드폰을 생성합니다.',
      createNowBtn: '생성하기',
      loadingTitle: '디바이스 초기화 중...',
      loadingDesc: 'IP 할당 및 샌드박스 환경 설정 중',
      renameModalTitle: '디바이스 이름 변경',
      renameModalDesc: '새로운 디바이스 이름을 입력하세요.',
      deviceNamePlaceholder: '디바이스 이름...',

      deviceBoughtToast: '🎉 새 디바이스가 성공적으로 추가되었습니다!',
      deviceRenamedToast: '디바이스 이름이 변경되었습니다!',
      deviceDeletedToast: '디바이스가 삭제되었습니다!',
      inactiveDevicesDeletedToast: '비활성 디바이스를 모두 정리했습니다!',
      noInactiveDevicesToast: '정리할 비활성 디바이스가 없습니다!',
      adminUnlockedToast: '관리자 모드가 활성화되었습니다!',
      adminLockedToast: '관리자 모드가 잠겼습니다!',

      save: '저장',
      cancel: '취소',
    },
  },
  {
    code: 'es',
    name: 'Spanish',
    nativeName: 'Español',
    flag: '🇪🇸',
    translations: {
      homeTab: 'Inicio',
      devicesTab: 'Dispositivos',
      exploreTab: 'Explorar',
      settingsTab: 'Ajustes',
      adminTab: 'Admin',

      settingsTitle: 'Ajustes',
      vipAccount: 'Cuenta VIP',
      languageLabel: 'Idioma',
      darkMode: 'Modo Oscuro',
      adminMode: 'Modo Administrador',
      openAdmin: 'Abrir Admin',
      lockAdmin: 'Bloquear',
      logout: 'Cerrar Sesión',
      confirmLogout: '¿Estás seguro de que quieres cerrar sesión?',
      languageChangedToast: 'Cambiado a Español 🇪🇸',
      on: 'Activado',
      off: 'Desactivado',

      homeTitle: 'Inicio',
      heroSub: 'Juegos AFK 24/7 • Sin Lag • Alto FPS • Sin Calentamiento',
      heroBtn: 'Ir a Dispositivos',
      featuredServices: 'Servicios Destacados',
      boostTitle: 'Aceleración Cloud 3X',
      boostDesc: 'Optimización de FPS para juegos en la nube.',
      securityTitle: 'Seguridad de Nivel Sistema',
      securityDesc: 'Conexión cifrada + IP oculta + aislamiento sandbox.',
      adminUnlockedTitle: 'Acceso Admin Concedido',
      adminUnlockedDesc: '¡Puedes editar enlaces de dispositivos y administrar juegos!',
      goToAdminBtn: 'Ir a Administración',

      exploreTitle: 'Explorar',
      searchPlaceholder: 'Buscar juegos o apps...',
      allGamesTitle: 'Todos los Juegos Cloud',
      allGamesDesc: 'Catálogo completo y búsqueda avanzada.',
      viewBtn: 'Ver',
      discordTitle: 'Unirse a Discord',
      discordDesc: 'La comunidad de soporte más rápida.',
      eventTitle: 'Eventos Cloud Phone',
      eventDesc: 'Obtén recompensas diarias al iniciar sesión.',
      noGameFound: 'No se encontraron aplicaciones',

      devicesTitle: 'Dispositivos',
      deleteInactiveBtn: 'Borrar Inactivos',
      addDeviceBtn: 'Comprar Dispositivo',
      emptyDevicesTitle: 'Sin dispositivos aún',
      emptyDevicesDesc: 'Haz clic en "Comprar Dispositivo" para comenzar',
      enterDeviceBtn: 'Entrar',
      renameDeviceBtn: 'Renombrar',
      deleteDeviceBtn: 'Eliminar',
      activeStatus: 'Activo',
      inactiveStatus: 'Inactivo',

      allGamesModalTitle: 'Todos los Juegos y Apps',
      searchGamesModalPlaceholder: 'Buscar juegos, etiquetas...',
      playBtn: 'Jugar',
      closeBtn: 'Cerrar',
      cloudAppsAvailable: 'Aplicaciones disponibles en la nube',

      cloudConnecting: 'Conectando...',
      cloudConnectingSandbox: 'Conectando al Sandbox Nube...',
      cloudConnected: 'Conectado',
      cloudReloading: 'Recargando...',
      cloudReloaded: 'Recargado',
      cloudRestarting: 'Reiniciando...',
      cloudRestarted: 'Reiniciado',
      assistBallTitle: 'Botón de asistencia (arrastra o toca para abrir menú)',
      reloadCloud: 'Recargar Nube',
      fullscreen: 'Pantalla Completa',
      restartCloud: 'Reiniciar Nube',
      fakeIpOnToast: 'IP Falsa Activada (Anónimo)',
      fakeIpOffToast: 'IP Falsa Desactivada',
      fakeIpMenuOn: 'IP Falsa Anónima',
      fakeIpMenuOff: 'Desactivar IP Falsa',
      cleanRam: 'Limpiar RAM 3X',
      cleanRamCleaningToast: 'Limpiando RAM...',
      cleanRamSuccessToast: '¡RAM Limpiada! Liberado 1.2GB RAM',
      fpsMonitorOnToast: 'Monitor FPS Activado',
      fpsMonitorOffToast: 'Monitor FPS Desactivado',
      fpsMonitorMenuOn: 'Activar Monitor FPS',
      fpsMonitorMenuOff: 'Desactivar Monitor FPS',
      exitCloud: 'Salir de la Nube',

      buyModalTitle: 'Comprar Dispositivo Cloud',
      buyModalDesc: 'Crea un nuevo Cloud Phone PRO MAX con 8GB RAM, Android 12.',
      createNowBtn: 'Crear Ahora',
      loadingTitle: 'Inicializando Dispositivo...',
      loadingDesc: 'Asignando IP y configurando Sandbox',
      renameModalTitle: 'Renombrar Dispositivo',
      renameModalDesc: 'Ingresa un nuevo nombre para este dispositivo.',
      deviceNamePlaceholder: 'Nombre del dispositivo...',

      deviceBoughtToast: '🎉 ¡Nuevo dispositivo en la nube añadido!',
      deviceRenamedToast: '¡Nombre cambiado con éxito!',
      deviceDeletedToast: '¡Dispositivo eliminado!',
      inactiveDevicesDeletedToast: '¡Dispositivos inactivos limpiados!',
      noInactiveDevicesToast: '¡No hay dispositivos inactivos!',
      adminUnlockedToast: '¡Modo administrador desbloqueado!',
      adminLockedToast: '¡Modo administrador bloqueado!',

      save: 'Guardar',
      cancel: 'Cancelar',
    },
  },
  {
    code: 'fr',
    name: 'French',
    nativeName: 'Français',
    flag: '🇫🇷',
    translations: {
      homeTab: 'Accueil',
      devicesTab: 'Appareils',
      exploreTab: 'Explorer',
      settingsTab: 'Paramètres',
      adminTab: 'Admin',

      settingsTitle: 'Paramètres',
      vipAccount: 'Compte VIP',
      languageLabel: 'Langue',
      darkMode: 'Mode Sombre',
      adminMode: 'Mode Administrateur',
      openAdmin: 'Ouvrir Admin',
      lockAdmin: 'Verrouiller',
      logout: 'Déconnexion',
      confirmLogout: 'Êtes-vous sûr de vouloir vous déconnecter ?',
      languageChangedToast: 'Passé en Français 🇫🇷',
      on: 'Activé',
      off: 'Désactivé',

      homeTitle: 'Accueil',
      heroSub: 'Jeu AFK 24/7 • Sans Latence • FPS Élevé • Pas de Surchauffe',
      heroBtn: 'Voir Appareils',
      featuredServices: 'Services En Vedette',
      boostTitle: 'Accélération Cloud 3X',
      boostDesc: 'Optimisation du FPS pour le jeu sur le cloud.',
      securityTitle: 'Sécurité de Niveau Système',
      securityDesc: 'Cryptage de données + Masquage IP + Isolation Sandbox.',
      adminUnlockedTitle: 'Accès Admin Activé',
      adminUnlockedDesc: 'Vous pouvez modifier les appareils et ajouter des jeux !',
      goToAdminBtn: 'Page Administration',

      exploreTitle: 'Explorer',
      searchPlaceholder: 'Chercher des jeux ou applications...',
      allGamesTitle: 'Tous les Jeux Cloud',
      allGamesDesc: 'Catalogue complet & recherche avancée.',
      viewBtn: 'Voir',
      discordTitle: 'Rejoindre Discord',
      discordDesc: 'La communauté de support la plus rapide.',
      eventTitle: 'Événements Cloud Phone',
      eventDesc: 'Récompenses quotidiennes à la connexion.',
      noGameFound: 'Aucune application trouvée',

      devicesTitle: 'Appareils',
      deleteInactiveBtn: 'Effacer Inactifs',
      addDeviceBtn: 'Acheter Appareil',
      emptyDevicesTitle: 'Aucun appareil disponible',
      emptyDevicesDesc: 'Cliquez sur "Acheter Appareil" pour démarrer',
      enterDeviceBtn: 'Ouvrir',
      renameDeviceBtn: 'Renommer',
      deleteDeviceBtn: 'Supprimer',
      activeStatus: 'Actif',
      inactiveStatus: 'Inactif',

      allGamesModalTitle: 'Tous les Jeux & Applications',
      searchGamesModalPlaceholder: 'Rechercher par nom, catégorie...',
      playBtn: 'Jouer',
      closeBtn: 'Fermer',
      cloudAppsAvailable: 'Applications cloud disponibles',

      cloudConnecting: 'Connexion...',
      cloudConnectingSandbox: 'Connexion au Sandbox Cloud...',
      cloudConnected: 'Connecté',
      cloudReloading: 'Rechargement...',
      cloudReloaded: 'Rechargé',
      cloudRestarting: 'Redémarrage...',
      cloudRestarted: 'Redémarré',
      assistBallTitle: 'Bouton d assistance (glisser ou toucher pour ouvrir le menu)',
      reloadCloud: 'Recharger le Cloud',
      fullscreen: 'Plein écran',
      restartCloud: 'Redémarrer le Cloud',
      fakeIpOnToast: 'Faux IP Activé (Anonyme)',
      fakeIpOffToast: 'Faux IP Désactivé',
      fakeIpMenuOn: 'Faux IP Anonyme',
      fakeIpMenuOff: 'Désactiver Faux IP',
      cleanRam: 'Nettoyer RAM 3X',
      cleanRamCleaningToast: 'Nettoyage de la RAM...',
      cleanRamSuccessToast: 'RAM Nettoyée ! 1.2Go de RAM libéré',
      fpsMonitorOnToast: 'Moniteur FPS Activé',
      fpsMonitorOffToast: 'Moniteur FPS Désactivé',
      fpsMonitorMenuOn: 'Activer le Moniteur FPS',
      fpsMonitorMenuOff: 'Désactiver le Moniteur FPS',
      exitCloud: 'Quitter le Cloud',

      buyModalTitle: 'Acheter un appareil Cloud',
      buyModalDesc: 'Créer un nouvel appareil Cloud Phone PRO MAX avec 8Go RAM, Android 12.',
      createNowBtn: 'Créer maintenant',
      loadingTitle: 'Initialisation de l appareil...',
      loadingDesc: 'Allocation d IP et configuration du Sandbox',
      renameModalTitle: 'Renommer l appareil',
      renameModalDesc: 'Saisissez un nouveau nom pour cet appareil.',
      deviceNamePlaceholder: 'Nom de l appareil...',

      deviceBoughtToast: '🎉 Nouvel appareil cloud ajouté avec succès !',
      deviceRenamedToast: 'Appareil renommé avec succès !',
      deviceDeletedToast: 'Appareil supprimé !',
      inactiveDevicesDeletedToast: 'Appareils inactifs nettoyés !',
      noInactiveDevicesToast: 'Aucun appareil inactif trouvé !',
      adminUnlockedToast: 'Mode administrateur déverrouillé !',
      adminLockedToast: 'Mode administrateur verrouillé !',

      save: 'Enregistrer',
      cancel: 'Annuler',
    },
  },
  {
    code: 'de',
    name: 'German',
    nativeName: 'Deutsch',
    flag: '🇩🇪',
    translations: {
      homeTab: 'Startseite',
      devicesTab: 'Geräte',
      exploreTab: 'Entdecken',
      settingsTab: 'Einstellungen',
      adminTab: 'Admin',

      settingsTitle: 'Einstellungen',
      vipAccount: 'VIP-Konto',
      languageLabel: 'Sprache',
      darkMode: 'Dunkelmodus',
      adminMode: 'Admin-Modus',
      openAdmin: 'Admin öffnen',
      lockAdmin: 'Sperren',
      logout: 'Abmelden',
      confirmLogout: 'Möchten Sie sich wirklich abmelden?',
      languageChangedToast: 'Gewechselt zu Deutsch 🇩🇪',
      on: 'Ein',
      off: 'Aus',

      homeTitle: 'Startseite',
      heroSub: '24/7 AFK Gaming • Kein Lag • Hohe FPS • Kein Überhitzen',
      heroBtn: 'Zu den Geräten',
      featuredServices: 'Beliebte Dienste',
      boostTitle: 'Cloud Boost 3X',
      boostDesc: 'FPS-Optimierung für Cloud Gaming.',
      securityTitle: 'Sicherheit auf Systemebene',
      securityDesc: 'Verschlüsselte Verbindung + IP-Schutz + Sandbox.',
      adminUnlockedTitle: 'Admin-Zugriff Aktiviert',
      adminUnlockedDesc: 'Verwalten Sie Gerätelinks und neue Spiele!',
      goToAdminBtn: 'Zur Admin-Seite',

      exploreTitle: 'Entdecken',
      searchPlaceholder: 'Spiele oder Apps suchen...',
      allGamesTitle: 'Alle Cloud-Spiele',
      allGamesDesc: 'Vollständige Bibliothek & erweiterte Suche.',
      viewBtn: 'Ansehen',
      discordTitle: 'Discord Beitreten',
      discordDesc: 'Die schnellste Support-Community.',
      eventTitle: 'Cloud Phone Events',
      eventDesc: 'Tägliche Belohnungen beim Anmelden.',
      noGameFound: 'Keine passenden Apps gefunden',

      devicesTitle: 'Geräte',
      deleteInactiveBtn: 'Inaktive Löschen',
      addDeviceBtn: 'Gerät Kaufen',
      emptyDevicesTitle: 'Noch keine Geräte',
      emptyDevicesDesc: 'Klicken Sie auf "Gerät Kaufen" um zu starten',
      enterDeviceBtn: 'Starten',
      renameDeviceBtn: 'Umbennen',
      deleteDeviceBtn: 'Löschen',
      activeStatus: 'Aktiv',
      inactiveStatus: 'Inaktiv',

      allGamesModalTitle: 'Alle Spiele & Apps',
      searchGamesModalPlaceholder: 'Spiele, Tags suchen...',
      playBtn: 'Spielen',
      closeBtn: 'Schließen',
      cloudAppsAvailable: 'Verfügbare Cloud-Apps',

      cloudConnecting: 'Verbinden...',
      cloudConnectingSandbox: 'Verbindung zur Cloud Sandbox...',
      cloudConnected: 'Verbunden',
      cloudReloading: 'Neu laden...',
      cloudReloaded: 'Neu geladen',
      cloudRestarting: 'Neustart...',
      cloudRestarted: 'Neugestartet',
      assistBallTitle: 'Assistive Button (ziehen oder tippen für Menü)',
      reloadCloud: 'Cloud Neu Laden',
      fullscreen: 'Vollbild',
      restartCloud: 'Cloud Neustarten',
      fakeIpOnToast: 'Fake IP Aktiviert (Anonym)',
      fakeIpOffToast: 'Fake IP Deaktiviert',
      fakeIpMenuOn: 'Anonyme Fake IP',
      fakeIpMenuOff: 'Fake IP Ausschalten',
      cleanRam: 'RAM 3X Bereinigen',
      cleanRamCleaningToast: 'RAM wird bereinigt...',
      cleanRamSuccessToast: 'RAM Bereinigt! 1.2GB RAM freigegeben',
      fpsMonitorOnToast: 'FPS Monitor Aktiviert',
      fpsMonitorOffToast: 'FPS Monitor Deaktiviert',
      fpsMonitorMenuOn: 'FPS Monitor Einschalten',
      fpsMonitorMenuOff: 'FPS Monitor Ausschalten',
      exitCloud: 'Cloud Beenden',

      buyModalTitle: 'Cloud-Gerät Kaufen',
      buyModalDesc: 'Erstelle ein neues Cloud Phone PRO MAX Gerät mit 8GB RAM, Android 12.',
      createNowBtn: 'Jetzt Erstellen',
      loadingTitle: 'Gerät wird initialisiert...',
      loadingDesc: 'IP-Zuweisung & Sandbox-Konfiguration',
      renameModalTitle: 'Gerät Umbenennen',
      renameModalDesc: 'Gib einen neuen Namen für dieses Gerät ein.',
      deviceNamePlaceholder: 'Gerätename...',

      deviceBoughtToast: '🎉 Neues Cloud-Gerät erfolgreich hinzugefügt!',
      deviceRenamedToast: 'Gerät erfolgreich umbenannt!',
      deviceDeletedToast: 'Gerät gelöscht!',
      inactiveDevicesDeletedToast: 'Inaktive Geräte bereinigt!',
      noInactiveDevicesToast: 'Keine inaktiven Geräte gefunden!',
      adminUnlockedToast: 'Admin-Modus freigeschaltet!',
      adminLockedToast: 'Admin-Modus gesperrt!',

      save: 'Speichern',
      cancel: 'Abbrechen',
    },
  },
  {
    code: 'ru',
    name: 'Russian',
    nativeName: 'Русский',
    flag: '🇷🇺',
    translations: {
      homeTab: 'Главная',
      devicesTab: 'Устройства',
      exploreTab: 'Обзор',
      settingsTab: 'Настройки',
      adminTab: 'Админ',

      settingsTitle: 'Настройки',
      vipAccount: 'VIP Аккаунт',
      languageLabel: 'Язык',
      darkMode: 'Темный режим',
      adminMode: 'Режим администратора',
      openAdmin: 'Открыть админ',
      lockAdmin: 'Заблокировать',
      logout: 'Выйти',
      confirmLogout: 'Вы уверены, что хотите выйти?',
      languageChangedToast: 'Переключено на Русский 🇷🇺',
      on: 'Вкл',
      off: 'Выкл',

      homeTitle: 'Главная',
      heroSub: '24/7 АФК Игры • Без лагов • Высокий FPS • Без перегрева',
      heroBtn: 'К устройствам',
      featuredServices: 'Популярные сервисы',
      boostTitle: 'Ускорение Cloud 3X',
      boostDesc: 'Оптимизация FPS для облачного гейминга.',
      securityTitle: 'Системная безопасность',
      securityDesc: 'Шифрование трафика + скрытие IP + песочница.',
      adminUnlockedTitle: 'Доступ администратора открыт',
      adminUnlockedDesc: 'Управляйте устройствами и добавляйте новые игры!',
      goToAdminBtn: 'Перейти в Админку',

      exploreTitle: 'Обзор',
      searchPlaceholder: 'Поиск игр и приложений...',
      allGamesTitle: 'Все Облачные Игры',
      allGamesDesc: 'Полная библиотека и расширенный поиск.',
      viewBtn: 'Смотреть',
      discordTitle: 'Discord Сообщество',
      discordDesc: 'Быстрая поддержка и общение.',
      eventTitle: 'События Cloud Phone',
      eventDesc: 'Ежедневные награды за вход в устройство.',
      noGameFound: 'Приложения не найдены',

      devicesTitle: 'Устройства',
      deleteInactiveBtn: 'Очистить неактивные',
      addDeviceBtn: 'Купить устройство',
      emptyDevicesTitle: 'Устройств пока нет',
      emptyDevicesDesc: 'Нажмите "Купить устройство", чтобы начать',
      enterDeviceBtn: 'Войти',
      renameDeviceBtn: 'Переименовать',
      deleteDeviceBtn: 'Удалить',
      activeStatus: 'Активен',
      inactiveStatus: 'Неактивен',

      allGamesModalTitle: 'Все Игры и Приложения',
      searchGamesModalPlaceholder: 'Поиск игр, тегов...',
      playBtn: 'Играть',
      closeBtn: 'Закрыть',
      cloudAppsAvailable: 'Доступные облачные приложения',

      cloudConnecting: 'Подключение...',
      cloudConnectingSandbox: 'Подключение к облачной песочнице...',
      cloudConnected: 'Подключено',
      cloudReloading: 'Перезагрузка...',
      cloudReloaded: 'Перезагружено',
      cloudRestarting: 'Перезапуск...',
      cloudRestarted: 'Перезапущено',
      assistBallTitle: 'Вспомогательная кнопка (перетащите или нажмите для меню)',
      reloadCloud: 'Обновить облако',
      fullscreen: 'На весь экран',
      restartCloud: 'Перезапустить облако',
      fakeIpOnToast: 'Fake IP Включен (Анонимно)',
      fakeIpOffToast: 'Fake IP Выключен',
      fakeIpMenuOn: 'Анонимный Fake IP',
      fakeIpMenuOff: 'Выключить Fake IP',
      cleanRam: 'Очистка ОЗУ 3X',
      cleanRamCleaningToast: 'Очистка ОЗУ...',
      cleanRamSuccessToast: 'ОЗУ очищено! Освобождено 1.2 ГБ ОЗУ',
      fpsMonitorOnToast: 'Монитор FPS включен',
      fpsMonitorOffToast: 'Монитор FPS выключен',
      fpsMonitorMenuOn: 'Включить монитор FPS',
      fpsMonitorMenuOff: 'Выключить монитор FPS',
      exitCloud: 'Выйти из облака',

      buyModalTitle: 'Купить облачное устройство',
      buyModalDesc: 'Создайте новое устройство Cloud Phone PRO MAX с 8ГБ ОЗУ и Android 12.',
      createNowBtn: 'Создать сейчас',
      loadingTitle: 'Инициализация устройства...',
      loadingDesc: 'Выделение IP и настройка песочницы',
      renameModalTitle: 'Переименовать устройство',
      renameModalDesc: 'Введите новое имя для этого устройства.',
      deviceNamePlaceholder: 'Имя устройства...',

      deviceBoughtToast: '🎉 Новое облачное устройство успешно добавлено!',
      deviceRenamedToast: 'Имя устройства успешно изменено!',
      deviceDeletedToast: 'Устройство удалено!',
      inactiveDevicesDeletedToast: 'Неактивные устройства удалены!',
      noInactiveDevicesToast: 'Неактивных устройств не найдено!',
      adminUnlockedToast: 'Режим администратора разблокирован!',
      adminLockedToast: 'Режим администратора заблокирован!',

      save: 'Сохранить',
      cancel: 'Отмена',
    },
  },
  {
    code: 'th',
    name: 'Thai',
    nativeName: 'ไทย',
    flag: '🇹🇭',
    translations: {
      homeTab: 'หน้าแรก',
      devicesTab: 'อุปกรณ์',
      exploreTab: 'สำรวจ',
      settingsTab: 'การตั้งค่า',
      adminTab: 'แอดมิน',

      settingsTitle: 'การตั้งค่า',
      vipAccount: 'บัญชี VIP',
      languageLabel: 'ภาษา',
      darkMode: 'โหมดมืด',
      adminMode: 'โหมดผู้ดูแลระบบ',
      openAdmin: 'เปิดผู้ดูแลระบบ',
      lockAdmin: 'ล็อก',
      logout: 'ออกจากระบบ',
      confirmLogout: 'คุณแน่ใจหรือไม่ว่าต้องการออกจากระบบ?',
      languageChangedToast: 'เปลี่ยนเป็นภาษาไทยแล้ว 🇹🇭',
      on: 'เปิด',
      off: 'ปิด',

      homeTitle: 'หน้าแรก',
      heroSub: 'ปล่อยจอเล่นเกม 24/7 • ไม่กระตุก • FPS สูง • เครื่องไม่ร้อน',
      heroBtn: 'ไปที่อุปกรณ์',
      featuredServices: 'บริการเด่น',
      boostTitle: 'เร่งความเร็ว Cloud 3X',
      boostDesc: 'ปรับแต่ง FPS สำหรับการเล่นเกมบนคลาวด์',
      securityTitle: 'ระบบความปลอดภัยระดับสูง',
      securityDesc: 'เข้ารหัสข้อมูล + ซ่อน IP + ระบบแซนด์บ็อกซ์',
      adminUnlockedTitle: 'เปิดสิทธิ์แอดมินแล้ว',
      adminUnlockedDesc: 'คุณสามารถจัดการลิงก์อุปกรณ์และเพิ่มเกมใหม่ได้!',
      goToAdminBtn: 'ไปที่หน้าแอดมิน',

      exploreTitle: 'สำรวจ',
      searchPlaceholder: 'ค้นหาเกมหรือแอป...',
      allGamesTitle: 'เกมคลาวด์ทั้งหมด',
      allGamesDesc: 'คลังเกมทั้งหมด + ระบบค้นหาขั้นสูง',
      viewBtn: 'ดู',
      discordTitle: 'เข้าร่วม Discord',
      discordDesc: 'ชุมชนช่วยเหลือที่เร็วที่สุด',
      eventTitle: 'กิจกรรม Cloud Phone',
      eventDesc: 'รับของขวัญฟรีทุกวันเมื่อเข้าสู่ระบบ',
      noGameFound: 'ไม่พบแอปที่ค้นหา',

      devicesTitle: 'อุปกรณ์',
      deleteInactiveBtn: 'ลบอุปกรณ์ที่ไม่ทำงาน',
      addDeviceBtn: 'ซื้ออุปกรณ์',
      emptyDevicesTitle: 'ยังไม่มีอุปกรณ์',
      emptyDevicesDesc: 'กด "ซื้ออุปกรณ์" เพื่อเริ่มใช้งาน Cloud Phone',
      enterDeviceBtn: 'เข้าสู่เครื่อง',
      renameDeviceBtn: 'เปลี่ยนชื่อ',
      deleteDeviceBtn: 'ลบ',
      activeStatus: 'เปิดทำงาน',
      inactiveStatus: 'ปิดทำงาน',

      allGamesModalTitle: 'เกมและแอปทั้งหมด',
      searchGamesModalPlaceholder: 'ค้นหาเกม, หมวดหมู่...',
      playBtn: 'เล่นเกม',
      closeBtn: 'ปิด',
      cloudAppsAvailable: 'แอปคลาวด์พร้อมใช้งาน',

      cloudConnecting: 'กำลังเชื่อมต่อ...',
      cloudConnectingSandbox: 'กำลังเชื่อมต่อ Cloud Sandbox...',
      cloudConnected: 'เชื่อมต่อแล้ว',
      cloudReloading: 'กำลังโหลดใหม่...',
      cloudReloaded: 'โหลดใหม่แล้ว',
      cloudRestarting: 'กำลังรีสตาร์ท...',
      cloudRestarted: 'รีสตาร์ทแล้ว',
      assistBallTitle: 'ปุ่มช่วยเหลือ (ลากหรือแตะเพื่อเปิดเมนู)',
      reloadCloud: 'โหลดคลาวด์ใหม่',
      fullscreen: 'เต็มจอ',
      restartCloud: 'รีสตาร์ทคลาวด์',
      fakeIpOnToast: 'เปิด Fake IP (ไม่ระบุตัวตน)',
      fakeIpOffToast: 'ปิด Fake IP',
      fakeIpMenuOn: 'Fake IP ไม่ระบุตัวตน',
      fakeIpMenuOff: 'ปิด Fake IP',
      cleanRam: 'ล้าง RAM 3X',
      cleanRamCleaningToast: 'กำลังล้าง RAM...',
      cleanRamSuccessToast: 'ล้าง RAM สำเร็จ! คืนค่า RAM 1.2GB',
      fpsMonitorOnToast: 'เปิดตัววัด FPS',
      fpsMonitorOffToast: 'ปิดตัววัด FPS',
      fpsMonitorMenuOn: 'เปิดตัววัด FPS',
      fpsMonitorMenuOff: 'ปิดตัววัด FPS',
      exitCloud: 'ออกจาก Cloud Sandbox',

      buyModalTitle: 'ซื้ออุปกรณ์คลาวด์',
      buyModalDesc: 'สร้างอุปกรณ์ Cloud Phone PRO MAX ใหม่ RAM 8GB, Android 12',
      createNowBtn: 'สร้างทันที',
      loadingTitle: 'กำลังเริ่มต้นอุปกรณ์...',
      loadingDesc: 'กำลังจัดสรร IP และตั้งค่า Sandbox',
      renameModalTitle: 'เปลี่ยนชื่ออุปกรณ์',
      renameModalDesc: 'ป้อนชื่อใหม่สำหรับอุปกรณ์นี้',
      deviceNamePlaceholder: 'ชื่ออุปกรณ์...',

      deviceBoughtToast: '🎉 เพิ่มอุปกรณ์ใหม่สำเร็จ!',
      deviceRenamedToast: 'เปลี่ยนชื่ออุปกรณ์สำเร็จ!',
      deviceDeletedToast: 'ลบอุปกรณ์แล้ว!',
      inactiveDevicesDeletedToast: 'ลบอุปกรณ์ที่ไม่ทำงานเรียบร้อย!',
      noInactiveDevicesToast: 'ไม่อุปกรณ์ที่ไม่ทำงาน!',
      adminUnlockedToast: 'ปลดล็อกโหมดแอดมินสำเร็จ!',
      adminLockedToast: 'ล็อกโหมดแอดมินแล้ว!',

      save: 'บันทึก',
      cancel: 'ยกเลิก',
    },
  },
];

export function getLanguage(code: string): LanguageOption {
  return LANGUAGES.find((l) => l.code === code) || LANGUAGES[0];
}
