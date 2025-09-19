// context/AuthContext.tsx --- DEBUGGING VERSION
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

  const refreshUserSession = async () => {
    console.log("[AUTH DEBUG] 1. Starting session refresh...");
    setIsLoading(true);
    try {
      console.log("[AUTH DEBUG] 2. Attempting to get current user from Cognito...");
      const cognitoUser = await getCurrentUser();
      console.log(`[AUTH DEBUG] 3. Success! User found: ${cognitoUser.username}`);
      setUser({ username: cognitoUser.username });
      
      console.log("[AUTH DEBUG] 4. Checking membership status from API...");
      const idToken = await getIdToken();
      if (idToken) {
        const res = await fetch(STATUS_URL, { headers: { Authorization: idToken } });
        console.log(`[AUTH DEBUG] 5. API response status: ${res.status}`);
        if (res.ok) {
          const data = await res.json().catch(() => ({}));
          setIsMember(!!data.active);
          console.log(`[AUTH DEBUG] 6. Membership status set to: ${!!data.active}`);
        } else {
          setIsMember(false);
        }
      } else {
        console.log("[AUTH DEBUG] No ID token found for membership check.");
        setIsMember(false);
      }

    } catch (error) {
      console.error("[AUTH DEBUG] ERROR during user session refresh:", error);
      setUser(null);
      setIsMember(false);
    } finally {
      console.log("[AUTH DEBUG] 7. Refresh finished. Setting isLoading to false.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUserSession();
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      console.log(`[AUTH DEBUG] Hub event received: ${payload.event}`);
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