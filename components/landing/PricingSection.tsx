// components/landing/PricingSection.tsx
"use client";

import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || "").replace(/\/+$/, "");

export default function PricingSection() {
  const router = useRouter();
  const { isAuthenticated, getIdToken } = useAuth();
  
  // Helper function to check for login before proceeding
  const requireLoginThen = async (afterLoginPath: string) => {
    if (!isAuthenticated) {
      router.push(`/login?next=${encodeURIComponent(afterLoginPath)}`);
      return false;
    }
    return true;
  };

  const goCheckout = async (plan: "monthly" | "annual") => {
    // Use the helper to gate the action
    const ok = await requireLoginThen("/pricing");
    if (!ok) return;

    try {
        const idToken = await getIdToken();
        if(!idToken) throw new Error("Could not get auth token.");

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
    } catch (err) {
        console.error("Checkout error:", err);
        alert("An error occurred during checkout.");
    }
  };

  return (
    <section className="bg-black text-white">
      <div className="max-w-5xl mx-auto px-4 py-14">
        <h2 className="text-center text-4xl font-extrabold mb-2">Simple, Flexible Pricing</h2>
        <p className="text-center text-gray-400 mb-12">
          Unlock unlimited access to our growing library of interactive music activities.
        </p>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan Card */}
          <div className="rounded-2xl border border-white/10 bg-[#121821] p-8 shadow-xl">
            <h3 className="text-2xl font-semibold mb-1">Monthly</h3>
            <p className="text-5xl font-extrabold mt-4 mb-6">
              <span className="align-top text-2xl">$</span>2
              <span className="ml-2 text-2xl text-gray-300">/month</span>
            </p>
            <p className="text-gray-400 mb-6">Perfect for trying things out.</p>
            <ul className="space-y-3 mb-8 text-gray-300">
              <li>✅ Unlimited Activity Access</li>
              <li>✅ Weekly New Content</li>
              <li>✅ All Music Genres</li>
              <li>✅ Priority Support</li>
            </ul>
            <button
              onClick={() => goCheckout("monthly")}
              className="w-full px-6 py-4 rounded-full bg-gray-800 hover:bg-gray-700 font-semibold"
            >
              Choose Monthly
            </button>
          </div>
          {/* Annual Plan Card */}
          <div className="rounded-2xl border border-green-600/50 bg-[#121821] p-8 shadow-xl relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-black px-3 py-1 rounded-full text-sm font-semibold">
              🏆 Best Value
            </div>
            <h3 className="text-2xl font-semibold mb-1">Annual</h3>
            <p className="text-5xl font-extrabold mt-4 mb-2">
              <span className="align-top text-2xl">$</span>15
              <span className="ml-2 text-2xl text-gray-300">/year</span>
            </p>
            <p className="text-green-400 font-semibold mb-1">Save 37%</p>
            <p className="text-gray-400 mb-6">Just $1.25 per month</p>
            <ul className="space-y-3 mb-8 text-gray-300">
              <li>✅ Everything in Monthly</li>
              <li>✅ Save 37% compared to monthly</li>
              <li>✅ Early Access to New Features</li>
              <li>✅ Downloadable Resources</li>
            </ul>
            <button
              onClick={() => goCheckout("annual")}
              className="w-full px-6 py-4 rounded-full bg-green-500 text-black hover:bg-green-400 font-semibold"
            >
              Go Annual
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}