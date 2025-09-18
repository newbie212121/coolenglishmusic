// pages/pricing.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { fetchAuthSession } from "aws-amplify/auth";

const API_BASE = process.env.NEXT_PUBLIC_API_HOST || "";
const CREATE_URL = `${API_BASE}/create-checkout-session`;

const plans = [
    { name: 'Monthly', price: '$2', details: '/month', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_MONTHLY, features: ['Unlimited Activity Access', 'Weekly New Content', 'All Music Genres', 'Priority Support'], cta: 'Choose Monthly' },
    { name: 'Annual', price: '$15', details: '/year', priceId: process.env.NEXT_PUBLIC_STRIPE_PRICE_ANNUAL, features: ['Everything in Monthly', 'Save 37% compared to monthly', 'Early Access to New Features', 'Downloadable Resources'], cta: 'Go Annual', bestValue: true }
];

export default function PricingPage() {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [isLoading, setIsLoading] = useState<string | null>(null);

    const handleChoosePlan = async (priceId: string) => {
        setIsLoading(priceId);
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        try {
            const session = await fetchAuthSession();
            const userId = session.tokens?.idToken?.payload.sub;
            const idToken = session.tokens?.idToken?.toString();
            
            const response = await fetch(CREATE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${idToken}`,
                },
                body: JSON.stringify({ priceId, userId }),
            });

            if (!response.ok) throw new Error('Failed to create checkout session.');
            
            const { url } = await response.json();
            window.location.href = url;

        } catch (error) {
            console.error("Pricing checkout error:", error);
            alert("Please log in to choose a plan.");
            setIsLoading(null);
        }
    };

    return (
        <div className="py-20 px-4">
            <div className="text-center">
                <h1 className="text-5xl font-bold mb-4">Simple, Flexible Pricing</h1>
                <p className="text-xl text-gray-400">Unlock unlimited access to our growing library of interactive music activities.</p>
            </div>
            <div className="max-w-4xl mx-auto mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
                {plans.map((plan) => (
                    <div key={plan.name} className={`bg-gray-800 p-8 rounded-2xl border ${plan.bestValue ? 'border-green-500' : 'border-gray-700'} flex flex-col`}>
                        {plan.bestValue && <span className="bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full self-start mb-4">Best Value</span>}
                        <h2 className="text-3xl font-semibold mb-2">{plan.name}</h2>
                        <div className="flex items-baseline mb-6">
                            <span className="text-5xl font-bold">{plan.price}</span>
                            <span className="text-gray-400 ml-1">{plan.details}</span>
                        </div>
                        <ul className="space-y-3 text-gray-300 mb-8 flex-grow">
                            {plan.features.map(feature => (
                                <li key={feature} className="flex items-center">
                                    <svg className="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
                                    {feature}
                                </li>
                            ))}
                        </ul>
                        <button
                            onClick={() => handleChoosePlan(plan.priceId!)}
                            disabled={!!isLoading}
                            className={`w-full py-3 rounded-full font-semibold transition-colors ${isLoading === plan.priceId ? 'bg-gray-600' : 'bg-green-500 text-black hover:bg-green-400'}`}
                        >
                            {isLoading === plan.priceId ? 'Processing...' : plan.cta}
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}