import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const GoogleAuthCallback: React.FC = () => {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const error = searchParams.get('error');

    if (error) {
      // Handle OAuth error
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_ERROR',
        error
      }, window.location.origin);
      window.close();
      return;
    }

    if (code && state) {
      // Send success message to parent window
      window.opener?.postMessage({
        type: 'GOOGLE_OAUTH_SUCCESS',
        code,
        state
      }, window.location.origin);
      
      // Close popup
      window.close();
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 text-center">
        <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <div className="w-8 h-8 bg-white rounded-full"></div>
        </div>
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Completing Sign In
        </h2>
        <p className="text-gray-600 mb-6">
          Please wait while we complete your Google authentication...
        </p>
        <LoadingSpinner size="lg" />
      </div>
    </div>
  );
};

export default GoogleAuthCallback;
