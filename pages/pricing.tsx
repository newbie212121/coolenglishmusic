// pages/pricing.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Check, Users } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const PricingPage = () => {
  const router = useRouter();
  const { isAuthenticated, getIdToken } = useAuth();
  const [teamSeats, setTeamSeats] = useState(5);
  const [loading, setLoading] = useState(false);
  
  // Individual plans
  const handleIndividualPurchase = async (priceId: string, annual: boolean = false) => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }
    
    setLoading(true);
    try {
      const token = await getIdToken();
      if (!token) {
        router.push('/login');
        return;
      }
      
      // Use your existing checkout creation endpoint
      const response = await fetch('https://api.coolenglishmusic.com/create-checkout-session', {
        method: 'POST',
        headers: {
          'Authorization': token, // Note: just token, not Bearer
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          priceId: annual ? 'price_1Ps6hbGovzMa8KUC5qTGppei' : 'price_1Ps6gTGovzMa8KUCXQWShPwI',
          mode: 'subscription'
        })
      });
      
      const data = await response.json();
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };
  
  // Team checkout
  const handleTeamPurchase = async () => {
    if (!isAuthenticated) {
      router.push('/login?redirect=/pricing');
      return;
    }
    
    setLoading(true);
    try {
      const token = await getIdToken();
      if (!token) {
        router.push('/login');
        return;
      }
      
      const response = await fetch('https://api.coolenglishmusic.com/create-team-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seatCount: teamSeats
        })
      });
      
      if (!response.ok) {
        const error = await response.json();
        console.error('Team checkout error:', error);
        alert(error.error || 'Failed to create team checkout');
        return;
      }
      
      const data = await response.json();
      if (data.sessionUrl) {
        window.location.href = data.sessionUrl;
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Failed to create checkout session');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Simple, Transparent Pricing
        </h1>
        
        {/* Individual Plans */}
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            For Individual Teachers
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Monthly */}
            <div className="bg-gray-800 rounded-lg p-8">
              <h3 className="text-xl font-bold text-white mb-2">Monthly</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$2</span>
                <span className="text-gray-400">/month</span>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-white">Access all 160+ activities</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-white">Cancel anytime</span>
                </li>
              </ul>
              <button
                onClick={() => handleIndividualPurchase('monthly', false)}
                disabled={loading}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-semibold"
              >
                Get Started
              </button>
            </div>
            
            {/* Annual */}
            <div className="bg-gray-800 rounded-lg p-8 border-2 border-green-500">
              <div className="bg-green-500 text-white text-xs px-2 py-1 rounded inline-block mb-2">
                BEST VALUE
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Annual</h3>
              <div className="mb-4">
                <span className="text-4xl font-bold text-white">$15</span>
                <span className="text-gray-400">/year</span>
                <p className="text-sm text-green-400 mt-1">First year only, then $20/year</p>
              </div>
              <ul className="space-y-2 mb-6">
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-white">Save $9 first year!</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-5 h-5 text-green-500 mt-0.5" />
                  <span className="text-white">All features included</span>
                </li>
              </ul>
              <button
                onClick={() => handleIndividualPurchase('annual', true)}
                disabled={loading}
                className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-semibold"
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
        
        {/* Team Plan */}
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-semibold text-white text-center mb-6">
            For Schools & Teams
          </h2>
          <div className="bg-gray-800 rounded-lg p-8">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-white">Team License</h3>
              <span className="bg-green-500 text-white text-sm px-3 py-1 rounded">
                Save 15%
              </span>
            </div>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">
                ${(teamSeats * 1.75).toFixed(2)}
              </span>
              <span className="text-gray-400">/month</span>
            </div>
            
            <div className="bg-gray-700 rounded-lg p-4 mb-6">
              <label className="block text-sm text-gray-400 mb-2">
                How many teachers?
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  min="2"
                  max="50"
                  value={teamSeats}
                  onChange={(e) => setTeamSeats(parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={teamSeats}
                  onChange={(e) => {
                    const value = parseInt(e.target.value);
                    if (value >= 2 && value <= 50) {
                      setTeamSeats(value);
                    }
                  }}
                  className="w-20 px-2 py-1 bg-gray-600 text-white rounded text-center"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {teamSeats} seats × $1.75 = ${(teamSeats * 1.75).toFixed(2)}/month
              </p>
            </div>
            
            <ul className="space-y-2 mb-6">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-white">Everything in Individual</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-white">Centralized billing</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-white">Add/remove teachers anytime</span>
              </li>
            </ul>
            
            <button
              onClick={handleTeamPurchase}
              disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-semibold"
            >
              {loading ? 'Creating checkout...' : `Start Team (${teamSeats} seats)`}
            </button>
          </div>
        </div>
        
        {/* Enterprise */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Need more than 50 seats?
          </p>
          <button
            onClick={() => window.location.href = 'mailto:support@coolenglishmusic.com?subject=Enterprise Pricing'}
            className="px-6 py-3 border border-gray-600 text-white rounded-lg hover:bg-gray-800"
          >
            Contact Us for Enterprise Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default PricingPage;