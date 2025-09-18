'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'aws-amplify/auth';

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await signOut();
      } catch {}
      router.replace('/');
    })();
  }, [router]);

  return null;
}
