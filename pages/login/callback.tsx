// pages/login/callback.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function LoginCallback() {
  const router = useRouter();

  useEffect(() => {
    // Simply redirect to home and let Amplify handle the auth
    // The tokens should be automatically processed by Amplify
    const timer = setTimeout(() => {
      window.location.href = "/";
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex h-screen items-center justify-center bg-black text-white">
      <div className="text-center">
        <div className="mb-4">
          <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
        <div>Completing sign-in...</div>
      </div>
    </div>
  );
}