// components/landing/PricingSection.tsx
import { useState } from 'react';
import { auth } from '@/lib/auth'; // Import the auth library

export default function PricingSection() {
  const [loading, setLoading] = useState('');

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);

    // Get the current user's ID. If not logged in, prompt them.
    const userId = auth.getUserId();
    if (!userId) {
      alert('Please log in or create an account to subscribe.');
      setLoading('');
      // Redirect to login page after alert
      window.location.href = '/login'; 
      return;
    }

    try {
      const response = await fetch(
        'https://vadjgqgyxc.execute-api.us-east-1.amazonaws.com/default/create-checkout-session', // 👈 PASTE THE URL YOU JUST COPIED
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          // Send both the priceId and the userId
          body: JSON.stringify({ priceId, userId }),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to create checkout session');
      }

      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error: Could not redirect to payment page.');
      setLoading('');
    }
  };
  
  const monthlyPriceId = 'price_1S6I4wEWbhWs9Y6oRzBGIh8e'; // 👈 Paste your TEST $2/month ID
  const annualPriceId = 'price_1S6I5FEWbhWs9Y6oGs4CQEc2';   // 👈 Paste your TEST $20/year ID

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-black to-neutral-900">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Flexible Pricing
          </h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto rounded-full mb-6" />
          <p className="text-neutral-400 text-lg">
            Unlock unlimited access to our growing library of interactive music activities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly */}
          <div className="spotify-card p-8 border border-neutral-800 hover:border-neutral-700 transition-all rounded-2xl flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
              <div className="text-5xl font-extrabold text-white mb-2">
                $2<span className="text-xl text-neutral-400">/month</span>
              </div>
              <p className="text-neutral-400">Perfect for trying things out</p>
            </div>
            <ul className="space-y-3 text-neutral-300 mb-8">
              <Feature>Unlimited Activity Access</Feature>
              <Feature>Weekly New Content</Feature>
              <Feature>All Music Genres</Feature>
              <Feature>Priority Support</Feature>
            </ul>
            <button
              onClick={() => handleCheckout(monthlyPriceId)}
              disabled={!!loading}
              className="mt-auto w-full text-center border border-neutral-700 text-neutral-200 hover:border-emerald-400 hover:bg-white/5 py-3 rounded-full transition disabled:opacity-50"
            >
              {loading === monthlyPriceId ? 'Redirecting...' : 'Choose Monthly'}
            </button>
          </div>

          {/* Annual */}
          <div className="spotify-card p-8 border-2 border-emerald-400 relative hover:border-emerald-300 transition-all rounded-2xl flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                ✨ Best Value
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Annual</h3>
              <div className="text-5xl font-extrabold text-white mb-1">
                $12<span className="text-xl text-neutral-400">/first year</span>
              </div>
              <p className="text-emerald-400 font-semibold mb-1">Save 40% on your first year</p>
              <p className="text-neutral-400">Renews at $20/year</p>
            </div>
            <ul className="space-y-3 text-neutral-300 mb-8">
              <Feature>Everything in Monthly</Feature>
              <Feature>Save 40% compared to monthly</Feature>
              <Feature>Early Access to New Features</Feature>
              <Feature>Downloadable Resources</Feature>
            </ul>
            <button
              onClick={() => handleCheckout(annualPriceId)}
              disabled={!!loading}
              className="mt-auto w-full text-center spotify-green spotify-green-hover text-black font-semibold py-3 rounded-full transition disabled:opacity-50"
              aria-label="Choose Annual plan"
            >
              {loading === annualPriceId ? 'Redirecting...' : '👑 Go Annual'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-2">
      <span className="inline-flex w-5 h-5 rounded-full bg-emerald-400 items-center justify-center text-black text-[11px]">
        ✓
      </span>
      <span>{children}</span>
    </li>
  );
}