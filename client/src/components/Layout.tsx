import { ReactNode } from 'react'
import Sidebar from './Sidebar.tsx'
import UserProfile from './auth/UserProfile.tsx'
import { useAuth } from '../hooks/useAuth'
import GoogleSignInButton from './auth/GoogleSignInButton'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated, isLoading } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Profile */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {/* Logo/Brand */}
            <h1 className="text-xl font-bold text-gray-900">Clarity</h1>
            
            {/* Guest Mode Indicator */}
            {!isAuthenticated && !isLoading && (
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <span>Guest Mode</span>
                <span className="text-xs text-gray-400">• Progress not saved</span>
              </div>
            )}
          </div>
          
          {/* User Profile, Sign-in Button, or Loading */}
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div data-testid="loading-spinner" className="w-6 h-6 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin" />
            ) : isAuthenticated ? (
              <UserProfile />
            ) : (
              <div className="flex items-center space-x-3">
                <span className="text-sm text-gray-600">Ready to save progress?</span>
                <GoogleSignInButton size="sm" variant="header" />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="flex">
        <Sidebar />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
