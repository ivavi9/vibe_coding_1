import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from '../Dashboard';

// Mock the custom hooks and components
vi.mock('../../contexts/GoalContext', () => ({
  useGoalContext: () => ({
    goals: [
      {
        id: '1',
        title: 'Test Goal 1',
        description: 'Test Description 1',
        metric_type: 'Numeric',
        current_progress: 5,
        target_progress: 10,
        status: 'active'
      },
      {
        id: '2',
        title: 'Test Goal 2',
        description: 'Test Description 2',
        metric_type: 'Boolean',
        current_progress: 1,
        target_progress: 1,
        status: 'completed'
      },
      {
        id: '3',
        title: 'Test Goal 3',
        description: 'Test Description 3',
        metric_type: 'Numeric',
        current_progress: 0,
        target_progress: 100,
        status: 'active'
      }
    ],
    isLoading: false,
    updateGoal: vi.fn()
  })
}));

vi.mock('../../hooks/useToast', () => ({
  useToast: () => ({
    showSuccess: vi.fn(),
    showError: vi.fn()
  })
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('📊 Dashboard Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('📱 Component Rendering', () => {
    it('should render without crashing', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByText('Track Progress')).toBeInTheDocument();
    });

    it('should display all main sections', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByText('Quick Stats')).toBeInTheDocument();
      expect(screen.getByText('Track Progress')).toBeInTheDocument();
      expect(screen.getByText('Recent Goals')).toBeInTheDocument();
    });
  });

  describe('📊 Quick Stats Display', () => {
    it('should display active goals count correctly', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByText('Active Goals')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument(); // 2 active goals
    });

    it('should display completed goals count correctly', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByText('Completed')).toBeInTheDocument();
      expect(screen.getByText('1')).toBeInTheDocument(); // 1 completed goal
    });

    it('should display progress updates count', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByText('Progress Updates')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument(); // No progress history yet
    });
  });

  describe('🎯 Progress Tracking Form', () => {
    it('should have goal selection dropdown', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByText('Choose a goal...')).toBeInTheDocument();
      expect(screen.getByDisplayValue('')).toBeInTheDocument();
    });

    it('should have progress value input', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByDisplayValue('1')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1')).toHaveAttribute('type', 'number');
      expect(screen.getByDisplayValue('1')).toHaveAttribute('min', '1');
    });

    it('should have progress description input', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByPlaceholderText('What did you accomplish?')).toBeInTheDocument();
    });

    it('should have track progress button', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByRole('button', { name: /track progress/i })).toBeInTheDocument();
    });
  });

  describe('📝 Goal Selection and Display', () => {
    it('should populate goal dropdown with active goals', () => {
      renderWithRouter(<Dashboard />);
      const dropdown = screen.getByDisplayValue('');
      
      fireEvent.click(dropdown);
      
      expect(screen.getByText('Test Goal 1')).toBeInTheDocument();
      expect(screen.getByText('Test Goal 3')).toBeInTheDocument();
      // Completed goals should not appear in dropdown
      expect(screen.queryByText('Test Goal 2')).not.toBeInTheDocument();
    });

    it('should show goal details when selected', async () => {
      renderWithRouter(<Dashboard />);
      const dropdown = screen.getByDisplayValue('');
      
      fireEvent.change(dropdown, { target: { value: '1' } });
      
      await waitFor(() => {
        expect(dropdown).toHaveValue('1');
      });
    });
  });

  describe('🔧 Progress Tracking Functionality', () => {
    it('should calculate progress correctly', () => {
      renderWithRouter(<Dashboard />);
      const progressInput = screen.getByDisplayValue('1');
      
      // Change progress value
      fireEvent.change(progressInput, { target: { value: '3' } });
      expect(progressInput).toHaveValue(3);
    });

    it('should handle progress description input', () => {
      renderWithRouter(<Dashboard />);
      const descriptionInput = screen.getByPlaceholderText('What did you accomplish?');
      
      fireEvent.change(descriptionInput, { target: { value: 'Made significant progress' } });
      expect(descriptionInput).toHaveValue('Made significant progress');
    });

    it('should validate form inputs before submission', () => {
      renderWithRouter(<Dashboard />);
      const trackButton = screen.getByRole('button', { name: /track progress/i });
      
      // Button should be disabled when no goal is selected
      expect(trackButton).toBeDisabled();
    });
  });

  describe('📊 Recent Goals Display', () => {
    it('should display recent goals section', () => {
      renderWithRouter(<Dashboard />);
      expect(screen.getByText('Recent Goals')).toBeInTheDocument();
    });

    it('should show goals with proper information', () => {
      renderWithRouter(<Dashboard />);
      
      // Check if goals are displayed
      expect(screen.getByText('Test Goal 1')).toBeInTheDocument();
      expect(screen.getByText('Test Goal 2')).toBeInTheDocument();
      expect(screen.getByText('Test Goal 3')).toBeInTheDocument();
    });

    it('should display goal progress bars for active goals', () => {
      renderWithRouter(<Dashboard />);
      
      // Active goals should show progress
      expect(screen.getByText('5/10')).toBeInTheDocument(); // Goal 1
      expect(screen.getByText('0/100')).toBeInTheDocument(); // Goal 3
    });

    it('should show completed status for finished goals', () => {
      renderWithRouter(<Dashboard />);
      
      // Completed goal should show completion status
      expect(screen.getByText('1/1')).toBeInTheDocument(); // Goal 2
    });
  });

  describe('🎨 UI Component Integration', () => {
    it('should have proper container structure', () => {
      renderWithRouter(<Dashboard />);
      const container = screen.getByText('Track Progress').closest('.max-w-6xl');
      expect(container).toBeInTheDocument();
    });

    it('should have proper spacing between sections', () => {
      renderWithRouter(<Dashboard />);
      const container = screen.getByText('Track Progress').closest('.space-y-8');
      expect(container).toBeInTheDocument();
    });

    it('should have responsive grid layout for stats', () => {
      renderWithRouter(<Dashboard />);
      const statsContainer = screen.getByText('Active Goals').closest('.grid');
      expect(statsContainer).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });
  });

  describe('📱 Responsive Design', () => {
    it('should have mobile-first responsive design', () => {
      renderWithRouter(<Dashboard />);
      
      // Check for responsive classes
      const statsGrid = screen.getByText('Active Goals').closest('.grid');
      expect(statsGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
      
      const progressGrid = screen.getByText('Select Goal').closest('.grid');
      expect(progressGrid).toHaveClass('grid-cols-1', 'md:grid-cols-3');
    });
  });

  describe('🔐 Authentication State Handling', () => {
    it('should display goals for authenticated users', () => {
      renderWithRouter(<Dashboard />);
      
      // Should show user's goals
      expect(screen.getByText('Test Goal 1')).toBeInTheDocument();
      expect(screen.getByText('Test Goal 2')).toBeInTheDocument();
      expect(screen.getByText('Test Goal 3')).toBeInTheDocument();
    });

    it('should show proper goal counts based on status', () => {
      renderWithRouter(<Dashboard />);
      
      // Active goals: 2 (Goal 1 and Goal 3)
      expect(screen.getByText('2')).toBeInTheDocument();
      
      // Completed goals: 1 (Goal 2)
      expect(screen.getByText('1')).toBeInTheDocument();
    });
  });

  describe('⚡ Performance and Loading States', () => {
    it('should handle loading states gracefully', () => {
      renderWithRouter(<Dashboard />);
      
      // Should not show loading spinner when data is ready
      expect(screen.queryByText('Loading dashboard...')).not.toBeInTheDocument();
    });

    it('should display content immediately when ready', () => {
      renderWithRouter(<Dashboard />);
      
      // All content should be visible immediately
      expect(screen.getByText('Quick Stats')).toBeInTheDocument();
      expect(screen.getByText('Track Progress')).toBeInTheDocument();
      expect(screen.getByText('Recent Goals')).toBeInTheDocument();
    });
  });
});
