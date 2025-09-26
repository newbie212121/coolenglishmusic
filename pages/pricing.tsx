// pages/pricing.tsx - With Team UI Added (Not Connected Yet)
import { useState } from "react";
import { useRouter } from "next/router";
import { getCurrentUser } from "aws-amplify/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "https://api.coolenglishmusic.com";

const STRIPE_PRICE_IDS = {
  monthly: "price_1S6I4wEWbhWs9Y6oRzBGIh8e",
  annual: "price_1S6I5FEWbhWs9Y6oGs4CQEc2",
  teamSeat: "price_1SBK11EWbhWs9Y6o4gPa824W" // Your team seat price ID
};

export default function PricingPage() {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<"monthly" | "annual" | "team" | null>(null);
  const [error, setError] = useState<string>("");
  
  // Team-specific states
  const [teamSeats, setTeamSeats] = useState(5);
  const [isAnnual, setIsAnnual] = useState(false);
  
  const teamPricePerSeat = isAnnual ? 18 : 1.75;
  const teamTotal = teamPricePerSeat * teamSeats;

  const handleSubscribe = async (plan: "monthly" | "annual") => {
    setLoadingPlan(plan);
    setError("");
    
    try {
      let userId: string;
      let userEmail: string = "";
      
      try {
        const user = await getCurrentUser();
        userId = user.userId;
        userEmail = user.signInDetails?.loginId || "";
        console.log("User authenticated:", userId);
      } catch {
        console.log("User not authenticated, redirecting to login");
        sessionStorage.setItem("pendingPlan", plan);
        sessionStorage.setItem("postLoginRedirect", "/pricing");
        router.push("/login");
        return;
      }

      console.log("Creating checkout session for plan:", plan);
      const res = await fetch(`${API_BASE}/create-checkout-session`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          priceId: STRIPE_PRICE_IDS[plan],
          userId: userId,
          email: userEmail
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

const handleTeamCheckout = async () => {
  setLoadingPlan("team");
  setError("");
  
  try {
    // Get user info
    const user = await getCurrentUser();
    const userId = user.userId;
    const userEmail = user.signInDetails?.loginId || "";
    
    // Get auth token
    const idToken = localStorage.getItem('idToken');
    
    console.log('Calling team checkout...');
    
    const response = await fetch(`${API_BASE}/create-team-checkout`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${idToken}`
      },
      body: JSON.stringify({ 
        seatCount: teamSeats,
        annual: isAnnual
      })
    });

    // Log the response for debugging
    console.log('Response status:', response.status);
    
    const data = await response.json();
    console.log('Response data:', data);
    
    // Check for the URL and redirect
    if (data.sessionUrl || data.url) {
      console.log('Redirecting to:', data.sessionUrl || data.url);
      window.location.href = data.sessionUrl || data.url;
      // Don't set loading to null here - we're redirecting
      return;
    } else {
      throw new Error('No checkout URL in response');
    }
    
  } catch (error: any) {
    console.error("Team checkout error:", error);
    setError(error.message || "Failed to start team checkout");
    setLoadingPlan(null);
  }
};

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <h1 className="text-5xl font-bold text-center mb-4">
          Simple Pricing for Every Classroom
        </h1>
        <div className="w-24 h-1 bg-green-500 mx-auto mb-8"></div>
        <p className="text-center text-gray-400 text-lg">
          Choose the plan that's right for you. Unlock 160+ music-based activities to energize your ESL lessons.
        </p>
        
        {/* Billing Toggle */}
        <div className="flex justify-center mt-8">
          <div className="inline-flex items-center gap-3 bg-gray-900 p-2 rounded-full border border-gray-800">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-4 py-2 rounded-full transition-all ${
                !isAnnual ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-4 py-2 rounded-full transition-all ${
                isAnnual ? 'bg-gray-700 text-white' : 'text-gray-400'
              }`}
            >
              Yearly
              {isAnnual && <span className="ml-2 text-green-500 text-sm">Save 25%</span>}
            </button>
          </div>
        </div>
        
        {/* Error Message */}
        {error && (
          <div className="mt-6 p-4 bg-red-900/20 border border-red-800 rounded-lg text-red-400 text-center">
            {error}
          </div>
        )}
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        <div className="grid md:grid-cols-3 gap-8">
          
          {/* Individual Plan */}
          <div className="bg-[#111111] rounded-2xl border border-gray-800 p-8 hover:border-gray-700 transition-all">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Individual</h2>
              <p className="text-gray-500 text-sm mb-4">Perfect for solo teachers</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">
                  ${isAnnual ? "20" : "2"}
                </span>
                <span className="text-gray-400">
                  /{isAnnual ? "year" : "month"}
                </span>
              </div>
              {isAnnual && (
                <p className="text-amber-500 text-sm mt-2">
                  ✨ First year special: $15
                </p>
              )}
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>All 160+ activities</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Student share links</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Use on 3 devices</span>
              </li>
            </ul>

            <button
              onClick={() => handleSubscribe(isAnnual ? "annual" : "monthly")}
              disabled={loadingPlan !== null}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loadingPlan === "monthly" || loadingPlan === "annual" ? "Loading..." : "Get Started"}
            </button>
          </div>

          {/* Team Plan */}
          <div className="relative bg-[#111111] rounded-2xl border-2 border-green-600 p-8">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold">
              MOST POPULAR
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Team Plan</h2>
              <p className="text-gray-500 text-sm mb-4">For schools & departments</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-5xl font-bold">
                  ${teamTotal.toFixed(2)}
                </span>
                <span className="text-gray-400">
                  /{isAnnual ? "year" : "month"}
                </span>
              </div>
              <p className="text-green-500 text-sm mt-2">
                ${teamPricePerSeat.toFixed(2)} per teacher/{isAnnual ? "year" : "month"}
              </p>
            </div>
            
            {/* Seat Selector */}
            <div className="bg-gray-900/50 p-4 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-3">
                <label className="text-sm text-gray-400">Number of teachers</label>
                <span className="text-lg font-semibold">{teamSeats}</span>
              </div>
              <input
                type="range"
                min="2"
                max="49"
                value={teamSeats}
                onChange={(e) => setTeamSeats(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                style={{
                  background: `linear-gradient(to right, #10b981 0%, #10b981 ${
                    ((teamSeats - 2) / 47) * 100
                  }%, #374151 ${((teamSeats - 2) / 47) * 100}%, #374151 100%)`
                }}
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>2 seats</span>
                <span>49 seats</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Everything in Individual</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Centralized billing</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Manage team members</span>
              </li>
            </ul>

            <button
              onClick={handleTeamCheckout}
              disabled={loadingPlan !== null}
              className="w-full py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 text-white rounded-lg font-semibold transition-all disabled:opacity-50"
            >
              {loadingPlan === "team" ? "Loading..." : "Continue to Checkout"}
            </button>
            <p className="text-center text-gray-500 text-xs mt-2">
              Seats can be adjusted anytime
            </p>
          </div>

          {/* Enterprise Plan */}
          <div className="bg-[#111111] rounded-2xl border border-gray-800 p-8 hover:border-gray-700 transition-all">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold mb-2">Schools & Districts</h2>
              <p className="text-gray-500 text-sm mb-4">For 50+ teachers</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-3xl font-bold">Contact Us</span>
              </div>
              <p className="text-gray-400 text-sm mt-2">Custom pricing available</p>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Volume discounts</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Invoice & PO accepted</span>
              </li>
              <li className="flex items-center gap-2">
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>Dedicated support</span>
              </li>
            </ul>

            <button
              onClick={() => window.location.href = 'mailto:support@coolenglishmusic.com'}
              className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all"
            >
              Contact Sales
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