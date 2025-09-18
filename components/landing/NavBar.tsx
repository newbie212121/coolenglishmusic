// components/landing/NavBar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { signOut } from "aws-amplify/auth";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, isMember, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } finally {
      router.replace("/"); // back to home after logout
    }
  };

  const RightSide = () => {
    if (isLoading) {
      return <div className="h-8 w-28 rounded-full bg-gray-700 animate-pulse" />;
    }
    if (!isAuthenticated) {
      return (
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
          >
            Log in
          </Link>
        </div>
      );
    }
    // authenticated
    return (
      <div className="flex items-center gap-3">
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
          onClick={handleLogout}
          className="px-4 py-2 rounded-full bg-gray-800 text-white hover:bg-gray-700"
        >
          Logout
        </button>
      </div>
    );
  };

  return (
    <nav className="w-full sticky top-0 z-40 bg-black/90 backdrop-blur border-b border-white/10">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-white font-bold text-xl">
            <span className="text-green-400">Cool</span>EnglishMusic
          </Link>
          <div className="hidden sm:flex items-center gap-6">
            <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
            <Link href="/activities" className="text-gray-300 hover:text-white">Activities</Link>
            <Link href="/pricing" className="text-gray-300 hover:text-white">Pricing</Link>
          </div>
        </div>
        <RightSide />
      </div>
    </nav>
  );
}
