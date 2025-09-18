// components/AuthGate.tsx
"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";
import { useEffect } from "react";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const path = router.pathname || "";

  useEffect(() => {
    // After loading, if the user is authenticated and on the callback page, redirect them.
    if (!isLoading && isAuthenticated && path.startsWith("/login/callback")) {
      const stored = sessionStorage.getItem("nextAfterLogin");
      const next = (router.query.next as string) || stored || "/activities";
      sessionStorage.removeItem("nextAfterLogin");
      router.replace(next);
    }
  }, [isLoading, isAuthenticated, path, router]);

  // Show the loader only if the session is loading.
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-white">Finalizing session...</div>
      </div>
    );
  }

  return <>{children}</>;
}