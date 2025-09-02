import { Routes, Route } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import { Analytics } from './pages/Analytics'
import { Layout } from './components/Layout'
import { AuthProvider } from './hooks/useAuth'
import { Toaster } from './components/ui/Toaster'

function App() {
  return (
    <AuthProvider>
      <Layout>
        <AnimatePresence mode="wait">
          <Routes>
            <Route
              path="/"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Dashboard />
                </motion.div>
              }
            />
            <Route
              path="/goals"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Goals />
                </motion.div>
              }
            />
            <Route
              path="/analytics"
              element={
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <Analytics />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
        <Toaster />
      </Layout>
    </AuthProvider>
  )
}

export default App
