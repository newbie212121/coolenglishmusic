// components/landing/NavBar.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function NavBar() {
  const router = useRouter();
  const { isAuthenticated, isMember, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentPath = router.pathname;

  const handleLogout = async () => {
    try {
      await logout();
    } finally {
      window.location.assign("/");
    }
  };

  return (
    <nav className="w-full bg-black border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 text-lg font-bold">
            <span className="text-green-500 text-xl">🎵</span>
            <span className="hidden sm:inline">
              <span className="text-white">Cool English</span>
              <span className="text-green-500"> Music</span>
            </span>
            <span className="sm:hidden">
              <span className="text-white">CE</span>
              <span className="text-green-500">M</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            <Link 
              href="/" 
              className={`relative py-4 ${currentPath === '/' ? 'text-white' : 'text-gray-400 hover:text-white'} transition`}
            >
              Home
              {currentPath === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></span>
              )}
            </Link>
            <Link 
              href="/activities" 
              className={`relative py-4 ${currentPath === '/activities' ? 'text-white' : 'text-gray-400 hover:text-white'} transition`}
            >
              Activities
              {currentPath === '/activities' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></span>
              )}
            </Link>
            <Link 
              href="/pricing" 
              className={`relative py-4 ${currentPath === '/pricing' ? 'text-white' : 'text-gray-400 hover:text-white'} transition`}
            >
              Pricing
              {currentPath === '/pricing' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-green-500"></span>
              )}
            </Link>
          </div>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <>
                {isMember ? (
                  <Link href="/dashboard">
                    <button className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition text-sm">
                      Dashboard
                    </button>
                  </Link>
                ) : (
                  <Link href="/pricing">
                    <button className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition text-sm">
                      Upgrade
                    </button>
                  </Link>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-1.5 border border-gray-600 hover:border-gray-500 text-white rounded-md transition text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login">
                <button className="px-4 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-md font-medium transition text-sm">
                  Login
                </button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-800">
            <div className="flex flex-col gap-4">
              <Link href="/" className={currentPath === '/' ? 'text-white' : 'text-gray-400'}>
                Home
              </Link>
              <Link href="/activities" className={currentPath === '/activities' ? 'text-white' : 'text-gray-400'}>
                Activities
              </Link>
              <Link href="/pricing" className={currentPath === '/pricing' ? 'text-white' : 'text-gray-400'}>
                Pricing
              </Link>
              {isAuthenticated ? (
                <>
                  {!isMember && (
                    <Link href="/pricing">
                      <button className="w-full py-2 bg-green-600 text-white rounded-md text-sm">
                        Upgrade to Premium
                      </button>
                    </Link>
                  )}
                  <button onClick={handleLogout} className="w-full py-2 border border-gray-600 text-white rounded-md text-sm">
                    Logout
                  </button>
                </>
              ) : (
                <Link href="/login">
                  <button className="w-full py-2 bg-green-600 text-white rounded-md text-sm">
                    Login
                  </button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}