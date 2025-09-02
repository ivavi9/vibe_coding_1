import React, { useState } from 'react';
import { X, CheckCircle, Trash2, RotateCcw, ArrowUp } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: 'in_progress' | 'completed' | 'deleted';
}

interface GoalManagementProps {
  goals: Goal[];
  onDeleteGoal: (goalId: string) => void;
  onCompleteGoal: (goalId: string) => void;
  onRecoverGoal: (goalId: string) => void;
}

const GoalManagement: React.FC<GoalManagementProps> = ({ 
  goals, 
  onDeleteGoal, 
  onCompleteGoal, 
  onRecoverGoal 
}) => {
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);
  const [activeTab, setActiveTab] = useState<'in_progress' | 'completed' | 'deleted'>('in_progress');

  const handleDeleteClick = (goal: Goal) => {
    setGoalToDelete(goal);
  };

  const handleConfirmDelete = () => {
    if (goalToDelete) {
      onDeleteGoal(goalToDelete.id);
      setGoalToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setGoalToDelete(null);
  };

  const filteredGoals = goals.filter(goal => goal.status === activeTab);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'deleted':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-blue-600 bg-blue-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'deleted':
        return <Trash2 className="w-4 h-4" />;
      default:
        return <ArrowUp className="w-4 h-4" />;
    }
  };

  const tabs = [
    { key: 'in_progress', label: 'In Progress', count: goals.filter(g => g.status === 'in_progress').length },
    { key: 'completed', label: 'Completed', count: goals.filter(g => g.status === 'completed').length },
    { key: 'deleted', label: 'Trash', count: goals.filter(g => g.status === 'deleted').length }
  ];

  if (goals.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Goals</h2>
        <p className="text-gray-500 text-center py-8">
          No goals yet. Create your first goal above!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Goal Management</h2>
        
        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex-1 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                activeTab === tab.key
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <span className="flex items-center justify-center space-x-2">
                <span>{tab.label}</span>
                <span className={`px-2 py-1 rounded-full text-xs ${
                  activeTab === tab.key ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </span>
            </button>
          ))}
        </div>

        {/* Goals List */}
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              {activeTab === 'in_progress' && <ArrowUp className="w-8 h-8 text-gray-400" />}
              {activeTab === 'completed' && <CheckCircle className="w-8 h-8 text-gray-400" />}
              {activeTab === 'deleted' && <Trash2 className="w-8 h-8 text-gray-400" />}
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {activeTab === 'in_progress' && 'No Active Goals'}
              {activeTab === 'completed' && 'No Completed Goals'}
              {activeTab === 'deleted' && 'Trash is Empty'}
            </h3>
            <p className="text-gray-500">
              {activeTab === 'in_progress' && 'Start working on your goals to see them here!'}
              {activeTab === 'completed' && 'Complete some goals to see your achievements here!'}
              {activeTab === 'deleted' && 'Deleted goals will appear here for recovery.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredGoals.map((goal) => (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow duration-200">
                {/* Header with Status */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 mb-1">{goal.title}</h3>
                    <div className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                      {getStatusIcon(goal.status)}
                      <span className="capitalize">{goal.status.replace('_', ' ')}</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-1">
                    {goal.status === 'in_progress' && (
                      <>
                        <button
                          onClick={() => onCompleteGoal(goal.id)}
                          className="p-1 text-green-600 hover:text-green-700 hover:bg-green-50 rounded transition-colors"
                          title="Mark as completed"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(goal)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                          title="Move to trash"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    
                    {goal.status === 'deleted' && (
                      <button
                        onClick={() => onRecoverGoal(goal.id)}
                        className="p-1 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                        title="Recover goal"
                      >
                        <RotateCcw className="w-4 h-4" />
                      </button>
                    )}
                    
                    {goal.status === 'completed' && (
                      <button
                        onClick={() => handleDeleteClick(goal)}
                        className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title="Move to trash"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                <p className="text-gray-600 text-sm mb-3">{goal.description}</p>

                {/* Progress Bar (only for in-progress goals) */}
                {goal.status === 'in_progress' && (
                  <div className="space-y-2 mb-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Progress</span>
                      <span className="text-gray-900">
                        {goal.current_progress} / {goal.target_progress}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${Math.min((goal.current_progress / goal.target_progress) * 100, 100)}%`
                        }}
                      />
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  {goal.metric_type} • {goal.status === 'completed' ? 'Achieved!' : goal.status.replace('_', ' ')}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!goalToDelete}
        title="Move Goal to Trash"
        message={`Are you sure you want to move "${goalToDelete?.title}" to trash? You can recover it later.`}
        confirmText="Move to Trash"
        cancelText="Cancel"
        type="warning"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default GoalManagement;
