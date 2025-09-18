'use client';

import { useEffect, useState } from 'react';
import { fetchAuthSession } from 'aws-amplify/auth';

const BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');
const STATUS_URL = `${BASE}/members/status`;
const PORTAL_URL = `${BASE}/billing/portal`;

export default function Members() {
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);

  const toLogin = () => {
    window.location.href = `/login?next=${encodeURIComponent('/members')}`;
  };

  const getIdToken = async (): Promise<string | null> => {
    try {
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString() || null;
      if (!idToken) {
        toLogin();
        return null;
      }
      return idToken;
    } catch {
      toLogin();
      return null;
    }
  };

  useEffect(() => {
    (async () => {
      const idToken = await getIdToken();
      if (!idToken) return;

      try {
        const res = await fetch(STATUS_URL, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // IMPORTANT: Bearer format so API Gateway JWT authorizer accepts it
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (res.status === 401) {
          // token rejected → go log in
          toLogin();
          return;
        }

        if (!res.ok) {
          console.error('[members] status non-OK:', res.status);
          setActive(false);
        } else {
          const data = await res.json().catch(() => ({} as any));
          setActive(!!data.active);
        }
      } catch (e) {
        console.error('[members] status error:', e);
        setActive(false);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const openBillingPortal = async () => {
    setBusy(true);
    try {
      const idToken = await getIdToken();
      if (!idToken) return;

      const res = await fetch(PORTAL_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.message || 'Could not open billing portal.');
        return;
      }

      const data = await res.json();
      if (data?.url) window.location.href = data.url;
      else alert('No portal URL returned.');
    } catch (e) {
      console.error('[members] portal error:', e);
      alert('Could not open billing portal.');
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <div className="p-8 text-white">Checking membership…</div>;

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

      <button
        onClick={openBillingPortal}
        disabled={busy}
        className="px-6 py-3 rounded-full bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-60"
      >
        {busy ? 'Opening…' : 'Manage Billing'}
      </button>
    </div>
  );
}
