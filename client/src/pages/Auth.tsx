import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import GoogleSignInButton from '../components/auth/GoogleSignInButton';
import { Target, Sparkles } from 'lucide-react';

const Auth: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();

  // If already authenticated, redirect to goals
  if (isAuthenticated) {
    return <Navigate to="/goals" replace />;
  }

  // Show loading while checking auth status
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Target className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to Clarity
          </h1>
          <p className="text-gray-600">
            Your AI-powered goal achievement partner
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Sign In to Continue
            </h2>
            <p className="text-gray-500">
              Use your Google account to get started with Clarity
            </p>
          </div>

          {/* Google Sign In Button */}
          <GoogleSignInButton />

          {/* Features */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h3 className="text-sm font-medium text-gray-900 mb-4 text-center">
              What you'll get with Clarity:
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-green-600" />
                </div>
                <span className="text-sm text-gray-600">AI-powered goal extraction</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Target className="w-3 h-3 text-blue-600" />
                </div>
                <span className="text-sm text-gray-600">Smart progress tracking</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-purple-600" />
                </div>
                <span className="text-sm text-gray-600">Personalized insights</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
