// pages/login/callback.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { handleSignIn, fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
import { amplifyConfig } from "@/lib/amplify-config";

export default function LoginCallback() {
  const router = useRouter();
  const [status, setStatus] = useState("Finalizing session…");
  const [error, setError] = useState<string | null>(null);
  const tried = useRef(false);

  const getNext = () => {
    const fromParam = (router.query.next as string) || "";
    const fromStorage = sessionStorage.getItem("nextAfterLogin") || "";
    const next = fromParam || fromStorage || "/activities";
    sessionStorage.removeItem("nextAfterLogin");
    return next;
  };

  useEffect(() => {
    if (!router.isReady || tried.current) return;
    tried.current = true;

    (async () => {
      try {
        setStatus("Completing sign-in with Cognito…");
        // This is the key call for Amplify v6 Hosted UI redirect:
        await handleSignIn();

        // Now the code→token exchange should be done; load the session
        let session = await fetchAuthSession({ forceRefresh: false });

        // On some browsers it can take a moment—poll briefly
        const start = Date.now();
        let idToken = session.tokens?.idToken?.toString() || null;
        while (!idToken && Date.now() - start < 8000) {
          await new Promise((r) => setTimeout(r, 250));
          session = await fetchAuthSession({ forceRefresh: false });
          idToken = session.tokens?.idToken?.toString() || null;
        }

        if (!idToken) {
          setError("We couldn’t finish sign-in (no ID token). Check domain/redirects and try again.");
          setStatus("");
          return;
        }

        // Optional: hydrate user object
        await getCurrentUser().catch(() => {});

        setStatus("All set — taking you back…");
        window.location.replace(getNext());
      } catch (e: any) {
        console.error(e);
        setError(e?.message || "Unexpected sign-in error. Please try again.");
        setStatus("");
      }
    })();
  }, [router.isReady, router]);

  const showDebug = router.query.debug === "1";
  const oauth = (amplifyConfig as any)?.Auth?.Cognito?.loginWith?.oauth || {};
  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center space-y-3">
        {status && <div>{status}</div>}
        {error && (
          <>
            <div className="text-red-400">{error}</div>
            <a
              href={`/login?next=${encodeURIComponent(getNext())}`}
              className="inline-block mt-2 px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
            >
              Try again
            </a>
          </>
        )}
        {showDebug && (
          <div className="mt-6 text-left text-sm max-w-xl mx-auto p-3 rounded bg-white/5">
            <div><b>Domain</b>: {oauth.domain || "(missing)"} </div>
            <div><b>redirectSignIn</b>: {(oauth.redirectSignIn || []).join(", ")}</div>
            <div><b>redirectSignOut</b>: {(oauth.redirectSignOut || []).join(", ")}</div>
            <div><b>URL</b>: {typeof window !== "undefined" ? window.location.href : ""}</div>
          </div>
        )}
      </div>
    </div>
  );
}
