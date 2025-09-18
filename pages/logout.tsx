// pages/logout.tsx
import { useEffect } from "react";
import { useRouter } from "next/router";
import { signOut } from "aws-amplify/auth";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      try {
        // Sign out from Cognito Hosted UI + local session
        await signOut();
      } catch (err) {
        console.error("[logout] error:", err);
      } finally {
        // Go home either way
        router.replace("/");
      }
    })();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white">
      Signing out…
    </div>
  );
}
