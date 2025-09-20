// pages/signup.tsx
import { useState } from "react";
import { useRouter } from "next/router";
import { signUp, confirmSignUp, signIn } from "aws-amplify/auth";

export default function SignUpPage() {
  const router = useRouter();
  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmCode, setConfirmCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await signUp({
        username: email,
        password: password,
        options: {
          userAttributes: {
            email: email,
          },
        },
      });
      
      setStep("confirm");
    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "Failed to sign up. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await confirmSignUp({
        username: email,
        confirmationCode: confirmCode,
      });

      // Auto sign in after confirmation
      const { isSignedIn } = await signIn({
        username: email,
        password: password,
      });

      if (isSignedIn) {
        router.push("/activities");
      }
    } catch (err: any) {
      console.error("Confirmation error:", err);
      setError(err.message || "Failed to confirm. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-2">
            <span className="text-green-400">Cool</span>EnglishMusic
          </h1>
          <h2 className="text-2xl text-gray-300">
            {step === "signup" ? "Create Account" : "Verify Email"}
          </h2>
        </div>

        {step === "signup" ? (
          <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="you@example.com"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Min 8 characters"
                />
              </div>
            </div>

            {error && (
              <div className="rounded-md bg-red-900/50 border border-red-700 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

            <p className="text-center text-sm text-gray-400">
              Already have an account?{" "}
              <a href="/login" className="text-green-500 hover:text-green-400">
                Log in
              </a>
            </p>
          </form>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleConfirm}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-300">
                Confirmation Code
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={confirmCode}
                onChange={(e) => setConfirmCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter code from email"
              />
              <p className="mt-2 text-sm text-gray-400">
                We sent a verification code to {email}
              </p>
            </div>

            {error && (
              <div className="rounded-md bg-red-900/50 border border-red-700 p-4">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify & Sign In"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}