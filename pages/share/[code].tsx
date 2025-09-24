// pages/share/[code].tsx
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { Play, Clock, AlertCircle, Loader2, Music } from 'lucide-react';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'https://api.coolenglishmusic.com';

export default function SharePage() {
  const router = useRouter();
  const { code } = router.query;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activity, setActivity] = useState<any>(null);
  const [accessing, setAccessing] = useState(false);

  useEffect(() => {
    if (code) {
      validateShareLink();
    }
  }, [code]);

  const validateShareLink = async () => {
    try {
      const response = await fetch(`${API_BASE}/validate-share-link?code=${code}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Invalid link');
      }
      
      setActivity(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

const startActivity = async () => {
  setAccessing(true);
  try {
    // Use the grant-access endpoint with no auth for free activities
    const response = await fetch(`/api/grant-access?prefix=${encodeURIComponent(activity.s3Prefix)}`);
    
    if (response.ok) {
      const data = await response.json();
      if (data.activityUrl) {
        window.location.href = data.activityUrl;
      }
    } else {
      setError('Failed to access activity');
    }
  } catch (err) {
    console.error('Failed to access activity:', err);
    setError('Failed to start activity');
  } finally {
    setAccessing(false);
  }
};

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-green-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
        <div className="text-center max-w-md mx-4">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Oops!</h1>
          <p className="text-gray-400">{error}</p>
          <p className="text-sm text-gray-500 mt-4">
            Ask your teacher for a new share link
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-green-400">Cool</span>English<span className="text-green-400">Music</span>
          </h1>
          <p className="text-gray-400">Student Access Portal</p>
        </div>
        
        <div className="bg-gray-800 rounded-xl p-8">
          <div className="text-center mb-6">
            <Music className="w-16 h-16 text-green-400 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-white mb-2">
              {activity?.title}
            </h2>
            <p className="text-gray-400">{activity?.artist}</p>
            <div className="mt-4 text-sm text-gray-500 flex items-center justify-center gap-2">
              <Clock className="w-4 h-4" />
              Expires {new Date(activity?.expiresAt).toLocaleDateString()}
            </div>
          </div>
          
          <button
            onClick={startActivity}
            disabled={accessing}
            className="w-full py-4 bg-green-500 hover:bg-green-600 disabled:bg-gray-700 
                     text-white font-bold rounded-lg transition-all flex items-center 
                     justify-center gap-2"
          >
            {accessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Loading Activity...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Start Activity
              </>
            )}
          </button>
          
          <p className="text-center text-xs text-gray-500 mt-6">
            No login required • Shared by your teacher
          </p>
        </div>
      </div>
    </div>
  );
}