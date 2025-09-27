import { useState } from 'react';
import { resetPassword, confirmResetPassword } from 'aws-amplify/auth';
import { useRouter } from 'next/router';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await resetPassword({ username: email });
      setStep('reset');
    } catch (err: any) {
      setError(err.message || 'Failed to send reset code');
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      await confirmResetPassword({ 
        username: email, 
        confirmationCode: code, 
        newPassword 
      });
      router.push('/login');
    } catch (err: any) {
      setError(err.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Reset Password</h1>
          <p className="text-gray-400 mt-2">
            {step === 'email' 
              ? "Enter your email to receive a reset code" 
              : "Enter the code sent to your email"}
          </p>
        </div>

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                placeholder="you@example.com"
              />
            </div>
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 p-3 rounded">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Reset Code'}
            </button>
            
            <a href="/login" className="block text-center text-sm text-green-500 hover:text-green-400">
              Back to Login
            </a>
          </form>
        ) : (
          <form onSubmit={handleResetPassword} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Reset Code
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                placeholder="Enter code from email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-300">
                New Password
              </label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-gray-900 border border-gray-700 rounded-md text-white"
                placeholder="Minimum 8 characters"
              />
            </div>
            
            {error && (
              <div className="bg-red-900/50 border border-red-700 p-3 rounded">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-green-500 text-black font-semibold rounded-md hover:bg-green-400 disabled:opacity-50"
            >
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>
            
            <button
              type="button"
              onClick={() => setStep('email')}
              className="w-full text-center text-sm text-green-500 hover:text-green-400"
            >
              Send code again
            </button>
          </form>
        )}
      </div>
    </div>
  );
}