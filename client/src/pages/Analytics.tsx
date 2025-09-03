import { motion } from 'framer-motion'
import { BarChart3, TrendingUp, Calendar, Target } from 'lucide-react'
import { useGoalContext } from '../contexts/GoalContext'

export function Analytics() {
  const { goals, isLoading } = useGoalContext();
  
  // Calculate analytics data
  const totalGoals = goals.length;
  const activeGoals = goals.filter(goal => goal.status === 'active').length;
  const completedGoals = goals.filter(goal => goal.status === 'completed').length;
  const updatesThisMonth = goals.filter(goal => {
    // This is a placeholder - in a real app you'd track actual update timestamps
    return goal.current_progress > 0;
  }).length;

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
          <h3 className="text-2xl font-bold">{isLoading ? '...' : totalGoals}</h3>
          <p className="caption-text">Total Goals</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{isLoading ? '...' : activeGoals}</h3>
          <p className="caption-text">Active Goals</p>
        </div>
        <div className="card text-center">
          <BarChart3 className="w-8 h-8 text-blue-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{isLoading ? '...' : completedGoals}</h3>
          <p className="caption-text">Completed</p>
        </div>
        <div className="card text-center">
          <Calendar className="w-8 h-8 text-purple-500 mx-auto mb-2" />
          <h3 className="text-2xl font-bold">{isLoading ? '...' : updatesThisMonth}</h3>
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
          <div className="text-center py-12 text-primary-secondary">
            <Target className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">No goals yet</p>
            <p className="text-sm">Create your first goal to see performance analytics here</p>
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
          <div className="text-center py-12 text-primary-secondary">
            <Calendar className="w-16 h-16 mx-auto mb-4 opacity-20" />
            <p className="text-lg font-medium mb-2">No recent activity</p>
            <p className="text-sm">Start tracking your goals to see activity history here</p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}
