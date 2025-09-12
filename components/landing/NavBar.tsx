// components/landing/NavBar.tsx
import Link from "next/link";
import { useEffect, useState } from "react";
import { getCurrentUser, signInWithRedirect, signOut } from "aws-amplify/auth";
import type { AuthUser } from "aws-amplify/auth";

export default function NavBar() {
  const [user, setUser] = useState<AuthUser | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const u = await getCurrentUser();
        setUser(u);
      } catch {
        setUser(null);
      }
    })();
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white text-xl font-bold">
            <span className="text-emerald-400">Cool</span>English
            <span className="text-white/80">Music</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/pricing" className="text-neutral-300 hover:text-white">
              Pricing
            </Link>
            <Link href="/members" className="text-neutral-300 hover:text-white">
              Members
            </Link>

            {user ? (
              <button
                onClick={() => signOut()}
                className="bg-neutral-700 px-3 py-1.5 rounded-lg"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => signInWithRedirect()}
                className="spotify-green text-black font-semibold px-4 py-2 rounded-lg"
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
