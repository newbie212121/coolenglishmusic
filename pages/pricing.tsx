// pages/pricing.tsx  (Next.js pages router)
// If you use the App Router, use app/pricing/page.tsx with the same JSX below.
import Head from 'next/head';
import PricingSection from '@/components/landing/PricingSection';

export default function PricingPage() {
  return (
    <>
      <Head><title>Pricing – CoolEnglishMusic</title></Head>
      <PricingSection />
    </>
  );
}
