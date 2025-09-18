// app/test-grant/page.tsx  (or pages/test-grant.tsx in pages router)
"use client";

import { useState } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

const API = process.env.NEXT_PUBLIC_API_BASE!; // e.g. https://api.coolenglishmusic.com

export default function TestGrant() {
  const [msg, setMsg] = useState("");

  const run = async () => {
    try {
      // 1) Ensure signed in
      await getCurrentUser();

      // 2) Get ID token
      const session = await fetchAuthSession();
      const idToken = session?.tokens?.idToken?.toString();
      if (!idToken) throw new Error("No ID token in session.");

      // 3) Call grant; Lambda returns 200 + JSON {ok,next}
      const res = await fetch(`${API}/grant?prefix=Pure_WW/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
        mode: "cors",
        credentials: "include", // receive CF cookies
        cache: "no-store",
      });

      if (!res.ok) {
        const txt = await res.text();
        setMsg(`Error ${res.status}: ${txt}`);
        return;
      }

      const data = (await res.json()) as { ok?: boolean; next?: string };
      setMsg(`200: ${JSON.stringify(data)}`);

      if (data.next) {
        window.location.assign(data.next);
      } else {
        setMsg("200 OK but no next link in response.");
      }
    } catch (err: any) {
      setMsg(`Auth or fetch error: ${err?.message ?? String(err)}`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <button onClick={run}>Test Grant</button>
      <p>{msg}</p>
    </div>
  );
}
