// components/Layout.tsx
import type { ReactNode } from "react";
import NavBar from "@/components/landing/NavBar";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <NavBar />
      <main>{children}</main>
    </div>
  );
}
