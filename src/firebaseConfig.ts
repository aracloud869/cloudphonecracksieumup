import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  getDocs, 
  setDoc, 
  doc, 
  deleteDoc, 
  onSnapshot 
} from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  User
} from "firebase/auth";
import { GameApp, Device, Announcement, DeviceType, GuideItem, BugReport } from "./types";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCrjrUc-Xr0o6H8sxiNlaNwklv2ljP2BaE",
  authDomain: "cloudphone-1939d.firebaseapp.com",
  databaseURL: "https://cloudphone-1939d-default-rtdb.firebaseio.com",
  projectId: "cloudphone-1939d",
  storageBucket: "cloudphone-1939d.firebasestorage.app",
  messagingSenderId: "596711405546",
  appId: "1:596711405546:web:9a33200a6e566a6d48a493",
  measurementId: "G-Q2JP79D9RB"
};

// Initialize Firebase safely
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app);
export const auth = getAuth(app);

// Firebase Auth Exports
export { onAuthStateChanged, signOut };
export type { User };

// 3. CHỦ ĐỘNG THÊM: Hàm xử lý Đăng Ký tài khoản mới
export function dangKyUser(email: string, pass: string) {
  return createUserWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      console.log("Đăng ký thành công:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Lỗi đăng ký:", error.message);
      throw error;
    });
}

// 4. CHỦ ĐỘNG THÊM: Hàm xử lý Đăng Nhập tài khoản đã có
export function dangNhapUser(email: string, pass: string) {
  return signInWithEmailAndPassword(auth, email, pass)
    .then((userCredential) => {
      console.log("Đăng nhập thành công:", userCredential.user);
      return userCredential.user;
    })
    .catch((error) => {
      console.error("Lỗi đăng nhập:", error.message);
      throw error;
    });
}

// Login with Email & Password
export async function loginWithEmail(email: string, pass: string): Promise<User> {
  return dangNhapUser(email, pass);
}

// Register with Email & Password
export async function registerWithEmail(email: string, pass: string, displayName?: string): Promise<User> {
  const user = await dangKyUser(email, pass);
  if (displayName && user) {
    await updateProfile(user, { displayName });
  }
  return user;
}

// Logout
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Helper with timeout safety to prevent infinite loading spinners
function withTimeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Firestore operation timeout")), ms);
    promise
      .then((res) => {
        clearTimeout(timer);
        resolve(res);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// Helper to save a game/app to Firestore
export async function saveGameToCloud(game: GameApp): Promise<boolean> {
  try {
    const gameId = game.id || `game_${Date.now()}`;
    const docRef = doc(db, "explore_games", gameId);
    await withTimeout(setDoc(docRef, {
      ...game,
      id: gameId,
      updatedAt: Date.now()
    }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save game error:", err);
    return false;
  }
}

// Helper to delete a game from Firestore
export async function deleteGameFromCloud(gameId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "explore_games", gameId);
    // Set isDeleted flag so initial default games are also hidden for all users
    await withTimeout(setDoc(docRef, { id: gameId, isDeleted: true }, { merge: true }), 3000).catch(() => {});
    await withTimeout(deleteDoc(docRef), 3000).catch(() => {});
    return true;
  } catch (err) {
    console.warn("Firestore delete game error:", err);
    return false;
  }
}

// Helper to load games from Firestore
export async function loadGamesFromCloud(): Promise<GameApp[] | null> {
  try {
    const querySnapshot = await withTimeout(getDocs(collection(db, "explore_games")), 5000);
    const games: GameApp[] = [];
    querySnapshot.forEach((docSnap) => {
      games.push(docSnap.data() as GameApp);
    });
    return games;
  } catch (err) {
    console.warn("Firestore load games error:", err);
    return null;
  }
}

// Subscribe to real-time updates for games
export function subscribeCloudGames(callback: (games: GameApp[]) => void) {
  try {
    return onSnapshot(collection(db, "explore_games"), (snapshot) => {
      const games: GameApp[] = [];
      snapshot.forEach((docSnap) => {
        games.push(docSnap.data() as GameApp);
      });
      callback(games);
    }, (err) => {
      console.warn("Firestore subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore subscribe setup error:", err);
    return () => {};
  }
}

// Helper to sync device settings to Firestore
export async function saveDevicesToCloud(devices: Device[], defaultUrl?: string): Promise<boolean> {
  try {
    const docRef = doc(db, "admin_config", "devices_data");
    const payload: Record<string, any> = { devices, updatedAt: Date.now() };
    if (defaultUrl) {
      payload.defaultUrl = defaultUrl;
    }
    await withTimeout(setDoc(docRef, payload, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save devices error:", err);
    return false;
  }
}

// Subscribe to real-time updates for devices & config
export function subscribeCloudDevices(callback: (devices: Device[], defaultUrl?: string) => void) {
  try {
    return onSnapshot(doc(db, "admin_config", "devices_data"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data) {
          callback(data.devices || [], data.defaultUrl);
        }
      }
    }, (err) => {
      console.warn("Firestore devices subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore devices subscribe setup error:", err);
    return () => {};
  }
}

// Helper to sync category list to Firestore
export async function saveCategoriesToCloud(categories: { value: string; label: string }[]): Promise<boolean> {
  try {
    const docRef = doc(db, "admin_config", "categories_data");
    await withTimeout(setDoc(docRef, { categories, updatedAt: Date.now() }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save categories error:", err);
    return false;
  }
}

// Subscribe to real-time updates for categories
export function subscribeCloudCategories(callback: (categories: { value: string; label: string }[]) => void) {
  try {
    return onSnapshot(doc(db, "admin_config", "categories_data"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.categories) && data.categories.length > 0) {
          callback(data.categories);
        }
      }
    }, (err) => {
      console.warn("Firestore categories subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore categories subscribe setup error:", err);
    return () => {};
  }
}

// Helper to save announcement to Firestore
export async function saveAnnouncementToCloud(announcement: Announcement): Promise<boolean> {
  try {
    const annId = announcement.id || `ann_${Date.now()}`;
    const docRef = doc(db, "announcements", annId);
    await withTimeout(setDoc(docRef, {
      ...announcement,
      id: annId,
      updatedAt: Date.now()
    }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save announcement error:", err);
    return false;
  }
}

// Helper to delete announcement from Firestore
export async function deleteAnnouncementFromCloud(announcementId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "announcements", announcementId);
    await withTimeout(setDoc(docRef, { id: announcementId, isDeleted: true }, { merge: true }), 3000).catch(() => {});
    await withTimeout(deleteDoc(docRef), 3000).catch(() => {});
    return true;
  } catch (err) {
    console.warn("Firestore delete announcement error:", err);
    return false;
  }
}

// Helper to sync Device Types (Loại Thiết Bị) to Firestore
export async function saveDeviceTypesToCloud(deviceTypes: DeviceType[]): Promise<boolean> {
  try {
    const docRef = doc(db, "admin_config", "device_types");
    await withTimeout(setDoc(docRef, { deviceTypes, updatedAt: Date.now() }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save device types error:", err);
    return false;
  }
}

// Subscribe to real-time updates for device types
export function subscribeCloudDeviceTypes(callback: (deviceTypes: DeviceType[]) => void) {
  try {
    return onSnapshot(doc(db, "admin_config", "device_types"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.deviceTypes)) {
          callback(data.deviceTypes);
        }
      }
    }, (err) => {
      console.warn("Firestore device types subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore device types subscribe setup error:", err);
    return () => {};
  }
}

// Subscribe to real-time updates for announcements
export function subscribeCloudAnnouncements(callback: (announcements: Announcement[]) => void) {
  try {
    return onSnapshot(collection(db, "announcements"), (snapshot) => {
      const announcements: Announcement[] = [];
      snapshot.forEach((docSnap) => {
        announcements.push(docSnap.data() as Announcement);
      });
      callback(announcements);
    }, (err) => {
      console.warn("Firestore announcements subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore announcements subscribe setup error:", err);
    return () => {};
  }
}

// Helper to sync Guides (Hướng Dẫn) to Firestore
export async function saveGuidesToCloud(guides: GuideItem[]): Promise<boolean> {
  try {
    const docRef = doc(db, "admin_config", "app_guides");
    await withTimeout(setDoc(docRef, { guides, updatedAt: Date.now() }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save guides error:", err);
    return false;
  }
}

// Subscribe to real-time updates for guides
export function subscribeCloudGuides(callback: (guides: GuideItem[]) => void) {
  try {
    return onSnapshot(doc(db, "admin_config", "app_guides"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.guides)) {
          callback(data.guides);
        }
      }
    }, (err) => {
      console.warn("Firestore guides subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore guides subscribe setup error:", err);
    return () => {};
  }
}

// Helper to sync App Panel Title to Firestore
export async function saveAppTitleToCloud(title: string): Promise<boolean> {
  try {
    const docRef = doc(db, "admin_config", "app_title");
    await withTimeout(setDoc(docRef, { title, updatedAt: Date.now() }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save app title error:", err);
    return false;
  }
}

// Subscribe to real-time updates for App Title
export function subscribeCloudAppTitle(callback: (title: string) => void) {
  try {
    return onSnapshot(doc(db, "admin_config", "app_title"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && typeof data.title === "string" && data.title.trim()) {
          callback(data.title.trim());
        }
      }
    }, (err) => {
      console.warn("Firestore app title subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore app title subscribe setup error:", err);
    return () => {};
  }
}

// Helper to save bug report / reply to Firestore
export async function saveBugReportToCloud(report: BugReport): Promise<boolean> {
  try {
    const reportId = report.id || `bug_${Date.now()}`;
    const docRef = doc(db, "bug_reports", reportId);
    await withTimeout(setDoc(docRef, {
      ...report,
      id: reportId,
      updatedAt: Date.now()
    }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save bug report error:", err);
    return false;
  }
}

// Helper to delete bug report from Firestore
export async function deleteBugReportFromCloud(reportId: string): Promise<boolean> {
  try {
    const docRef = doc(db, "bug_reports", reportId);
    await withTimeout(deleteDoc(docRef), 3000).catch(() => {});
    return true;
  } catch (err) {
    console.warn("Firestore delete bug report error:", err);
    return false;
  }
}

// Subscribe to real-time updates for bug reports
export function subscribeCloudBugReports(callback: (reports: BugReport[]) => void) {
  try {
    return onSnapshot(collection(db, "bug_reports"), (snapshot) => {
      const reports: BugReport[] = [];
      snapshot.forEach((docSnap) => {
        reports.push(docSnap.data() as BugReport);
      });
      callback(reports);
    }, (err) => {
      console.warn("Firestore bug reports subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore bug reports subscribe setup error:", err);
    return () => {};
  }
}

// Helper to save User-specific Background URL to Firestore
export async function saveUserBgUrlToCloud(userId: string, bgUrl: string): Promise<boolean> {
  try {
    const docRef = doc(db, "user_prefs", userId);
    await withTimeout(setDoc(docRef, { userId, bgUrl, updatedAt: Date.now() }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save user bgUrl error:", err);
    return false;
  }
}

// Subscribe to real-time updates for User Background URL
export function subscribeUserBgUrl(userId: string, callback: (bgUrl: string) => void) {
  try {
    return onSnapshot(doc(db, "user_prefs", userId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && typeof data.bgUrl === 'string') {
          callback(data.bgUrl);
        }
      }
    }, (err) => {
      console.warn("Firestore user bgUrl subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore user bgUrl subscribe setup error:", err);
    return () => {};
  }
}

// Helper to save User-specific Devices to Firestore
export async function saveUserDevicesToCloud(userId: string, devices: Device[]): Promise<boolean> {
  try {
    const docRef = doc(db, "user_devices", userId);
    await withTimeout(setDoc(docRef, { userId, devices, updatedAt: Date.now() }, { merge: true }), 5000);
    return true;
  } catch (err) {
    console.warn("Firestore save user devices error:", err);
    return false;
  }
}

// Subscribe to real-time updates for User-specific Devices
export function subscribeUserDevices(userId: string, callback: (devices: Device[]) => void) {
  try {
    return onSnapshot(doc(db, "user_devices", userId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data && Array.isArray(data.devices)) {
          callback(data.devices);
        }
      } else {
        callback([]);
      }
    }, (err) => {
      console.warn("Firestore user devices subscribe error:", err);
    });
  } catch (err) {
    console.warn("Firestore user devices subscribe setup error:", err);
    return () => {};
  }
}



