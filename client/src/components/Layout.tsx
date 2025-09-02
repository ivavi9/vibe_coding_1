import { ReactNode } from 'react'
import Sidebar from './Sidebar.tsx'
import UserProfile from './auth/UserProfile.tsx'

interface LayoutProps {
  children: ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with User Profile */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex justify-end">
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
