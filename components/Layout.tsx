// components/Layout.tsx
import type { ReactNode } from "react";
import NavBar from "./landing/NavBar";  // Add the NavBar import

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#0b0f14] text-white">
      <NavBar />  {/* Add NavBar here so it appears on all pages */}
      <main>{children}</main>
    </div>
  );
}