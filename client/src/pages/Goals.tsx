import React, { useState, useEffect } from 'react';
import {
  GoalExtractionForm,
  ExtractedGoalsList,
  UserGoalsList
} from '../components/goals';

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: string;
}

interface ExtractedGoal {
  title: string;
  description: string;
  metric_type: string;
  target_progress: number;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [extractedGoals, setExtractedGoals] = useState<ExtractedGoal[]>([]);
  const [showExtractedGoals, setShowExtractedGoals] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals');
      const data = await response.json();
      if (data.success) {
        setGoals(data.data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTextExtract = async (text: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const data = await response.json();
      if (data.success) {
        setExtractedGoals(data.goals);
        setShowExtractedGoals(true);
      } else {
        alert('No goals extracted. Please try different text.');
      }
    } catch (error) {
      console.error('Error extracting goals:', error);
      alert('Failed to extract goals. Please try again.');
    }
  };

  const handleFileExtract = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', '');

    try {
      const response = await fetch('http://localhost:8000/api/v1/documents/upload/document', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();
      if (data.success) {
        setExtractedGoals(data.extracted_goals);
        setShowExtractedGoals(true);
      } else {
        alert('No goals extracted from document. Please try a different file.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    }
  };

  const handleEditGoal = (index: number, updatedGoal: ExtractedGoal) => {
    const updatedGoals = [...extractedGoals];
    updatedGoals[index] = updatedGoal;
    setExtractedGoals(updatedGoals);
  };

  const handleCreateGoal = async (goalData: ExtractedGoal) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: goalData.title,
          description: goalData.description,
          metric_type: goalData.metric_type,
          target_progress: goalData.target_progress,
          current_progress: 0
        })
      });

      if (response.ok) {
        await fetchGoals();
        // Remove the goal from extracted goals
        setExtractedGoals(prev => prev.filter(g => g !== goalData));
        if (extractedGoals.length === 1) {
          setShowExtractedGoals(false);
        }
      } else {
        alert('Failed to create goal. Please try again.');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      alert('Failed to create goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;

    try {
      const response = await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchGoals();
      } else {
        alert('Failed to delete goal. Please try again.');
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Failed to delete goal. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading goals...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Goal Extraction Form */}
      <GoalExtractionForm
        onTextExtract={handleTextExtract}
        onFileExtract={handleFileExtract}
      />

      {/* Extracted Goals List */}
      {showExtractedGoals && (
        <ExtractedGoalsList
          goals={extractedGoals}
          onEditGoal={handleEditGoal}
          onCreateGoal={handleCreateGoal}
        />
      )}

      {/* User Goals List */}
      <UserGoalsList
        goals={goals}
        onDeleteGoal={handleDeleteGoal}
      />
    </div>
  );
};

export default Goals;
