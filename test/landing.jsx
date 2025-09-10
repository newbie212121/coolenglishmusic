import React from "react";
import HeroSection from "../components/landing/HeroSection";
import FreeActivities from "../components/landing/FreeActivities";
import PricingSection from "../components/landing/PricingSection";

export default function Landing() {
  return (
    <div className="min-h-screen">
      <HeroSection />
      <FreeActivities />
      <PricingSection />
    </div>
  );
}