// components/landing/NavBar.tsx
"use client";

import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

export default function NavBar() {
  const { isLoading, isAuthenticated, isMember, logout } = useAuth();

  const handleLogin = () => {
    const next = encodeURIComponent(window.location.pathname + window.location.search);
    window.location.assign(`/login?next=${next}`);
  };

  const handleLogout = async () => {
    try {
      await logout();           // <-- use context (not direct signOut)
    } finally {
      window.location.assign("/"); // hard reload to clear any stale UI
    }
  };

  // ...rest of your render untouched...
}
