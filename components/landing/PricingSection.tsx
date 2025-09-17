// components/landing/PricingSection.tsx
import { useState } from 'react';
import { Check, Crown, Sparkles } from 'lucide-react';

// Build a safe API URL once
const BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');
const API_URL = BASE ? `${BASE}/create-checkout-session` : '';

const MONTHLY_PRICE = 'price_1S6I4wEWbhWs9Y6oRzBGIh8e'; // test price
const ANNUAL_PRICE  = 'price_1S6I5FEWbhWs9Y6oGs4CQEc2'; // test price

export default function PricingSection() {
  const [loading, setLoading] = useState<string>('');

  const go = async (priceId: string) => {
    try {
      if (!API_URL) {
        throw new Error('API base URL is not configured.');
      }
      setLoading(priceId);

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      // Read text first in case it's not JSON
      const text = await res.text();
      let data: any = undefined;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok || !data?.url) {
        // Bubble up the best message we have
        const msg = data?.message || text || `Checkout API error (HTTP ${res.status})`;
        throw new Error(msg);
      }

      // Success → redirect to Stripe
      window.location.href = data.url;
    } catch (e: any) {
      console.error('[pricing] checkout error:', e);
      alert(e?.message || 'Could not redirect to payment page.');
      setLoading('');
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Flexible Pricing</h2>
          <div className="w-24 h-1 bg-green-400 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock unlimited access to our growing library of interactive music activities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly */}
          <div className="spotify-card rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Monthly</h3>
              <div className="text-5xl font-bold text-white mb-4">
                $2<span className="text-xl text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Perfect for trying things out.</p>
            </div>
            <div className="space-y-4 mb-8 flex-grow">
              <Feature>Unlimited Activity Access</Feature>
              <Feature>Weekly New Content</Feature>
              <Feature>All Music Genres</Feature>
              <Feature>Priority Support</Feature>
            </div>
            <button
              onClick={() => go(MONTHLY_PRICE)}
              disabled={!!loading}
              className="w-full border border-gray-600 text-white hover:bg-gray-800 py-3 text-lg rounded-full disabled:opacity-50"
            >
              {loading === MONTHLY_PRICE ? 'Processing…' : 'Choose Monthly'}
            </button>
          </div>

          {/* Annual */}
          <div className="spotify-card rounded-2xl p-8 border-2 border-green-400 relative hover:border-green-300 transition-all flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-green-400 text-black px-4 py-1 rounded-full text-sm font-semibold flex items-center">
                <Sparkles className="w-4 h-4 mr-1" />
                Best Value
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Annual</h3>
              <div className="text-5xl font-bold text-white mb-2">
                $15<span className="text-xl text-gray-400">/year</span>
              </div>
              <p className="text-green-400 font-semibold mb-2">Save 37%</p>
              <p className="text-gray-400">Just $1.25 per month</p>
            </div>
            <div className="space-y-4 mb-8 flex-grow">
              <Feature>Everything in Monthly</Feature>
              <Feature>Save 37% compared to monthly</Feature>
              <Feature>Early Access to New Features</Feature>
              <Feature>Downloadable Resources</Feature>
            </div>
            <button
              onClick={() => go(ANNUAL_PRICE)}
              disabled={!!loading}
              className="w-full spotify-green spotify-green-hover text-black font-semibold py-3 text-lg rounded-full disabled:opacity-50"
            >
              <Crown className="w-5 h-5 mr-2 inline" />
              {loading === ANNUAL_PRICE ? 'Processing…' : 'Go Annual'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center space-x-3">
      <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
        <Check className="w-3 h-3 text-green-400" />
      </div>
      <span className="text-gray-300">{children}</span>
    </div>
  );
}
