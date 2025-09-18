// context/AuthContext.tsx
"use client";

import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";

type Ctx = {
  isLoading: boolean;
  isAuthenticated: boolean;
  isMember: boolean;
  user: { username: string } | null;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const STATUS_URL = `${API_BASE}/members/status`;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isMember, setIsMember] = useState(false);

  const getIdToken = async () => {
    try {
      const s = await fetchAuthSession({ forceRefresh: false });
      return s.tokens?.idToken?.toString() || null;
    } catch {
      return null;
    }
  };

  const checkMembership = async () => {
    const idToken = await getIdToken();
    if (!idToken) {
      setIsMember(false);
      return;
    }
    try {
      const res = await fetch(STATUS_URL, { headers: { Authorization: idToken } });
      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setIsMember(!!data.active);
      } else {
        setIsMember(false);
        console.error("Membership check failed:", res.status);
      }
    } catch (error) {
      setIsMember(false);
      console.error("Error fetching membership status:", error);
    }
  };

  const refreshUserSession = async () => {
    setIsLoading(true);
    try {
      const cognitoUser = await getCurrentUser();
      setUser({ username: cognitoUser.username });
      await checkMembership();
    } catch (error) {
      setUser(null);
      setIsMember(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserSession();
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      if (payload.event === "signedIn" || payload.event === "tokenRefresh") {
        refreshUserSession();
      }
      if (payload.event === "signedOut") {
        setUser(null);
        setIsMember(false);
      }
    });
    return unsubscribe;
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