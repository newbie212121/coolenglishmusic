// components/landing/PricingSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");
const CREATE_URL = `${BASE}/create-checkout-session`;

type Plan = { label: string; priceId: string };

const PLANS: Plan[] = [
  { label: "Monthly", priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY || "" },
  { label: "Annual",  priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL  || "" },
];

export default function PricingSection() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();
  const [busy, setBusy] = useState<string | null>(null);

  const startCheckout = async (plan: Plan) => {
    // 1) force login first, bounce back to /pricing after login
    if (!isAuthenticated) {
      router.push("/login?next=/pricing");
      return;
    }

    try {
      setBusy(plan.label);

      // You must pass user sub as userId so your webhook can write Dynamo
      const idToken = (await import("aws-amplify/auth")).fetchAuthSession().then(s => s.tokens?.idToken?.toString());

      const res = await fetch(CREATE_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json", Origin: window.location.origin },
        body: JSON.stringify({
          priceId: plan.priceId,
          userId: (await (await import("aws-amplify/auth")).getCurrentUser()).userId, // Cognito sub
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        alert(err?.message || "Could not start checkout.");
        return;
      }

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("No checkout URL returned.");
      }
    } catch (e) {
      console.error("[pricing] checkout error:", e);
      alert("Checkout failed. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="mx-auto max-w-5xl px-4 py-12 text-white">
      <h2 className="text-4xl font-bold text-center mb-10">Simple, Flexible Pricing</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {PLANS.map((p) => (
          <div key={p.label} className="rounded-2xl border border-green-900/40 bg-black/40 p-6">
            <h3 className="text-xl font-semibold mb-3">{p.label}</h3>
            <ul className="text-gray-300 mb-6 space-y-2">
              <li>Unlimited Activity Access</li>
              <li>Weekly New Content</li>
              <li>All Music Genres</li>
              <li>Priority Support</li>
            </ul>
            <button
              onClick={() => startCheckout(p)}
              disabled={!!busy}
              className="w-full rounded-full bg-green-500 text-black font-semibold py-3 hover:bg-green-400 disabled:opacity-60"
            >
              {busy === p.label ? "Processing..." : p.label === "Annual" ? "Go Annual" : "Choose Monthly"}
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}
