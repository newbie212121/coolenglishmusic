import { useEffect } from "react";
import { useRouter } from "next/router";
import { signInWithRedirect } from "aws-amplify/auth";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      const next = (router.query.next as string) || "/activities";
      router.replace(next);
    }
  }, [isAuthenticated, isLoading, router]);

  const handleLogin = async () => {
    await signInWithRedirect(); // Hosted UI
  };

  if (isLoading) return <div className="p-8 text-white">Loading…</div>;

  return (
    <div className="flex items-center justify-center py-24">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Log In to Your Account</h1>
        <p className="text-gray-400 mb-8">Access your premium music activities.</p>
        <button onClick={handleLogin} className="px-8 py-3 rounded-full bg-green-500 text-black font-semibold hover:bg-green-400">
          Log In
        </button>
      </div>
    </div>
  );
}
