// pages/pricing.tsx
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Check, Users } from 'lucide-react';

const PricingPage = () => {
  const router = useRouter();
  const [seatCount, setSeatCount] = useState(5);
  const [loading, setLoading] = useState(false);
  
  const monthlyPrice = seatCount * 1.75;
  const yearlyPrice = seatCount * 18;
  
  const createTeamCheckout = async () => {
    setLoading(true);
    try {
      const token = await getIdToken();
      const response = await fetch('https://api.coolenglishmusic.com/create-team-checkout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          seatCount,
          groupName: null // Let them set this later
        })
      });
      
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
    <div className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Simple, Transparent Pricing
        </h1>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Individual Plan */}
          <div className="bg-gray-800 rounded-lg p-8">
            <h2 className="text-2xl font-bold text-white mb-2">Individual</h2>
            <p className="text-gray-400 mb-4">For solo teachers</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">$2</span>
              <span className="text-gray-400">/month</span>
            </div>
            
            <p className="text-sm text-gray-400 mb-6">
              or $20/year (first year $15)
            </p>
            
            <ul className="space-y-3 mb-8">
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-white">Access to all 160+ activities</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-white">Favorites & playlists</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-white">Cancel anytime</span>
              </li>
            </ul>
            
            <button
              onClick={() => router.push('/subscribe')}
              className="w-full py-3 bg-green-500 hover:bg-green-600 text-white rounded-lg font-semibold"
            >
              Get Started
            </button>
          </div>
          
          {/* Team Plan */}
          <div className="bg-gray-800 rounded-lg p-8 border-2 border-green-500">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-2xl font-bold text-white">Team</h2>
              <span className="bg-green-500 text-white text-sm px-2 py-1 rounded">
                Save 15%
              </span>
            </div>
            <p className="text-gray-400 mb-4">For schools & groups</p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">${monthlyPrice.toFixed(2)}</span>
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
                  value={seatCount}
                  onChange={(e) => setSeatCount(parseInt(e.target.value))}
                  className="flex-1"
                />
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={seatCount}
                  onChange={(e) => setSeatCount(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 bg-gray-600 text-white rounded"
                />
              </div>
              <p className="text-xs text-gray-400 mt-2">
                {seatCount} seats × $1.75 = ${monthlyPrice.toFixed(2)}/month
              </p>
            </div>
            
            <ul className="space-y-3 mb-8">
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
              <li className="flex items-start gap-2">
                <Check className="w-5 h-5 text-green-500 mt-0.5" />
                <span className="text-white">$1.75 per teacher (15% off)</span>
              </li>
            </ul>
            
            <button
              onClick={createTeamCheckout}
              disabled={loading}
              className="w-full py-3 bg-green-500 hover:bg-green-600 disabled:bg-gray-600 text-white rounded-lg font-semibold"
            >
              {loading ? 'Loading...' : `Start Team (${seatCount} seats)`}
            </button>
          </div>
        </div>
        
        {/* Enterprise */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Need more than 50 seats? Have special requirements?
          </p>
          <button
            onClick={() => window.location.href = 'mailto:support@coolenglishmusic.com'}
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