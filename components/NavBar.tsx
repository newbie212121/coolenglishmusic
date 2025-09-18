// components/NavBar.tsx
import Link from "next/link";
import { useRouter } from "next/router";
import { signOut, signInWithRedirect } from "aws-amplify/auth";
import { useAuth } from "@/context/AuthContext"; // ✅ use the shared Auth Brain

export default function NavBar() {
  const { isAuthenticated, isMember, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    await signInWithRedirect();
  };

  const handleLogout = async () => {
    await signOut();
    router.push("/"); // redirect home after logout
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-white text-xl font-bold">
            <span className="text-emerald-400">Cool</span>English
            <span className="text-white/80">Music</span>
          </Link>

          <nav className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-neutral-300 hover:text-white">
              Home
            </Link>
            <Link href="/activities" className="text-neutral-300 hover:text-white">
              Activities
            </Link>
            <Link href="/pricing" className="text-neutral-300 hover:text-white">
              Pricing
            </Link>

            {isLoading ? (
              <div className="h-8 w-20 bg-gray-700 rounded-full animate-pulse" />
            ) : isAuthenticated ? (
              isMember ? (
                <>
                  <button
                    onClick={() => router.push("/members")}
                    className="text-neutral-300 hover:text-white"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-neutral-700 px-3 py-1.5 rounded-lg"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    href="/pricing"
                    className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
                  >
                    Upgrade to Premium
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-neutral-300 hover:text-white"
                  >
                    Logout
                  </button>
                </>
              )
            ) : (
              <button
                onClick={handleLogin}
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
