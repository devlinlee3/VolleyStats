'use client';

import { useState } from 'react';
import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gray-800 flex flex-col justify-start pt-20 px-4">
      <div className="mx-auto w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">VolleyStats</h1>
          <p className="text-gray-300 text-lg">
            {isLogin ? 'Sign in to your account' : 'Create a new account'}
          </p>
        </div>

        <div className="bg-gray-700 py-8 px-6 shadow-xl rounded-xl border border-gray-600">
          {/* Toggle between Login and Register - Centered */}
          <div className="flex mb-8 bg-gray-600 rounded-lg p-1 max-w-xs mx-auto">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white hover:text-gray-100'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 px-4 text-sm font-medium rounded-md transition-colors ${
                !isLogin
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-white hover:text-gray-100'
              }`}
            >
              Create Account
            </button>
          </div>

          {isLogin ? <LoginForm /> : <RegisterForm />}
        </div>
      </div>
    </div>
  );
}
