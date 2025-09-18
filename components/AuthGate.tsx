// components/AuthGate.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const router = useRouter();
  const path = router.pathname || "";
  const passthrough =
    path.startsWith("/login/callback") || path === "/login" || path === "/logout";

  if (!passthrough && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-white">Finalizing session...</div>
      </div>
    );
  }
  return <>{children}</>;
}
