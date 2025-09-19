// components/landing/PricingSection.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "aws-amplify/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

// Hardcoded price IDs
const STRIPE_PRICE_IDS = {
  monthly: "price_1S6I4wEWbhWs9Y6oRzBGIh8e",
  annual: "price_1S6I5FEWbhWs9Y6oGs4CQEc2"
};

export default function PricingSection() {
  const router = useRouter();
  const [busy, setBusy] = useState<"monthly" | "annual" | null>(null);

  const goCheckout = async (plan: "monthly" | "annual") => {
    setBusy(plan);
    
    try {
      // Check if user is logged in
      let isLoggedIn = false;
      try {
        await getCurrentUser();
        isLoggedIn = true;
      } catch {
        // Not logged in
      }

      if (!isLoggedIn) {
        // Save intended plan and redirect to login
        sessionStorage.setItem("pendingPlan", plan);
        sessionStorage.setItem("nextAfterLogin", "/pricing");
        router.push("/login");
        return;
      }

      // User is logged in, proceed with checkout
      console.log(`Creating ${plan} checkout session...`);
      
      const requestBody = { 
        priceId: STRIPE_PRICE_IDS[plan]
      };
      
      console.log("Sending to Stripe:", requestBody);
      
      // Call the Lambda WITHOUT auth header (since Lambda is simplified)
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody),
      });

      const data = await res.json().catch(() => ({}));
      
      if (res.ok && data?.url) {
        console.log("Redirecting to Stripe checkout...");
        window.location.href = data.url;
      } else {
        console.error("Checkout failed:", res.status, data);
        alert(data?.error || data?.message || "Could not start checkout. Please try again.");
      }
    } catch (e) {
      console.error("Checkout error:", e);
      alert("An error occurred. Please try again.");
    } finally {
      setBusy(null);
    }
  };

  // Check if there's a pending plan after login
  useState(() => {
    const pendingPlan = sessionStorage.getItem("pendingPlan") as "monthly" | "annual" | null;
    if (pendingPlan) {
      sessionStorage.removeItem("pendingPlan");
      // Auto-trigger checkout after successful login
      setTimeout(() => {
        goCheckout(pendingPlan);
      }, 500);
    }
  });

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
              disabled={busy !== null}
              onClick={() => goCheckout("monthly")}
              className="w-full px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {busy === "monthly" ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></span>
                  Processing...
                </span>
              ) : "Subscribe Monthly"}
            </button>
          </div>

          {/* Annual */}
          <div className="rounded-2xl border border-white/10 p-6 bg-white/5">
            <h3 className="text-xl font-semibold text-white mb-2">Annual</h3>
            <p className="text-3xl font-bold text-white">$15</p>
            <p className="text-sm text-gray-400 mb-6">per year (save 37%)</p>
            <button
              disabled={busy !== null}
              onClick={() => goCheckout("annual")}
              className="w-full px-4 py-2 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {busy === "annual" ? (
                <span className="flex items-center justify-center">
                  <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                  Processing...
                </span>
              ) : "Subscribe Annual"}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}