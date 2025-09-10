import Link from "next/link";

export default function NavBar() {
  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur border-b">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="font-black tracking-tight text-xl">
          Cool<span className="text-blue-600">English</span>Music
        </Link>
        <nav className="flex items-center gap-4 text-sm">
          <Link href="/pricing" className="hover:text-blue-700">Pricing</Link>
          <Link href="/members" className="hover:text-blue-700">Members</Link>
          <Link href="/login" className="rounded-lg px-3 py-1.5 bg-blue-600 text-white hover:bg-blue-700 shadow">
            Log in
          </Link>
        </nav>
      </div>
    </header>
  );
}
