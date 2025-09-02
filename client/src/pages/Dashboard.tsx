import { motion } from 'framer-motion'
import { Plus, Target, TrendingUp, CheckCircle } from 'lucide-react'
import { useState, useEffect } from 'react'

interface Goal {
  id: string
  title: string
  description: string
  metric_type: string
  current_progress: number
  target_progress: number
  status: string
}

interface ProgressEntry {
  id: string
  goal_id: string
  description: string
  progress_value: number
  timestamp: number
  type: string
}

export function Dashboard() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([])
  const [progressInput, setProgressInput] = useState('')
  const [selectedGoalId, setSelectedGoalId] = useState('')
  const [progressValue, setProgressValue] = useState('')
  const [loading, setLoading] = useState(false)

  // Fetch goals and progress on component mount
  useEffect(() => {
    fetchGoals()
    fetchProgressHistory()
  }, [])

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals')
      const data = await response.json()
      setGoals(data.data || [])
    } catch (error) {
      console.error('Error fetching goals:', error)
    }
  }

  const fetchProgressHistory = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/progress')
      const data = await response.json()
      setProgressHistory(data.data || [])
    } catch (error) {
      console.error('Error fetching progress:', error)
    }
  }

  const trackProgress = async () => {
    if (!progressInput.trim() || !selectedGoalId) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_id: selectedGoalId,
          description: progressInput,
          progress_value: parseInt(progressValue) || 0
        })
      })
      
      if (response.ok) {
        // Clear form
        setProgressInput('')
        setSelectedGoalId('')
        setProgressValue('')
        
        // Refresh data
        await fetchGoals()
        await fetchProgressHistory()
      }
    } catch (error) {
      console.error('Error tracking progress:', error)
    } finally {
      setLoading(false)
    }
  }

  const getActiveGoalsCount = () => goals.filter(g => g.status === 'active').length
  const getCompletedGoalsCount = () => goals.filter(g => g.current_progress >= g.target_progress).length
  const getProgressUpdatesCount = () => progressHistory.length

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
          {/* Goal Selection */}
          <div>
            <label className="block text-sm font-medium text-primary-secondary mb-2">
              Select Goal
            </label>
            <select
              className="input-field w-full"
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
            >
              <option value="">Choose a goal...</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title} ({goal.current_progress}/{goal.target_progress})
                </option>
              ))}
            </select>
          </div>

          {/* Progress Value Input */}
          <div>
            <label className="block text-sm font-medium text-primary-secondary mb-2">
              Progress Value (optional)
            </label>
            <input
              type="number"
              className="input-field w-full"
              placeholder="e.g., 5 for 5km run, 2 for 2 chapters read"
              value={progressValue}
              onChange={(e) => setProgressValue(e.target.value)}
            />
          </div>

          {/* Progress Description */}
          <div>
            <label className="block text-sm font-medium text-primary-secondary mb-2">
              Description
            </label>
            <textarea
              className="input-field min-h-[100px] resize-none w-full"
              placeholder="I ran 5km and finished the first 2 chapters of 'Atomic Habits'..."
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
            />
          </div>

          <button 
            className="btn-primary w-full"
            onClick={trackProgress}
            disabled={loading || !progressInput.trim() || !selectedGoalId}
          >
            {loading ? 'Tracking...' : 'Track Progress'}
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
          <h3 className="text-lg font-semibold">{getActiveGoalsCount()}</h3>
          <p className="caption-text">Active Goals</p>
        </div>
        <div className="card text-center">
          <TrendingUp className="w-8 h-8 text-accent mx-auto mb-2" />
          <h3 className="text-lg font-semibold">{getProgressUpdatesCount()}</h3>
          <p className="caption-text">Progress Updates</p>
        </div>
        <div className="card text-center">
          <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold">{getCompletedGoalsCount()}</h3>
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
        {goals.length === 0 ? (
          <div className="text-center py-8 text-primary-secondary">
            No goals yet. Create your first goal in the Goals section!
          </div>
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 3).map((goal) => (
              <div key={goal.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="caption-text">{goal.current_progress} of {goal.target_progress} completed</p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-accent">
                    {Math.round((goal.current_progress / goal.target_progress) * 100)}%
                  </div>
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-accent h-2 rounded-full" 
                      style={{ width: `${(goal.current_progress / goal.target_progress) * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Recent Progress Updates */}
      {progressHistory.length > 0 && (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <h2 className="heading-2 mb-4">Recent Progress Updates</h2>
          <div className="space-y-3">
            {progressHistory.slice(0, 5).map((entry) => {
              const goal = goals.find(g => g.id === entry.goal_id)
              return (
                <div key={entry.id} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{goal?.title || 'Unknown Goal'}</p>
                      <p className="text-sm text-primary-secondary">{entry.description}</p>
                    </div>
                    <div className="text-right">
                      {entry.progress_value > 0 && (
                        <span className="text-sm font-medium text-accent">+{entry.progress_value}</span>
                      )}
                      <p className="text-xs text-primary-secondary">
                        {new Date(entry.timestamp * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </motion.div>
      )}
    </motion.div>
  )
}
