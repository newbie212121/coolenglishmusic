// pages/index.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import { getCurrentUser } from 'aws-amplify/auth';
import HeroSection from '@/components/landing/HeroSection';
import FreeActivities from '@/components/landing/FreeActivities';

// Inline PricingSection component
function SimplePricingSection() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "annual" | null>(null);

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setLoadingPlan(plan);
    
    try {
      let isLoggedIn = false;
      try {
        await getCurrentUser();
        isLoggedIn = true;
      } catch {
        // Not logged in
      }

      if (!isLoggedIn) {
        sessionStorage.setItem("pendingPlan", plan);
        sessionStorage.setItem("nextAfterLogin", "/pricing");
        router.push("/login");
        return;
      }

      const res = await fetch("https://api.coolenglishmusic.com/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          priceId: plan === "monthly" 
            ? "price_1S6I4wEWbhWs9Y6oRzBGIh8e" 
            : "price_1S6I5FEWbhWs9Y6oGs4CQEc2" 
        }),
      });

      const data = await res.json();
      if (res.ok && data?.url) {
        window.location.href = data.url;
      }
    } catch (e) {
      console.error("Checkout error:", e);
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <section className="py-20 px-4 bg-gradient-to-b from-gray-900 to-black">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Simple, Flexible Pricing</h2>
        <p className="text-gray-400 text-center mb-12">
          Unlock unlimited access to our growing library of interactive music activities
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="bg-[#111111] rounded-2xl border border-gray-800 p-8">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Monthly</h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-white">$2</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-500 text-sm">Perfect for trying things out</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Unlimited Activity Access
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Weekly New Content
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> All Music Genres
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Priority Support
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe("monthly")}
              disabled={loadingPlan !== null}
              className="w-full py-3 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-semibold transition"
            >
              Choose Monthly
            </button>
          </div>

          {/* Annual Plan */}
          <div className="relative bg-[#111111] rounded-2xl border-2 border-green-600 p-8">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-600 text-black text-sm font-bold px-4 py-1 rounded-full">
                ✨ Best Value
              </span>
            </div>

            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-white mb-4">Annual</h3>
              <div className="flex items-baseline justify-center gap-1 mb-2">
                <span className="text-4xl font-bold text-white">$15</span>
                <span className="text-gray-400">/year</span>
              </div>
              <p className="text-green-500 font-semibold">Save 37%</p>
              <p className="text-gray-500 text-sm">Just $1.25 per month</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Everything in Monthly
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Save 37% compared to monthly
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Early Access to New Features
              </li>
              <li className="flex items-center gap-3 text-gray-300">
                <span className="text-green-500">✓</span> Downloadable Resources
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe("annual")}
              disabled={loadingPlan !== null}
              className="w-full py-3 rounded-full bg-green-600 hover:bg-green-500 text-black font-bold transition"
            >
              ▶ Go Annual
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FreeActivities />
      <SimplePricingSection />
    </>
  );
}