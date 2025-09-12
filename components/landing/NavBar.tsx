// components/NavBar.tsx
import Link from "next/link";
import { auth } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const checkAuthStatus = () => setToken(auth.getIdToken());
    checkAuthStatus();
    window.addEventListener("focus", checkAuthStatus);
    window.addEventListener("storage", checkAuthStatus);
    return () => {
      window.removeEventListener("focus", checkAuthStatus);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white text-xl font-bold">
            <span className="text-emerald-400">Cool</span>English<span className="text-white/80">Music</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link className="text-neutral-300 hover:text-emerald-400 transition" href="/">Home</Link>
            <Link className="text-neutral-300 hover:text-emerald-400 transition" href="/activities">Activities</Link>
            <Link className="text-neutral-300 hover:text-emerald-400 transition" href="/pricing">Pricing</Link>
          </nav>

          <div className="flex items-center gap-4">
            {token ? (
              <>
                <Link href="/members" className="text-sm text-neutral-300 hover:text-emerald-400">Premium</Link>
                <button
                  onClick={() => auth.logout()}
                  className="rounded-lg px-3 py-1.5 text-sm border border-neutral-700 text-neutral-200 hover:bg-neutral-800 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg px-4 py-2 text-sm text-black font-semibold spotify-green spotify-green-hover shadow-lg"
              >
                Log in
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}