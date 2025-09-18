// pages/login/callback.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { fetchAuthSession } from "aws-amplify/auth";

export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!router.isReady) return;

    (async () => {
      try {
        // Force Amplify to complete the Hosted UI redirect flow and materialize tokens
        await fetchAuthSession();
      } catch {
        // ignore — if it fails we still attempt to move on
      }

      const fromParam = (router.query.next as string) || "";
      const fromStorage = sessionStorage.getItem("nextAfterLogin") || "";
      const next = fromParam || fromStorage || "/activities";
      sessionStorage.removeItem("nextAfterLogin");

      // Navigate after the session exists
      router.replace(next);
    })();
  }, [router.isReady, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Completing sign-in…
    </div>
  );
}
