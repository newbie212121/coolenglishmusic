// pages/pricing.tsx - SIMPLE VERSION
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Pricing() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to your original subscription page
    router.push('/subscribe');
  }, []);
  
  return null;
}