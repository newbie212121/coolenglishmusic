// pages/login/callback.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Cognito Hosted UI will return here.
 * We pull ?next (if present) or the sessionStorage fallback,
 * then send the user there.
 */
export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    const fromParam = (router.query.next as string) || "";
    const fromStorage = sessionStorage.getItem("nextAfterLogin") || "";
    const next = fromParam || fromStorage || "/activities";
    sessionStorage.removeItem("nextAfterLogin");
    router.replace(next);
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      Completing sign-in…
    </div>
  );
}
