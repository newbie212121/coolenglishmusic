// context/AuthContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Hub } from "aws-amplify/utils";
import {
  fetchAuthSession,
  getCurrentUser,
  signOut,
} from "aws-amplify/auth";

type Ctx = {
  isLoading: boolean;              // only the INITIAL Cognito check
  isAuthenticated: boolean;
  isMember: boolean;
  user: { username: string } | null;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

// --- Config ---
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const STATUS_URL = `${API_BASE}/members/status`;

// Small helper so our console logs are easy to filter
const log = (...args: any[]) => console.log("[AUTH]", ...args);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);      // initial auth check only
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isMember, setIsMember] = useState(false);

  const getIdToken = async (): Promise<string | null> => {
    try {
      const s = await fetchAuthSession({ forceRefresh: false });
      return s.tokens?.idToken?.toString() || null;
    } catch {
      return null;
    }
  };

  // --- IMPORTANT: send "Bearer <token>" ---
  const checkMembership = async () => {
    const idToken = await getIdToken();
    if (!idToken) {
      setIsMember(false);
      return;
    }
    try {
      const res = await fetch(STATUS_URL, {
        method: "GET",
        headers: {
          // <-- this was the missing bit
          Authorization: `Bearer ${idToken}`,
        },
      });
      if (!res.ok) {
        log("Membership check failed:", res.status);
        setIsMember(false);
        return;
      }
      const data = await res.json().catch(() => ({}));
      setIsMember(!!data.active);
    } catch (err) {
      log("Membership fetch error:", err);
      setIsMember(false);
    }
  };

  // Runs after Cognito confirms the user (or confirms there is none)
  const refreshUser = async () => {
    setIsLoading(true);
    log("Starting session refresh…");
    try {
      const cognitoUser = await getCurrentUser();
      setUser({ username: cognitoUser.username });
      await checkMembership();               // run in foreground once on load
    } catch {
      // Not signed in
      setUser(null);
      setIsMember(false);
    } finally {
      setIsLoading(false);                   // never block the app forever
      log("Refresh finished. isLoading = false");
    }
  };

  // Initial check + react to Amplify events
  useEffect(() => {
    refreshUser();                           // first load

    const unsub = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
        case "tokenRefresh":
          refreshUser();
          break;
        case "signedOut":
          setUser(null);
          setIsMember(false);
          setIsLoading(false);
          break;
      }
    });
    return unsub;
  }, []);

  const logout = async () => {
    try {
      await signOut();
    } finally {
      setUser(null);
      setIsMember(false);
      // Optional: force a clean reload to the homepage
      if (typeof window !== "undefined") window.location.assign("/");
    }
  };

  const value = useMemo<Ctx>(
    () => ({
      isLoading,
      isAuthenticated: !!user,
      isMember,
      user,
      logout,
      getIdToken,
    }),
    [isLoading, user, isMember]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
