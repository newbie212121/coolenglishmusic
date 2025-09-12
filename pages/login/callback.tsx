// pages/login/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { handleSignIn } from 'aws-amplify/auth';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await handleSignIn();           // finishes the OAuth code exchange
      } catch (e) {
        console.error('Amplify handleSignIn error', e);
      } finally {
        // Clean URL and continue
        if (typeof window !== 'undefined') {
          history.replaceState(null, '', window.location.pathname);
        }
        router.replace('/members');     // or wherever you want to land
      }
    })();
  }, [router]);

  return (
    <main className="min-h-[50vh] grid place-items-center text-neutral-200">
      Signing you in…
    </main>
  );
}
