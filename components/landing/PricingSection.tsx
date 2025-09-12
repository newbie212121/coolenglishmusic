// components/landing/PricingSection.tsx
import { useState } from 'react';
import { signInWithRedirect } from 'aws-amplify/auth';
import { getUserSub, getIdTokenString } from '@/lib/auth-helpers'; // if the @ alias fails, use: '../../lib/auth-helpers'
import { Check, Crown, Sparkles } from 'lucide-react';

export default function PricingSection() {
  const [loading, setLoading] = useState<string>('');

  // ✅ Your Stripe price IDs (test mode)
  // Keep these or replace with your own from the Stripe dashboard
  const monthlyPriceId = 'price_1S6I4wEWbhWs9Y6oRzBGIh8e';
  const annualPriceId  = 'price_1S6I5FEWbhWs9Y6oGs4CQEc2';

  // ✅ Our Next.js API route that creates the Checkout Session
  const CHECKOUT_API = '/api/create-checkout-session';

  const handleCheckout = async (priceId: string) => {
    try {
      setLoading(priceId);

      // 1) Ensure the user is logged in
      const userId = await getUserSub();
      if (!userId) {
        await signInWithRedirect(); // returns via /login/callback
        setLoading('');
        return;
      }

      // 2) Get Cognito ID token and call our API with Bearer auth
      const idToken = await getIdTokenString();
      const res = await fetch(CHECKOUT_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json().catch(() => ({} as any));
      if (!res.ok || !data?.url) {
        console.error('Checkout API error:', { status: res.status, data });
        alert('Error: Could not redirect to payment page.');
        setLoading('');
        return;
      }

      // 3) Redirect to Stripe-hosted checkout
      window.location.href = data.url;
    } catch (err) {
      console.error(err);
      alert('Error: Could not redirect to payment page.');
      setLoading('');
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Simple, Flexible Pricing
          </h2>
          <div className="w-24 h-1 bg-green-400 mx-auto rounded-full mb-6" />
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock unlimited access to our growing library of interactive music activities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="spotify-card rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Monthly</h3>
              <div className="text-5xl font-bold text-white mb-4">
                $2<span className="text-xl text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Perfect for trying things out.</p>
            </div>
            <div className="space-y-4 mb-8 flex-grow">
              <FeatureItem>Unlimited Activity Access</FeatureItem>
              <FeatureItem>Weekly New Content</FeatureItem>
              <FeatureItem>All Music Genres</FeatureItem>
              <FeatureItem>Priority Support</FeatureItem>
            </div>
            <button
              onClick={() => handleCheckout(monthlyPriceId)}
              disabled={!!loading}
              className="w-full border border-gray-600 text-white hover:bg-gray-800 py-3 text-lg rounded-full disabled:opacity-50"
            >
              {loading === monthlyPriceId ? 'Processing…' : 'Choose Monthly'}
            </button>
          </div>

          {/* Annual Plan */}
          <div className="spotify-card rounded-2xl p-8 border-2 border-green-400 relative hover:border-green-300 transition-all flex flex-col">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
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
              <FeatureItem>Everything in Monthly</FeatureItem>
              <FeatureItem>Save 37% compared to monthly</FeatureItem>
              <FeatureItem>Early Access to New Features</FeatureItem>
              <FeatureItem>Downloadable Resources</FeatureItem>
            </div>
            <button
              onClick={() => handleCheckout(annualPriceId)}
              disabled={!!loading}
              className="w-full spotify-green spotify-green-hover text-black font-semibold py-3 text-lg rounded-full disabled:opacity-50"
            >
              <Crown className="w-5 h-5 mr-2 inline" />
              {loading === annualPriceId ? 'Processing…' : 'Go Annual'}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

const FeatureItem = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center space-x-3">
    <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
      <Check className="w-3 h-3 text-green-400" />
    </div>
    <span className="text-gray-300">{children}</span>
  </div>
);
