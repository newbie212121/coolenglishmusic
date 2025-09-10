import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Crown, Sparkles, Music, Users } from "lucide-react";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function PricingSection() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 spotify-darker">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">Simple, Flexible Pricing</h2>
          <div className="w-24 h-1 bg-green-400 mx-auto rounded-full mb-6"></div>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto">
            Unlock unlimited access to our growing library of interactive music activities
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Monthly Plan */}
          <div className="spotify-card rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-all">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold text-white mb-4">Monthly</h3>
              <div className="text-5xl font-bold text-white mb-4">
                $2<span className="text-xl text-gray-400">/month</span>
              </div>
              <p className="text-gray-400">Perfect for trying things out</p>
            </div>

            <div className="space-y-4 mb-8">
              <FeatureItem>Unlimited Activity Access</FeatureItem>
              <FeatureItem>Weekly New Content</FeatureItem>
              <FeatureItem>All Music Genres</FeatureItem>
              <FeatureItem>Priority Support</FeatureItem>
            </div>

            <Link to={createPageUrl("Pricing")}>
              <Button className="w-full border border-gray-600 text-white hover:bg-gray-800 py-3 text-lg rounded-full">
                Choose Monthly
              </Button>
            </Link>
          </div>

          {/* Annual Plan */}
          <div className="spotify-card rounded-2xl p-8 border-2 border-green-400 relative hover:border-green-300 transition-all">
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

            <div className="space-y-4 mb-8">
              <FeatureItem>Everything in Monthly</FeatureItem>
              <FeatureItem>Save 37% compared to monthly</FeatureItem>
              <FeatureItem>Early Access to New Features</FeatureItem>
              <FeatureItem>Downloadable Resources</FeatureItem>
            </div>

            <Link to={createPageUrl("Pricing")}>
              <Button className="w-full spotify-green spotify-green-hover text-black font-semibold py-3 text-lg rounded-full">
                <Crown className="w-5 h-5 mr-2" />
                Go Annual
              </Button>
            </Link>
          </div>
        </div>

        <div className="text-center mt-16">
          <div className="spotify-card rounded-2xl p-8 border border-gray-800">
            <div className="flex flex-col md:flex-row items-center justify-center space-y-6 md:space-y-0 md:space-x-12">
              <div className="flex items-center space-x-3">
                <Users className="w-6 h-6 text-green-400" />
                <span className="text-white font-semibold">Perfect for Teachers</span>
              </div>
              <div className="flex items-center space-x-3">
                <Music className="w-6 h-6 text-green-400" />
                <span className="text-white font-semibold">Engaging for Students</span>
              </div>
              <div className="flex items-center space-x-3">
                <Sparkles className="w-6 h-6 text-green-400" />
                <span className="text-white font-semibold">Updated Weekly</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

const FeatureItem = ({ children }) => (
  <div className="flex items-center space-x-3">
    <div className="w-5 h-5 rounded-full bg-green-400 flex items-center justify-center flex-shrink-0">
      <Check className="w-3 h-3 text-black" />
    </div>
    <span className="text-gray-300">{children}</span>
  </div>
);