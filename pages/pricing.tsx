// pages/pricing.tsx - Best Practices Version
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
  const [error, setError] = useState<string>("");

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setLoadingPlan(plan);
    setError("");
    
    try {
      // Step 1: Check if user is logged in and get their info
      let userId: string;
      let userEmail: string = "";
      
      try {
        const user = await getCurrentUser();
        userId = user.userId;  // Cognito UUID
        userEmail = user.signInDetails?.loginId || "";
        console.log("User authenticated:", userId);
      } catch {
        // Not logged in - redirect to login
        console.log("User not authenticated, redirecting to login");
        sessionStorage.setItem("pendingPlan", plan);
        sessionStorage.setItem("postLoginRedirect", "/pricing");
        router.push("/login");
        return;
      }

      // Step 2: Create Stripe checkout session
      console.log("Creating checkout session for plan:", plan);
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          priceId: STRIPE_PRICE_IDS[plan],
          userId: userId,      // Pass Cognito UUID
          email: userEmail     // Pass email for Stripe customer
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || data.message || "Failed to create checkout session");
      }
      
      if (data.url) {
        console.log("Redirecting to Stripe checkout");
        window.location.href = data.url;
      } else {
        throw new Error("No checkout URL received");
      }
      
    } catch (error: any) {
      console.error("Checkout error:", error);
      setError(error.message || "Failed to start checkout. Please try again.");
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
        
        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="max-w-5xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-2 gap-8">
          
          {/* Monthly Plan */}
          <div className="bg-[#111111] rounded-2xl border border-gray-800 p-8 hover:border-gray-700 transition-all">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Monthly</h2>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">$2</span>
                <span className="text-gray-400">/month</span>
              </div>
              <p className="text-gray-500 text-sm mt-2">
                Perfect for trying things out
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Unlimited Activity Access</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Weekly New Content</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Cancel Anytime</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe("monthly")}
              disabled={loadingPlan !== null}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loadingPlan === "monthly" ? "Loading..." : "Subscribe Monthly"}
            </button>
          </div>

          {/* Annual Plan */}
          <div className="relative bg-[#111111] rounded-2xl border-2 border-green-600 p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-black px-4 py-1 rounded-full text-sm font-bold">
              BEST VALUE
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-4">Annual</h2>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">$15</span>
                <span className="text-gray-400">/year</span>
              </div>
              <p className="text-green-500 text-sm mt-2 font-semibold">
                Save 37% (Just $1.25 per month)
              </p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Everything in Monthly</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Save 37% compared to monthly</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Priority Support</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe("annual")}
              disabled={loadingPlan !== null}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loadingPlan === "annual" ? "Loading..." : "Go Annual"}
            </button>
          </div>
        </div>

        {/* Login reminder */}
        <p className="text-center text-gray-400 text-sm mt-8">
          You must be logged in to subscribe. 
          <a href="/login" className="text-green-500 hover:text-green-400 ml-1">
            Log in here
          </a>
        </p>
      </div>
    </div>
  );
}