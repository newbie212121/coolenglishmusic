// components/landing/PricingSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE as string) || "";

export default function PricingSection() {
  const router = useRouter();
  const { isAuthenticated, getIdToken, isLoading } = useAuth();

  const [busy, setBusy] = useState<"monthly" | "annual" | null>(null);

  const goCheckout = async (plan: "monthly" | "annual") => {
    // Require login first
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent("/pricing")}`);
      return;
    }

    setBusy(plan);
    try {
      // Try to get a token; if missing, retry once after a brief wait
      let idToken = await getIdToken();
      if (!idToken) {
        await new Promise((r) => setTimeout(r, 250));
        idToken = await getIdToken();
      }
      if (!idToken) throw new Error("Could not get auth token.");

      const res = await fetch(`${API_BASE}/billing/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: idToken },
        body: JSON.stringify({ plan }),
      });

      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.message || "Could not start checkout.");
      }
    } catch (e) {
      console.error("Checkout error:", e);
      alert("An error occurred during checkout.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="py-16">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-white">Premium Plans</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Monthly */}
          <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
            <h3 className="text-xl font-semibold text-white mb-2">Monthly</h3>
            <p className="text-3xl font-bold text-white">$2</p>
            <p className="text-sm text-gray-400 mb-6">per month</p>
            <button
              disabled={isLoading || busy !== null}
              onClick={() => goCheckout("monthly")}
              className="w-full px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50"
            >
              {busy === "monthly" ? "Processing…" : "Subscribe Monthly"}
            </button>
          </div>

          {/* Annual */}
          <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
            <h3 className="text-xl font-semibold text-white mb-2">Annual</h3>
            <p className="text-3xl font-bold text-white">$15</p>
            <p className="text-sm text-gray-400 mb-6">per year (save 37%)</p>
            <button
              disabled={isLoading || busy !== null}
              onClick={() => goCheckout("annual")}
              className="w-full px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-500 disabled:opacity-50"
            >
              {busy === "annual" ? "Processing…" : "Subscribe Annual"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
