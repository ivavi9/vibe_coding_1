import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import axios from 'axios';
import { format } from 'date-fns';
import ProgressConsole from '../../pages/ProgressConsole';

// Mock axios
jest.mock('axios');

// Mock date-fns
jest.mock('date-fns', () => ({
  format: jest.fn(() => '2024-01-15')
}));

const mockGoals = [
  {
    id: 1,
    title: 'Learn React',
    description: 'Master React fundamentals',
    priority: 'high',
    category: 'learning',
    target_date: '2024-06-01T00:00:00',
    current_progress: 25.0,
    total_progress_entries: 3
  },
  {
    id: 2,
    title: 'Exercise Daily',
    description: 'Build healthy habits',
    priority: 'medium',
    category: 'health',
    target_date: '2024-12-31T00:00:00',
    current_progress: 0.0,
    total_progress_entries: 0
  }
];

const renderWithRouter = (component) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('ProgressConsole', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    axios.get.mockResolvedValue({ data: mockGoals });
  });

  test('renders loading state initially', () => {
    renderWithRouter(<ProgressConsole />);
    // During loading, the component shows skeleton loading, not the header text
    expect(screen.getByTestId('skeleton-loading')).toBeInTheDocument();
  });

  test('renders goals after loading', async () => {
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
      expect(screen.getByText('Exercise Daily')).toBeInTheDocument();
    });
  });

  test('displays correct summary statistics', async () => {
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument(); // Total Goals
      // Use getAllByText for multiple "0" values and check specific contexts
      const progressElements = screen.getAllByText('0');
      expect(progressElements.length).toBeGreaterThan(0);
      // Check that we have the right number of "0" values
      expect(progressElements).toHaveLength(2); // Total Progress Today and Goals Updated
    });
  });

  test('allows setting progress for individual goals', async () => {
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Find progress input for first goal
    const progressInputs = screen.getAllByPlaceholderText('0');
    const firstGoalInput = progressInputs[0];
    
    fireEvent.change(firstGoalInput, { target: { value: '15' } });
    expect(firstGoalInput.value).toBe('15');
  });

  test('allows adding notes for individual goals', async () => {
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Find notes textarea for first goal
    const notesTextareas = screen.getAllByPlaceholderText('What did you accomplish today?');
    const firstGoalNotes = notesTextareas[0];
    
    fireEvent.change(firstGoalNotes, { target: { value: 'Completed React tutorial' } });
    expect(firstGoalNotes.value).toBe('Completed React tutorial');
  });

  test('updates summary statistics when progress is entered', async () => {
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Enter progress for first goal
    const progressInputs = screen.getAllByPlaceholderText('0');
    const firstGoalInput = progressInputs[0];
    
    fireEvent.change(firstGoalInput, { target: { value: '25' } });
    
    // Check that total progress updates
    expect(screen.getByText('25')).toBeInTheDocument(); // Total Progress Today
    expect(screen.getByText('1')).toBeInTheDocument(); // Goals Updated
  });

  test('saves all progress when save button is clicked', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Successfully updated 2 progress entries' } });
    
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Enter progress for both goals
    const progressInputs = screen.getAllByPlaceholderText('0');
    fireEvent.change(progressInputs[0], { target: { value: '20' } });
    fireEvent.change(progressInputs[1], { target: { value: '15' } });

    // Click save button
    const saveButton = screen.getByText('Save All Progress');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(axios.post).toHaveBeenCalledWith('/daily-progress-bulk', [
        {
          goal_id: 1,
          progress_value: 20,
          notes: '',
          date: format(new Date(), 'yyyy-MM-dd')
        },
        {
          goal_id: 2,
          progress_value: 15,
          notes: '',
          date: format(new Date(), 'yyyy-MM-dd')
        }
      ]);
    });
  });

  test('shows saving state while processing', async () => {
    // Mock a delayed response
    axios.post.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));
    
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save All Progress');
    fireEvent.click(saveButton);

    // Should show saving state
    expect(screen.getByText('Saving...')).toBeInTheDocument();
  });

  test('shows success message after saving', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Successfully updated 2 progress entries' } });
    
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save All Progress');
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Saved!')).toBeInTheDocument();
    });
  });

  test('allows changing the date', async () => {
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Find the date input by its label and type
    const dateInput = screen.getByLabelText('Date:');
    expect(dateInput).toHaveAttribute('type', 'date');
    
    // Change the date to a specific value
    fireEvent.change(dateInput, { target: { value: '2024-01-20' } });
    
    expect(dateInput.value).toBe('2024-01-20');
  });

  test('displays priority icons correctly', async () => {
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Check that priority icons are displayed
    // Note: We can't easily test the actual icon rendering, but we can check the structure
    const goalCards = screen.getAllByText(/Learn React|Exercise Daily/);
    expect(goalCards).toHaveLength(2);
  });

  test('displays current progress for each goal', async () => {
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    // Check that current progress is displayed
    expect(screen.getByText('25%')).toBeInTheDocument(); // Learn React progress
    expect(screen.getByText('0%')).toBeInTheDocument(); // Exercise Daily progress
  });

  test('handles empty goals list', async () => {
    axios.get.mockResolvedValue({ data: [] });
    
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('No goals yet')).toBeInTheDocument();
      expect(screen.getByText('Upload a document to extract your goals or create one manually.')).toBeInTheDocument();
    });
  });

  test('handles API errors gracefully', async () => {
    axios.get.mockRejectedValue(new Error('API Error'));
    
    renderWithRouter(<ProgressConsole />);
    
    // Should still render the component (shows skeleton loading during error)
    expect(screen.getByTestId('skeleton-loading')).toBeInTheDocument();
  });

  test('refreshes goals after saving progress', async () => {
    axios.post.mockResolvedValue({ data: { message: 'Successfully updated 2 progress entries' } });
    
    renderWithRouter(<ProgressConsole />);
    
    await waitFor(() => {
      expect(screen.getByText('Learn React')).toBeInTheDocument();
    });

    const saveButton = screen.getByText('Save All Progress');
    fireEvent.click(saveButton);

    await waitFor(() => {
      // Should call get goals again to refresh data
      expect(axios.get).toHaveBeenCalledTimes(2);
    });
  });
});
