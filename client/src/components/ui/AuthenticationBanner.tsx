import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, X, User, Sparkles } from 'lucide-react';

const AuthenticationBanner: React.FC = () => {
  const { user, isAuthenticated, isLoading, loginWithGoogle } = useAuth();
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    // Show banner after a short delay if not authenticated
    if (!isAuthenticated && !isLoading) {
      const timer = setTimeout(() => setIsVisible(true), 1000);
      return () => clearTimeout(timer);
    } else if (isAuthenticated) {
      setIsVisible(false);
    }
  }, [isAuthenticated, isLoading]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (isVisible && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsDismissed(true);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isDismissed]);

  if (isAuthenticated || isLoading || isDismissed || !isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in-down">
      <div className="bg-white/90 backdrop-blur-xl border border-gray-200/50 rounded-2xl shadow-lg px-6 py-4 max-w-md mx-4">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900">
              Unlock your full potential
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              Sign in to save goals and track progress
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button
              onClick={loginWithGoogle}
              className="inline-flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium rounded-lg transition-colors duration-200"
            >
              <LogIn className="w-3 h-3 mr-1.5" />
              Sign In
            </button>
            
            <button
              onClick={() => setIsVisible(false)}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationBanner;
