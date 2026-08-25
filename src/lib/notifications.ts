import { useSyncExternalStore } from "react";

export type NotificationType = "order" | "review" | "stock" | "customer";

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  href?: string;
  createdAt: number;
  read: boolean;
}

export type NewNotification = Omit<
  AppNotification,
  "id" | "createdAt" | "read"
>;

const STORAGE_KEY = "haven-notifications-v1";
const MAX_NOTIFICATIONS = 50;

function seedNotifications(): AppNotification[] {
  const now = Date.now();
  return [
    {
      id: "seed-order",
      type: "order",
      title: "New order #HV-10493",
      message: "Amelia placed an order worth £1,149.",
      href: "/admin/orders/hv-10493",
      createdAt: now - 1000 * 60 * 22,
      read: false,
    },
    {
      id: "seed-review",
      type: "review",
      title: "New 5-star review",
      message: "“The Sloane Sofa is even better in person.”",
      createdAt: now - 1000 * 60 * 65,
      read: false,
    },
    {
      id: "seed-stock",
      type: "stock",
      title: "Low stock · Luna Pendant",
      message: "Only 3 pieces left — consider restocking.",
      href: "/admin/products",
      createdAt: now - 1000 * 60 * 60 * 3,
      read: true,
    },
  ];
}

const serverSnapshot: AppNotification[] = seedNotifications();

let snapshot: AppNotification[] = [];
let cacheReady = false;
const listeners = new Set<() => void>();

function readSnapshot(): AppNotification[] {
  if (cacheReady) return snapshot;
  if (typeof window === "undefined") return snapshot;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        snapshot = parsed as AppNotification[];
        cacheReady = true;
        return snapshot;
      }
    }
  } catch {
    // fall through to the seed
  }
  snapshot = seedNotifications();
  cacheReady = true;
  return snapshot;
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function write(next: AppNotification[]) {
  snapshot = next;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — this session only
  }
  for (const listener of listeners) listener();
}

export function pushNotification(input: NewNotification): AppNotification {
  const item: AppNotification = {
    ...input,
    id: `n-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: Date.now(),
    read: false,
  };
  write([item, ...readSnapshot()].slice(0, MAX_NOTIFICATIONS));
  return item;
}

export function markNotificationRead(id: string) {
  write(
    readSnapshot().map((n) => (n.id === id ? { ...n, read: true } : n))
  );
}

export function markAllNotificationsRead() {
  write(readSnapshot().map((n) => ({ ...n, read: true })));
}

export function dismissNotification(id: string) {
  write(readSnapshot().filter((n) => n.id !== id));
}

export function clearAllNotifications() {
  write([]);
}

export interface NotificationsApi {
  notifications: AppNotification[];
  unreadCount: number;
  push: (input: NewNotification) => AppNotification;
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  clearAll: () => void;
}

export function useNotifications(): NotificationsApi {
  const notifications = useSyncExternalStore(
    subscribe,
    readSnapshot,
    () => serverSnapshot
  );
  const unreadCount = notifications.filter((n) => !n.read).length;
  return {
    notifications,
    unreadCount,
    push: pushNotification,
    markRead: markNotificationRead,
    markAllRead: markAllNotificationsRead,
    dismiss: dismissNotification,
    clearAll: clearAllNotifications,
  };
}

/** Compact relative time, e.g. "just now", "4m ago", "2h ago". */
export function relativeTime(timestamp: number): string {
  const seconds = Math.max(0, Math.floor((Date.now() - timestamp) / 1000));
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
