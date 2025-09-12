// pages/members.tsx
import { useEffect, useState } from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { getUserSub, getIdTokenString } from '@/lib/auth-helpers'; // if this alias fails, use: '../../lib/auth-helpers'

type Status = 'loading' | 'out' | 'in';

export default function MembersPage() {
  const [status, setStatus] = useState<Status>('loading');
  const [userSub, setUserSub] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [sub, token] = await Promise.all([getUserSub(), getIdTokenString()]);
        if (!sub || !token) {
          setStatus('out');
          return;
        }
        setUserSub(sub);
        setStatus('in');
      } catch {
        setStatus('out');
      }
    })();
  }, []);

  if (status === 'loading') {
    return (
      <main className="max-w-3xl mx-auto py-16 text-center text-neutral-200">
        <h1 className="text-2xl font-semibold mb-2">Members</h1>
        <p>Checking your session…</p>
      </main>
    );
  }

  if (status === 'out') {
    return (
      <main className="max-w-3xl mx-auto py-16 text-center text-neutral-200">
        <h1 className="text-2xl font-semibold mb-4">Members</h1>
        <p className="mb-6">Please log in to see the members-only content.</p>
        <button
          onClick={() => signInWithRedirect()}
          className="spotify-green text-black font-semibold px-4 py-2 rounded-lg"
        >
          Log in
        </button>
      </main>
    );
  }

  return (
    <main className="max-w-5xl mx-auto py-10 text-neutral-200">
      <h1 className="text-2xl font-semibold mb-2">Welcome, member!</h1>
      <p className="mb-6 text-sm text-neutral-400">
        user id (sub): <code className="text-neutral-300">{userSub}</code>
      </p>
      <section className="rounded-xl border border-neutral-800 p-6">
        <h2 className="text-xl font-semibold mb-3">Premium Content</h2>
        <p className="text-neutral-300">
          You're logged in. Replace this block with your members-only resources.
        </p>
      </section>
    </main>
  );
}
