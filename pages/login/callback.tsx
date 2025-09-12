// pages/login/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // The Amplify library has already handled the login in the background.
    // We just need to redirect the user to the members area.
    router.replace('/members');
  }, [router]);

  return (
    <main className="min-h-[50vh] grid place-items-center text-neutral-200">
      Signing you in…
    </main>
  );
}