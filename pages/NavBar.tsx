import Link from "next/link";
import { auth } from "@/lib/auth";

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
