export interface Device {
  id: number;
  name: string;
  ram: string;
  android: string;
  url: string;
  deviceTypeId?: string;
  openExternal?: boolean;
  openMode?: 'iframe' | 'external';
  useProxy?: boolean;
  created_at?: number;
  status?: 'active' | 'inactive' | 'offline';
  playTime?: number; // Total play time in seconds
}

export interface BugReport {
  id: string;
  targetName: string;
  description: string;
  createdAt: number;
  status: 'pending' | 'replied';
  adminReply?: string;
  repliedAt?: number;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

export interface DeviceType {
  id: string;
  name: string;
  ram: string;
  android: string;
  desc?: string;
  url: string;
  badge?: string;
  openExternal?: boolean;
  openMode?: 'iframe' | 'external';
  useProxy?: boolean;
  created_at?: number;
}

export interface GameApp {
  id?: string;
  name: string;
  desc: string;
  url: string;
  icon: string;
  tag?: string;
  created_at?: number;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  date: string;
  created_at?: number;
  type?: 'update' | 'event' | 'info' | 'alert';
  isImportant?: boolean;
}

export interface GuideItem {
  id: string;
  title: string;
  note: string;
  link: string;
  videoUrl: string;
  created_at?: number;
}

export type TabType = 'home' | 'devices' | 'explore' | 'account' | 'settings' | 'admin';

export interface ToastMessage {
  id: number;
  text: string;
}
