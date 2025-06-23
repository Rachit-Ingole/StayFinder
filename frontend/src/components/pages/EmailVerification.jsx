import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, Mail, RefreshCw, ArrowLeft } from 'lucide-react';

const EmailVerification = () => {
  const [status, setStatus] = useState('verifying'); // 'verifying', 'success', 'error', 'expired'
  const [message, setMessage] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState('');
  const [showResendForm, setShowResendForm] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;

  const alreadyVerifiedRef = useRef(false);

  useEffect(() => {
    const verifyEmail = async () => {
      if (alreadyVerifiedRef.current) return; 
      alreadyVerifiedRef.current = true; 

      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');

      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link. No token found.');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/api/v1/auth/verify-email?token=${token}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        const data = await response.json();

        if (response.ok) {
          setStatus('success');
          setMessage('Your email has been verified successfully! You can now sign in to your account.');

          setTimeout(() => {
            window.location.href = '/login';
          }, 3000);
        } else {
          if (data.message?.toLowerCase().includes('expired')) {
            setStatus('expired');
            setMessage('Your verification link has expired. Please request a new one.');
          } else {
            setStatus('error');
            setMessage(data.message || 'Email verification failed. Please try again.');
          }
        }
      } catch (error) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage('An error occurred while verifying your email. Please try again.');
      }
    };

    verifyEmail();
  }, [API_URL]);
  

  const handleResendVerification = async () => {
    if (!email) {
      alert('Please enter your email address');
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch(`${API_URL}/api/v1/auth/resend-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('A new verification email has been sent to your email address.');
        setShowResendForm(false);
        setStatus('success');
      } else {
        alert(data.error || 'Failed to resend verification email');
      }
    } catch (error) {
      alert('An error occurred while resending the verification email');
      console.error('Resend error:', error);
    } finally {
      setIsResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'verifying':
        return <RefreshCw className="h-16 w-16 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-16 w-16 text-green-500" />;
      case 'error':
      case 'expired':
        return <XCircle className="h-16 w-16 text-red-500" />;
      default:
        return <Mail className="h-16 w-16 text-blue-500" />;
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'success':
        return 'text-green-600';
      case 'error':
      case 'expired':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  const getBackgroundColor = () => {
    switch (status) {
      case 'success':
        return 'from-green-50 to-emerald-100';
      case 'error':
      case 'expired':
        return 'from-red-50 to-rose-100';
      default:
        return 'from-blue-50 to-indigo-100';
    }
  };

  return (
    <div className={`min-h-screen bg-gradient-to-br ${getBackgroundColor()} flex items-center justify-center px-4 py-8`}>
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-6">
            {getStatusIcon()}
          </div>

          {/* Title */}
          <h1 className={`text-2xl font-bold mb-4 ${getStatusColor()}`}>
            {status === 'verifying' && 'Verifying Your Email'}
            {status === 'success' && 'Email Verified!'}
            {status === 'error' && 'Verification Failed'}
            {status === 'expired' && 'Link Expired'}
          </h1>

          {/* Message */}
          <p className="text-gray-600 mb-8 leading-relaxed">
            {message}
          </p>

          {/* Success Actions */}
          {status === 'success' && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  Redirecting to login page in 3 seconds...
                </p>
              </div>
              <a
                href="/login"
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                Continue to Login
              </a>
            </div>
          )}

          {/* Error/Expired Actions */}
          {(status === 'error' || status === 'expired') && !showResendForm && (
            <div className="space-y-4">
              <button
                onClick={() => setShowResendForm(true)}
                className="inline-flex items-center justify-center w-full py-3 px-4 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-colors"
              >
                <Mail className="h-5 w-5 mr-2" />
                Resend Verification Email
              </button>
              
              <a
                href="/register"
                className="inline-flex items-center justify-center w-full py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                Back to Registration
              </a>
            </div>
          )}

          {/* Resend Form */}
          {showResendForm && (
            <div className="space-y-4">
              <div className="text-left">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Enter your email address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={handleResendVerification}
                  disabled={isResending}
                  className={`flex-1 py-3 px-4 rounded-lg text-white font-medium transition-colors ${
                    isResending
                      ? 'bg-blue-400 cursor-not-allowed'
                      : 'bg-blue-500 hover:bg-blue-600'
                  }`}
                >
                  {isResending ? (
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      Sending...
                    </div>
                  ) : (
                    'Send Email'
                  )}
                </button>
                
                <button
                  onClick={() => setShowResendForm(false)}
                  className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Verifying State */}
          {status === 'verifying' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700">
                Please wait while we verify your email address...
              </p>
            </div>
          )}

          {/* Back to Home */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <a
              href="/"
              className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;