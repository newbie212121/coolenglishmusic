// components/landing/NavBar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { signOut } from "aws-amplify/auth";

export default function NavBar() {
  const { isLoading, isAuthenticated, isMember } = useAuth();

  const handleLogin = () => {
    // This new logic remembers the current page and adds it to the login URL
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/login?next=${next}`);
  };

  const handleLogout = async () => {
    // This new "bullet-proof" logout ensures everything resets
    try {
      await signOut();
    } catch (e) {
      console.error("signOut failed", e);
    } finally {
      // Hard reload guarantees a clean state
      window.location.assign("/");
    }
  };

  const openPortal = () => {
      // Placeholder for your Stripe Customer Portal logic
      alert("Billing portal coming soon!");
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
              onClick={handleLogin}
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
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => window.location.assign('/pricing')}
                className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
              >
                Upgrade to Premium
              </button>
              <button
                onClick={handleLogout}
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