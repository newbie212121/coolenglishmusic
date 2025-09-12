// pages/login/callback.tsx
import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        await fetchAuthSession();        // completes code->token exchange and hydrates session
        await getCurrentUser().catch(() => null);
      } catch (err) {
        console.error('Auth callback error:', err);
      } finally {
        router.replace('/members');
      }
    })();
  }, [router]);

  return (
    <main className="min-h-[50vh] grid place-items-center text-neutral-200">
      Completing sign-in…
    </main>
  );
}
