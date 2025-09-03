import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { buildApiUrl, API_CONFIG } from '../config/constants';

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
}

interface GoalContextType {
  goals: Goal[];
  isLoading: boolean;
  fetchGoals: () => Promise<void>;
  createGoal: (goalData: Omit<Goal, 'id'>) => Promise<Goal>;
  updateGoal: (goalId: string, updates: Partial<Goal>) => Promise<Goal>;
  deleteGoal: (goalId: string) => Promise<void>;
  completeGoal: (goalId: string) => Promise<void>;
  reactivateGoal: (goalId: string) => Promise<void>;
  refreshGoals: () => void;
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const useGoalContext = () => {
  const context = useContext(GoalContext);
  if (context === undefined) {
    throw new Error('useGoalContext must be used within a GoalProvider');
  }
  return context;
};

interface GoalProviderProps {
  children: React.ReactNode;
}

export const GoalProvider: React.FC<GoalProviderProps> = ({ children }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { showSuccess, showError } = useToast();

  const fetchGoals = useCallback(async () => {
    if (!isAuthenticated || authLoading || !user) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS));
      
      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setGoals(result.data);
        } else {
          setGoals([]);
        }
      } else {
        const errorText = await response.text();
        console.error('Goals API failed:', response.status, errorText);
        showError('Failed to Load Goals', 'Unable to load your goals. Please try again.');
        setGoals([]);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
      showError('Failed to Load Goals', 'Network error while loading goals. Please check your connection.');
      setGoals([]);
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, user, showError]);

  const createGoal = useCallback(async (goalData: Omit<Goal, 'id'>): Promise<Goal> => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(goalData)
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Goal creation response:', result); // Debug log
        if (result.success && result.data) {
          const newGoal = result.data;
          setGoals(prev => [...prev, newGoal]);
          showSuccess('Goal Created', 'Your goal has been created successfully!');
          return newGoal;
        } else {
          console.error('Invalid response format:', result); // Debug log
          throw new Error(`Invalid response format: ${JSON.stringify(result)}`);
        }
      } else {
        const errorText = await response.text();
        console.error('Goal creation failed:', response.status, errorText); // Debug log
        throw new Error(errorText);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
      showError('Failed to Create Goal', 'Something went wrong while creating your goal. Please try again.');
      throw error;
    }
  }, [showSuccess, showError]);

  const updateGoal = useCallback(async (goalId: string, updates: Partial<Goal>): Promise<Goal> => {
    try {
      console.log('updateGoal called with:', { goalId, updates }); // Debug log
      
      const url = `${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/${goalId}`;
      console.log('Making request to:', url); // Debug log
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });

      console.log('Response status:', response.status); // Debug log
      console.log('Response ok:', response.ok); // Debug log

      if (response.ok) {
        const result = await response.json();
        console.log('Response data:', result); // Debug log
        
        if (result.success && result.data) {
          const updatedGoal = result.data;
          console.log('Updated goal:', updatedGoal); // Debug log
          
          setGoals(prev => prev.map(goal => 
            goal.id === goalId ? { ...goal, ...updatedGoal } : goal
          ));
          return updatedGoal;
        } else {
          console.error('Invalid response format:', result); // Debug log
          throw new Error('Invalid response format');
        }
      } else {
        const errorText = await response.text();
        console.error('Response not ok:', response.status, errorText); // Debug log
        throw new Error('Failed to update goal');
      }
    } catch (error) {
      console.error('Error updating goal:', error);
      showError('Failed to Update Goal', 'Something went wrong while updating your goal. Please try again.');
      throw error;
    }
  }, [showError]);

  const deleteGoal = useCallback(async (goalId: string): Promise<void> => {
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
  }, [showSuccess, showError]);

  const completeGoal = useCallback(async (goalId: string): Promise<void> => {
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
      showError('Failed to Complete Goal', 'Something went wrong while completing your goal. Please try again.');
      throw error;
    }
  }, [showSuccess, showError]);

  const reactivateGoal = useCallback(async (goalId: string): Promise<void> => {
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
  }, [showSuccess, showError]);

  const refreshGoals = useCallback(() => {
    fetchGoals();
  }, [fetchGoals]);

  // Fetch goals when authentication state changes
  useEffect(() => {
    if (isAuthenticated && !authLoading && user) {
      fetchGoals();
    } else if (!authLoading && !isAuthenticated) {
      setGoals([]);
    }
  }, [isAuthenticated, authLoading, user, fetchGoals]);

  const value: GoalContextType = {
    goals,
    isLoading,
    fetchGoals,
    createGoal,
    updateGoal,
    deleteGoal,
    completeGoal,
    reactivateGoal,
    refreshGoals
  };

  return (
    <GoalContext.Provider value={value}>
      {children}
    </GoalContext.Provider>
  );
};
