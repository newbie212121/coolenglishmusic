// components/NavBar.tsx
import Link from "next/link";
import { auth } from "@/lib/auth";

export default function NavBar() {
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

          <button
            onClick={() => auth.login()}
            className="rounded-lg px-3 py-1.5 bg-gradient-to-r from-emerald-500 to-emerald-600 text-black font-semibold hover:brightness-110 shadow"
          >
            Log in
          </button>
        </nav>
      </div>
    </header>
  );
}
