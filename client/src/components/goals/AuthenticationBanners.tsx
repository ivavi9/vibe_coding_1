import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import { useGuestMode } from '../../hooks/useGuestMode';

interface AuthenticationBannersProps {
  showWelcomeBanner: boolean;
  onDismissWelcome: () => void;
}

export const AuthenticationBanners: React.FC<AuthenticationBannersProps> = ({
  showWelcomeBanner,
  onDismissWelcome
}) => {
  const { isAuthenticated } = useAuth();
  const { getTrialTimeRemainingFormatted } = useGuestMode();

  if (!isAuthenticated) {
    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-sm font-medium text-blue-800">Guest Mode - Explore Clarity</h3>
              <div className="text-xs text-blue-700 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                  <span>✅ Extract unlimited goals</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                  <span>⏰ Trial: {getTrialTimeRemainingFormatted()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                  <span>❌ Cannot save permanently</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <span className="text-xs text-blue-600">Ready to unlock full features?</span>
            <button
              onClick={() => window.location.href = '/auth'}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105"
            >
              Sign In with Google
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showWelcomeBanner) {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 animate-in slide-in-from-top-4 duration-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <div>
              <h3 className="text-sm font-medium text-green-800">Welcome back!</h3>
              <p className="text-xs text-green-700">
                You have unlimited access to extract goals and save your progress.
              </p>
            </div>
          </div>
          <button
            onClick={onDismissWelcome}
            className="text-green-500 hover:text-green-700 transition-colors p-1"
            aria-label="Dismiss welcome message"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  return null;
};
