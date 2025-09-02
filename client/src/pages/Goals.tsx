import { motion } from 'framer-motion'
import { Plus, Target, Edit, Trash2 } from 'lucide-react'

export function Goals() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Goals</h1>
          <p className="body-text text-primary-secondary">
            Manage and track your personal goals
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Goal Creation */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="heading-2 mb-4">Create Goals from Text</h2>
        <div className="space-y-4">
          <textarea
            className="input-field min-h-[120px] resize-none"
            placeholder="Paste your goals here... For example: I need to read 12 books this year and also finish my certification exam by June. I should also run 100km."
          />
          <button className="btn-primary w-full">
            Extract Goals
          </button>
        </div>
      </motion.div>

      {/* Goals List */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="heading-2">Your Goals</h2>
        
        <div className="grid gap-4">
          {/* Goal Card 1 */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.3 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold">Read 12 books</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-primary-secondary mb-3">
                  Read 12 books this year to expand knowledge and improve reading habits.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-primary-secondary">Progress:</span>
                    <span className="font-medium">3 of 12</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-primary-secondary">Type:</span>
                    <span className="font-medium">Numeric</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '25%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-primary-secondary" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>

          {/* Goal Card 2 */}
          <motion.div 
            className="card"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.4 }}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Target className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold">Run 100km</h3>
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    Active
                  </span>
                </div>
                <p className="text-primary-secondary mb-3">
                  Build endurance and fitness by running 100km total.
                </p>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-primary-secondary">Progress:</span>
                    <span className="font-medium">15 of 100</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-primary-secondary">Type:</span>
                    <span className="font-medium">Numeric</span>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-accent h-2 rounded-full" style={{ width: '15%' }}></div>
                  </div>
                </div>
              </div>
              <div className="flex space-x-2">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Edit className="w-4 h-4 text-primary-secondary" />
                </button>
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4 text-red-500" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  )
}
