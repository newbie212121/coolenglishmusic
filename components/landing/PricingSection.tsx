// components/landing/PricingSection.tsx
import { useState } from 'react';
import { auth } from '@/lib/auth';

export default function PricingSection() {
  // (Your handleCheckout logic remains the same)
  const [loading, setLoading] = useState('');
  const handleCheckout = async (priceId: string) => { /* ... */ };
  const monthlyPriceId = 'price...'; // 👈 Your Test Price ID
  const annualPriceId = 'price...';  // 👈 Your Test Price ID

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Simple, Flexible Pricing
          </h2>
          <div className="w-24 h-1 bg-emerald-400 mx-auto rounded-full mb-6" />
          <p className="text-neutral-400 text-lg max-w-2xl mx-auto">
            Unlock unlimited access to our growing library of interactive music activities.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly */}
          <div className="spotify-card p-8 flex flex-col">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Monthly</h3>
              <div className="text-5xl font-extrabold text-white mb-2">
                $2<span className="text-xl text-neutral-400">/month</span>
              </div>
              <p className="text-neutral-400">Perfect for trying things out.</p>
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
              className="mt-auto w-full text-center bg-neutral-800 text-neutral-200 hover:bg-neutral-700 py-3 rounded-full transition font-semibold disabled:opacity-50"
            >
              {loading === monthlyPriceId ? 'Redirecting...' : 'Choose Monthly'}
            </button>
          </div>

          {/* Annual */}
          <div className="spotify-card p-8 border-2 border-emerald-400 relative flex flex-col">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="bg-emerald-400 text-black px-4 py-1 rounded-full text-sm font-semibold">
                ✨ Best Value
              </span>
            </div>
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-2">Annual</h3>
              <div className="text-5xl font-extrabold text-white mb-1">
                $15<span className="text-xl text-neutral-400">/year</span>
              </div>
              <p className="text-emerald-400 font-semibold mb-1">Save 37%</p>
              <p className="text-neutral-400">Just $1.25 per month</p>
            </div>
            <ul className="space-y-3 text-neutral-300 mb-8">
              <Feature>Everything in Monthly</Feature>
              <Feature>Save 37% compared to monthly</Feature>
              <Feature>Early Access to New Features</Feature>
              <Feature>Downloadable Resources</Feature>
            </ul>
            <button
              onClick={() => handleCheckout(annualPriceId)}
              disabled={!!loading}
              className="mt-auto w-full text-center spotify-green spotify-green-hover text-black font-semibold py-3 rounded-full transition disabled:opacity-50"
            >
              {loading === annualPriceId ? 'Redirecting...' : 'Go Annual'}
            </button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 text-center mt-14">
          <Pill>👩‍🏫 Perfect for Teachers</Pill>
          <Pill>🎶 Engaging for Students</Pill>
          <Pill>⚡ Updated Weekly</Pill>
        </div>
      </div>
    </section>
  );
}

function Feature({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-center gap-3">
      <span className="inline-flex w-5 h-5 rounded-full bg-emerald-900/50 items-center justify-center text-emerald-400 text-[11px]">✓</span>
      <span className="text-neutral-300">{children}</span>
    </li>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return <div className="spotify-card text-neutral-300 px-4 py-3 rounded-xl">{children}</div>
}