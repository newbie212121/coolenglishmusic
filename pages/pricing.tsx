// pages/pricing.tsx - FIXED to work with your AuthContext
import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { fetchAuthSession } from 'aws-amplify/auth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.coolenglishmusic.com';

export default function Pricing() {
  const router = useRouter();
  const { isAuthenticated, getIdToken } = useAuth();
  const [loading, setLoading] = useState<'monthly' | 'annual' | null>(null);
  const [error, setError] = useState('');

  const handleCheckout = async (plan: 'monthly' | 'annual') => {
    // Check authentication first
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }
    
    setLoading(plan);
    setError('');
    
    try {
      // Get the session to extract userId and email
      const session = await fetchAuthSession();
      const idToken = session.tokens?.idToken;
      
      if (!idToken) {
        throw new Error('No authentication token found');
      }
      
      // Extract userId and email from the token payload
      const userId = idToken.payload.sub as string; // This is the Cognito UUID
      const userEmail = (idToken.payload.email || idToken.payload['cognito:username']) as string;
      
      // Use your EXISTING create-checkout-session endpoint
      const priceId = plan === 'annual' 
        ? 'price_1Ps6hbGovzMa8KUC5qTGppei'  // Your annual price ID
        : 'price_1Ps6gTGovzMa8KUCXQWShPwI'; // Your monthly price ID
      
      const response = await fetch(`${API_BASE}/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: priceId,
          userId: userId,
          email: userEmail
        })
      });

      const data = await response.json();
      
      if (data.url) {
        // Redirect to Stripe
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'No checkout URL received');
      }
      
    } catch (err: any) {
      console.error('Checkout error:', err);
      setError(err.message || 'Failed to start checkout. Please try again.');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-4">
          Choose Your Plan
        </h1>
        <p className="text-gray-400 text-center mb-8">
          Unlock unlimited access to interactive music activities for English learning
        </p>
        
        {error && (
          <div className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-lg mb-6">
            {error}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Monthly */}
          <div className="bg-gray-800 rounded-lg p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-4">Monthly</h2>
            <p className="text-4xl font-bold text-white mb-2">
              $2<span className="text-lg text-gray-400">/month</span>
            </p>
            <p className="text-gray-400 mb-6">Perfect for trying things out</p>
            
            <ul className="mb-8 space-y-3">
              <li className="flex items-center text-gray-300">
                <span className="text-green-500 mr-2">✓</span>
                Unlimited Activity Access
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-500 mr-2">✓</span>
                Weekly New Content
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-500 mr-2">✓</span>
                Cancel Anytime
              </li>
            </ul>
            
            <button
              onClick={() => handleCheckout('monthly')}
              disabled={loading !== null}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              {loading === 'monthly' ? 'Loading...' : 'Subscribe Monthly'}
            </button>
          </div>

          {/* Annual */}
          <div className="bg-gray-800 rounded-lg p-8 border-2 border-green-500 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-green-500 text-white text-sm px-4 py-1 rounded-full font-semibold">
                BEST VALUE
              </span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-4">Annual</h2>
            <p className="text-4xl font-bold text-white mb-2">
              $15<span className="text-lg text-gray-400">/year</span>
            </p>
            <p className="text-green-400 mb-6">
              Save 37% (Just $1.25 per month!)
            </p>
            
            <ul className="mb-8 space-y-3">
              <li className="flex items-center text-gray-300">
                <span className="text-green-500 mr-2">✓</span>
                Everything in Monthly
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-500 mr-2">✓</span>
                Save 37% compared to monthly
              </li>
              <li className="flex items-center text-gray-300">
                <span className="text-green-500 mr-2">✓</span>
                Priority Support
              </li>
            </ul>
            
            <button
              onClick={() => handleCheckout('annual')}
              disabled={loading !== null}
              className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              {loading === 'annual' ? 'Loading...' : 'Go Annual'}
            </button>
          </div>
        </div>

        <p className="text-center text-gray-500 mt-8 text-sm">
          You must be logged in to subscribe. 
          <button 
            onClick={() => router.push('/login')} 
            className="text-blue-400 ml-1 hover:underline"
          >
            Log in here
          </button>
        </p>
      </div>
    </div>
  );
}