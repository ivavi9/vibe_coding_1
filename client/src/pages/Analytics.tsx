import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react'

export function Analytics() {
  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div>
          <h1 className="heading-2">Analytics</h1>
          <p className="body-text text-primary-secondary">
            Visualize your progress and insights
          </p>
        </div>
      </div>

      {/* Overview Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-4 gap-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <div className="card text-center">
          <Target className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="text-2xl font-bold">5</h3>
          <p className="caption-text">Total Goals</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">3</h3>
          <p className="caption-text">Active Goals</p>
        </div>
        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">2</h3>
          <p className="caption-text">Completed</p>
        </div>
        <div className="card text-center">
          <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">12</h3>
          <p className="caption-text">Updates This Month</p>
        </div>
      </motion.div>

      {/* Progress Chart */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <h2 className="heading-2 mb-4">Progress Overview</h2>
        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
          <div className="text-center text-primary-secondary">
            <BarChart3 className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p>Progress charts will be displayed here</p>
            <p className="text-sm">Integration with Recharts coming soon</p>
          </div>
        </div>
      </motion.div>

      {/* Goal Performance */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <h2 className="heading-2 mb-4">Goal Performance</h2>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-accent" />
              <div>
                <h3 className="font-medium">Read 12 books</h3>
                <p className="caption-text">Started 3 months ago</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-accent">25%</div>
              <div className="text-sm text-primary-secondary">On track</div>
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Target className="w-5 h-5 text-accent" />
              <div>
                <h3 className="font-medium">Run 100km</h3>
                <p className="caption-text">Started 1 month ago</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-accent">15%</div>
              <div className="text-sm text-primary-secondary">Behind schedule</div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Recent Activity */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.4 }}
      >
        <h2 className="heading-2 mb-4">Recent Activity</h2>
        <div className="space-y-3">
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm">Updated progress for "Read 12 books"</p>
              <p className="caption-text">2 hours ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm">Added new goal "Learn Spanish"</p>
              <p className="caption-text">1 day ago</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm">Completed goal "Finish Project X"</p>
              <p className="caption-text">3 days ago</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
