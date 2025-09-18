// components/landing/NavBar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "aws-amplify/auth";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, isMember, isLoading } = useAuth();

  const doLogout = async () => {
    try {
      await signOut();
    } finally {
      router.push("/"); // snap back to home
    }
  };

  return (
    <nav className="w-full bg-black/90 backdrop-blur sticky top-0 z-50">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        {/* Brand + primary nav */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-white font-bold text-lg">
            <span className="text-green-400">Cool</span>EnglishMusic
          </Link>
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/activities" className="text-gray-300 hover:text-white">Activities</Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white">Pricing</Link>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {isLoading ? (
            <div className="h-9 w-28 rounded-full bg-gray-700 animate-pulse" />
          ) : isAuthenticated ? (
            <>
              {isMember ? (
                <Link
                  href="/members"
                  className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
                >
                  Dashboard
                </Link>
              ) : (
                <Link
                  href="/pricing"
                  className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
                >
                  Upgrade to Premium
                </Link>
              )}
              <button
                onClick={doLogout}
                className="px-4 py-2 rounded-full bg-gray-700 text-white hover:bg-gray-600"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              href="/login"
              className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
            >
              Log in
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}
