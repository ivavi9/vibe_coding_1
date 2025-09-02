import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import Goals from '../Goals';

// Mock axios
jest.mock('axios');

const mockGoals = [
  {
    id: 1,
    title: 'Learn React',
    description: 'Master React fundamentals and build projects',
    priority: 'high',
    category: 'learning',
    target_date: '2024-06-01T00:00:00',
    current_progress: 25.0,
    total_progress_entries: 3
  },
  {
    id: 2,
    title: 'Exercise Daily',
    description: 'Build healthy exercise habits',
    priority: 'medium',
    category: 'health',
    target_date: '2024-12-31T00:00:00',
    current_progress: 0.0,
    total_progress_entries: 0
  },
  {
    id: 3,
    title: 'Save Money',
    description: 'Save $5000 for vacation',
    priority: 'low',
    category: 'finance',
    target_date: '2024-12-31T00:00:00',
    current_progress: 75.0,
    total_progress_entries: 8
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Goals Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockGoals });
  });

  test('renders loading state initially', () => {
    renderWithRouter(<Goals />);
    // During loading, the component shows skeleton loading, not the header text
    // Check for the skeleton loading structure instead
    expect(screen.getByTestId('skeleton-loading')).toBeInTheDocument();
  });

  test('renders goals after loading', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Exercise Daily')).toBeInTheDocument();
      expect(screen.getByText('Save Money')).toBeInTheDocument();
    });
  });

  test('displays goal information correctly', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Check priority display
    expect(screen.getByText('high')).toBeInTheDocument();
    expect(screen.getByText('medium')).toBeInTheDocument();
    expect(screen.getByText('low')).toBeInTheDocument();

    // Check category display
    expect(screen.getByText('learning')).toBeInTheDocument();
    expect(screen.getByText('health')).toBeInTheDocument();
    expect(screen.getByText('finance')).toBeInTheDocument();

    // Check progress display
    expect(screen.getByText('25%')).toBeInTheDocument();
    expect(screen.getByText('0%')).toBeInTheDocument();
    expect(screen.getByText('75%')).toBeInTheDocument();
  });

  test('displays progress entries count', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Check progress entries count - only shows when > 0
    expect(screen.getByText('3 progress entries')).toBeInTheDocument();
    expect(screen.getByText('8 progress entries')).toBeInTheDocument();
    // Goal with 0 progress entries won't show the text
  });

  test('filters goals by search term', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Search goals...');
    fireEvent.change(searchInput, { target: { value: 'React' } });

    // Should only show React goal
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.queryByText('Exercise Daily')).not.toBeInTheDocument();
    expect(screen.queryByText('Save Money')).not.toBeInTheDocument();
  });

  test('filters goals by category', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'health' } });

    // Should only show health category goals
    expect(screen.queryByText('Learn React')).not.toBeInTheDocument();
    expect(screen.getByText('Exercise Daily')).toBeInTheDocument();
    expect(screen.queryByText('Save Money')).not.toBeInTheDocument();
  });

  test('filters goals by priority', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const prioritySelect = screen.getByDisplayValue('All Priorities');
    fireEvent.change(prioritySelect, { target: { value: 'high' } });

    // Should only show high priority goals
    expect(screen.getByText('Learn React')).toBeInTheDocument();
    expect(screen.queryByText('Exercise Daily')).not.toBeInTheDocument();
    expect(screen.queryByText('Save Money')).not.toBeInTheDocument();
  });

  test('shows correct results count', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('3 of 3 goals')).toBeInTheDocument();
    });

    // Filter by category
    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'health' } });

    expect(screen.getByText('1 of 3 goals')).toBeInTheDocument();
  });

  test('opens progress modal when track progress button is clicked', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Track Progress buttons are already visible in test environment
    const goalCards = screen.getAllByText('Track Progress');
    const firstGoalCard = goalCards[0];
    fireEvent.click(firstGoalCard);

    // Modal should appear
    expect(screen.getByText('Track Progress: Learn React')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('0')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('What did you accomplish today?')).toBeInTheDocument();
  });

  test('allows entering progress value in modal', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Track Progress buttons are already visible in test environment
    const goalCards = screen.getAllByText('Track Progress');
    const firstGoalCard = goalCards[0];
    fireEvent.click(firstGoalCard);

    // Enter progress value
    const progressInput = screen.getByPlaceholderText('0');
    fireEvent.change(progressInput, { target: { value: '15' } });
    
    expect(progressInput.value).toBe('15');
  });

  test('allows entering notes in modal', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Open progress modal
    const goalCards = screen.getAllByText('Track Progress');
    const firstGoalCard = goalCards[0];
    fireEvent.click(firstGoalCard);

    // Enter notes
    const notesTextarea = screen.getByPlaceholderText('What did you accomplish today?');
    fireEvent.change(notesTextarea, { target: { value: 'Test notes' } });
    
    expect(notesTextarea.value).toBe('Test notes');
  });

  test('saves progress when save button is clicked', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, goal_id: 1, progress_value: 15, notes: 'Test notes' } });
    
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Open progress modal
    const goalCards = screen.getAllByText('Track Progress');
    const firstGoalCard = goalCards[0];
    fireEvent.click(firstGoalCard);

    // Enter progress and notes
    const progressInput = screen.getByPlaceholderText('0');
    const notesTextarea = screen.getByPlaceholderText('What did you accomplish today?');
    
    fireEvent.change(progressInput, { target: { value: '15' } });
    fireEvent.change(notesTextarea, { target: { value: 'Test notes' } });

    // Click save button
    const saveButton = screen.getByText('Save Progress');
    fireEvent.click(saveButton);

    // Should call API with correct data - progress_value is a number from number input
    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/daily-progress', {
        goal_id: 1,
        progress_value: 15,
        notes: 'Test notes'
      });
    });
  });

  test('disables save button when no progress value is entered', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Track Progress buttons are already visible in test environment
    const goalCards = screen.getAllByText('Track Progress');
    const firstGoalCard = goalCards[0];
    fireEvent.click(firstGoalCard);

    // Save button should be disabled initially
    const saveButton = screen.getByText('Save Progress');
    expect(saveButton).toBeDisabled();

    // Enter progress value
    const progressInput = screen.getByPlaceholderText('0');
    fireEvent.change(progressInput, { target: { value: '15' } });
    
    // Save button should be enabled
    expect(saveButton).not.toBeDisabled();
  });

  test('closes modal when cancel button is clicked', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Track Progress buttons are already visible in test environment
    const goalCards = screen.getAllByText('Track Progress');
    const firstGoalCard = goalCards[0];
    fireEvent.click(firstGoalCard);

    // Modal should be visible
    expect(screen.getByText('Track Progress: Learn React')).toBeInTheDocument();

    // Click cancel button
    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    // Modal should be hidden
    expect(screen.queryByText('Track Progress: Learn React')).not.toBeInTheDocument();
  });

  test('refreshes goals after saving progress', async () => {
    axios.post.mockResolvedValue({ data: { id: 1, goal_id: 1, progress_value: 15, notes: 'Test notes' } });
    
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Track Progress buttons are already visible in test environment
    const goalCards = screen.getAllByText('Track Progress');
    const firstGoalCard = goalCards[0];
    fireEvent.click(firstGoalCard);

    const progressInput = screen.getByPlaceholderText('0');
    fireEvent.change(progressInput, { target: { value: '15' } });

    const saveButton = screen.getByText('Save Progress');
    fireEvent.click(saveButton);

    await waitFor(() => {
      // Should call get goals again to refresh data
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });

  test('handles empty goals list', async () => {
    axios.get.mockResolvedValue({ data: [] });
    
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('No goals yet')).toBeInTheDocument();
      expect(screen.getByText('Upload a document to extract your goals or create one manually.')).toBeInTheDocument();
      expect(screen.getByText('Add Your First Goal')).toBeInTheDocument();
    });
  });

  test('handles filtered goals with no results', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Filter by non-existent category
    const categorySelect = screen.getByDisplayValue('All Categories');
    fireEvent.change(categorySelect, { target: { value: 'nonexistent' } });

    expect(screen.getByText('No goals match your filters')).toBeInTheDocument();
    expect(screen.getByText('Try adjusting your search or filter criteria.')).toBeInTheDocument();
  });

  test('displays target dates correctly', async () => {
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Check that target dates are displayed - no "Due" text, just the date
    // The component uses toLocaleDateString() which formats based on locale
    // Use getAllByText to handle multiple elements with the same date
    const dateElements = screen.getAllByText(/6\/1\/2024|12\/31\/2024/);
    expect(dateElements.length).toBeGreaterThan(0);
  });

  test('handles goals without target dates', async () => {
    const goalsWithoutDates = mockGoals.map(goal => ({ ...goal, target_date: null }));
    axios.get.mockResolvedValue({ data: goalsWithoutDates });
    
    renderWithRouter(<Goals />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Should not show any "Due" text
    expect(screen.queryByText(/Due/)).not.toBeInTheDocument();
  });
});
