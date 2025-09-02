import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  Plus,
  Save,
  Target,
  BarChart3,
  Clock,
  Star
} from 'lucide-react';
import axios from 'axios';
import { format } from 'date-fns';

const ProgressConsole = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [progressData, setProgressData] = useState({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  useEffect(() => {
    if (goals.length > 0) {
      initializeProgressData();
    }
  }, [goals, selectedDate]);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('/goals');
      setGoals(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const initializeProgressData = () => {
    const initialData = {};
    goals.forEach(goal => {
      initialData[goal.id] = {
        progress_value: 0,
        notes: ''
      };
    });
    setProgressData(initialData);
  };

  const handleProgressChange = (goalId, field, value) => {
    setProgressData(prev => ({
      ...prev,
      [goalId]: {
        ...prev[goalId],
        [field]: value
      }
    }));
  };

  const handleSaveAll = async () => {
    setSaving(true);
    try {
      const progressEntries = Object.entries(progressData).map(([goalId, data]) => ({
        goal_id: parseInt(goalId),
        progress_value: parseFloat(data.progress_value) || 0,
        notes: data.notes,
        date: selectedDate
      }));

      await axios.post('/daily-progress-bulk', progressEntries);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      
      // Refresh goals to show updated progress
      fetchGoals();
    } catch (error) {
      console.error('Error saving progress:', error);
    } finally {
      setSaving(false);
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Star className="w-4 h-4 text-red-500" />;
      case 'medium': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'low': return <Star className="w-4 h-4 text-green-500" />;
      default: return <Star className="w-4 h-4 text-gray-400" />;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'text-green-600';
    if (progress >= 50) return 'text-yellow-600';
    if (progress >= 25) return 'text-orange-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse" data-testid="skeleton-loading">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Progress Console</h1>
          <p className="text-lg text-gray-600">
            Track your daily progress across all goals in one place
          </p>
        </div>

        {/* Date Selector and Save Button */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <label htmlFor="date-input" className="text-sm font-medium text-gray-700">Date:</label>
              <input
                id="date-input"
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="form-input"
              />
            </div>
            <button
              onClick={handleSaveAll}
              disabled={saving}
              className={`btn btn-primary flex items-center gap-2 ${
                saved ? 'btn-success' : ''
              }`}
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Saving...
                </>
              ) : saved ? (
                <>
                  <CheckCircle className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save All Progress
                </>
              )}
            </button>
          </div>
        </div>

        {/* Progress Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">{goals.length}</h3>
            <p className="text-gray-600">Total Goals</p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Object.values(progressData).reduce((sum, data) => sum + (parseFloat(data.progress_value) || 0), 0)}
            </h3>
            <p className="text-gray-600">Total Progress Today</p>
          </div>
          
          <div className="card p-6 text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900">
              {Object.values(progressData).filter(data => parseFloat(data.progress_value) > 0).length}
            </h3>
            <p className="text-gray-600">Goals Updated</p>
          </div>
        </div>

        {/* Goals Progress List */}
        <div className="space-y-4">
          {goals.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No goals yet</h3>
              <p className="text-gray-600">
                Upload a document to extract your goals or create one manually.
              </p>
            </div>
          ) : (
            goals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card p-6"
              >
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
                  {/* Goal Info */}
                  <div className="lg:col-span-2">
                    <div className="flex items-start gap-3 mb-3">
                      {getPriorityIcon(goal.priority)}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-1">
                          {goal.title}
                        </h3>
                        {goal.description && (
                          <p className="text-gray-600 text-sm mb-2">
                            {goal.description}
                          </p>
                        )}
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <span className="capitalize">{goal.category}</span>
                          {goal.target_date && (
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Due {new Date(goal.target_date).toLocaleDateString()}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Current Progress Display */}
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">Current Total:</span>
                      <span className={`font-semibold ${getProgressColor(goal.current_progress || 0)}`}>
                        {goal.current_progress || 0}%
                      </span>
                      <div className="flex-1 max-w-xs">
                        <div className="progress">
                          <div 
                            className="progress-bar" 
                            style={{ width: `${goal.current_progress || 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Input */}
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Today's Progress
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          step="0.1"
                          value={progressData[goal.id]?.progress_value || ''}
                          onChange={(e) => handleProgressChange(goal.id, 'progress_value', e.target.value)}
                          className="form-input w-20 text-center"
                          placeholder="0"
                        />
                        <span className="text-gray-500">%</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Notes
                      </label>
                      <textarea
                        value={progressData[goal.id]?.notes || ''}
                        onChange={(e) => handleProgressChange(goal.id, 'notes', e.target.value)}
                        className="form-input form-textarea text-sm"
                        rows="2"
                        placeholder="What did you accomplish today?"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ProgressConsole;
