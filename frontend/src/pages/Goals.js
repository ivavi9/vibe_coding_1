import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Target, 
  Calendar, 
  Edit3, 
  Trash2, 
  BarChart3,
  CheckCircle,
  Circle,
  TrendingUp
} from 'lucide-react';
import axios from 'axios';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [progressText, setProgressText] = useState('');

  useEffect(() => {
    fetchGoals();
  }, []);

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

  const handleAddProgress = async () => {
    if (!selectedGoal || !progressText.trim()) return;
    
    try {
      await axios.post('/goals/track-progress', {
        progress_text: progressText,
        goal_ids: [selectedGoal.id]
      });
      
      // Refresh goals to show updated progress
      fetchGoals();
      
      // Reset form and close modal
      setProgressText('');
      setShowProgressModal(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const openProgressModal = (goal) => {
    setSelectedGoal(goal);
    setProgressText('');
    setShowProgressModal(true);
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const getMetricTypeIcon = (metricType) => {
    switch (metricType) {
      case 'Percentage':
        return <Circle className="w-4 h-4 text-blue-500" />;
      case 'Numeric':
        return <TrendingUp className="w-4 h-4 text-green-500" />;
      case 'Checklist':
        return <CheckCircle className="w-4 h-4 text-purple-500" />;
      default:
        return <Target className="w-4 h-4 text-gray-400" />;
    }
  };

  const getMetricTypeColor = (metricType) => {
    switch (metricType) {
      case 'Percentage':
        return 'bg-blue-100 text-blue-600';
      case 'Numeric':
        return 'bg-green-100 text-green-600';
      case 'Checklist':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  const getProgressPercentage = (goal) => {
    if (goal.metric_type === 'Percentage') {
      return goal.current_progress;
    } else if (goal.metric_type === 'Numeric') {
      return Math.min((goal.current_progress / goal.target_progress) * 100, 100);
    } else {
      return goal.current_progress;
    }
  };

  const getProgressColor = (progress) => {
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse" data-testid="skeleton-loading">
          <div className="h-12 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-xl"></div>
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
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-slate-900 mb-4">Your Goals</h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto">
            Track your progress with clarity and purpose. Every step forward counts.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-12">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search your goals..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Target className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-semibold text-slate-900 mb-3">
              {goals.length === 0 ? 'No goals yet' : 'No goals match your search'}
            </h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
              {goals.length === 0 
                ? 'Start by adding your first goal. What would you like to achieve?'
                : 'Try adjusting your search terms to find what you\'re looking for.'
              }
            </p>
            {goals.length === 0 && (
              <button
                onClick={() => setShowAddGoal(true)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-blue-500 text-white font-semibold rounded-2xl hover:bg-blue-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Plus className="w-5 h-5" />
                Add Your First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-100"
              >
                {/* Goal Header */}
                <div className="flex items-start justify-between mb-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      {getMetricTypeIcon(goal.metric_type)}
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getMetricTypeColor(goal.metric_type)}`}>
                        {goal.metric_type}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-900 mb-2 leading-tight">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {goal.description}
                      </p>
                    )}
                  </div>
                </div>

                {/* Progress Section */}
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-slate-600">Progress</span>
                    <span className="text-lg font-bold text-slate-900">
                      {goal.current_progress} / {goal.target_progress}
                      {goal.metric_type === 'Percentage' && '%'}
                    </span>
                  </div>
                  
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <div 
                      className={`h-full ${getProgressColor(getProgressPercentage(goal))} transition-all duration-500 ease-out`}
                      style={{ width: `${getProgressPercentage(goal)}%` }}
                    ></div>
                  </div>
                  
                  <div className="text-xs text-slate-500 text-center">
                    {getProgressPercentage(goal).toFixed(1)}% complete
                  </div>
                </div>

                {/* Goal Details */}
                <div className="space-y-3 mb-8">
                  {goal.target_date && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar className="w-4 h-4" />
                      <span>Due {new Date(goal.target_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Target className="w-4 h-4" />
                    <span>Target: {goal.target_progress}{goal.metric_type === 'Percentage' ? '%' : ''}</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <button
                    onClick={() => openProgressModal(goal)}
                    className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Update Progress
                  </button>
                  
                  <button
                    onClick={() => {/* Edit functionality */}}
                    className="p-3 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-all duration-200"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => {/* Delete functionality */}}
                    className="p-3 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all duration-200"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Progress Update Modal */}
      {showProgressModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl p-8 w-full max-w-lg"
          >
            <h3 className="text-2xl font-semibold text-slate-900 mb-6 text-center">
              Update Progress
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-3">
                  What progress did you make today?
                </label>
                <textarea
                  value={progressText}
                  onChange={(e) => setProgressText(e.target.value)}
                  className="w-full p-4 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  rows="4"
                  placeholder="Describe your progress in natural language..."
                />
              </div>
            </div>
            
            <div className="flex gap-4 mt-8">
              <button
                onClick={() => setShowProgressModal(false)}
                className="flex-1 py-3 px-6 border border-slate-200 text-slate-700 font-semibold rounded-xl hover:bg-slate-50 transition-all duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProgress}
                disabled={!progressText.trim()}
                className="flex-1 py-3 px-6 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                Update Progress
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Goals;
