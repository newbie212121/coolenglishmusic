// pages/login.tsx
import { useEffect } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import { useAuth } from "@/context/AuthContext"; // ✅ centralized auth brain
import { useRouter } from "next/router";

export default function LoginPage() {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // If already logged in, skip login page and go straight to activities
      router.replace("/activities");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async () => {
    await signInWithRedirect();
  };

  if (isLoading || isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black text-white">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white">
      <h1 className="text-4xl font-bold mb-4">Log In to Your Account</h1>
      <p className="mb-8 text-gray-400">
        Access your premium music activities.
      </p>
      <button
        onClick={handleLogin}
        className="px-8 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
      >
        Log In
      </button>
    </div>
  );
}
