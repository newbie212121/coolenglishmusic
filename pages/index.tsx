// pages/index.tsx
import HeroSection from '@/components/landing/HeroSection';
import FreeActivities from '@/components/landing/FreeActivities';
import PricingSection from '@/components/landing/PricingSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <FreeActivities />
      <PricingSection />
    </>
  );
}