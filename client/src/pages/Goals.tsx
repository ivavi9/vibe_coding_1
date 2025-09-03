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
import { X } from 'lucide-react';
import { API_CONFIG, buildApiUrl } from '../config/constants';

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
  const [addedGoals, setAddedGoals] = useState<Set<string>>(new Set()); // Track added goals
  const [showWelcomeBanner, setShowWelcomeBanner] = useState(true);
  const { toasts, removeToast, showSuccess, showError, showWarning } = useToast();
  const { isAuthenticated } = useAuth();
  const { canExtractGoals, canSaveGoals, canTrackProgress, canManageGoals, getTrialTimeRemainingFormatted } = useGuestMode();

  useEffect(() => {
    if (isAuthenticated) {
      fetchGoals();
      // Auto-dismiss welcome banner after 5 seconds
      const timer = setTimeout(() => {
        setShowWelcomeBanner(false);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [isAuthenticated]);

  const fetchGoals = async () => {
    try {
      console.log('Fetching goals from backend...');
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS));
      console.log('Goals API response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Goals API response data:', data);
        setGoals(data || []);
        console.log('Goals state updated:', data || []);
      } else {
        console.error('Goals API failed with status:', response.status);
        const errorText = await response.text();
        console.error('Goals API error response:', errorText);
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
    // Skip guest mode restrictions for authenticated users
    if (!isAuthenticated && !canSaveGoals) {
      showWarning('Guest Mode - Trial Expired', 'Your trial period has expired. Sign in to save goals and track your progress permanently.');
      return;
    }

    setIsExtracting(true);
    setShouldCompleteLoader(false);
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS_EXTRACT), {
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
          // Only increment guest mode count for guest users
          if (!isAuthenticated) {
            // incrementExtractionCount(); // This line is removed as per the new guest mode system
          }
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
    // Skip guest mode restrictions for authenticated users
    if (!isAuthenticated && !canSaveGoals) {
      showWarning('Guest Mode - Trial Expired', 'Your trial period has expired. Sign in to save goals and track your progress permanently.');
      return;
    }

    setIsExtracting(true);
    setShouldCompleteLoader(false);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('description', '');
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_UPLOAD), {
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
          // Only increment guest mode count for guest users
          if (!isAuthenticated) {
            // incrementExtractionCount(); // This line is removed as per the new guest mode system
          }
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
    console.log('handleCreateGoal called with goal:', goal);
    console.log('Current authentication state:', { isAuthenticated });
    
    if (!isAuthenticated && !canSaveGoals) {
      showWarning('Guest Mode - Trial Expired', 'Your trial period has expired. Sign in to save goals and track your progress permanently.');
      return;
    }

    try {
      console.log('Creating goal via API...');
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS), {
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

      console.log('Goal creation API response status:', response.status);
      if (response.ok) {
        const responseData = await response.json();
        console.log('Goal creation API response data:', responseData);
        
        showSuccess('Goal Created', 'Your goal has been created successfully!');
        await fetchGoals();
        
        // Mark this goal as added
        const goalKey = `${goal.title}-${goal.description}-${goal.metric_type}-${goal.target_progress}`;
        setAddedGoals(prev => new Set([...prev, goalKey]));
        
        // Remove only the specific goal that was added, not the entire list
        setExtractedGoals(prevGoals => prevGoals.filter(g => 
          g.title !== goal.title || 
          g.description !== goal.description ||
          g.metric_type !== goal.metric_type ||
          g.target_progress !== goal.target_progress
        ));
        
        // Only hide extracted goals section if all goals have been added
        if (extractedGoals.length <= 1) {
          setShowExtractedGoals(false);
        }
        
        console.log('Goal created successfully, goals list updated');
      } else {
        const errorText = await response.text();
        console.error('Goal creation failed with status:', response.status, 'Error:', errorText);
        showError('Failed to Create Goal', 'Something went wrong while creating your goal. Please try again.');
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      showError('Failed to Create Goal', 'Something went wrong while creating your goal. Please try again.');
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    if (!isAuthenticated) {
      showWarning('Guest Mode - Feature Locked', 'Sign in to unlock goal management features.');
      return;
    }

    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/${goalId}/`, {
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
      showWarning('Guest Mode - Feature Locked', 'Sign in to unlock goal management features.');
      return;
    }

    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/${goalId}/`, {
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
      showWarning('Guest Mode - Feature Locked', 'Sign in to unlock goal management features.');
      return;
    }

    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/${goalId}`, {
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
        {/* Guest Mode Banner - Only show for guest users */}
        {!isAuthenticated && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-sm font-medium text-blue-800">Guest Mode - Explore Clarity</h3>
                  <div className="text-xs text-blue-700 space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                      <span>✅ Extract unlimited goals</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                      <span>⏰ Trial: {getTrialTimeRemainingFormatted()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="w-2 h-2 bg-red-400 rounded-full"></span>
                      <span>❌ Cannot save permanently</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span className="text-xs text-blue-600">Ready to unlock full features?</span>
                <button
                  onClick={() => window.location.href = '/auth'}
                  className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-700 text-white text-sm rounded-lg hover:from-blue-700 hover:to-purple-800 transition-all duration-200 transform hover:scale-105"
                >
                  Sign In with Google
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Authenticated User Banner */}
        {isAuthenticated && showWelcomeBanner && (
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 animate-in slide-in-from-top-4 duration-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <div>
                  <h3 className="text-sm font-medium text-green-800">Welcome back!</h3>
                  <p className="text-xs text-green-700">
                    You have unlimited access to extract goals and save your progress.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowWelcomeBanner(false)}
                className="text-green-500 hover:text-green-700 transition-colors p-1"
                aria-label="Dismiss welcome message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        <GoalExtractionForm
          onTextExtract={handleTextExtract}
          onFileExtract={handleFileExtract}
          isLoading={isExtracting}
          shouldComplete={shouldCompleteLoader}
          disabled={false}
        />

        {showExtractedGoals && (
          <div ref={setExtractedGoalsRef} className="transition-all duration-500 ease-out">
            <ExtractedGoalsList
              goals={extractedGoals}
              onEditGoal={handleEditGoal}
              onCreateGoal={handleCreateGoal}
              isLoading={isExtracting}
              addedGoals={addedGoals}
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
