// components/landing/PricingSection.tsx
import { useState } from 'react';
import { auth } from '@/lib/auth';

export default function PricingSection() {
  const [loading, setLoading] = useState('');

  const handleCheckout = async (priceId: string) => {
    setLoading(priceId);
    const userId = auth.getUserId();
    if (!userId) {
      alert('Please log in or create an account to subscribe.');
      setLoading('');
      window.location.href = '/login'; 
      return;
    }
    try {
      const response = await fetch('https://vadjgqgyxc.execute-api.us-east-1.amazonaws.com/default/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId, userId }),
      });
      if (!response.ok) throw new Error('API request failed');
      const { url } = await response.json();
      window.location.href = url;
    } catch (error) {
      alert('Error: Could not redirect to payment page.');
      setLoading('');
    }
  };
  
  const monthlyPriceId = 'price_1S6I4wEWbhWs9Y6oRzBGIh8e';
  const annualPriceId = 'price_1S6I5FEWbhWs9Y6oGs4CQEc2';

  return (
    <section className="py-20 px-4 bg-black">
      <div className="max-w-5xl mx-auto">
        {/* All the correct JSX for the pricing section... */}
        <button onClick={() => handleCheckout(monthlyPriceId)} disabled={!!loading}>
          {loading === monthlyPriceId ? 'Redirecting...' : 'Choose Monthly'}
        </button>
        <button onClick={() => handleCheckout(annualPriceId)} disabled={!!loading}>
          {loading === annualPriceId ? 'Redirecting...' : 'Go Annual'}
        </button>
      </div>
    </section>
  );
}