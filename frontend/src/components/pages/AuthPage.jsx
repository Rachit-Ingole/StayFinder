import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle } from 'lucide-react';

const AuthPage = ({ mode = 'login' }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const isRegister = mode === 'register';


  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (isRegister) {
      if (!formData.name) {
        newErrors.name = 'Name is required';
      }
      
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const makeApiCall = async (endpoint, data) => {
    const response = await fetch(`/api/v1/auth/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    });

    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'Something went wrong');
    }
    
    return result;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setSuccessMessage('');
    setErrors({});
    
    try {
      let result;
      
      if (isRegister) {
        result = await makeApiCall('register', {
          name: formData.name,
          email: formData.email,
          password: formData.password
        });
        
        setSuccessMessage(result.message || 'Registration successful! Please check your email to verify your account.');
        
        setFormData({
          email: '',
          password: '',
          confirmPassword: '',
          name: ''
        });
        
      } else {
        result = await makeApiCall('login', {
          name:formData.name,
          email: formData.email,
          password: formData.password
        });
        
        // Store token in localStorage (or use your preferred storage method)
        if (result.data && result.data.token) {
          
          localStorage.setItem('authToken', result.data.token);
          localStorage.setItem('user', JSON.stringify(result.data.user));
        }
        
        setSuccessMessage(result.message || 'Login successful! Redirecting...');
        
        // Redirect after successful login (you can customize this)
        setTimeout(() => {
          // Replace with your redirect logic
          window.location.href = '/';
        }, 1500);
      }
      
    } catch (error) {
      console.error('Authentication error:', error);
      
      // Handle specific error cases
      if (error.message.includes('verify your email')) {
        setErrors({ 
          submit: error.message,
          needsVerification: true 
        });
      } else {
        setErrors({ 
          submit: error.message || 'An error occurred. Please try again.' 
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address' });
      return;
    }
    
    setIsLoading(true);
    try {
      const result = await makeApiCall('resend-verification', {
        email: formData.email
      });
      
      setSuccessMessage(result.message || 'Verification email sent successfully!');
      setErrors({});
    } catch (error) {
      setErrors({ submit: error.message || 'Failed to resend verification email' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <User className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">
              {isRegister ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="mt-2 text-sm text-gray-600">
              {isRegister 
                ? 'Sign up to get started with your account' 
                : 'Sign in to your account to continue'
              }
            </p>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center">
              <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          )}

          {/* Error Message */}
          {errors.submit && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
                <p className="text-sm text-red-700">{errors.submit}</p>
              </div>
              {errors.needsVerification && (
                <div className="mt-3">
                  <button
                    type="button"
                    onClick={resendVerification}
                    disabled={isLoading}
                    className="text-sm text-blue-600 hover:text-blue-800 underline"
                  >
                    Resend verification email
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Name Field (Register only) */}
            {isRegister && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your full name"
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Field (Register only) */}
            {isRegister && (
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
                      errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  {isRegister ? 'Creating Account...' : 'Signing In...'}
                </div>
              ) : (
                isRegister ? 'Create Account' : 'Sign In'
              )}
            </button>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-600">
              {isRegister ? 'Already have an account?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => window.location.href = isRegister ? '/login' : '/register'}
                className="font-medium text-blue-500 hover:text-blue-600 transition-colors"
              >
                {isRegister ? 'Sign in' : 'Sign up'}
              </button>
            </p>
          </div>

          {/* Forgot Password (Login only) */}
          {!isRegister && (
            <div className="mt-4 text-center">
              <button
                type="button"
                onClick={() => window.location.href = '/forgot-password'}
                className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
              >
                Forgot your password?
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthPage;