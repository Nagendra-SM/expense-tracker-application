import { useState } from 'react';
import { DollarSign } from 'lucide-react';

interface AuthFormProps {
  onSignIn: (email: string, password: string) => Promise<void>;
  onSignUp: (email: string, password: string) => Promise<void>;
}

export const AuthForm = ({ onSignIn, onSignUp }: AuthFormProps) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    try {
      setLoading(true);
      if (isSignUp) {
        await onSignUp(email, password);
      } else {
        await onSignIn(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center p-4 min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="p-8 w-full max-w-md bg-white rounded-2xl shadow-xl">
        <div className="flex justify-center items-center mb-8">
          <div className="p-3 bg-blue-600 rounded-xl">
            <DollarSign className="w-8 h-8 text-white" />
          </div>
        </div>

        <h1 className="mb-2 text-3xl font-bold text-center text-gray-900">
          Expense Tracker
        </h1>
        <p className="mb-8 text-center text-gray-600">
          {isSignUp ? 'Create an account to get started' : 'Sign in to your account'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 text-sm text-red-800 bg-red-50 rounded-lg border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-shadow outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="you@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="px-4 py-2 w-full rounded-lg border border-gray-300 transition-shadow outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="py-3 w-full font-medium text-white bg-blue-600 rounded-lg transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : isSignUp ? 'Sign Up' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError('');
            }}
            className="text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>
    </div>
  );
};
