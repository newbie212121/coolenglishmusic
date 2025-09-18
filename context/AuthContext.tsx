// context/AuthContext.tsx
"use client";

import {
  fetchAuthSession,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  isLoading: boolean;
  isAuthenticated: boolean;
  isMember: boolean;
  user: { username: string } | null;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const STATUS_URL = `${API_BASE}/members/status`;   // expects Authorization: <idToken> (no Bearer)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isMember, setIsMember] = useState(false);

  const getIdToken = async () => {
    try {
      const s = await fetchAuthSession();
      return s.tokens?.idToken?.toString() || null;
    } catch {
      return null;
    }
  };

  const refresh = async () => {
    setIsLoading(true);
    try {
      const u = await getCurrentUser().catch(() => null);
      setUser(u ? { username: u.username } : null);

      if (u) {
        const id = await getIdToken();
        if (id) {
          const res = await fetch(STATUS_URL, {
            headers: { Authorization: id, "Content-Type": "application/json" },
          });
          if (res.ok) {
            const data = await res.json().catch(() => ({}));
            setIsMember(!!data.active);
          } else {
            setIsMember(false);
          }
        } else {
          setIsMember(false);
        }
      } else {
        setIsMember(false);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refresh();

    const unsub = Hub.listen("auth", ({ payload }) => {
      // Keep context accurate without page refresh
      if (payload.event === "signedIn" || payload.event === "tokenRefresh") {
        refresh();
      }
      if (payload.event === "signedOut") {
        setUser(null);
        setIsMember(false);
      }
    });
    return () => unsub();
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsMember(false);
  };

  const value = useMemo<Ctx>(() => ({
    isLoading,
    isAuthenticated: !!user,
    isMember,
    user,
    refresh,
    logout,
    getIdToken,
  }), [isLoading, user, isMember]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
