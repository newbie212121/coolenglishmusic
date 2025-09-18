// components/AuthGate.tsx
"use client";

import { useAuth } from "@/context/AuthContext";

/**
 * Shows a full-page loader until the initial auth/membership
 * state has finished loading. Prevents UI from rendering
 * in a half-initialized state.
 */
export default function AuthGate({ children }: { children: React.ReactNode }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-black">
        <div className="text-white">Finalizing session...</div>
      </div>
    );
  }

  return <>{children}</>;
}
