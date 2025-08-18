'use client';

import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function RegisterForm() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters long';
    } else if (!/(?=.*[a-z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one lowercase letter';
    } else if (!/(?=.*[A-Z])/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter';
    } else if (!/(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one number';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await register(
        formData.email,
        formData.password,
        formData.confirmPassword,
        formData.firstName,
        formData.lastName
      );
      setSuccess(true);
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Registration failed. Please try again.';
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (success) {
    return (
      <div className="w-full max-w-md mx-auto bg-green-900 border border-green-700 text-green-200 px-6 py-4 rounded-xl shadow-sm text-center">
        <p className="font-semibold text-lg mb-2">🎉 Registration successful!</p>
        <p>You can now log in with your new account.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-3xl font-bold text-white mb-8 text-center">Create Account</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {errors.general && (
          <div className="bg-red-900 border border-red-700 text-red-200 px-4 py-3 rounded-lg shadow-sm">
            {errors.general}
          </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="firstName" className="block text-sm font-semibold text-gray-200">
              First Name *
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-600 text-white placeholder-gray-300 ${
                errors.firstName ? 'border-red-500' : 'border-gray-500'
              }`}
              placeholder="Enter your first name"
            />
            {errors.firstName && (
              <p className="text-red-400 text-sm">{errors.firstName}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <label htmlFor="lastName" className="block text-sm font-semibold text-gray-200">
              Last Name *
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-600 text-white placeholder-gray-300 ${
                errors.lastName ? 'border-red-500' : 'border-gray-500'
              }`}
              placeholder="Enter your last name"
            />
            {errors.lastName && (
              <p className="text-red-400 text-sm">{errors.lastName}</p>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="email" className="block text-sm font-semibold text-gray-200">
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-600 text-white placeholder-gray-300 ${
              errors.email ? 'border-red-500' : 'border-gray-500'
            }`}
            placeholder="Enter your email address"
          />
          {errors.email && (
            <p className="text-red-400 text-sm">{errors.email}</p>
          )}
        </div>
        
        <div className="space-y-2">
          <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
            Password *
          </label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-600 text-white placeholder-gray-300 ${
              errors.password ? 'border-red-500' : 'border-gray-500'
            }`}
            placeholder="Create a strong password"
          />
          {errors.password && (
            <p className="text-red-400 text-sm">{errors.password}</p>
          )}
          <p className="text-xs text-gray-400 opacity-70">
            Must be at least 8 characters with uppercase, lowercase, and number
          </p>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-200">
            Confirm Password *
          </label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition-all duration-200 shadow-sm hover:shadow-md bg-gray-600 text-white placeholder-gray-300 ${
              errors.confirmPassword ? 'border-red-500' : 'border-gray-500'
            }`}
            placeholder="Confirm your password"
          />
          {errors.confirmPassword && (
            <p className="text-red-400 text-sm">{errors.confirmPassword}</p>
          )}
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-semibold text-base"
        >
          {loading ? 'Creating Account...' : 'Create Account'}
        </button>
      </form>
    </div>
  );
}
