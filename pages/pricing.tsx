// pages/pricing.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "aws-amplify/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

const STRIPE_PRICE_IDS = {
  monthly: "price_1S6I4wEWbhWs9Y6oRzBGIh8e",
  annual: "price_1S6I5FEWbhWs9Y6oGs4CQEc2"
};

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "annual" | null>(null);

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setLoadingPlan(plan);
    
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
        sessionStorage.setItem("pendingPlan", plan);
        sessionStorage.setItem("nextAfterLogin", "/pricing");
        router.push("/login");
        return;
      }

      // Create checkout session
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          priceId: STRIPE_PRICE_IDS[plan]
        }),
      });

      const data = await res.json();
      
      if (res.ok && data?.url) {
        window.location.href = data.url;
      } else {
        alert(data?.message || "Could not start checkout. Please try again.");
      }
    } catch (e) {
      console.error("Checkout error:", e);
      alert("An error occurred. Please try again.");
    } finally {
      setLoadingPlan(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <h1 className="text-5xl font-bold text-center mb-4">
          Choose Your Plan
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
        <p className="text-center text-gray-400 text-lg">
          Unlock unlimited access to interactive music activities for English learning
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8 mb-20">
          {/* Monthly Plan */}
          <div className="relative bg-[#111111] rounded-2xl border border-gray-800 p-8 hover:border-gray-700 transition-all">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Monthly</h2>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">$2</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">Perfect for trying things out</p>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Unlimited Activity Access</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Weekly New Content</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>All Music Genres</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Priority Support</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe("monthly")}
              disabled={loadingPlan !== null}
              className="w-full py-4 rounded-full bg-gray-800 hover:bg-gray-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {loadingPlan === "monthly" ? "Processing..." : "Subscribe Monthly"}
            </button>
          </div>

          {/* Annual Plan */}
          <div className="relative bg-[#111111] rounded-2xl border-2 border-green-600 p-8 hover:border-green-500 transition-all">
            {/* Best Value Badge */}
            <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-600 text-black text-sm font-bold px-4 py-1 rounded-full flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                Best Value
              </span>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Annual</h2>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">$15</span>
                <span className="text-gray-400">/year</span>
              </div>
              <div className="mt-2">
                <span className="text-green-500 font-semibold">Save 37%</span>
                <p className="text-gray-500 text-sm">Just $1.25 per month</p>
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Everything in Monthly</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Save 37% compared to monthly</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Early Access to New Features</span>
              </li>
              <li className="flex items-center gap-3">
                <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                </svg>
                <span>Downloadable Resources</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe("annual")}
              disabled={loadingPlan !== null}
              className="w-full py-4 rounded-full bg-green-600 hover:bg-green-500 text-black font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {loadingPlan === "annual" ? "Processing..." : "Go Annual"}
            </button>
          </div>
        </div>

        {/* FAQs */}
        <div className="bg-[#111111] rounded-2xl p-12">
          <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
          
          <div className="grid md:grid-cols-2 gap-x-12 gap-y-8">
            <div>
              <h3 className="text-xl font-semibold mb-3">Can I cancel anytime?</h3>
              <p className="text-gray-400">
                Yes, you can cancel your subscription at any time. You'll continue to have access until your current billing period ends.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">How often is new content added?</h3>
              <p className="text-gray-400">
                We add fresh activities every week, including new songs and interactive exercises across different genres.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">What age groups are supported?</h3>
              <p className="text-gray-400">
                Our activities are designed for English learners of all ages, from elementary students to adult learners.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold mb-3">Do I need special software?</h3>
              <p className="text-gray-400">
                No, all activities run in your web browser. Just click and start learning with music!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}