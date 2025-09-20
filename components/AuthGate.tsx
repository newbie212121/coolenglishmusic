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
  return null; // Just return null instead of showing the message
}
  return <>{children}</>;
}
