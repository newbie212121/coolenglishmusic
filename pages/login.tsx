// pages/login.tsx
import { useEffect } from "react";
import { signInWithRedirect } from "aws-amplify/auth";
import { useRouter } from "next/router";
import { useAuth } from "@/context/AuthContext";

export default function Login() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace("/activities");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async () => {
    // Optionally carry forward the "next" param
    const next = (router.query.next as string) || "/activities";
    await signInWithRedirect(); // your Cognito Hosted UI will return to your callback
    // When you land back, AuthContext will flip and NavBar will update.
  };

  if (isLoading) {
    return <div className="min-h-screen bg-gray-900 text-white p-8">Loading…</div>;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
      <div className="max-w-lg w-full text-center">
        <h1 className="text-4xl font-bold mb-4">Log In to Your Account</h1>
        <p className="text-gray-400 mb-8">Access your premium music activities.</p>
        <button
          onClick={handleLogin}
          className="px-8 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400"
        >
          Log In
        </button>
      </div>
    </div>
  );
}
