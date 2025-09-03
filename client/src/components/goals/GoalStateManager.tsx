import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';
import { buildApiUrl, API_CONFIG } from '../../config/constants';

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
}

export const useGoalState = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();

  const fetchGoals = async () => {
    if (!isAuthenticated || authLoading || !user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS));
      
      if (response.ok) {
        const data = await response.json();
        setGoals(data || []);
      } else {
        const errorText = await response.text();
        console.error('Goals API failed:', response.status, errorText);
        showError('Failed to Load Goals', 'Unable to load your goals. Please try again.');
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      showError('Failed to Load Goals', 'Network error while loading goals. Please check your connection.');
    } finally {
      setIsLoading(false);
    }
  };

  const createGoal = async (goalData: Omit<Goal, 'id'>) => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });

      if (response.ok) {
        const newGoal = await response.json();
        setGoals(prev => [...prev, newGoal]);
        showSuccess('Goal Created', 'Your goal has been created successfully!');
        return newGoal;
      } else {
        const errorText = await response.text();
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      showError('Failed to Create Goal', 'Something went wrong while creating your goal. Please try again.');
      throw error;
    }
  };

  const updateGoal = async (goalId: string, updates: Partial<Goal>) => {
    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      if (response.ok) {
        const updatedGoal = await response.json();
        setGoals(prev => prev.map(goal => 
          goal.id === goalId ? { ...goal, ...updatedGoal } : goal
        ));
        return updatedGoal;
      } else {
        throw new Error('Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      showError('Failed to Update Goal', 'Something went wrong while updating your goal. Please try again.');
      throw error;
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'cancelled' })
      });

      if (response.ok) {
        setGoals(prev => prev.map(goal => 
          goal.id === goalId ? { ...goal, status: 'cancelled' } : goal
        ));
        showSuccess('Goal Cancelled', 'The goal has been moved to cancelled goals. You can reactivate it later.');
      } else {
        throw new Error('Failed to cancel goal');
      }
    } catch (error) {
      console.error('Error cancelling goal:', error);
      showError('Failed to Cancel Goal', 'Something went wrong. Please try again.');
      throw error;
    }
  };

  const completeGoal = async (goalId: string) => {
    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'completed' })
      });

      if (response.ok) {
        setGoals(prev => prev.map(goal => 
          goal.id === goalId ? { ...goal, status: 'completed' } : goal
        ));
        showSuccess('Goal Completed', 'Congratulations! You have completed this goal.');
      } else {
        throw new Error('Failed to complete goal');
      }
    } catch (error) {
      console.error('Error completing goal:', error);
      showError('Failed to Complete Goal', 'Something went wrong. Please try again.');
      throw error;
    }
  };

  const reactivateGoal = async (goalId: string) => {
    try {
      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/${goalId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'active' })
      });

      if (response.ok) {
        setGoals(prev => prev.map(goal => 
          goal.id === goalId ? { ...goal, status: 'active' } : goal
        ));
        showSuccess('Goal Reactivated', 'The goal has been restored to your active goals.');
      } else {
        throw new Error('Failed to reactivate goal');
      }
    } catch (error) {
      console.error('Error reactivating goal:', error);
      showError('Failed to Reactivate Goal', 'Something went wrong. Please try again.');
      throw error;
    }
  };

  // Fetch goals when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !authLoading && user) {
      fetchGoals();
    } else if (!authLoading && !isAuthenticated) {
      setGoals([]);
    }
  }, [isAuthenticated, authLoading, user]);

  return {
    goals,
    isLoading,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    reactivateGoal
  };
};
