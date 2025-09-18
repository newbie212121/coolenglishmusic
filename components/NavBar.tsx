// components/NavBar.tsx
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { signInWithRedirect, signOut } from 'aws-amplify/auth';

export default function NavBar() {
  const { isAuthenticated, isMember, isLoading } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    // This directly starts the login process
    await signInWithRedirect();
  };

  const handleLogout = async () => {
    await signOut();
    // Refresh the page to ensure all state is cleared
    window.location.href = '/'; 
  };

  const renderAuthButtons = () => {
    if (isLoading) {
      // Show a placeholder while we check the user's status
      return <div className="h-10 w-28 bg-neutral-700 rounded-lg animate-pulse"></div>;
    }

    if (isAuthenticated) {
      return (
        <>
          {!isMember && (
            <Link href="/pricing" className="bg-green-500 text-black font-semibold px-4 py-2 rounded-full hover:bg-green-400 mr-4">
              Upgrade
            </Link>
          )}
          <button onClick={handleLogout} className="text-neutral-300 hover:text-white">Logout</button>
        </>
      );
    }

    // If not logged in, the button will start the login flow
    return (
      <button onClick={handleLogin} className="bg-green-500 text-black font-semibold px-4 py-2 rounded-lg hover:bg-green-400">
        Login / Sign Up
      </button>
    );
  };

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur border-b border-neutral-800">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-10">
            <Link href="/" className="text-white text-xl font-bold">
              <span className="text-emerald-400">Cool</span>English<span className="text-white/80">Music</span>
            </Link>
            <nav className="hidden md:flex items-center gap-6 text-sm">
              <Link href="/" className="text-neutral-300 hover:text-white">Home</Link>
              <Link href="/activities" className="text-neutral-300 hover:text-white">Activities</Link>
              <Link href="/pricing" className="text-neutral-300 hover:text-white">Pricing</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm">
            {renderAuthButtons()}
          </div>
        </div>
      </div>
    </header>
  );
}