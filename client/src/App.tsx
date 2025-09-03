import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import { Analytics } from './pages/Analytics'
import Auth from './pages/Auth'
import GoogleAuthCallback from './pages/GoogleAuthCallback'
import { Layout } from './components/Layout'
import { AuthProvider } from './hooks/useAuth'
import { GoalProvider } from './contexts/GoalContext'
import { Toaster } from './components/ui/Toaster'

function App() {
  return (
    <AuthProvider>
      <GoalProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        
        {/* App routes - accessible to all users */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/goals"
          element={
            <Layout>
              <Goals />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <Analytics />
            </Layout>
          }
        />
      </Routes>
      <Toaster />
      </GoalProvider>
    </AuthProvider>
  )
}

export default App
