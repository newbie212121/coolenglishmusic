// pages/test-grant.tsx   (or app/test-grant/page.tsx with "use client")
"use client";
import { useState } from "react";
import { getCurrentUser, fetchAuthSession } from "aws-amplify/auth";

const API = process.env.NEXT_PUBLIC_API_BASE!; // e.g. https://6nxfttx5yi.execute-api.us-east-1.amazonaws.com

export default function TestGrant() {
  const [msg, setMsg] = useState("");

  const run = async () => {
    try {
      // 1) Ensure signed in (throws if not)
      await getCurrentUser();

      // 2) Grab ID token
      const { tokens } = await fetchAuthSession();
      const idToken = tokens?.idToken?.toString();
      if (!idToken) throw new Error("No ID token in session");

      // 3) Call /grant (don’t auto-follow redirects so we can read Location)
      const res = await fetch(`${API}/grant?prefix=Pure_WW/`, {
        method: "GET",
        headers: { Authorization: `Bearer ${idToken}` },
        redirect: "manual",
      });

      if (res.status === 302) {
        const loc = res.headers.get("Location");
        if (loc) {
          window.open(loc, "_blank");
          setMsg("Opened activity in a new tab.");
        } else {
          setMsg("302 without Location header.");
        }
      } else {
        // show any error the Lambda returned
        const text = await res.text();
        setMsg(`${res.status}: ${text}`);
      }
    } catch (err: any) {
      setMsg(`Error: ${err?.message || String(err)}`);
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <button onClick={run}>Test Grant</button>
      <p>{msg}</p>
    </div>
  );
}
