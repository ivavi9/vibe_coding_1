import { motion } from 'framer-motion'
import { User, Settings } from 'lucide-react'

export function Header() {
  return (
    <motion.header 
      className="bg-panel border-b border-border px-6 py-4"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <motion.h1 
            className="heading-1 text-accent"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            Clarity
          </motion.h1>
          <p className="caption-text">AI-Native Personal Achievement Partner</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Settings className="w-5 h-5 text-primary-secondary" />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <User className="w-5 h-5 text-primary-secondary" />
          </button>
        </div>
      </div>
    </motion.header>
  )
}
