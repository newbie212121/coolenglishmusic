import { useState } from 'react';
import { Check, Crown, Sparkles } from 'lucide-react';
import { fetchAuthSession } from 'aws-amplify/auth';
import { useRouter } from 'next/router';

const BASE = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '');
const API_URL = BASE ? `${BASE}/create-checkout-session` : '';

const MONTHLY_PRICE = 'price_1S6I4wEWbhWs9Y6oRzBGIh8e'; // test price
const ANNUAL_PRICE  = 'price_1S6I5FEWbhWs9Y6oGs4CQEc2'; // test price

export default function PricingSection() {
  const [loading, setLoading] = useState<string>('');
  const router = useRouter();

  const go = async (priceId: string) => {
    try {
      setLoading(priceId);

      // Ensure logged in before checkout
      const session = await fetchAuthSession();
      const userId = session.tokens?.idToken?.payload?.sub as string | undefined;

      if (!userId) {
        // redirect to login and bring them back to pricing
        router.push("/login?next=/pricing");
        setLoading('');
        return;
      }

      // Call backend to create checkout session
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId }),
      });

      const data = await res.json();
      if (!res.ok || !data?.url) throw new Error(data?.message || 'Checkout API error');

      window.location.href = data.url;
    } catch (e: any) {
      alert(e?.message || 'Could not redirect to payment page.');
      setLoading('');
    }
  };

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      {/* ...the rest of your JSX unchanged... */}
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
