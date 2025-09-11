// components/NavBar.tsx

import Link from "next/link";
import { auth } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // This ensures the NavBar updates when the user logs in or out
    const handleAuthChange = () => setToken(auth.getIdToken());
    
    // Check on initial load
    handleAuthChange();

    // Listen for changes (e.g., after login callback)
    window.addEventListener('storage', handleAuthChange);
    window.addEventListener('focus', handleAuthChange); // Catches re-focusing the tab
    
    return () => {
      window.removeEventListener('storage', handleAuthChange);
      window.removeEventListener('focus', handleAuthChange);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/70 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="text-white text-xl font-bold">
              CoolEnglish<span className="text-emerald-400">Music</span>
            </Link>
          </div>

          {/* Nav Links */}
          <nav className="flex items-center gap-5 text-sm">
            <Link className="text-neutral-300 hover:text-emerald-400" href="/pricing">Pricing</Link>
            <Link className="text-neutral-300 hover:text-emerald-400" href="/members">Members</Link>
            
            {token ? (
              <button
                onClick={() => auth.logout()}
                className="rounded-lg px-3 py-1.5 border border-neutral-700 text-neutral-200 hover:bg-neutral-900"
              >
                Log out
              </button>
            ) : (
              <button
                onClick={() => auth.login()}
                className="rounded-lg px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-semibold hover:brightness-110 shadow"
              >
                Log in
              </button>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}