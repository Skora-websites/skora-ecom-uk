"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type UserRole = "customer" | "admin";

export interface AuthUser {
  name: string;
  email: string;
  role: UserRole;
}

interface AuthContextValue {
  user: AuthUser | null;
  login: (email: string, password: string, role?: UserRole) => boolean;
  logout: () => void;
  isAuthenticated: (role?: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const STORAGE_KEY = "haven-session";

const CUSTOMER_EMAIL = "emma@haven.com";
const CUSTOMER_PASSWORD = "password";
const CUSTOMER_NAME = "Emma Hartley";

const ADMIN_EMAIL = "admin@haven.com";
const ADMIN_PASSWORD = "admin";
const ADMIN_NAME = "Haven Admin";

function loadSession(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed.email === "string" && parsed.role) {
      return parsed as AuthUser;
    }
    return null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    setUser(loadSession());
  }, []);

  const login = useCallback((email: string, password: string, role?: UserRole) => {
    const normalizedEmail = email.trim().toLowerCase();
    if (role === "admin") {
      if (normalizedEmail === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        const next: AuthUser = {
          name: ADMIN_NAME,
          email: ADMIN_EMAIL,
          role: "admin",
        };
        setUser(next);
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
        return true;
      }
      return false;
    }
    if (normalizedEmail === CUSTOMER_EMAIL && password === CUSTOMER_PASSWORD) {
      const next: AuthUser = {
        name: CUSTOMER_NAME,
        email: CUSTOMER_EMAIL,
        role: "customer",
      };
      setUser(next);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    window.localStorage.removeItem(STORAGE_KEY);
  }, []);

  const isAuthenticated = useCallback(
    (role?: UserRole) => {
      if (!user) return false;
      if (role && user.role !== role) return false;
      return true;
    },
    [user]
  );

  const value = useMemo<AuthContextValue>(
    () => ({ user, login, logout, isAuthenticated }),
    [user, login, logout, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
