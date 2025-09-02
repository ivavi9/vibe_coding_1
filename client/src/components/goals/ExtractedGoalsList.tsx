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
  onEditGoal: (goal: ExtractedGoal) => void;
  onCreateGoal: (goal: ExtractedGoal) => void;
  isLoading?: boolean;
  addedGoals?: Set<string>; // Track which goals have been added
}

const ExtractedGoalsList: React.FC<ExtractedGoalsListProps> = ({
  goals,
  onEditGoal,
  onCreateGoal,
  isLoading = false,
  addedGoals = new Set()
}) => {
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const startEditing = (index: number) => {
    setEditingIndex(index);
  };

  const handleSaveEdit = (updatedGoal: ExtractedGoal) => {
    if (editingIndex !== null) {
      onEditGoal(updatedGoal);
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
        {goals.map((goal, index) => {
          const goalKey = `${goal.title}-${goal.description}-${goal.metric_type}-${goal.target_progress}`;
          const isAdded = addedGoals.has(goalKey);
          
          return (
            <div key={index} className={`p-4 border rounded-lg transition-all duration-200 ${
              isAdded 
                ? 'border-green-200 bg-green-50' 
                : 'border-gray-200'
            }`}>
              {editingIndex === index ? (
                <GoalEditForm
                  goal={goal}
                  onSave={handleSaveEdit}
                  onCancel={cancelEdit}
                />
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-gray-900">{goal.title}</h4>
                    {isAdded && (
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        ✓ Added
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-xs text-gray-500">
                      {goal.metric_type} • Target: {goal.target_progress}
                    </span>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => startEditing(index)}
                        disabled={isAdded}
                        className={`flex items-center space-x-1 px-3 py-1 text-sm rounded transition-colors ${
                          isAdded
                            ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                            : 'bg-yellow-600 text-white hover:bg-yellow-700'
                        }`}
                      >
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={() => onCreateGoal(goal)}
                        disabled={isAdded}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          isAdded
                            ? 'bg-green-600 text-white cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        {isAdded ? 'Added ✓' : 'Add Goal'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ExtractedGoalsList;
