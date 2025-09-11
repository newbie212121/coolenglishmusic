// components/NavBar.tsx
import Link from "next/link";
import { auth } from "@/lib/auth";
import { useEffect, useState } from "react";

export default function NavBar() {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // This function checks for the token and updates our state
    const checkAuthStatus = () => {
      setToken(auth.getIdToken());
    };

    // Check when the component first loads
    checkAuthStatus();

    // Add event listeners to check again if the user logs in/out in another tab
    window.addEventListener("focus", checkAuthStatus);
    window.addEventListener("storage", checkAuthStatus);

    // Clean up listeners when the component is removed
    return () => {
      window.removeEventListener("focus", checkAuthStatus);
      window.removeEventListener("storage", checkAuthStatus);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-800 bg-black/70 backdrop-blur">
      <div className="mx-auto max-w-7xl h-14 px-4 flex items-center justify-between">
        <Link href="/" className="font-extrabold tracking-tight text-xl text-white">
          <span className="text-white">Cool</span>
          <span className="text-emerald-400">English</span>
          <span className="text-white">Music</span>
        </Link>

        <nav className="flex items-center gap-5 text-sm">
          <Link className="text-neutral-300 hover:text-emerald-400" href="/activities">Activities</Link>
          <Link className="text-neutral-300 hover:text-emerald-400" href="/pricing">Pricing</Link>
          <Link className="text-neutral-300 hover:text-emerald-400" href="/members">Members</Link>

          {/* This part now changes based on login status */}
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
    </header>
  );
}