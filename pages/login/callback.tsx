"use client";
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginCallback() {
  const router = useRouter();
  useEffect(() => {
    const next = (router.query.next as string) || "/activities";
    router.replace(next);
  }, [router]);

  return <div className="p-8 text-white">Completing sign in…</div>;
}
