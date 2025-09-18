'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import {
  signIn,
  fetchAuthSession,
} from 'aws-amplify/auth';

export default function LoginPage() {
  const router = useRouter();
  const nextUrl = useMemo(() => {
    // e.g. /login?next=%2Fmembers
    if (typeof window === 'undefined') return '/members';
    const p = new URLSearchParams(window.location.search);
    const n = p.get('next');
    return n && n.startsWith('/') ? n : '/members';
  }, []);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If already signed in, skip the form and go to nextUrl
  useEffect(() => {
    (async () => {
      try {
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();
        if (idToken) {
          router.replace(nextUrl);
          return;
        }
      } catch {
        // no session — show form
      }
      setBusy(false);
    })();
  }, [router, nextUrl]);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    try {
      // Try to sign in only if not already authenticated
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) {
        await signIn({ username: email.trim(), password });
      }
      router.replace(nextUrl);
    } catch (err: any) {
      // “There is already a signed in user.” → just redirect
      if (err?.name === 'UserAlreadyAuthenticatedException') {
        router.replace(nextUrl);
        return;
      }
      setError(err?.message || 'Login failed');
      setBusy(false);
    }
  };

  if (busy) return null; // brief flash-free state; or show a spinner

  return (
    <div className="min-h-screen flex items-start justify-center p-8 text-white">
      <form
        onSubmit={onSubmit}
        className="w-full max-w-md space-y-4"
        autoComplete="on"
      >
        <h1 className="text-3xl font-bold mb-4">Login</h1>

        {error && (
          <div className="text-red-400 text-sm">{error}</div>
        )}

        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
          autoComplete="username"
        />

        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
          autoComplete="current-password"
        />

        <button
          type="submit"
          disabled={busy}
          className="w-full py-3 rounded bg-green-400 text-black font-semibold disabled:opacity-60"
        >
          {busy ? 'Signing in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
