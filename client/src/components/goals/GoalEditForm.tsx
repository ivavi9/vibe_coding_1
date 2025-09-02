import React, { useState } from 'react';

interface ExtractedGoal {
  title: string;
  description: string;
  metric_type: string;
  target_progress: number;
}

interface GoalEditFormProps {
  goal: ExtractedGoal;
  onSave: (updatedGoal: ExtractedGoal) => void;
  onCancel: () => void;
}

const GoalEditForm: React.FC<GoalEditFormProps> = ({ goal, onSave, onCancel }) => {
  const [editedGoal, setEditedGoal] = useState<ExtractedGoal>({ ...goal });

  const handleSave = () => {
    onSave(editedGoal);
  };

  const updateField = (field: keyof ExtractedGoal, value: string | number) => {
    setEditedGoal(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={editedGoal.title}
        onChange={(e) => updateField('title', e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Goal title"
      />
      <textarea
        value={editedGoal.description}
        onChange={(e) => updateField('description', e.target.value)}
        className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        rows={2}
        placeholder="Goal description"
      />
      <div className="grid grid-cols-2 gap-3">
        <select
          value={editedGoal.metric_type}
          onChange={(e) => updateField('metric_type', e.target.value)}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="Numeric">Numeric</option>
          <option value="Boolean">Boolean</option>
          <option value="Percentage">Percentage</option>
        </select>
        <input
          type="number"
          value={editedGoal.target_progress}
          onChange={(e) => updateField('target_progress', Number(e.target.value))}
          className="p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Target value"
          min="0"
          step="0.1"
        />
      </div>
      <div className="flex space-x-2">
        <button
          onClick={handleSave}
          className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white text-sm rounded hover:bg-green-700 transition-colors"
        >
          <span>Save</span>
        </button>
        <button
          onClick={onCancel}
          className="flex items-center space-x-1 px-3 py-1 bg-gray-500 text-white text-sm rounded hover:bg-gray-600 transition-colors"
        >
          <span>Cancel</span>
        </button>
      </div>
    </div>
  );
};

export default GoalEditForm;
