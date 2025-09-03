import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Goals from '../Goals';

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
        current_progress: 0,
        target_progress: 1,
        status: 'completed'
      }
    ],
    isLoading: false,
    createGoal: vi.fn(),
    updateGoal: vi.fn(),
    deleteGoal: vi.fn(),
    completeGoal: vi.fn(),
    reactivateGoal: vi.fn()
  })
}));

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    user: { id: '123', email: 'test@example.com', name: 'Test User' },
    isAuthenticated: true,
    isLoading: false
  })
}));

vi.mock('../../hooks/useToast', () => ({
  useToast: () => ({
    toasts: [],
    removeToast: vi.fn()
  })
}));

vi.mock('../../components/goals/GoalExtractionManager', () => ({
  useGoalExtraction: () => ({
    extractedGoals: [],
    showExtractedGoals: false,
    isExtracting: false,
    shouldCompleteLoader: false,
    addedGoals: new Set(),
    extractedGoalsRef: { current: null },
    handleTextExtract: vi.fn(),
    handleFileExtract: vi.fn(),
    handleEditGoal: vi.fn(),
    handleCreateGoal: vi.fn()
  })
}));

vi.mock('../../components/goals/GoalExtractionForm', () => ({
  default: ({ onTextExtract, onFileExtract, isLoading, disabled }: {
    onTextExtract: (text: string) => void;
    onFileExtract: (file: File | undefined) => void;
    isLoading: boolean;
    disabled: boolean;
  }) => (
    <div data-testid="goal-extraction-form">
      <button 
        onClick={() => onTextExtract('Test goal text')}
        disabled={disabled}
        data-testid="text-extract-btn"
      >
        Extract from Text
      </button>
      <input 
        type="file" 
        onChange={(e) => onFileExtract(e.target.files?.[0])}
        disabled={disabled}
        data-testid="file-upload"
      />
      {isLoading && <div data-testid="extraction-loading">Extracting...</div>}
    </div>
  )
}));

vi.mock('../../components/goals/GoalExtractionLoader', () => ({
  default: ({ isVisible, onComplete, shouldComplete }: {
    isVisible: boolean;
    onComplete: () => void;
    shouldComplete: boolean;
  }) => (
    isVisible ? (
      <div data-testid="extraction-loader">
        <div>Loading extraction...</div>
        {shouldComplete && (
          <button onClick={onComplete} data-testid="complete-loader">
            Complete
          </button>
        )}
      </div>
    ) : null
  )
}));

vi.mock('../../components/goals/GoalManagement', () => ({
  default: ({ goals, onDeleteGoal, onCompleteGoal, onRecoverGoal }: {
    goals: Array<{
      id: string;
      title: string;
      description: string;
      status: string;
      current_progress: number;
      target_progress: number;
    }>;
    onDeleteGoal: (id: string) => void;
    onCompleteGoal: (id: string) => void;
    onRecoverGoal: (id: string) => void;
  }) => (
    <div data-testid="goal-management">
      <h2>Goal Management</h2>
      {goals.map((goal) => (
        <div key={goal.id} data-testid={`goal-${goal.id}`}>
          <h3>{goal.title}</h3>
          <p>{goal.description}</p>
          <p>Status: {goal.status}</p>
          <p>Progress: {goal.current_progress}/{goal.target_progress}</p>
          <button 
            onClick={() => onDeleteGoal(goal.id)}
            data-testid={`delete-goal-${goal.id}`}
          >
            Delete
          </button>
          <button 
            onClick={() => onCompleteGoal(goal.id)}
            data-testid={`complete-goal-${goal.id}`}
          >
            Complete
          </button>
          <button 
            onClick={() => onRecoverGoal(goal.id)}
            data-testid={`recover-goal-${goal.id}`}
          >
            Recover
          </button>
        </div>
      ))}
    </div>
  )
}));

vi.mock('../../components/ui/ToastContainer', () => ({
  default: ({ toasts, onRemoveToast }: {
    toasts: Array<{ id: string; message: string }>;
    onRemoveToast: (id: string) => void;
  }) => (
    <div data-testid="toast-container">
      {toasts.map((toast, index) => (
        <div key={index} data-testid={`toast-${index}`}>
          {toast.message}
          <button onClick={() => onRemoveToast(toast.id)}>Dismiss</button>
        </div>
      ))}
    </div>
  )
}));

// Mock the goals components
vi.mock('../../components/goals', () => ({
  GoalExtractionForm: vi.fn(),
  ExtractedGoalsList: vi.fn(),
  GoalManagement: vi.fn(),
  AuthenticationBanners: vi.fn()
}));

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('🎯 Goals Page Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('📱 Component Rendering', () => {
    it('should render without crashing', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('goal-extraction-form')).toBeInTheDocument();
    });

    it('should display goal extraction form', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('goal-extraction-form')).toBeInTheDocument();
      expect(screen.getByTestId('text-extract-btn')).toBeInTheDocument();
      expect(screen.getByTestId('file-upload')).toBeInTheDocument();
    });

    it('should display goal management for authenticated users', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('goal-management')).toBeInTheDocument();
    });

    it('should display all goals in management section', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('goal-1')).toBeInTheDocument();
      expect(screen.getByTestId('goal-2')).toBeInTheDocument();
    });
  });

  describe('🎯 Goal Display and Information', () => {
    it('should display goal titles correctly', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByText('Test Goal 1')).toBeInTheDocument();
      expect(screen.getByText('Test Goal 2')).toBeInTheDocument();
    });

    it('should display goal descriptions correctly', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByText('Test Description 1')).toBeInTheDocument();
      expect(screen.getByText('Test Description 2')).toBeInTheDocument();
    });

    it('should display goal status correctly', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByText('Status: active')).toBeInTheDocument();
      expect(screen.getByText('Status: completed')).toBeInTheDocument();
    });

    it('should display goal progress correctly', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByText('Progress: 5/10')).toBeInTheDocument();
      expect(screen.getByText('Progress: 0/1')).toBeInTheDocument();
    });
  });

  describe('🔧 Goal Management Actions', () => {
    it('should have delete buttons for each goal', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('delete-goal-1')).toBeInTheDocument();
      expect(screen.getByTestId('delete-goal-2')).toBeInTheDocument();
    });

    it('should have complete buttons for each goal', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('complete-goal-1')).toBeInTheDocument();
      expect(screen.getByTestId('complete-goal-2')).toBeInTheDocument();
    });

    it('should have recover buttons for each goal', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('recover-goal-1')).toBeInTheDocument();
      expect(screen.getByTestId('recover-goal-2')).toBeInTheDocument();
    });
  });

  describe('📝 Goal Extraction Functionality', () => {
    it('should have text extraction button', () => {
      renderWithRouter(<Goals />);
      const textBtn = screen.getByTestId('text-extract-btn');
      expect(textBtn).toBeInTheDocument();
      expect(textBtn).not.toBeDisabled();
    });

    it('should have file upload input', () => {
      renderWithRouter(<Goals />);
      const fileInput = screen.getByTestId('file-upload');
      expect(fileInput).toBeInTheDocument();
      expect(fileInput).not.toBeDisabled();
    });

    it('should not show extraction loader by default', () => {
      renderWithRouter(<Goals />);
      expect(screen.queryByTestId('extraction-loader')).not.toBeInTheDocument();
    });
  });

  describe('🔐 Authentication State Handling', () => {
    it('should show goal management for authenticated users', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('goal-management')).toBeInTheDocument();
    });

    it('should display user goals correctly', () => {
      renderWithRouter(<Goals />);
      const goal1 = screen.getByTestId('goal-1');
      const goal2 = screen.getByTestId('goal-2');
      
      expect(goal1).toBeInTheDocument();
      expect(goal2).toBeInTheDocument();
    });
  });

  describe('📱 Responsive Design', () => {
    it('should have proper container structure', () => {
      renderWithRouter(<Goals />);
      const container = screen.getByTestId('goal-extraction-form').closest('.max-w-6xl');
      expect(container).toBeInTheDocument();
    });

    it('should have proper spacing between sections', () => {
      renderWithRouter(<Goals />);
      const container = screen.getByTestId('goal-extraction-form').closest('.space-y-8');
      expect(container).toBeInTheDocument();
    });
  });

  describe('🎨 UI Component Integration', () => {
    it('should render toast container', () => {
      renderWithRouter(<Goals />);
      expect(screen.getByTestId('toast-container')).toBeInTheDocument();
    });

    it('should have proper form layout', () => {
      renderWithRouter(<Goals />);
      const form = screen.getByTestId('goal-extraction-form');
      expect(form).toBeInTheDocument();
    });
  });
});
