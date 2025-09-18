// context/AuthContext.tsx
import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from 'react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

// Your deployed API base (already used elsewhere)
const BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');
const STATUS_URL = `${BASE}/members/status`;

type AuthCtx = {
  isAuthenticated: boolean;
  isMember: boolean;
  isLoading: boolean;
  userEmail?: string | null;
  refresh: () => Promise<void>;
};

const Ctx = createContext<AuthCtx | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoading, setLoading] = useState(true);
  const [isMember, setMember]   = useState(false);
  const [userEmail, setEmail]   = useState<string | null>(null);
  const [isAuthenticated, setAuthed] = useState(false);

  const check = async () => {
    try {
      // Are we signed in?
      const user = await getCurrentUser().catch(() => null);
      setAuthed(!!user);
      setEmail(user?.signInDetails?.loginId ?? null);

      // If signed in, grab ID token + ask your /members/status
      if (user) {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (idToken) {
          const res = await fetch(STATUS_URL, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // IMPORTANT: your API Gateway authorizer reads the raw JWT (no "Bearer ")
              Authorization: idToken,
            },
          });
          setMember(res.ok && (await res.json()).active === true);
        } else {
          setMember(false);
        }
      } else {
        setMember(false);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    check();
    // No deps -> run once on app mount. You can add a Hub listener later if desired.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const value = useMemo<AuthCtx>(() => ({
    isAuthenticated,
    isMember,
    isLoading,
    userEmail,
    refresh: check,
  }), [isAuthenticated, isMember, isLoading, userEmail]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
