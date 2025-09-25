import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe('pk_test_51Ps5T2GovzMa8KUCN3LVOgjHCcBJOTXmSBQGqJlaNRLgMl2RHmC91RgOBXzn1EqGsUxZ7Eqko2fhQjHo61Swulzk005bj3tLjx');

const API_URL = 'https://api.coolenglishmusic.com';

export default function Pricing() {
  const { user, getIdToken } = useAuth();
  const [loading, setLoading] = useState({ monthly: false, annual: false, team: false });
  const [seatCount, setSeatCount] = useState(5);
  const [teamPrice, setTeamPrice] = useState(8.75);
  const [error, setError] = useState('');

  useEffect(() => {
    setTeamPrice(seatCount * 1.75);
  }, [seatCount]);

  const handleCheckout = async (plan: string) => {
    if (!user) {
      window.location.href = '/login?redirect=/pricing';
      return;
    }

    setError('');
    const loadingKey = plan === 'monthly' ? 'monthly' : plan === 'annual' ? 'annual' : 'team';
    setLoading(prev => ({ ...prev, [loadingKey]: true }));

    try {
      const idToken = await getIdToken();
      
      let endpoint, payload;
      
      if (plan === 'team') {
        endpoint = '/create-team-checkout';
        payload = {
          seatCount: seatCount,
          userId: user.uid,
          email: user.email
        };
      } else {
        // THIS IS THE FIX - changed from /create-checkout to /create-checkout-session
        endpoint = '/create-checkout-session'; 
        const priceId = plan === 'monthly' 
          ? 'price_1Ps6gTGovzMa8KUCXQWShPwI'
          : 'price_1Ps6hbGovzMa8KUC5qTGppei';
        
        payload = {
          priceId,
          userId: user.uid,
          email: user.email
        };
      }

      console.log(`Calling ${endpoint} with payload:`, payload);

      const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${idToken}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Request failed' }));
        throw new Error(errorData.error || `Request failed with status ${response.status}`);
      }

      const data = await response.json();
      
      if (data.url) {
        window.location.href = data.url;
      } else if (data.sessionId) {
        const stripe = await stripePromise;
        const { error } = await stripe.redirectToCheckout({ sessionId: data.sessionId });
        if (error) {
          throw error;
        }
      } else {
        throw new Error('No checkout URL or session ID received');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(prev => ({ ...prev, [loadingKey]: false }));
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl text-gray-300">Choose the plan that works for you</p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 bg-red-500/10 border border-red-500 rounded-lg">
            <p className="text-red-400 text-center">{error}</p>
          </div>
        )}

        <div className="mb-16">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            For Individual Teachers
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8">
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Monthly</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">$2</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Access all 160+ activities
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Cancel anytime
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('monthly')}
                disabled={loading.monthly}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading.monthly ? 'Processing...' : 'Get Started'}
              </button>
            </div>

            <div className="bg-gray-800/50 backdrop-blur border border-green-600 rounded-xl p-8 relative">
              <div className="absolute -top-3 right-6 bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                BEST VALUE
              </div>
              <div className="mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Annual</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">$15</span>
                  <span className="text-gray-400 ml-2">/year</span>
                </div>
                <p className="text-green-400 text-sm mt-2">First year only, then $20/year</p>
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  Save $9 first year!
                </li>
                <li className="flex items-center text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  All features included
                </li>
              </ul>
              <button
                onClick={() => handleCheckout('annual')}
                disabled={loading.annual}
                className="w-full py-3 px-6 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
              >
                {loading.annual ? 'Processing...' : 'Get Started'}
              </button>
            </div>
          </div>
        </div>

        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">
            For Schools & Teams
          </h2>
          <div className="bg-gray-800/50 backdrop-blur border border-gray-700 rounded-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-semibold text-white mb-2">Team License</h3>
                <div className="flex items-baseline">
                  <span className="text-4xl font-bold text-white">${teamPrice.toFixed(2)}</span>
                  <span className="text-gray-400 ml-2">/month</span>
                </div>
              </div>
              <span className="bg-blue-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                Save 15%
              </span>
            </div>

            <div className="mb-8">
              <label className="block text-gray-300 mb-3">
                How many teachers?
              </label>
              <div className="space-y-3">
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={seatCount}
                  onChange={(e) => setSeatCount(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-green-600"
                />
                <div className="flex justify-between text-sm text-gray-400">
                  <span>{seatCount} seats</span>
                  <span>= ${(seatCount * 1.75).toFixed(2)}/month</span>
                </div>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Everything in Individual
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Centralized billing
              </li>
              <li className="flex items-center text-gray-300">
                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                Add/remove teachers anytime
              </li>
            </ul>

            <button
              onClick={() => handleCheckout('team')}
              disabled={loading.team}
              className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              {loading.team ? 'Processing...' : `Start Team (${seatCount} seats)`}
            </button>
            
            <p className="text-center text-gray-400 text-sm mt-4">
              Need more than 50 seats? <a href="mailto:support@coolenglishmusic.com" className="text-blue-400 hover:underline">Contact us</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}