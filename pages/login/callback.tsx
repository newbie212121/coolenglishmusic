import { useEffect } from "react";
import { useRouter } from "next/router";
import { auth } from "@/lib/auth";
export default function Callback() {
  const r = useRouter();
  useEffect(() => { auth.getIdToken(); r.replace("/members"); }, [r]);
  return <div className="p-10 text-center text-white">Finishing login…</div>;
}
