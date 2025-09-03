import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Target, BarChart3, Sparkles, Clock, Save, XCircle } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useGuestMode } from '../hooks/useGuestMode'

const navigationItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
]

const Sidebar = () => {
  const { isAuthenticated, isLoading } = useAuth()
  const { getTrialTimeRemainingFormatted } = useGuestMode()

  return (
    <motion.aside 
      className="w-64 bg-white border-r border-gray-200 p-6"
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <nav className="space-y-2">
        {navigationItems.map((item, index) => (
          <motion.div
            key={item.path}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.1 + index * 0.1 }}
          >
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </NavLink>
          </motion.div>
        ))}
      </nav>

      {/* Guest Mode Information Section */}
      {!isLoading && !isAuthenticated && (
        <motion.div
          className="mt-8 pt-6 border-t border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-semibold text-gray-900 mb-1">
                Guest Mode Active
              </h3>
              <p className="text-xs text-gray-500">
                Sign in via the banner above to unlock full features
              </p>
            </div>

            {/* Guest Mode Benefits & Limitations */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span>✅ Extract unlimited goals</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <Clock className="w-3 h-3 text-yellow-500" />
                <span>⏰ Trial: {getTrialTimeRemainingFormatted()}</span>
              </div>
              <div className="flex items-center space-x-2 text-xs text-gray-600">
                <XCircle className="w-3 h-3 text-red-500" />
                <span>❌ Cannot save permanently</span>
              </div>
            </div>

            {/* Call to Action */}
            <div className="pt-2 text-center">
              <p className="text-xs text-blue-600 font-medium">
                Use the sign-in button in the header above
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Authenticated User Status */}
      {!isLoading && isAuthenticated && (
        <motion.div
          className="mt-8 pt-6 border-t border-gray-200"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <Save className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              Full Access Enabled
            </h3>
            <p className="text-xs text-gray-500">
              All features unlocked
            </p>
          </div>
        </motion.div>
      )}
    </motion.aside>
  )
}

export default Sidebar
