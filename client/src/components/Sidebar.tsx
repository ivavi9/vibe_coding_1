import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home, Target, BarChart3 } from 'lucide-react'

const navigationItems = [
  { path: '/', label: 'Dashboard', icon: Home },
  { path: '/goals', label: 'Goals', icon: Target },
  { path: '/analytics', label: 'Analytics', icon: BarChart3 },
]

const Sidebar = () => {
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
    </motion.aside>
  )
}

export default Sidebar
