// components/Layout.tsx
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <main>{children}</main>
    </div>
  );
}