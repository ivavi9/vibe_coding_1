import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { LogIn, X, Sparkles, Clock, XCircle } from 'lucide-react';

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

  // Auto-dismiss after 20 seconds (increased for better UX)
  useEffect(() => {
    if (isVisible && !isDismissed) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setIsDismissed(true);
      }, 20000);
      return () => clearTimeout(timer);
    }
  }, [isVisible, isDismissed]);

  if (isAuthenticated || isLoading || isDismissed || !isVisible) return null;

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-40 animate-fade-in-down">
      <div className="bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-lg px-4 py-3 max-w-md mx-4">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-medium text-gray-900 mb-1">
              Unlock Full Features
            </h3>
            <p className="text-xs text-gray-600 mb-2">
              Sign in to save goals permanently
            </p>
            
            {/* Compact Guest Mode Status */}
            <div className="flex items-center space-x-3 text-xs text-gray-500 mb-2">
              <div className="flex items-center space-x-1">
                <div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>
                <span>Extract goals</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3 text-yellow-500" />
                <span>Trial active</span>
              </div>
              <div className="flex items-center space-x-1">
                <XCircle className="w-3 h-3 text-red-500" />
                <span>No save</span>
              </div>
            </div>

            {/* Compact Sign In Button */}
            <button
              onClick={loginWithGoogle}
              className="w-full inline-flex items-center justify-center px-3 py-1.5 bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white text-xs font-medium rounded-lg transition-all duration-200 transform hover:scale-105 shadow-sm"
            >
              <LogIn className="w-3 h-3 mr-1.5" />
              Continue with Google
            </button>
          </div>

          {/* Close Button */}
          <button
            onClick={() => setIsVisible(false)}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthenticationBanner;
