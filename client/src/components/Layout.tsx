import { ReactNode } from 'react'
import Sidebar from './Sidebar.tsx'
import UserProfile from './auth/UserProfile.tsx'
import { useAuth } from '../hooks/useAuth'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Profile */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Guest Mode Indicator */}
          {!isAuthenticated && (
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <span>Guest Mode</span>
              <span className="text-xs text-gray-400">• Progress not saved</span>
            </div>
          )}
          
          <UserProfile />
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
