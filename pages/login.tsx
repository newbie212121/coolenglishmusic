// pages/login.tsx
"use client";

import { useEffect, useMemo } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  const nextDest = useMemo(() => {
    const q = router.query.next as string | undefined;
    return q && q.startsWith("/") ? q : "/activities";
  }, [router.query.next]);

  // If already signed in, bounce to next
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(nextDest);
    }
  }, [isLoading, isAuthenticated, nextDest, router]);

  const go = async () => {
    // remember desired destination across the Hosted UI round-trip
    try {
      sessionStorage.setItem("postLoginNext", nextDest);
    } catch {}
    await signInWithRedirect();
  };

  if (isAuthenticated) return null;

  return (
    <main className="min-h-[60vh] flex items-center justify-center bg-[#0b1220] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">Log In to Your Account</h1>
        <p className="text-gray-400 mb-8">Access your premium music activities.</p>
        <button
          onClick={go}
          className="px-6 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
        >
          Log In
        </button>
      </div>
    </main>
  );
}
