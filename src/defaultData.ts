import { GameApp, Announcement, DeviceType, GuideItem } from "./types";

export const DEFAULT_CLOUD_URL = "https://levivietnam.vercel.app/?url=https://stream.uptoplay.net";

export const SECRET_ADMIN_CODE = "0869125253";

export const GAME_CATEGORIES = [
  { value: "RPG", label: "RPG / Nhập Vai" },
  { value: "Action", label: "Hành Động / Action" },
  { value: "Story", label: "Cốt Truyện / Story" },
  { value: "Sci-fi", label: "Sci-Fi / Viễn Tưởng" },
  { value: "Strategy", label: "Chiến Thuật / Strategy" },
  { value: "Adventure", label: "Phiêu Lưu / Adventure" },
  { value: "Shooter", label: "Bắn Súng / FPS & TPS" },
  { value: "Racing", label: "Đua Xe / Racing" },
  { value: "Sports", label: "Thể Thao / Sports" },
  { value: "Simulation", label: "Mô Phỏng / Simulation" },
  { value: "Puzzle", label: "Giải Đố / Casual" },
  { value: "Survival", label: "Sinh Tồn / Survival" },
  { value: "Card", label: "Thẻ Bài / Board Game" },
  { value: "Music", label: "Âm Nhạc / Rhythm" },
  { value: "Gacha", label: "Gacha / Anime" },
  { value: "Horror", label: "Kinh Dị / Horror" },
  { value: "Moba", label: "MOBA / Esports" },
  { value: "Kids", label: "Trẻ Em / Gia Đình" },
  { value: "App", label: "Ứng Dụng / Tool" },
  { value: "Hot", label: "Hot Game / Phổ Biến" },
];

export const INITIAL_GUIDES: GuideItem[] = [];

export const INITIAL_DEVICE_TYPES: DeviceType[] = [
  {
    id: "devtype_promax",
    name: "Cloud Phone PRO MAX",
    ram: "8GB RAM",
    android: "Android 12",
    desc: "Cấu hình PRO MAX cao cấp, mượt mà mọi game & ứng dụng nặng.",
    url: DEFAULT_CLOUD_URL,
    badge: "Phổ Biến",
    openMode: "iframe",
    useProxy: true,
    created_at: Date.now(),
  },
  {
    id: "devtype_gaming",
    name: "Cloud Phone GAMING ULTRA",
    ram: "16GB RAM",
    android: "Android 13",
    desc: "Tốc độ xử lý cực đỉnh 120 FPS, tối ưu chuyên game đồ họa cao.",
    url: DEFAULT_CLOUD_URL,
    badge: "VIP",
    openMode: "iframe",
    useProxy: true,
    created_at: Date.now(),
  },
  {
    id: "devtype_standard",
    name: "Cloud Phone Thông Thường",
    ram: "4GB RAM",
    android: "Android 11",
    desc: "Mở thẳng ngoài tab/cửa sổ mới.",
    url: DEFAULT_CLOUD_URL,
    badge: "Standard",
    openMode: "external",
    useProxy: true,
    created_at: Date.now(),
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: "ann_1",
    title: "Cập nhật hệ thống Cloud Phone PRO MAX V3.0",
    content: "Nâng cấp hệ thống Cloud Sandbox 8GB RAM, bổ sung Fake IP ẩn danh và bộ theo dõi FPS. Tối ưu hóa mượt mà 24/7.",
    date: new Date().toISOString().split('T')[0],
    created_at: Date.now(),
    type: "update",
    isImportant: true
  },
  {
    id: "ann_2",
    title: "Sự kiện Đăng nhập hàng ngày nhận quà VIP",
    content: "Đăng nhập các thiết bị Cloud Phone hàng ngày để tích lũy giờ chơi và nhận gói tăng tốc Cloud 3X hoàn toàn miễn phí.",
    date: new Date().toISOString().split('T')[0],
    created_at: Date.now() - 86400000,
    type: "event",
    isImportant: false
  }
];

export const INITIAL_GAMES: GameApp[] = [
  { 
    id: "game_twd",
    name: "The Walking Dead", 
    desc: "Cốt truyện | Zombie", 
    url: "https://testdrive4.now.gg/apps/galaxy-play-technology-limited/10512_t1/the-walking-dead-survivors.html", 
    icon: "https://cdn.now.gg/apps-content/10512/icon/the-walking-dead-survivors.png", 
    tag: "Story" 
  },
  { 
    id: "game_bbh",
    name: "Battle Bears Heroes", 
    desc: "Battle Royale | Multiplayer & PVP", 
    url: "https://testdrive4.now.gg/apps/battlecoin-games/8270_t1/battle-bears-heroes.html", 
    icon: "https://cdn.now.gg/apps-content/8270/icon/battle-bears-heroes.png", 
    tag: "Action" 
  },
  { 
    id: "game_mfdq",
    name: "Magic Forest", 
    desc: "MMO | RPG", 
    url: "https://testdrive4.now.gg/play/sugar-game-network-limited/9030/magic-forest-dragon-quest", 
    icon: "https://cdn.now.gg/apps-content/9030/icon/magic-forest-dragon-quest.png", 
    tag: "RPG" 
  }
];
