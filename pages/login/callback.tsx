// pages/login/callback.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    const stored = typeof window !== "undefined" ? sessionStorage.getItem("postLoginNext") : null;
    const next = stored || (router.query.next as string) || "/activities";
    try { sessionStorage.removeItem("postLoginNext"); } catch {}
    router.replace(next.startsWith("/") ? next : "/activities");
  }, [router]);

  return <div className="p-8 text-white">Completing sign in…</div>;
}
