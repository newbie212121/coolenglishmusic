// components/landing/NavBar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const router = useRouter();
  const { isLoading, isAuthenticated, isMember, logout, getIdToken } = useAuth();

  const gotoLogin = () => {
    const next = router.asPath || "/activities";
    router.push(`/login?next=${encodeURIComponent(next)}`);
  };

  const gotoPricing = () => router.push("/pricing");

  const openPortal = async () => {
    const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
    const PORTAL_URL = `${API_BASE}/billing/portal`;
    const id = await getIdToken();
    if (!id) return gotoLogin();
    const res = await fetch(PORTAL_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: id },
    });
    const data = await res.json().catch(() => ({}));
    if (res.ok && data?.url) window.location.href = data.url;
    else alert(data?.message || "Could not open billing portal.");
  };

  return (
    <nav className="w-full bg-black/90 border-b border-white/5 sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-white font-bold text-lg">
            <span className="text-green-400">Cool</span>EnglishMusic
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/activities" className="text-gray-300 hover:text-white">Activities</Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white">Pricing</Link>
          </div>
        </div>

        {/* Right buttons */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-8 w-24 rounded-full bg-gray-700 animate-pulse" />
          ) : !isAuthenticated ? (
            <button
              onClick={gotoLogin}
              className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
            >
              Log in
            </button>
          ) : isMember ? (
            <>
              <button
                onClick={openPortal}
                className="px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-500"
              >
                Dashboard
              </button>
              <button
                onClick={() => logout().then(() => router.push("/"))}
                className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={gotoPricing}
                className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={() => logout().then(() => router.push("/"))}
                className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
