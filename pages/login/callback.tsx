// pages/login/callback.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/auth";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    try {
      // This function now handles all security checks and token storage
      auth.handleAuthCallback();
      router.replace("/members"); // Redirect to members area on success
    } catch (error) {
      console.error('Authentication callback failed:', error);
      alert('Login failed. Please try again.');
      router.replace("/"); // Redirect to home on failure
    }
  }, [router]);

  return <div className="p-10 text-center text-white">Finalizing login…</div>;
}