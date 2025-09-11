// components/landing/PricingSection.tsx
import { useState } from 'react';
import { auth } from '@/lib/auth'; // Import the auth library

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
      const response = await fetch(
        'https://vadjgqgyxc.execute-api.us-east-1.amazonaws.com/default/create-checkout-session', // 👈 PASTE THE URL FOR YOUR 'create-checkout-session' LAMBDA
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
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
        {/* ... The rest of your pricing section JSX ... */}
        {/* Monthly Button */}
        <button
          onClick={() => handleCheckout(monthlyPriceId)}
          // ...
        >
          {loading === monthlyPriceId ? 'Redirecting...' : 'Choose Monthly'}
        </button>
        {/* Annual Button */}
        <button
          onClick={() => handleCheckout(annualPriceId)}
          // ...
        >
          {loading === annualPriceId ? 'Redirecting...' : '👑 Go Annual'}
        </button>
      </div>
    </section>
  );
}

// ... your Feature component ...