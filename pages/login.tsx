// pages/login.tsx

import { auth } from "@/lib/auth";

export default function Login() {
  return (
    <main className="max-w-xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Log in</h1>
      <p className="mt-2 text-gray-600">
        Log in to access the members area. If you don’t have an account yet,
        you can create one on the next screen.
      </p>
      <button
        onClick={() => auth.login()}
        className="mt-6 inline-block rounded-xl px-5 py-2.5 bg-blue-600 text-white hover:bg-blue-700 shadow"
      >
        Continue
      </button>
    </main>
  );
}