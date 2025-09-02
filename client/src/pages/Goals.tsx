import React, { useState, useEffect } from 'react';
import {
  GoalExtractionForm,
  ExtractedGoalsList,
  GoalManagement
} from '../components/goals';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/ToastContainer';

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
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
  const [isExtracting, setIsExtracting] = useState(false);
  const [shouldCompleteLoader, setShouldCompleteLoader] = useState(false);
  const [extractedGoalsRef, setExtractedGoalsRef] = useState<HTMLDivElement | null>(null);
  const { toasts, removeToast, showSuccess } = useToast();

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

  const scrollToExtractedGoals = () => {
    if (extractedGoalsRef) {
      extractedGoalsRef.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      
      // Add a subtle highlight animation
      extractedGoalsRef.classList.add('animate-pulse', 'ring-2', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        extractedGoalsRef.classList.remove('animate-pulse', 'ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  };

  const handleTextExtract = async (text: string) => {
    setIsExtracting(true);
    setShouldCompleteLoader(false);
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      
      const data = await response.json();
      if (data.success) {
        // Signal the loader to complete gracefully
        setShouldCompleteLoader(true);
        
        // Wait for graceful completion, then show results
        setTimeout(() => {
          setExtractedGoals(data.goals);
          setShowExtractedGoals(true);
          setIsExtracting(false);
          setShouldCompleteLoader(false);
          
          // Scroll to extracted goals after showing them
          setTimeout(() => {
            scrollToExtractedGoals();
          }, 100);
        }, 800); // Total graceful completion time
      } else {
        alert('No goals extracted. Please try different text.');
        setIsExtracting(false);
        setShouldCompleteLoader(false);
      }
    } catch (error) {
      console.error('Error extracting goals:', error);
      alert('Failed to extract goals. Please try again.');
      setIsExtracting(false);
      setShouldCompleteLoader(false);
    }
  };

  const handleFileExtract = async (file: File) => {
    setIsExtracting(true);
    setShouldCompleteLoader(false);
    
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
        // Signal the loader to complete gracefully
        setShouldCompleteLoader(true);
        
        // Wait for graceful completion, then show results
        setTimeout(() => {
          setExtractedGoals(data.extracted_goals);
          setShowExtractedGoals(true);
          setIsExtracting(false);
          setShouldCompleteLoader(false);
          
          // Scroll to extracted goals after showing them
          setTimeout(() => {
            scrollToExtractedGoals();
          }, 100);
        }, 800); // Total graceful completion time
      } else {
        alert('No goals extracted from document. Please try a different file.');
        setIsExtracting(false);
        setShouldCompleteLoader(false);
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
      setIsExtracting(false);
      setShouldCompleteLoader(false);
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
    try {
      // Use the existing PUT endpoint to update status to 'cancelled'
      const response = await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      
      if (response.ok) {
        await fetchGoals();
        showSuccess('Goal Cancelled', 'The goal has been moved to cancelled goals. You can reactivate it later.');
      } else {
        alert('Failed to cancel goal. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling goal:', error);
      alert('Failed to cancel goal. Please try again.');
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    try {
      // Use the existing PUT endpoint to update status to 'completed'
      const response = await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      
      if (response.ok) {
        await fetchGoals();
        showSuccess('Goal Completed', 'Congratulations! You have completed this goal.');
      } else {
        alert('Failed to complete goal. Please try again.');
      }
    } catch (error) {
      console.error('Error completing goal:', error);
      alert('Failed to complete goal. Please try again.');
    }
  };

  const handleRecoverGoal = async (goalId: string) => {
    try {
      // Use the existing PUT endpoint to update status back to 'active'
      const response = await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
      
      if (response.ok) {
        await fetchGoals();
        showSuccess('Goal Reactivated', 'The goal has been restored to your active goals.');
      } else {
        alert('Failed to reactivate goal. Please try again.');
      }
    } catch (error) {
      console.error('Error reactivating goal:', error);
      alert('Failed to reactivate goal. Please try again.');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading goals...</div>;
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Goal Extraction Form */}
        <GoalExtractionForm
          onTextExtract={handleTextExtract}
          onFileExtract={handleFileExtract}
          isLoading={isExtracting}
          shouldComplete={shouldCompleteLoader}
        />

        {/* Extracted Goals List */}
        {showExtractedGoals && (
          <div ref={setExtractedGoalsRef} className="transition-all duration-500 ease-out">
            <ExtractedGoalsList
              goals={extractedGoals}
              onEditGoal={handleEditGoal}
              onCreateGoal={handleCreateGoal}
              isLoading={isExtracting}
            />
          </div>
        )}

        {/* Goal Management */}
        <GoalManagement
          goals={goals}
          onDeleteGoal={handleDeleteGoal}
          onCompleteGoal={handleCompleteGoal}
          onRecoverGoal={handleRecoverGoal}
        />
      </div>

      {/* Toast Notifications */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
};

export default Goals;
