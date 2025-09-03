import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import GoalCard from '../goals/GoalCard';
import { useGoalContext } from '../../contexts/GoalContext';
import { useToast } from '../../hooks/useToast';

// Mock useGoalContext
const mockUpdateGoal = vi.fn();
const mockCompleteGoal = vi.fn();
const mockReactivateGoal = vi.fn();
const mockDeleteGoal = vi.fn();

vi.mock('../../contexts/GoalContext', () => ({
  useGoalContext: () => ({
    updateGoal: mockUpdateGoal,
    completeGoal: mockCompleteGoal,
    reactivateGoal: mockReactivateGoal,
    deleteGoal: mockDeleteGoal
  })
}));

// Mock useToast
const mockShowSuccess = vi.fn();
const mockShowError = vi.fn();

vi.mock('../../hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: mockShowSuccess,
    showError: mockShowError
  })
}));

// Mock window.confirm
const mockConfirm = vi.fn();
Object.defineProperty(window, 'confirm', {
  writable: true,
  value: mockConfirm
});

describe('🎯 Enhanced GoalCard Component - Psychology-Driven UX', () => {
  const mockGoal = {
    id: '1',
    title: 'Learn React',
    description: 'Master React fundamentals and build projects',
    metric_type: 'Numeric',
    current_progress: 80,
    target_progress: 100,
    status: 'active' as const
  };

  const mockCompletedGoal = {
    ...mockGoal,
    status: 'completed' as const,
    current_progress: 100
  };

  const mockOnGoalUpdate = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    mockConfirm.mockReturnValue(true);
  });

  const renderWithProviders = (component: React.ReactElement) => {
    return render(component);
  };

  describe('📱 Component Rendering', () => {
    it('should render goal information correctly', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Master React fundamentals and build projects')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getByText('80 / 100 Numeric')).toBeInTheDocument();
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('should display correct progress bar', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const progressBar = screen.getByText('80%').closest('div')?.parentElement?.querySelector('[class*="bg-green-500"]');
      expect(progressBar).toBeInTheDocument();
    });

    it('should show appropriate status icon for active goal', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const statusIcon = screen.getByText('Learn React').closest('div')?.querySelector('svg');
      expect(statusIcon).toBeInTheDocument();
    });
  });

  describe('🎨 Visual Design & Styling', () => {
    it('should have proper card styling', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const goalCard = screen.getByText('Learn React').closest('div');
      expect(goalCard).toHaveClass('bg-white', 'rounded-xl', 'shadow-sm');
    });

    it('should have hover effects', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const goalCard = screen.getByText('Learn React').closest('div');
      expect(goalCard).toHaveClass('hover:shadow-md', 'transition-all', 'duration-300');
    });

    it('should have proper border styling', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const goalCard = screen.getByText('Learn React').closest('div');
      expect(goalCard).toHaveClass('border', 'border-gray-200');
    });
  });

  describe('🔘 Interactive Elements', () => {
    it('should have complete goal button for active goals', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      expect(screen.getByText('Complete Goal')).toBeInTheDocument();
    });

    it('should have reactivate goal button for completed goals', () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      expect(screen.getByText('Reactivate Goal')).toBeInTheDocument();
    });

    it('should have delete button', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const deleteButton = screen.getByRole('button', { name: '' });
      expect(deleteButton).toBeInTheDocument();
    });
  });

  describe('🎯 Goal Actions', () => {
    it('should call completeGoal when complete button is clicked', async () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const completeButton = screen.getByText('Complete Goal');
      fireEvent.click(completeButton);
      
      await waitFor(() => {
        expect(mockCompleteGoal).toHaveBeenCalledWith('1');
      });
    });

    it('should call reactivateGoal when reactivate button is clicked', async () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const reactivateButton = screen.getByText('Reactivate Goal');
      fireEvent.click(reactivateButton);
      
      await waitFor(() => {
        expect(mockReactivateGoal).toHaveBeenCalledWith('1');
      });
    });

    it('should call deleteGoal when delete button is clicked', async () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const deleteButton = screen.getByRole('button', { name: '' });
      fireEvent.click(deleteButton);
      
      await waitFor(() => {
        expect(mockDeleteGoal).toHaveBeenCalledWith('1');
      });
    });

  });

  describe('🏆 Completion Celebration', () => {
    it('should show celebration section for completed goals', () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      expect(screen.getByText('Goal Achieved!')).toBeInTheDocument();
      expect(screen.getByText("You've successfully completed this goal. Ready to take it to the next level?")).toBeInTheDocument();
    });

    it('should have celebration styling with stars and sparkles', () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const celebrationSection = screen.getByText('Goal Achieved!').closest('div');
      expect(celebrationSection).toHaveClass('bg-gradient-to-r', 'from-yellow-100', 'to-orange-100', 'border-yellow-200');
    });

    it('should display celebration icons', () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const starIcon = screen.getByText('Goal Achieved!').closest('div')?.querySelector('svg');
      expect(starIcon).toBeInTheDocument();
    });
  });

  describe('🔄 Reactivation Modal', () => {
    it('should show reactivation modal when reactivate button is clicked', () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const reactivateButton = screen.getByText('Reactivate Goal');
      fireEvent.click(reactivateButton);
      
      expect(screen.getByText('Reactivate Goal')).toBeInTheDocument();
      expect(screen.getByText('Are you ready to take "Learn React" to the next level?')).toBeInTheDocument();
    });

    it('should have psychology-driven reactivation content', () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const reactivateButton = screen.getByText('Reactivate Goal');
      fireEvent.click(reactivateButton);
      
      expect(screen.getByText('This will reset your progress and set you on a new journey.')).toBeInTheDocument();
      expect(screen.getByText("Yes, Let's Go! 🚀")).toBeInTheDocument();
    });

    it('should close modal when "Maybe Later" is clicked', () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const reactivateButton = screen.getByText('Reactivate Goal');
      fireEvent.click(reactivateButton);
      
      const maybeLaterButton = screen.getByText('Maybe Later');
      fireEvent.click(maybeLaterButton);
      
      expect(screen.queryByText('Are you ready to take "Learn React" to the next level?')).not.toBeInTheDocument();
    });
  });

  describe('🎭 Psychology-Driven UX Features', () => {
    it('should have hover effects on action buttons', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const completeButton = screen.getByText('Complete Goal');
      expect(completeButton).toHaveClass('hover:scale-105', 'transition-all', 'duration-200');
    });

    it('should have gradient backgrounds on primary buttons', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const completeButton = screen.getByText('Complete Goal');
      expect(completeButton).toHaveClass('bg-gradient-to-r', 'from-green-500', 'to-emerald-600');
    });

    it('should have encouraging button text', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      expect(screen.getByText('Complete Goal')).toBeInTheDocument();
    });

    it('should have motivational reactivation text', () => {
      renderWithProviders(<GoalCard goal={mockCompletedGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const reactivateButton = screen.getByText('Reactivate Goal');
      fireEvent.click(reactivateButton);
      
      expect(screen.getByText('Keep pushing forward!')).toBeInTheDocument();
    });
  });

  describe('⚡ Loading States & Error Handling', () => {
    it('should disable buttons during loading', async () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const completeButton = screen.getByText('Complete Goal');
      fireEvent.click(completeButton);
      
      // Wait for loading state
      await waitFor(() => {
        expect(completeButton).toBeDisabled();
      });
    });

    it('should handle errors gracefully', async () => {
      mockCompleteGoal.mockRejectedValueOnce(new Error('API Error'));
      
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const completeButton = screen.getByText('Complete Goal');
      fireEvent.click(completeButton);
      
      await waitFor(() => {
        expect(mockShowError).toHaveBeenCalledWith('Error', 'Failed to complete goal. Please try again.');
      });
    });
  });

  describe('📱 Responsive Design', () => {
    it('should have proper text sizing', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const title = screen.getByText('Learn React');
      const description = screen.getByText('Master React fundamentals and build projects');
      
      expect(title).toHaveClass('text-lg', 'font-semibold');
      expect(description).toHaveClass('text-sm');
    });
  });

  describe('🎨 Status & Progress Visualization', () => {
    it('should show correct status badge', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const statusBadge = screen.getByText('Active');
      expect(statusBadge).toHaveClass('px-3', 'py-1', 'text-xs', 'font-medium', 'rounded-full');
    });

    it('should display progress percentage correctly', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('should have color-coded progress bar', () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const progressBar = screen.getByText('80%').closest('div')?.parentElement?.querySelector('[class*="bg-green-500"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('🔒 Confirmation & Safety', () => {
    it('should ask for confirmation before deleting', async () => {
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const deleteButton = screen.getByRole('button', { name: '' });
      fireEvent.click(deleteButton);
      
      expect(mockConfirm).toHaveBeenCalledWith('Are you sure you want to delete this goal? This action cannot be undone.');
    });

    it('should not delete if confirmation is cancelled', async () => {
      mockConfirm.mockReturnValueOnce(false);
      
      renderWithProviders(<GoalCard goal={mockGoal} onGoalUpdate={mockOnGoalUpdate} />);
      
      const deleteButton = screen.getByRole('button', { name: '' });
      fireEvent.click(deleteButton);
      
      expect(mockDeleteGoal).not.toHaveBeenCalled();
    });
  });
});
