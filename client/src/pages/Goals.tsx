import React, { useState, useEffect } from 'react';
import {
  GoalExtractionForm,
  ExtractedGoalsList,
  GoalManagement
} from '../components/goals';
import { useToast } from '../hooks/useToast';
import { useGuestMode } from '../hooks/useGuestMode';
import { useAuth } from '../hooks/useAuth';
import ToastContainer from '../components/ui/ToastContainer';
import GoalExtractionLoader from '../components/goals/GoalExtractionLoader';

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
  const [extractedGoals, setExtractedGoals] = useState<ExtractedGoal[]>([]);
  const [showExtractedGoals, setShowExtractedGoals] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [shouldCompleteLoader, setShouldCompleteLoader] = useState(false);
  const [extractedGoalsRef, setExtractedGoalsRef] = useState<HTMLDivElement | null>(null);
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();
  const { isAuthenticated } = useAuth();
  const { canExtractGoals, extractionCount, maxExtractions, incrementExtractionCount } = useGuestMode();

  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
    }
  }, [isAuthenticated]);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals');
      if (response.ok) {
        const data = await response.json();
        setGoals(data.goals || []);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    }
  };

  const scrollToExtractedGoals = () => {
    if (extractedGoalsRef) {
      extractedGoalsRef.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      extractedGoalsRef.classList.add('animate-pulse', 'ring-2', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        extractedGoalsRef.classList.remove('animate-pulse', 'ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  };

  const handleTextExtract = async (text: string) => {
    if (!canExtractGoals) {
      showWarning('Guest Mode Limit Reached', 'You\'ve reached the limit for goal extraction in guest mode. Sign in to continue extracting goals and save your progress.');
      return;
    }

    setIsExtracting(true);
    setShouldCompleteLoader(false);
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });
      const data = await response.json();
      console.log('Text extraction response:', data);
      const goals = data.goals || data.data?.goals || [];

      if (goals && goals.length > 0) {
        setShouldCompleteLoader(true);
        setTimeout(() => {
          setExtractedGoals(goals);
          setShowExtractedGoals(true);
          setIsExtracting(false);
          setShouldCompleteLoader(false);
          incrementExtractionCount();
          setTimeout(() => { scrollToExtractedGoals(); }, 100);
        }, 800);
      } else {
        console.log('No goals extracted from text');
        setIsExtracting(false);
        setShouldCompleteLoader(false);
        showWarning('No Goals Found', 'Try describing your goals in more detail or with different wording.');
      }
    } catch (error) {
      console.error('Error extracting goals:', error);
      setIsExtracting(false);
      setShouldCompleteLoader(false);
      showError('Extraction Failed', 'Something went wrong while processing your text. Please try again.');
    }
  };

  const handleFileExtract = async (file: File) => {
    if (!canExtractGoals) {
      showWarning('Guest Mode Limit Reached', 'You\'ve reached the limit for goal extraction in guest mode. Sign in to continue extracting goals and save your progress.');
      return;
    }

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
      console.log('File extraction response:', data);
      const goals = data.extracted_goals || data.data?.extracted_goals || data.goals || [];

      if (goals && goals.length > 0) {
        setShouldCompleteLoader(true);
        setTimeout(() => {
          setExtractedGoals(goals);
          setShowExtractedGoals(true);
          setIsExtracting(false);
          setShouldCompleteLoader(false);
          incrementExtractionCount();
          setTimeout(() => { scrollToExtractedGoals(); }, 100);
        }, 800);
      } else {
        console.log('No goals extracted from document');
        setIsExtracting(false);
        setShouldCompleteLoader(false);
        showWarning('No Goals Found', 'The document didn\'t contain clear goal descriptions. Try a different document or add more context.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      setIsExtracting(false);
      setShouldCompleteLoader(false);
      showError('Upload Failed', 'Something went wrong while processing your document. Please try again.');
    }
  };

  const handleEditGoal = (goal: ExtractedGoal) => {
    // Handle editing extracted goal
    console.log('Editing goal:', goal);
  };

  const handleCreateGoal = async (goal: ExtractedGoal) => {
    if (!isAuthenticated) {
      showWarning('Guest Mode', 'You need to sign in to save goals and track your progress.');
      return;
    }

    try {
      const response = await fetch('http://localhost:8000/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: goal.title,
          description: goal.description,
          metric_type: goal.metric_type,
          target_progress: goal.target_progress,
          current_progress: 0
        })
      });

      if (response.ok) {
        showSuccess('Goal Created', 'Your goal has been created successfully!');
        await fetchGoals();
        setShowExtractedGoals(false);
        setExtractedGoals([]);
      } else {
        showError('Failed to Create Goal', 'Something went wrong while creating your goal. Please try again.');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      showError('Failed to Create Goal', 'Something went wrong while creating your goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!isAuthenticated) {
      showWarning('Guest Mode', 'You need to sign in to manage goals.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (response.ok) {
        await fetchGoals();
        showSuccess('Goal Cancelled', 'The goal has been moved to cancelled goals. You can reactivate it later.');
      } else {
        showError('Failed to Cancel Goal', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error cancelling goal:', error);
      showError('Failed to Cancel Goal', 'Something went wrong. Please try again.');
    }
  };

  const handleCompleteGoal = async (goalId: string) => {
    if (!isAuthenticated) {
      showWarning('Guest Mode', 'You need to sign in to manage goals.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });
      if (response.ok) {
        await fetchGoals();
        showSuccess('Goal Completed', 'Congratulations! You have completed this goal.');
      } else {
        showError('Failed to Complete Goal', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error completing goal:', error);
      showError('Failed to Complete Goal', 'Something went wrong. Please try again.');
    }
  };

  const handleRecoverGoal = async (goalId: string) => {
    if (!isAuthenticated) {
      showWarning('Guest Mode', 'You need to sign in to manage goals.');
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });
      if (response.ok) {
        await fetchGoals();
        showSuccess('Goal Reactivated', 'The goal has been restored to your active goals.');
      } else {
        showError('Failed to Reactivate Goal', 'Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error reactivating goal:', error);
      showError('Failed to Reactivate Goal', 'Something went wrong. Please try again.');
    }
  };

  // Show loading state
  if (isExtracting) {
    return (
      <GoalExtractionLoader
        isVisible={isExtracting}
        onComplete={() => {}}
        shouldComplete={shouldCompleteLoader}
      />
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Guest Mode Banner */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-sm font-medium text-yellow-800">Guest Mode</h3>
                  <p className="text-xs text-yellow-700">
                    You can extract goals {extractionCount}/{maxExtractions} times. 
                    {extractionCount >= maxExtractions && ' Sign in to continue extracting goals and save your progress.'}
                  </p>
                </div>
              </div>
              {extractionCount >= maxExtractions && (
                <div className="flex items-center space-x-3">
                  <span className="text-xs text-yellow-600">Ready to unlock unlimited access?</span>
                  <button
                    onClick={() => window.location.href = '/auth'}
                    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105"
                  >
                    Sign In with Google
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        <GoalExtractionForm
          onTextExtract={handleTextExtract}
          onFileExtract={handleFileExtract}
          isLoading={isExtracting}
          shouldComplete={shouldCompleteLoader}
          disabled={!canExtractGoals}
        />

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

        {isAuthenticated && (
          <GoalManagement
            goals={goals}
            onDeleteGoal={handleDeleteGoal}
            onCompleteGoal={handleCompleteGoal}
            onRecoverGoal={handleRecoverGoal}
          />
        )}
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
};

export default Goals;
