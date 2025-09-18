// components/NavBar.tsx
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';
import { signOut } from 'aws-amplify/auth';
import { useRouter } from 'next/router';

export default function NavBar() {
  const { isAuthenticated, isMember, isLoading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut();
      router.push('/'); // Back to home after logout
    } catch (err) {
      console.error('[navbar] logout error:', err);
    }
  };

  const renderAuthButtons = () => {
    if (isLoading) {
      return (
        <div className="h-8 w-24 bg-gray-700 rounded-full animate-pulse" />
      );
    }

    if (!isAuthenticated) {
      return (
        <Link
          href="/login"
          className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
        >
          Log in
        </Link>
      );
    }

    if (isAuthenticated && !isMember) {
      return (
        <>
          <Link
            href="/pricing"
            className="px-4 py-2 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400 mr-4"
          >
            Upgrade to Premium
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-300 hover:text-white"
          >
            Logout
          </button>
        </>
      );
    }

    if (isAuthenticated && isMember) {
      return (
        <>
          <Link
            href="/dashboard"
            className="text-gray-300 hover:text-white mr-4"
          >
            Dashboard
          </Link>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-gray-600 text-white hover:bg-gray-500"
          >
            Logout
          </button>
        </>
      );
    }
  };

  return (
    <nav className="bg-black p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Link href="/" className="text-white text-2xl font-bold">
          CoolEnglishMusic
        </Link>
        <div className="ml-10 space-x-6">
          <Link href="/" className="text-gray-300 hover:text-white">
            Home
          </Link>
          <Link href="/activities" className="text-gray-300 hover:text-white">
            Activities
          </Link>
          <Link href="/pricing" className="text-gray-300 hover:text-white">
            Pricing
          </Link>
        </div>
      </div>
      <div className="flex items-center">{renderAuthButtons()}</div>
    </nav>
  );
}
