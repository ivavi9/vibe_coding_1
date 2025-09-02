import { motion } from 'framer-motion'
import { Plus, Target, Edit, Trash2, Upload, FileText, X } from 'lucide-react'
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

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(false)
  const [textInput, setTextInput] = useState('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extractedGoals, setExtractedGoals] = useState<Goal[]>([])
  const [showExtractedGoals, setShowExtractedGoals] = useState(false)

  // Fetch goals on component mount
  useEffect(() => {
    fetchGoals()
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

  const extractGoalsFromText = async () => {
    if (!textInput.trim()) return
    
    setLoading(true)
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput })
      })
      const data = await response.json()
      setExtractedGoals(data.extracted_goals || [])
      setShowExtractedGoals(true)
    } catch (error) {
      console.error('Error extracting goals:', error)
    } finally {
      setLoading(false)
    }
  }

  const uploadDocument = async () => {
    if (!selectedFile) return
    
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      
      const response = await fetch('http://localhost:8000/api/v1/upload/document', {
        method: 'POST',
        body: formData
      })
      const data = await response.json()
      setExtractedGoals(data.extracted_goals || [])
      setShowExtractedGoals(true)
      setSelectedFile(null)
    } catch (error) {
      console.error('Error uploading document:', error)
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async (goalData: Partial<Goal>) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      })
      const data = await response.json()
      await fetchGoals() // Refresh goals list
      return data
    } catch (error) {
      console.error('Error creating goal:', error)
    }
  }

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return
    
    try {
      await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'DELETE'
      })
      await fetchGoals() // Refresh goals list
    } catch (error) {
      console.error('Error deleting goal:', error)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const addExtractedGoal = async (goal: Goal) => {
    await createGoal(goal)
    setExtractedGoals(extractedGoals.filter(g => g.id !== goal.id))
  }

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
      </div>

      {/* Goal Creation - Text Input */}
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
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
          />
          <button 
            className="btn-primary w-full"
            onClick={extractGoalsFromText}
            disabled={loading || !textInput.trim()}
          >
            {loading ? 'Extracting...' : 'Extract Goals'}
          </button>
        </div>
      </motion.div>

      {/* Goal Creation - File Upload */}
      <motion.div 
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.15 }}
      >
        <h2 className="heading-2 mb-4">Upload Document</h2>
        <p className="body-text text-primary-secondary mb-4">
          Upload PDF, DOCX, or TXT files to extract goals
        </p>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileSelect}
              className="hidden"
              id="file-upload"
            />
            <label htmlFor="file-upload" className="btn-secondary cursor-pointer">
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </label>
            {selectedFile && (
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-accent" />
                <span className="text-sm">{selectedFile.name}</span>
                <button
                  onClick={() => setSelectedFile(null)}
                  className="p-1 hover:bg-gray-100 rounded"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
          <button 
            className="btn-primary w-full"
            onClick={uploadDocument}
            disabled={loading || !selectedFile}
          >
            {loading ? 'Processing...' : 'Extract Goals from Document'}
          </button>
        </div>
      </motion.div>

      {/* Extracted Goals */}
      {showExtractedGoals && extractedGoals.length > 0 && (
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <h2 className="heading-2 mb-4">Extracted Goals</h2>
          <div className="space-y-3">
            {extractedGoals.map((goal, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{goal.title}</h3>
                  <p className="text-sm text-primary-secondary">{goal.description}</p>
                </div>
                <button
                  onClick={() => addExtractedGoal(goal)}
                  className="btn-primary text-sm px-3 py-1"
                >
                  Add Goal
                </button>
              </div>
            ))}
          </div>
          <button
            onClick={() => setShowExtractedGoals(false)}
            className="mt-4 text-sm text-primary-secondary hover:text-primary"
          >
            Close
          </button>
        </motion.div>
      )}

      {/* Goals List */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.25 }}
      >
        <h2 className="heading-2">Your Goals</h2>
        
        {goals.length === 0 ? (
          <div className="text-center py-8 text-primary-secondary">
            No goals yet. Create your first goal above!
          </div>
        ) : (
          <div className="grid gap-4">
            {goals.map((goal) => (
              <motion.div 
                key={goal.id}
                className="card"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <Target className="w-5 h-5 text-accent" />
                      <h3 className="text-lg font-semibold">{goal.title}</h3>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                        {goal.status}
                      </span>
                    </div>
                    <p className="text-primary-secondary mb-3">
                      {goal.description}
                    </p>
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-primary-secondary">Progress:</span>
                        <span className="font-medium">{goal.current_progress} of {goal.target_progress}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-primary-secondary">Type:</span>
                        <span className="font-medium">{goal.metric_type}</span>
                      </div>
                    </div>
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-accent h-2 rounded-full" 
                          style={{ width: `${(goal.current_progress / goal.target_progress) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <Edit className="w-4 h-4 text-primary-secondary" />
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}
