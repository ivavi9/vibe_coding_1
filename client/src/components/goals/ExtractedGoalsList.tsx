import React, { useState } from 'react';
import GoalEditForm from './GoalEditForm';
import GoalSkeleton from './GoalSkeleton';

interface ExtractedGoal {
  title: string;
  description: string;
  metric_type: string;
  target_progress: number;
}

interface ExtractedGoalsListProps {
  goals: ExtractedGoal[];
  onEditGoal: (index: number, updatedGoal: ExtractedGoal) => void;
  onCreateGoal: (goal: ExtractedGoal) => void;
  isLoading?: boolean;
}

const ExtractedGoalsList: React.FC<ExtractedGoalsListProps> = ({
  goals,
  onEditGoal,
  onCreateGoal,
  isLoading = false
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startEditing = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (updatedGoal: ExtractedGoal) => {
    if (editingIndex !== null) {
      onEditGoal(editingIndex, updatedGoal);
      setEditingIndex(null);
    }
  };

  const cancelEdit = () => {
    setEditingIndex(null);
  };

  if (isLoading) {
    return <GoalSkeleton />;
  }

  if (goals.length === 0) {
    return null;
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Goals</h3>
      <p className="text-sm text-gray-600 mb-4">
        Review and edit the extracted goals before adding them to your list.
      </p>
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="p-4 border border-gray-200 rounded-lg">
            {editingIndex === index ? (
              <GoalEditForm
                goal={goal}
                onSave={handleSaveEdit}
                onCancel={cancelEdit}
              />
            ) : (
              <div>
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {goal.metric_type} • Target: {goal.target_progress}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditing(index)}
                      className="flex items-center space-x-1 px-3 py-1 bg-yellow-600 text-white text-sm rounded hover:bg-yellow-700 transition-colors"
                    >
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => onCreateGoal(goal)}
                      className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Add Goal
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExtractedGoalsList;
