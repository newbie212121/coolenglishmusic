// components/AuthGate.tsx
"use client";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/router";

export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();
  const { pathname } = useRouter();

  const passthrough =
    pathname.startsWith("/login/callback") ||
    pathname === "/login" ||
    pathname === "/logout";

  if (!passthrough && isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-white">Finalizing session...</div>
      </div>
    );
  }
  return <>{children}</>;
}
