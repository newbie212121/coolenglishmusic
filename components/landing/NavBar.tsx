// components/landing/NavBar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "../../context/AuthContext";
import { signOut, fetchAuthSession } from "aws-amplify/auth";
import { useState } from "react";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const PORTAL_URL = `${API_BASE}/billing/portal`;

export default function NavBar() {
  const { isAuthenticated, isMember, isLoading } = useAuth();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const handleLogout = async () => {
    try {
      setBusy(true);
      await signOut();
      router.push("/");
    } finally {
      setBusy(false);
    }
  };

  const openBillingPortal = async () => {
    try {
      setBusy(true);
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken?.toString();
      if (!idToken) {
        router.push("/login");
        return;
      }
      const res = await fetch(PORTAL_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: idToken },
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.message || "Could not open billing portal.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur border-b border-white/5">
      <div className="mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-white font-bold text-xl">
            Cool<span className="text-green-400">English</span>Music
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/activities" className="text-gray-300 hover:text-white">Activities</Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white">Pricing</Link>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-28 rounded-full bg-gray-700 animate-pulse" />
          ) : !isAuthenticated ? (
            <>
              <Link
                href="/login"
                className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
              >
                Log in
              </Link>
            </>
          ) : isMember ? (
            <>
              <button
                onClick={openBillingPortal}
                disabled={busy}
                className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700 disabled:opacity-60"
              >
                {busy ? "Opening…" : "Dashboard"}
              </button>
              <button
                onClick={handleLogout}
                disabled={busy}
                className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-60"
              >
                {busy ? "…" : "Logout"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/pricing"
                className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
              >
                Upgrade to Premium
              </Link>
              <button
                onClick={handleLogout}
                disabled={busy}
                className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600 disabled:opacity-60"
              >
                {busy ? "…" : "Logout"}
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
