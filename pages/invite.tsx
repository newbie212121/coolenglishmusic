// pages/invite.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.coolenglishmusic.com';

export default function InvitePage() {
  const router = useRouter();
  const { isAuthenticated, getIdToken } = useAuth();
  const [status, setStatus] = useState('checking');
  const { token } = router.query;

  useEffect(() => {
    if (!token) return;
    
    if (!isAuthenticated) {
      // Save token and redirect to login
      sessionStorage.setItem('pendingInvite', token as string);
      router.push('/login?redirect=/invite');
      return;
    }

    acceptInvite();
  }, [token, isAuthenticated]);

  const acceptInvite = async () => {
    try {
      const idToken = await getIdToken();
      const response = await fetch(`${API_BASE}/groups/accept-invite`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ inviteToken: token })
      });

      if (response.ok) {
        setStatus('success');
        setTimeout(() => router.push('/activities'), 2000);
      } else {
        const data = await response.json();
        setStatus('error');
        console.error(data.error);
      }
    } catch (error) {
      setStatus('error');
    }
  };

  if (status === 'checking') {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p>Processing invitation...</p>
      </div>
    </div>;
  }

  if (status === 'success') {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">
      <div className="text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-2">Welcome to the team!</h1>
        <p>Redirecting to activities...</p>
      </div>
    </div>;
  }

  return <div className="min-h-screen bg-black flex items-center justify-center text-white">
    <div className="text-center">
      <div className="text-red-500 text-6xl mb-4">✗</div>
      <h1 className="text-2xl font-bold mb-2">Invalid or Expired Invitation</h1>
      <button onClick={() => router.push('/')} className="mt-4 px-6 py-2 bg-green-500 text-black rounded">
        Go Home
      </button>
    </div>
  </div>;
}