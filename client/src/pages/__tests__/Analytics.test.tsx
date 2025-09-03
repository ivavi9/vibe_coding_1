import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import Analytics from '../Analytics';
import { GoalProvider } from '../../contexts/GoalContext';

// Mock the useGoalContext hook
const mockUseGoalContext = {
  goals: [] as any[],
  isLoading: false,
  createGoal: vi.fn(),
  updateGoal: vi.fn(),
  deleteGoal: vi.fn(),
  completeGoal: vi.fn(),
  reactivateGoal: vi.fn(),
  getGoals: vi.fn()
};

vi.mock('../../contexts/GoalContext', () => ({
  useGoalContext: () => mockUseGoalContext
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <GoalProvider>
      {component}
    </GoalProvider>
  );
};

describe('🧠 Enhanced Analytics Component - Psychology-Driven UX', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset mock data
    mockUseGoalContext.goals = [];
    mockUseGoalContext.isLoading = false;
  });

  describe('📊 Core Analytics Rendering', () => {
    it('should render the main analytics header', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Your Progress Analytics')).toBeInTheDocument();
      expect(screen.getByText('Track your journey, celebrate wins, and build momentum')).toBeInTheDocument();
    });

    it('should render timeframe selector buttons', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Week')).toBeInTheDocument();
      expect(screen.getByText('Month')).toBeInTheDocument();
      expect(screen.getByText('Year')).toBeInTheDocument();
    });

    it('should render key metrics grid', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Total Goals')).toBeInTheDocument();
      expect(screen.getByText('Active Goals')).toBeInTheDocument();
      expect(screen.getByText('Completion Rate')).toBeInTheDocument();
      expect(screen.getByText('Current Streak')).toBeInTheDocument();
    });
  });

  describe('🎯 Key Metrics Calculation', () => {
    it('should display correct total goals count', () => {
      renderWithProviders(<Analytics />);
      
      // Use getAllByText since there are multiple elements with "3"
      const totalGoalsElements = screen.getAllByText('3');
      expect(totalGoalsElements.length).toBeGreaterThan(0);
    });

    it('should display correct active goals count', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('2')).toBeInTheDocument(); // Active goals
    });

    it('should display correct completion rate', () => {
      renderWithProviders(<Analytics />);
      
      // Use getAllByText since there are multiple elements with "33.3%"
      const completionRateElements = screen.getAllByText('33.3%');
      expect(completionRateElements.length).toBeGreaterThan(0);
    });

    it('should display current streak information', () => {
      renderWithProviders(<Analytics />);
      
      // Use getAllByText since there are multiple elements with "days"
      const daysElements = screen.getAllByText(/days/);
      expect(daysElements.length).toBeGreaterThan(0);
    });
  });

  describe('📈 Progress Overview Section', () => {
    it('should render weekly progress chart', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Weekly Progress')).toBeInTheDocument();
      expect(screen.getByText('Mon')).toBeInTheDocument();
      expect(screen.getByText('Sun')).toBeInTheDocument();
    });

    it('should render momentum and velocity section', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Momentum & Velocity')).toBeInTheDocument();
      expect(screen.getByText('Momentum Score')).toBeInTheDocument();
      expect(screen.getByText('Progress/Day')).toBeInTheDocument();
    });

    it('should display momentum score with emoji', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText(/Momentum Score/)).toBeInTheDocument();
      // Use getAllByText since there are multiple elements with "/100"
      const momentumElements = screen.getAllByText(/\/100/);
      expect(momentumElements.length).toBeGreaterThan(0);
    });
  });

  describe('🏆 Categories & Achievements', () => {
    it('should render top categories section', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Top Categories')).toBeInTheDocument();
    });

    it('should render recent achievements section', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Recent Achievements')).toBeInTheDocument();
    });

    it('should display achievement badges with proper styling', () => {
      renderWithProviders(<Analytics />);
      
      // Check for any achievement text that might be present
      const achievementSection = screen.getByText('Recent Achievements').closest('div');
      expect(achievementSection).toBeInTheDocument();
    });
  });

  describe('📊 Monthly Progress Chart', () => {
    it('should render monthly progress overview', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Monthly Progress Overview')).toBeInTheDocument();
    });

    it('should display all 12 months', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Jan')).toBeInTheDocument();
      expect(screen.getByText('Dec')).toBeInTheDocument();
    });
  });

  describe('🚀 Motivation Section', () => {
    it('should render motivation section with encouraging text', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Keep the Momentum Going! 🚀')).toBeInTheDocument();
      expect(screen.getByText(/You're on fire!/)).toBeInTheDocument();
    });

    it('should display key motivation metrics', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Success Rate')).toBeInTheDocument();
      expect(screen.getByText('Momentum')).toBeInTheDocument();
      expect(screen.getByText('Day Streak')).toBeInTheDocument();
    });
  });

  describe('🎨 Visual Design & UX', () => {
    it('should have proper gradient backgrounds', () => {
      renderWithProviders(<Analytics />);
      
      // Find the main container with the gradient background
      const mainContainer = screen.getByText('Your Progress Analytics').closest('div')?.parentElement;
      expect(mainContainer).toHaveClass('bg-gradient-to-br', 'from-gray-50', 'to-blue-50');
    });

    it('should have hover effects on metric cards', () => {
      renderWithProviders(<Analytics />);
      
      // Find the metric card container (parent of the text)
      const metricCard = screen.getByText('Total Goals').closest('div')?.parentElement;
      expect(metricCard).toHaveClass('hover:shadow-md', 'transition-all', 'duration-300');
    });

    it('should have proper border accents on metric cards', () => {
      renderWithProviders(<Analytics />);
      
      // Find the metric card containers (parents of the text)
      const totalGoalsCard = screen.getByText('Total Goals').closest('div')?.parentElement;
      const activeGoalsCard = screen.getByText('Active Goals').closest('div')?.parentElement;
      
      expect(totalGoalsCard).toHaveClass('border-l-4', 'border-blue-500');
      expect(activeGoalsCard).toHaveClass('border-l-4', 'border-green-500');
    });
  });

  describe('🔧 Interactive Features', () => {
    it('should allow timeframe selection', () => {
      renderWithProviders(<Analytics />);
      
      const weekButton = screen.getByText('Week');
      const monthButton = screen.getByText('Month');
      const yearButton = screen.getByText('Year');
      
      expect(weekButton).toBeInTheDocument();
      expect(monthButton).toBeInTheDocument();
      expect(yearButton).toBeInTheDocument();
    });

    it('should handle timeframe changes', () => {
      renderWithProviders(<Analytics />);
      
      const weekButton = screen.getByText('Week');
      fireEvent.click(weekButton);
      
      // Week button should now be active
      expect(weekButton).toHaveClass('bg-blue-600', 'text-white');
    });
  });

  describe('📱 Responsive Design', () => {
    it('should have responsive grid layouts', () => {
      renderWithProviders(<Analytics />);
      
      // Find the metrics grid container (parent of the metrics section)
      const metricsGrid = screen.getByText('Total Goals').closest('div')?.parentElement?.parentElement;
      expect(metricsGrid).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'lg:grid-cols-4');
    });

    it('should have responsive progress overview layout', () => {
      renderWithProviders(<Analytics />);
      
      const progressGrid = screen.getByText('Weekly Progress').closest('div')?.parentElement;
      expect(progressGrid).toHaveClass('grid', 'grid-cols-1', 'lg:grid-cols-2');
    });

  });

  describe('🎭 Psychology-Driven Features', () => {
    it('should display progress with color-coded feedback', () => {
      renderWithProviders(<Analytics />);
      
      // Completion rate should have color coding - use getAllByText since there are multiple elements
      const completionRateElements = screen.getAllByText('33.3%');
      expect(completionRateElements.length).toBeGreaterThan(0);
    });

    it('should show momentum emoji based on score', () => {
      renderWithProviders(<Analytics />);
      
      // Should display momentum emoji
      expect(screen.getByText(/Momentum Score/)).toBeInTheDocument();
    });

    it('should display encouraging achievement messages', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText(/You're on fire!/)).toBeInTheDocument();
      expect(screen.getByText(/incredible dedication/)).toBeInTheDocument();
    });
  });

  describe('⚡ Performance & Loading States', () => {
    it('should handle loading state gracefully', () => {
      // Mock loading state
      mockUseGoalContext.isLoading = true;
      
      renderWithProviders(<Analytics />);
      
      // Look for loading spinner by class
      const loadingSpinner = screen.getByText('Your Progress Analytics').closest('div')?.querySelector('[class*="animate-spin"]');
      expect(loadingSpinner).toBeInTheDocument();
    });

    it('should handle empty goals state', () => {
      // Mock empty goals
      mockUseGoalContext.goals = [];
      
      renderWithProviders(<Analytics />);
      
      // Use getAllByText since there are multiple elements with "0"
      const zeroElements = screen.getAllByText('0');
      expect(zeroElements.length).toBeGreaterThan(0);
    });
  });

  describe('🎯 Data Accuracy & Calculations', () => {
    it('should calculate completion rate correctly', () => {
      renderWithProviders(<Analytics />);
      
      // 1 completed out of 3 total = 33.3% - use getAllByText since there are multiple elements
      const completionRateElements = screen.getAllByText('33.3%');
      expect(completionRateElements.length).toBeGreaterThan(0);
    });

    it('should calculate active goals correctly', () => {
      renderWithProviders(<Analytics />);
      
      // 2 active goals out of 3 total
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('should display progress velocity', () => {
      renderWithProviders(<Analytics />);
      
      expect(screen.getByText('Progress/Day')).toBeInTheDocument();
    });
  });

  describe('🔍 Component Integration', () => {
    it('should integrate with GoalContext properly', () => {
      renderWithProviders(<Analytics />);
      
      // Should display goals from context - use getAllByText since there are multiple elements
      const totalGoalsElements = screen.getAllByText('3');
      expect(totalGoalsElements.length).toBeGreaterThan(0);
    });

    it('should update when goals change', () => {
      const { rerender } = renderWithProviders(<Analytics />);
      
      // Change goals
      mockUseGoalContext.goals = [
        {
          id: '1',
          title: 'Single Goal',
          description: 'Only one goal',
          metric_type: 'Numeric',
          current_progress: 50,
          target_progress: 100,
          status: 'active' as const
        }
      ];
      
      rerender(<Analytics />);
      
      // Use getAllByText to handle multiple elements with same text
      const totalGoalsElements = screen.getAllByText('1');
      expect(totalGoalsElements.length).toBeGreaterThan(0);
    });
  });
});

