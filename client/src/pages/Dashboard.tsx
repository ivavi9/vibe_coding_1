import { motion } from 'framer-motion'
import { Plus, Target, TrendingUp } from 'lucide-react'

export function Dashboard() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Dashboard</h1>
          <p className="body-text text-primary-secondary">
            Track your progress and stay motivated
          </p>
        </div>
        <button className="btn-primary flex items-center space-x-2">
          <Plus className="w-5 h-5" />
          <span>Add Goal</span>
        </button>
      </div>

      {/* Progress Input */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <h2 className="heading-2 mb-4">What progress did you make today?</h2>
        <div className="space-y-4">
          <textarea
            className="input-field min-h-[100px] resize-none"
            placeholder="I ran 5km and finished the first 2 chapters of 'Atomic Habits'..."
          />
          <button className="btn-primary w-full">
            Track Progress
          </button>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <div className="card text-center">
          <Target className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="text-lg font-semibold">5</h3>
          <p className="caption-text">Active Goals</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="text-lg font-semibold">12</h3>
          <p className="caption-text">Progress Updates</p>
        </div>
        <div className="card text-center">
          <Target className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="text-lg font-semibold">3</h3>
          <p className="caption-text">Completed</p>
        </div>
      </motion.div>

      {/* Recent Goals */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="heading-2 mb-4">Recent Goals</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Read 12 books</h3>
              <p className="caption-text">3 of 12 completed</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-accent">25%</div>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '25%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h3 className="font-medium">Run 100km</h3>
              <p className="caption-text">15 of 100 completed</p>
            </div>
            <div className="text-right">
              <div className="text-sm font-medium text-accent">15%</div>
              <div className="w-20 bg-gray-200 rounded-full h-2">
                <div className="bg-accent h-2 rounded-full" style={{ width: '15%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
