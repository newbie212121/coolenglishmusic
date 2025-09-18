// pages/login/callback.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";
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
        setStatus("Finalizing session…");
        // Trigger code→token exchange and load current session
        await fetchAuthSession().catch(() => {});

        // Poll briefly until ID token is visible
        const start = Date.now();
        let idToken: string | null = null;
        while (Date.now() - start < 8000) {
          const s = await fetchAuthSession().catch(() => null);
          idToken = s?.tokens?.idToken?.toString() || null;
          if (idToken) break;
          await new Promise((r) => setTimeout(r, 250));
        }

        if (!idToken) {
          setError("We couldn’t finish sign-in. Check your Cognito domain/redirects and try again.");
          setStatus("");
          return;
        }

        // Hydrate user object (nice-to-have)
        await getCurrentUser().catch(() => {});

        // Go to intended page
        setStatus("All set — taking you back…");
        const next = getNext();
        window.location.replace(next);
      } catch (e) {
        console.error(e);
        setError("Unexpected sign-in error. Please try again.");
        setStatus("");
      }
    })();
  }, [router.isReady, router]);

  // Optional tiny debug widget (?debug=1)
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
