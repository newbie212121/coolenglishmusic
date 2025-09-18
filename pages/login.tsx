// pages/login.tsx
"use client";

import { useEffect } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const next = (router.query.next as string) || "/activities";
      router.replace(next);
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async () => {
    await signInWithRedirect(); // uses your Amplify Hosted UI config
  };

  if (isLoading) return <div className="p-8 text-white">Loading…</div>;

  return (
    <main className="min-h-[60vh] grid place-items-center bg-[#0c1320] text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-3">Log In to Your Account</h1>
        <p className="text-gray-400 mb-8">Access your premium music activities.</p>
        <button
          onClick={handleLogin}
          className="px-8 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
        >
          Log In
        </button>
      </div>
    </main>
  );
}
