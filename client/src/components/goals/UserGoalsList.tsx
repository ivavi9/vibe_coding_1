import React, { useState } from 'react';
import { X } from 'lucide-react';
import ConfirmationModal from '../ui/ConfirmationModal';

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: string;
}

interface UserGoalsListProps {
  goals: Goal[];
  onDeleteGoal: (goalId: string) => void;
}

const UserGoalsList: React.FC<UserGoalsListProps> = ({ goals, onDeleteGoal }) => {
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

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
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Goals</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {goals.map((goal) => (
            <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <h3 className="font-medium text-gray-900">{goal.title}</h3>
                <button
                  onClick={() => handleDeleteClick(goal)}
                  className="text-red-500 hover:text-red-700 text-sm transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-gray-600 text-sm mb-3">{goal.description}</p>

              <div className="space-y-2">
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

              <div className="mt-3 text-xs text-gray-500">
                {goal.metric_type} • {goal.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!goalToDelete}
        title="Delete Goal"
        message={`Are you sure you want to delete "${goalToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete Goal"
        cancelText="Cancel"
        type="danger"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
};

export default UserGoalsList;
