'use client';

import { useEffect, useRef, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');
const STATUS_URL = `${BASE}/members/status`;

export default function Members() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<boolean | null>(null);
  const redirected = useRef(false); // prevent redirect loop

  const redirectToLogin = () => {
    if (redirected.current) return;
    redirected.current = true;
    const next = encodeURIComponent('/members');
    window.location.href = `/login?next=${next}`;
  };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        // 1) get a fresh ID token (Amplify will refresh if needed)
        const session = await fetchAuthSession();
        const idToken = session.tokens?.idToken?.toString();

        if (!idToken) {
          redirectToLogin();
          return;
        }

        // 2) call status once
        const res = await fetch(STATUS_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // API Gateway JWT authorizer reads the raw token from this header
            Authorization: idToken,
          },
        });

        if (res.status === 401) {
          redirectToLogin();
          return;
        }

        if (!res.ok) {
          // Treat unexpected errors as not-active but do not loop
          console.error('[members] status error:', res.status);
          if (!cancelled) setActive(false);
          return;
        }

        const data = await res.json().catch(() => ({} as any));
        if (!cancelled) setActive(!!data.active);
      } catch (e) {
        console.error('[members] exception:', e);
        if (!cancelled) setActive(false);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  if (loading) {
    return <div className="p-8 text-white">Checking membership…</div>;
  }

  if (!active) {
    return (
      <div className="p-8 text-white">
        <h1 className="text-3xl font-bold mb-4">Membership Required</h1>
        <p className="mb-6 text-gray-300">
          Your account doesn’t have an active subscription.
        </p>
        <a
          href="/pricing"
          className="inline-block px-6 py-3 rounded-full bg-green-400 text-black font-semibold"
        >
          Go to Pricing
        </a>
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h1 className="text-3xl font-bold mb-2">Welcome!</h1>
      <p className="text-gray-300 mb-6">
        Your subscription is active. Enjoy the activities 🎵
      </p>
      {/* render activities grid here */}
    </div>
  );
}
