// pages/login/callback.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/auth";

export default function Callback() {
  const router = useRouter();

  useEffect(() => {
    // This now correctly saves the token from the URL
    auth.handleAuthCallback(); 
    // Then, redirect to the members page
    router.replace("/members");
  }, [router]);

  return <div className="p-10 text-center text-white">Finishing login…</div>;
}