import { useState, useRef } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useGuestMode } from '../../hooks/useGuestMode';
import { useToast } from '../../hooks/useToast';
import { useGoalContext } from '../../contexts/GoalContext';
import { buildApiUrl, API_CONFIG } from '../../config/constants';

interface ExtractedGoal {
  title: string;
  description: string;
  metric_type: string;
  target_progress: number;
}

export const useGoalExtraction = () => {
  const [extractedGoals, setExtractedGoals] = useState<ExtractedGoal[]>([]);
  const [showExtractedGoals, setShowExtractedGoals] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [shouldCompleteLoader, setShouldCompleteLoader] = useState(false);
  const [addedGoals, setAddedGoals] = useState<Set<string>>(new Set());
  const extractedGoalsRef = useRef<HTMLDivElement>(null);
  
  const { isAuthenticated } = useAuth();
  const { canExtractGoals, canSaveGoals } = useGuestMode();
  const { showSuccess, showError, showWarning } = useToast();
  const { createGoal, refreshGoals } = useGoalContext();

  const scrollToExtractedGoals = () => {
    if (extractedGoalsRef.current) {
      extractedGoalsRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      extractedGoalsRef.current.classList.add('animate-pulse', 'ring-2', 'ring-blue-500', 'ring-opacity-50');
      setTimeout(() => {
        extractedGoalsRef.current?.classList.remove('animate-pulse', 'ring-2', 'ring-blue-500', 'ring-opacity-50');
      }, 2000);
    }
  };

  const handleTextExtract = async (text: string) => {
    // Skip guest mode restrictions for authenticated users
    if (!isAuthenticated && !canExtractGoals) {
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
      const goals = data.goals || data.data?.goals || [];

      if (goals && goals.length > 0) {
        setShouldCompleteLoader(true);
        setTimeout(() => {
          setExtractedGoals(goals);
          setShowExtractedGoals(true);
          setIsExtracting(false);
          setShouldCompleteLoader(false);
          setTimeout(() => { scrollToExtractedGoals(); }, 100);
        }, 800);
      } else {
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
      const goals = data.extracted_goals || data.data?.extracted_goals || data.goals || [];

      if (goals && goals.length > 0) {
        setShouldCompleteLoader(true);
        setTimeout(() => {
          setExtractedGoals(goals);
          setShowExtractedGoals(true);
          setIsExtracting(false);
          setShouldCompleteLoader(false);
          setTimeout(() => { scrollToExtractedGoals(); }, 100);
        }, 800);
      } else {
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

  const handleCreateGoal = async (goal: ExtractedGoal) => {
    if (!isAuthenticated && !canSaveGoals) {
      showWarning('Guest Mode - Trial Expired', 'Your trial period has expired. Sign in to save goals and track your progress permanently.');
      return false;
    }

    try {
      // Use the shared context to create the goal
      await createGoal({
        title: goal.title,
        description: goal.description,
        metric_type: goal.metric_type === 'count' ? 'Numeric' : goal.metric_type,
        target_progress: goal.target_progress,
        current_progress: 0
      });
      
      // Mark this goal as added
      const goalKey = `${goal.title}-${goal.description}-${goal.metric_type}-${goal.target_progress}`;
      setAddedGoals(prev => new Set([...prev, goalKey]));
      
      // Remove only the specific goal that was added
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
      
      return true;
    } catch (error) {
      console.error('Error creating goal:', error);
      return false;
    }
  };

  const handleEditGoal = (goal: ExtractedGoal) => {
    console.log('Editing goal:', goal);
    // TODO: Implement goal editing functionality
  };

  const clearExtractedGoals = () => {
    setExtractedGoals([]);
    setShowExtractedGoals(false);
    setAddedGoals(new Set());
  };

  return {
    extractedGoals,
    showExtractedGoals,
    isExtracting,
    shouldCompleteLoader,
    addedGoals,
    extractedGoalsRef,
    handleTextExtract,
    handleFileExtract,
    handleCreateGoal,
    handleEditGoal,
    clearExtractedGoals,
    setShowExtractedGoals
  };
};
