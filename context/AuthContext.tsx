// context/AuthContext.tsx
import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

type AuthCtx = {
  isAuthenticated: boolean;
  isMember: boolean;
  isLoading: boolean;
  user: { username?: string } | null;
};

const AuthContext = createContext<AuthCtx | undefined>(undefined);

// Build API base safely
const BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const STATUS_URL = `${BASE}/members/status`;

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ username?: string } | null>(null);
  const [isMember, setIsMember] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Is there a signed-in user?
        const u = await getCurrentUser().catch(() => null);
        setUser(u as any);

        // If signed in, check membership
        const session = await fetchAuthSession().catch(() => null);
        const idToken = session?.tokens?.idToken?.toString();
        if (idToken) {
          const res = await fetch(STATUS_URL, {
            headers: { Authorization: idToken }, // your API expects raw token (no Bearer)
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
      } catch {
        setUser(null);
        setIsMember(false);
      } finally {
        setIsLoading(false);
      }
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: !!user,
        isMember,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
