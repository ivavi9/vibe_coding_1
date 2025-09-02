import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Star, 
  Target, 
  Calendar, 
  Edit3, 
  Trash2, 
  BarChart3,
  AlertTriangle,
  MoreVertical
} from 'lucide-react';
import axios from 'axios';

const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressForm, setProgressForm] = useState({
    progress_value: '',
    notes: ''
  });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    category: 'general'
  });

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
    if (!selectedGoal || !progressForm.progress_value) return;
    
    try {
      await axios.post('/daily-progress', {
        goal_id: selectedGoal.id,
        progress_value: parseFloat(progressForm.progress_value),
        notes: progressForm.notes
      });
      
      // Refresh goals to show updated progress
      fetchGoals();
      
      // Reset form and close modal
      setProgressForm({ progress_value: '', notes: '' });
      setShowProgressModal(false);
      setSelectedGoal(null);
    } catch (error) {
      console.error('Error adding progress:', error);
    }
  };

  const openProgressModal = (goal) => {
    setSelectedGoal(goal);
    setProgressForm({ progress_value: '', notes: '' });
    setShowProgressModal(true);
  };

  const openEditModal = (goal) => {
    setSelectedGoal(goal);
    setEditForm({
      title: goal.title,
      description: goal.description,
      priority: goal.priority,
      category: goal.category
    });
    setShowEditModal(true);
  };

  const handleEditGoal = async (e) => {
    e.preventDefault();
    if (!selectedGoal) return;

    try {
      await axios.put(`/goals/${selectedGoal.id}`, editForm);
      fetchGoals();
      setShowEditModal(false);
      setSelectedGoal(null);
      setEditForm({ title: '', description: '', priority: 'medium', category: 'general' });
    } catch (error) {
      console.error('Error editing goal:', error);
    }
  };

  const filteredGoals = goals.filter(goal => {
    const matchesSearch = goal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         goal.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || goal.category === filterCategory;
    const matchesPriority = filterPriority === 'all' || goal.priority === filterPriority;
    
    return matchesSearch && matchesCategory && matchesPriority;
  });

  const categories = [...new Set(goals.map(goal => goal.category))];
  const priorities = ['low', 'medium', 'high'];

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-600';
      case 'medium': return 'bg-yellow-100 text-yellow-600';
      case 'low': return 'bg-green-100 text-green-600';
      default: return 'bg-gray-100 text-gray-600';
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
    if (progress >= 80) return 'bg-green-500';
    if (progress >= 50) return 'bg-yellow-500';
    if (progress >= 25) return 'bg-orange-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse" data-testid="skeleton-loading">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
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
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Your Goals</h1>
            <p className="text-lg text-gray-600">
              Track and manage all your goals in one place
            </p>
          </div>
          <button
            onClick={() => setShowAddGoal(true)}
            className="btn btn-primary mt-4 sm:mt-0 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Add Goal
          </button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search goals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="form-input pl-10"
              />
            </div>

            {/* Category Filter */}
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="form-input"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="form-input"
            >
              <option value="all">All Priorities</option>
              {priorities.map(priority => (
                <option key={priority} value={priority}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </option>
              ))}
            </select>

            {/* Results Count */}
            <div className="flex items-center text-sm text-gray-600">
              <span>{filteredGoals.length} of {goals.length} goals</span>
            </div>
          </div>
        </div>

        {/* Goals Grid */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {goals.length === 0 ? 'No goals yet' : 'No goals match your filters'}
            </h3>
            <p className="text-gray-600 mb-6">
              {goals.length === 0 
                ? 'Upload a document to extract your goals or create one manually.'
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {goals.length === 0 && (
              <button
                onClick={() => setShowAddGoal(true)}
                className="btn btn-primary"
              >
                Add Your First Goal
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGoals.map((goal, index) => (
              <motion.div
                key={goal.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4 }}
                className="card p-6 cursor-pointer group"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      {getPriorityIcon(goal.priority)}
                      <h3 className="font-semibold text-gray-900 line-clamp-2">
                        {goal.title}
                      </h3>
                    </div>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(goal.priority)}`}>
                      {goal.priority}
                    </span>
                  </div>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded">
                    <MoreVertical className="w-4 h-4 text-gray-400" />
                  </button>
                </div>

                {/* Description */}
                {goal.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {goal.description}
                  </p>
                )}

                {/* Progress */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Progress</span>
                    <span className="font-medium text-gray-900">
                      {goal.current_progress || 0}%
                    </span>
                  </div>
                  <div className="progress">
                    <div 
                      className={`progress-bar ${getProgressColor(goal.current_progress || 0)}`} 
                      style={{ width: `${goal.current_progress || 0}%` }}
                    ></div>
                  </div>
                  {goal.total_progress_entries > 0 && (
                    <div className="text-xs text-gray-500">
                      {goal.total_progress_entries} progress entries
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <span className="capitalize">{goal.category}</span>
                  </div>
                  {goal.target_date && (
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(goal.target_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => openProgressModal(goal)}
                    className="btn btn-primary btn-sm flex items-center gap-2"
                  >
                    <BarChart3 className="w-4 h-4" />
                    Track Progress
                  </button>
                  <button
                    onClick={() => openEditModal(goal)}
                    className="btn btn-secondary btn-sm flex items-center gap-2"
                  >
                    <Edit3 className="w-4 h-4" />
                    Edit
                  </button>
                  <button
                    onClick={() => {
                      setSelectedGoal(goal);
                      setShowDeleteConfirm(true);
                    }}
                    className="btn btn-danger btn-sm flex items-center gap-2"
                  >
                    <Trash2 className="w-4 h-4" />
                    Delete
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Progress Modal */}
      {showProgressModal && selectedGoal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Track Progress: {selectedGoal.title}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Progress Value
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progressForm.progress_value}
                    onChange={(e) => setProgressForm(prev => ({ ...prev, progress_value: e.target.value }))}
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
                  value={progressForm.notes}
                  onChange={(e) => setProgressForm(prev => ({ ...prev, notes: e.target.value }))}
                  className="form-input form-textarea"
                  rows="3"
                  placeholder="What did you accomplish today?"
                />
              </div>
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setShowProgressModal(false)}
                className="btn btn-secondary flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProgress}
                disabled={!progressForm.progress_value}
                className="btn btn-primary flex-1"
              >
                Save Progress
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Goals;
