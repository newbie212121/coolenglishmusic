// context/AuthContext.tsx
"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { fetchAuthSession, getCurrentUser, signOut } from "aws-amplify/auth";
import { Hub } from "aws-amplify/utils";

type Ctx = {
  isLoading: boolean;            // initial Cognito session check only
  isAuthenticated: boolean;
  isMember: boolean;             // paid member
  user: { username: string } | null;
  logout: () => Promise<void>;
  getIdToken: () => Promise<string | null>;
};

const AuthContext = createContext<Ctx | undefined>(undefined);

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const STATUS_URL = API_BASE ? `${API_BASE}/members/status` : "";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);        // only tracks Cognito check
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
    // If no API configured, just treat as not-a-member and exit quickly
    if (!STATUS_URL) {
      setIsMember(false);
      return;
    }

    const idToken = await getIdToken();
    if (!idToken) {
      setIsMember(false);
      return;
    }

    try {
      const res = await fetch(STATUS_URL, {
        headers: { Authorization: idToken },
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        setIsMember(!!data.active);
      } else {
        // Fail closed, but never block UI
        console.error("Membership check failed:", res.status);
        setIsMember(false);
      }
    } catch (error) {
      console.error("Error fetching membership status:", error);
      setIsMember(false);
    }
  };

  const refreshUser = async () => {
    setIsLoading(true);
    try {
      const cognitoUser = await getCurrentUser();
      setUser({ username: cognitoUser.username });

      // Fire-and-forget membership check — do not block initial load
      checkMembership();
    } catch {
      // Not signed in
      setUser(null);
      setIsMember(false);
    } finally {
      // Key change: loading is DONE after Cognito check
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // Initial load
    refreshUser();

    // React to auth events
    const unsubscribe = Hub.listen("auth", ({ payload }) => {
      switch (payload.event) {
        case "signedIn":
        case "tokenRefresh":
          refreshUser();
          break;
        case "signedOut":
          setUser(null);
          setIsMember(false);
          break;
      }
    });
    return unsubscribe;
  }, []);

  const logout = async () => {
    await signOut();
    setUser(null);
    setIsMember(false);
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
