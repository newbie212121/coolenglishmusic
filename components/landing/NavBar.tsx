// components/landing/NavBar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { signOut } from 'aws-amplify/auth';
import { useAuth } from '@/context/AuthContext';

export default function NavBar() {
  const { isAuthenticated, isMember, isLoading, userEmail } = useAuth();
  const router = useRouter();

  const onLogout = async () => {
    try { await signOut(); } finally { router.push('/'); }
  };

  return (
    <nav className="w-full px-5 py-3 flex items-center justify-between bg-black">
      {/* Left: brand + primary nav */}
      <div className="flex items-center gap-8">
        <Link href="/" className="text-white font-bold text-xl">CoolEnglishMusic</Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-gray-300 hover:text-white">Home</Link>
          <Link href="/activities" className="text-gray-300 hover:text-white">Activities</Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white">Pricing</Link>
        </div>
      </div>

      {/* Right: auth controls */}
      <div className="flex items-center gap-3">
        {isLoading && <div className="h-8 w-24 rounded-full bg-gray-700 animate-pulse" />}

        {!isLoading && !isAuthenticated && (
          <>
            <Link href="/login" className="text-gray-300 hover:text-white">Log in</Link>
            <Link
              href="/pricing"
              className="px-4 py-1.5 rounded-full bg-green-400 text-black font-semibold hover:bg-green-300"
            >
              Upgrade to Premium
            </Link>
          </>
        )}

        {!isLoading && isAuthenticated && !isMember && (
          <>
            <span className="text-gray-400 hidden sm:inline">Hi{userEmail ? `, ${userEmail}` : ''}</span>
            <Link
              href="/pricing"
              className="px-4 py-1.5 rounded-full bg-green-400 text-black font-semibold hover:bg-green-300"
            >
              Upgrade to Premium
            </Link>
            <button onClick={onLogout} className="text-gray-300 hover:text-white">Logout</button>
          </>
        )}

        {!isLoading && isAuthenticated && isMember && (
          <>
            <span className="text-gray-400 hidden sm:inline">Hi{userEmail ? `, ${userEmail}` : ''}</span>
            {/* When your Billing Portal route is live, link it here */}
            <Link
              href="/members"
              className="px-4 py-1.5 rounded-full bg-gray-800 text-white hover:bg-gray-700"
            >
              Dashboard
            </Link>
            <button onClick={onLogout} className="text-gray-300 hover:text-white">Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
