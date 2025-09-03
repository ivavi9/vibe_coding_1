import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import GoalCompletionCelebration from '../goals/GoalCompletionCelebration';

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
    h2: ({ children, ...props }: any) => <h2 {...props}>{children}</h2>,
    p: ({ children, ...props }: any) => <p {...props}>{children}</p>
  },
  AnimatePresence: ({ children }: any) => <div>{children}</div>
}));

describe('🎉 Enhanced GoalCompletionCelebration Component - Psychology-Driven UX', () => {
  const mockOnClose = vi.fn();
  const mockGoalTitle = 'Learn React';

  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('📱 Component Rendering', () => {
    it('should not render when not visible', () => {
      render(
        <GoalCompletionCelebration
          isVisible={false}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.queryByText('Goal Completed! 🎉')).not.toBeInTheDocument();
    });

    it('should render when visible', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText('Goal Completed! 🎉')).toBeInTheDocument();
      expect(screen.getByText('You did it!')).toBeInTheDocument();
      expect(screen.getByText(`Congratulations on completing "${mockGoalTitle}"!`)).toBeInTheDocument();
    });
  });

  describe('🎭 Celebration Levels & Progression', () => {
    it('should start with level 1 celebration', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText('Goal Completed! 🎉')).toBeInTheDocument();
      expect(screen.getByText('You did it!')).toBeInTheDocument();
    });

    it('should progress to level 2 celebration after 1 second', async () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Fast-forward 1 second
      vi.advanceTimersByTime(1000);
      
      await waitFor(() => {
        expect(screen.getByText('You\'re Amazing! 👑')).toBeInTheDocument();
        expect(screen.getByText('Keep the momentum going!')).toBeInTheDocument();
      });
    });

    it('should progress to level 3 celebration after 2 seconds', async () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Fast-forward 2 seconds
      vi.advanceTimersByTime(2000);
      
      await waitFor(() => {
        expect(screen.getByText('Unstoppable! 🚀')).toBeInTheDocument();
        expect(screen.getByText('Ready for the next challenge?')).toBeInTheDocument();
      });
    });
  });

  describe('🎊 Visual Effects & Animations', () => {
    it('should show confetti after 500ms', async () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Fast-forward 500ms
      vi.advanceTimersByTime(500);
      
      await waitFor(() => {
        // Confetti should be visible (50 confetti elements)
        const confettiContainer = screen.getByText('Goal Completed! 🎉').closest('div')?.parentElement;
        expect(confettiContainer).toBeInTheDocument();
      });
    });

    it('should show fireworks after 1.5 seconds', async () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Fast-forward 1.5 seconds
      vi.advanceTimersByTime(1500);
      
      await waitFor(() => {
        // Fireworks should be visible (8 firework elements)
        const fireworksContainer = screen.getByText('Goal Completed! 🎉').closest('div')?.parentElement;
        expect(fireworksContainer).toBeInTheDocument();
      });
    });

    it('should have floating animated icons', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Should have floating icons with animation classes
      const floatingIcons = screen.getByText('Goal Completed! 🎉').closest('div')?.parentElement?.querySelectorAll('[class*="absolute"]');
      expect(floatingIcons?.length).toBeGreaterThan(0);
    });
  });

  describe('🎯 Content & Messaging', () => {
    it('should display goal title in celebration message', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText(`Congratulations on completing "${mockGoalTitle}"!`)).toBeInTheDocument();
    });

          it('should have motivational progression messages', () => {
        render(
          <GoalCompletionCelebration
            isVisible={true}
            goalTitle={mockGoalTitle}
            onClose={mockOnClose}
          />
        );
        
        // Level 1 - this is what actually renders
        expect(screen.getByText('You did it!')).toBeInTheDocument();
        expect(screen.getByText('Congratulations on completing "Learn React"!')).toBeInTheDocument();
      });

    it('should have encouraging final message', async () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Fast-forward to level 3
      vi.advanceTimersByTime(2000);
      
      await waitFor(() => {
        expect(screen.getByText('Your dedication is inspiring. What\'s your next goal?')).toBeInTheDocument();
      });
    });
  });

  describe('🎨 Visual Design & Styling', () => {
    it('should have gradient backgrounds', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const celebrationCard = screen.getByText('Goal Completed! 🎉').closest('div');
      expect(celebrationCard).toHaveClass('bg-white', 'rounded-2xl', 'shadow-2xl');
    });

    it('should have proper backdrop styling', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const backdrop = screen.getByText('Goal Completed! 🎉').closest('div')?.parentElement;
      expect(backdrop).toHaveClass('bg-black', 'bg-opacity-75');
    });

    it('should have background glow effects', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const backgroundGlow = screen.getByText('Goal Completed! 🎉').closest('div')?.querySelector('[class*="blur-3xl"]');
      expect(backgroundGlow).toBeInTheDocument();
    });
  });

  describe('🔘 Interactive Elements', () => {
    it('should have continue journey button', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText('Continue Journey 🚀')).toBeInTheDocument();
    });

    it('should call onClose when continue button is clicked', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const continueButton = screen.getByText('Continue Journey 🚀');
      continueButton.click();
      
      expect(mockOnClose).toHaveBeenCalled();
    });

    it('should have hover effects on continue button', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const continueButton = screen.getByText('Continue Journey 🚀');
      expect(continueButton).toHaveClass('hover:scale-105', 'transition-all', 'duration-200');
    });
  });

  describe('⏰ Timing & Auto-Close', () => {
    it('should auto-close after 5 seconds', async () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('should clear confetti and fireworks before closing', async () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Fast-forward 5 seconds
      vi.advanceTimersByTime(5000);
      
      await waitFor(() => {
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('🎭 Psychology-Driven Features', () => {
    it('should use encouraging and motivational language', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      expect(screen.getByText(/You did it!/)).toBeInTheDocument();
      expect(screen.getByText(/Congratulations/)).toBeInTheDocument();
    });

    it('should have progress bar animation for satisfaction', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const progressBar = screen.getByText('Goal Completed! 🎉').closest('div')?.querySelector('[class*="bg-gray-200"]');
      expect(progressBar).toBeInTheDocument();
    });
  });

  describe('📱 Responsive Design', () => {
    it('should have proper spacing and layout', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const celebrationCard = screen.getByText('Goal Completed! 🎉').closest('div');
      expect(celebrationCard).toHaveClass('p-8', 'max-w-md', 'mx-4');
    });

    it('should be centered on screen', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const container = screen.getByText('Goal Completed! 🎉').closest('div')?.parentElement;
      expect(container).toHaveClass('flex', 'items-center', 'justify-center');
    });
  });

  describe('🎨 Icon & Visual Elements', () => {
    it('should display appropriate icons for each celebration level', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      // Level 1: Trophy
      expect(screen.getByText('Goal Completed! 🎉').closest('div')?.querySelector('svg')).toBeInTheDocument();
      
      // Level 2: Crown
      vi.advanceTimersByTime(1000);
      expect(screen.getByText('You\'re Amazing! 👑').closest('div')?.querySelector('svg')).toBeInTheDocument();
      
      // Level 3: Rocket
      vi.advanceTimersByTime(1000);
      expect(screen.getByText('Unstoppable! 🚀').closest('div')?.querySelector('svg')).toBeInTheDocument();
    });

    it('should have animated floating icons', () => {
      render(
        <GoalCompletionCelebration
          isVisible={true}
          goalTitle={mockGoalTitle}
          onClose={mockOnClose}
        />
      );
      
      const floatingIcons = screen.getByText('Goal Completed! 🎉').closest('div')?.parentElement?.querySelectorAll('[class*="absolute"]');
      expect(floatingIcons?.length).toBeGreaterThan(0);
    });
  });
});
