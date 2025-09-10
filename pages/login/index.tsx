// pages/login/index.tsx
import { useEffect } from "react";
import { auth } from "@/lib/auth";
export default function Login() {
  useEffect(() => { auth.login(); }, []);
  return <div className="p-10 text-center text-white">Redirecting to sign-in…</div>;
}
