// pages/login.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { signInWithRedirect } from "aws-amplify/auth";
import { useAuth } from "@/context/AuthContext";

/**
 * When you land here:
 *  - If already signed in -> bounce to ?next=... (or /activities)
 *  - Otherwise -> store next in sessionStorage and start Hosted UI
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const next = (router.query.next as string) || "/activities";

    // If we already have a session, just go where the user wanted.
    if (!isLoading && isAuthenticated) {
      router.replace(next);
      return;
    }

    // If not logged in, kick off Hosted UI as soon as we can.
    if (!isLoading && !isAuthenticated) {
      // keep a local fallback in case ?next isn’t present after the round-trip
      sessionStorage.setItem("nextAfterLogin", next);
      signInWithRedirect().catch((e) => {
        console.error("signInWithRedirect failed", e);
      });
    }
  }, [isAuthenticated, isLoading, router]);

  // We never show a second “Login” button anymore.
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d1620] text-white">
      <div>Redirecting to secure sign-in…</div>
    </div>
  );
}
