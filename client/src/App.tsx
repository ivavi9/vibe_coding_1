import { Routes, Route } from 'react-router-dom'
import { motion } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import { Analytics } from './pages/Analytics'
import Auth from './pages/Auth'
import GoogleAuthCallback from './pages/GoogleAuthCallback'
import { Layout } from './components/Layout'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { AuthProvider } from './hooks/useAuth'
import { Toaster } from './components/ui/Toaster'

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        
        {/* Protected routes with Layout */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Dashboard />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/goals"
          element={
            <ProtectedRoute>
              <Layout>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Goals />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/analytics"
          element={
            <ProtectedRoute>
              <Layout>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Analytics />
                </motion.div>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
      <Toaster />
    </AuthProvider>
  )
}

export default App
