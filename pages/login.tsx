'use client';

import { useState } from 'react';
import { signIn } from 'aws-amplify/auth';
import { useRouter } from 'next/router';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await signIn({ username: email, password });
      // If login succeeds, check for ?next= param
      const next = (router.query.next as string) || '/members';
      router.push(next);
    } catch (err: any) {
      console.error('[login] error:', err);
      setError(err.message || 'Login failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 text-white max-w-md mx-auto">
      <h1 className="text-3xl font-bold mb-6">Login</h1>
      <form onSubmit={handleLogin} className="space-y-4">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full px-4 py-2 rounded bg-gray-900 text-white border border-gray-700"
        />
        {error && <p className="text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded bg-green-400 text-black font-semibold hover:bg-green-300 disabled:opacity-60"
        >
          {loading ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  );
}
