// pages/login/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { handleOAuthSignIn } from 'aws-amplify/auth'; // Correct function name

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await handleOAuthSignIn(); // Use the correct function
      } catch (e) {
        console.error('Amplify handleSignIn error', e);
      } finally {
        router.replace('/members');
      }
    })();
  }, [router]);

  return (
    <main className="min-h-[50vh] grid place-items-center text-neutral-200">
      Signing you in…
    </main>
  );
}