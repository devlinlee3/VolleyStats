'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
  console.log('LoginForm component rendered');
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with:', { email, password });
    
    // Basic validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    setError('');
    setLoading(true);

    try {
      console.log('Attempting login...');
      console.log('Login function:', typeof login);
      await login(email, password);
      console.log('Login successful, redirecting...');
      // Redirect to home page after successful login
      router.push('/');
    } catch (err: any) {
      console.error('Login error:', err);
      console.error('Error details:', {
        message: err.message,
        response: err.response,
        status: err.response?.status,
        data: err.response?.data
      });
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto" style={{ border: '1px solid red', padding: '20px' }}>
      <form 
        onSubmit={handleSubmit} 
        className="space-y-6"
        onChange={() => console.log('Form changed')}
        onInput={() => console.log('Form input')}
        style={{ border: '1px solid blue', padding: '20px' }}
      >
        {error && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg shadow-sm">
            {error}
          </div>
        )}
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-200">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-600 text-white placeholder-gray-300"
            placeholder="Enter your email"
            style={{ minHeight: '48px' }}
          />
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
            Password
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-500 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-600 text-white placeholder-gray-300"
            placeholder="Enter your password"
            style={{ minHeight: '48px' }}
          />
          <p className="text-xs text-gray-400 opacity-70">
            Password must be at least 6 characters long
          </p>
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base"
          style={{ minHeight: '48px' }}
          onClick={() => console.log('Button clicked')}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </button>
      </form>
      
      <div className="mt-6 text-sm text-gray-400 text-center opacity-80">
        <p>Don't have an account? Use the toggle above to create one.</p>
      </div>
    </div>
  );
}
