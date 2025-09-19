// pages/login/callback.tsx
"use client";

import { useEffect } from "react";
import { useRouter } from "next/router";
import { fetchAuthSession } from "aws-amplify/auth";

/**
 * This page runs only after Cognito redirects back with ?code=...
 * We explicitly tell Amplify to complete the flow (exchange code -> tokens).
 * After that, we send the user to their "next" page (if we saved one),
 * or to "/" as a safe default.
 */
export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // IMPORTANT: This triggers the code->tokens exchange for Hosted UI
        await fetchAuthSession();

        // Read a saved post-login destination (optional)
        const next =
          sessionStorage.getItem("postLoginRedirect") ||
          (router.query.next as string) ||
          "/";

        // Clean up and go
        sessionStorage.removeItem("postLoginRedirect");
        router.replace(next);
      } catch (err) {
        console.error("Error completing Cognito sign-in:", err);
        router.replace("/login?error=callback_failed");
      }
    })();
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      Completing sign-in with Cognito...
    </div>
  );
}
