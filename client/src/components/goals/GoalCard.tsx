import React, { useState } from 'react';
import { 
  Target, 
  CheckCircle, 
  RotateCcw, 
  Trash2, 
  TrendingUp,
  Star,
  Sparkles,
  Zap,
  Trophy
} from 'lucide-react';
import { useGoalContext } from '../../contexts/GoalContext';
import { useToast } from '../../hooks/useToast';

interface GoalCardProps {
  goal: {
    id: string;
    title: string;
    description: string;
    metric_type: string;
    current_progress: number;
    target_progress: number;
    status: 'active' | 'completed' | 'paused' | 'cancelled';
  };
  onGoalUpdate: () => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onGoalUpdate }) => {
  const { updateGoal, completeGoal, reactivateGoal, deleteGoal } = useGoalContext();
  const { showSuccess, showError } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [showReactivationModal, setShowReactivationModal] = useState(false);

  const progressPercentage = Math.round((goal.current_progress / goal.target_progress) * 100);
  const isCompleted = goal.status === 'completed';
  const isActive = goal.status === 'active';

  const handleCompleteGoal = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await completeGoal(goal.id);
      showSuccess('Goal Completed! 🎉', 'Congratulations on achieving your goal!');
      onGoalUpdate();
    } catch (error) {
      showError('Error', 'Failed to complete goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReactivateGoal = async () => {
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      await reactivateGoal(goal.id);
      showSuccess('Goal Reactivated! 🔄', 'Your goal is now active again. Keep pushing forward!');
      setShowReactivationModal(false);
      onGoalUpdate();
    } catch (error) {
      showError('Error', 'Failed to reactivate goal. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteGoal = async () => {
    if (isLoading) return;
    
    if (window.confirm('Are you sure you want to delete this goal? This action cannot be undone.')) {
      try {
        setIsLoading(true);
        await deleteGoal(goal.id);
        showSuccess('Goal Deleted', 'Goal has been removed successfully.');
        onGoalUpdate();
      } catch (error) {
        showError('Error', 'Failed to delete goal. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    if (percentage >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getStatusIcon = () => {
    if (isCompleted) return <Trophy className="w-5 h-5 text-yellow-500" />;
    if (isActive) return <Target className="w-5 h-5 text-blue-500" />;
    return <TrendingUp className="w-5 h-5 text-gray-500" />;
  };

  const getStatusText = () => {
    if (isCompleted) return 'Completed';
    if (isActive) return 'Active';
    return 'Paused';
  };

  const getStatusColor = () => {
    if (isCompleted) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (isActive) return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  return (
    <>
      <div className={`bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border ${
        isCompleted ? 'border-yellow-200 bg-gradient-to-br from-yellow-50 to-orange-50' : 'border-gray-200'
      }`}>
        {/* Header with Status */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            {getStatusIcon()}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
              <p className="text-sm text-gray-600">{goal.description}</p>
            </div>
          </div>
          <span className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusColor()}`}>
            {getStatusText()}
          </span>
        </div>

        {/* Progress Section */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm font-medium text-gray-900">
              {goal.current_progress} / {goal.target_progress} {goal.metric_type}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all duration-500 ${getProgressColor(progressPercentage)}`}
              style={{ width: `${Math.min(progressPercentage, 100)}%` }}
            ></div>
          </div>
          <div className="text-right mt-1">
            <span className={`text-xs font-medium ${getProgressColor(progressPercentage).replace('bg-', 'text-')}`}>
              {progressPercentage}%
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {isActive && (
            <button
              onClick={handleCompleteGoal}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <CheckCircle className="w-4 h-4" />
                  <span>Complete Goal</span>
                </>
              )}
            </button>
          )}

          {isCompleted && (
            <button
              onClick={() => setShowReactivationModal(true)}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reactivate Goal</span>
            </button>
          )}

          <button
            onClick={handleDeleteGoal}
            disabled={isLoading}
            className="px-3 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>

        {/* Completion Celebration */}
        {isCompleted && (
          <div className="mt-4 p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg border border-yellow-200">
            <div className="flex items-center space-x-2 text-yellow-800">
              <Star className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium">Goal Achieved!</span>
              <Sparkles className="w-4 h-4 text-yellow-600 animate-pulse" />
            </div>
            <p className="text-xs text-yellow-700 mt-1">
              You've successfully completed this goal. Ready to take it to the next level?
            </p>
          </div>
        )}
      </div>

      {/* Reactivation Modal */}
      {showReactivationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <RotateCcw className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Reactivate Goal</h3>
              <p className="text-gray-600">
                Are you ready to take "{goal.title}" to the next level? 
                This will reset your progress and set you on a new journey.
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={handleReactivateGoal}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Yes, Let's Go! 🚀</span>
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowReactivationModal(false)}
                className="w-full px-4 py-3 text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-lg font-medium transition-all duration-200"
              >
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GoalCard;
