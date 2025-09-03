import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import AuthenticationBanner from '../ui/AuthenticationBanner';

// Mock useAuth hook
const mockSignIn = vi.fn();
const mockIsAuthenticated = false;
const mockIsLoading = false;

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: mockSignIn,
    isAuthenticated: mockIsAuthenticated,
    isLoading: mockIsLoading
  })
}));

describe('🔐 AuthenticationBanner Component - Subtle UX Design', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock timers for auto-dismiss functionality
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('📱 Component Rendering', () => {
    it('should not render when user is authenticated', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(true);
      
      render(<AuthenticationBanner />);
      
      expect(screen.queryByText('Ready to save your progress?')).not.toBeInTheDocument();
    });

    it('should not render when loading', () => {
      vi.mocked(mockIsLoading).mockReturnValue(true);
      
      render(<AuthenticationBanner />);
      
      expect(screen.queryByText('Ready to save your progress?')).not.toBeInTheDocument();
    });

    it('should render after 1 second delay when user is not authenticated and not loading', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      const { container } = render(<AuthenticationBanner />);
      
      // Initially not visible due to 1-second delay
      expect(screen.queryByText('Unlock Full Features')).not.toBeInTheDocument();
      console.log('Initial render:', container.innerHTML);
      
      // Fast-forward 1 second
      vi.advanceTimersByTime(1000);
      console.log('After 1 second:', container.innerHTML);
      
      // Force a re-render by advancing timers
      vi.runAllTimers();
      console.log('After runAllTimers:', container.innerHTML);
      
      expect(screen.getByText('Unlock Full Features')).toBeInTheDocument();
      expect(screen.getByText('Sign in to save goals permanently')).toBeInTheDocument();
    });
  });

  describe('🎨 Visual Design & Styling', () => {
    it('should have subtle, non-intrusive styling', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const banner = screen.getByText('Ready to save your progress?').closest('div');
      expect(banner).toHaveClass(
        'fixed',
        'top-4',
        'right-4',
        'bg-white',
        'border',
        'border-gray-200',
        'rounded-lg',
        'shadow-lg',
        'p-4',
        'max-w-sm',
        'z-50'
      );
    });

    it('should have proper icon styling', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const icon = screen.getByText('Ready to save your progress?').closest('div')?.querySelector('svg');
      expect(icon).toHaveClass('w-5', 'h-5', 'text-blue-500');
    });

    it('should have fade-in animation', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const banner = screen.getByText('Ready to save your progress?').closest('div');
      expect(banner).toHaveClass('animate-fade-in-down');
    });

    it('should have proper text hierarchy', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const title = screen.getByText('Ready to save your progress?');
      const description = screen.getByText('Sign in with Google to track your goals and see your progress over time.');
      
      expect(title).toHaveClass('font-semibold', 'text-gray-900');
      expect(description).toHaveClass('text-sm', 'text-gray-600');
    });
  });

  describe('🔘 Interactive Elements', () => {
    it('should have sign-in button', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('should call signIn when button is clicked', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const signInButton = screen.getByText('Continue with Google');
      fireEvent.click(signInButton);
      
      expect(mockSignIn).toHaveBeenCalled();
    });

    it('should have dismiss button', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
    });

    it('should have proper button styling', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const signInButton = screen.getByText('Continue with Google');
      expect(signInButton).toHaveClass(
        'bg-blue-500',
        'hover:bg-blue-600',
        'text-white',
        'px-4',
        'py-2',
        'rounded-lg',
        'text-sm',
        'font-medium',
        'transition-colors',
        'duration-200'
      );
    });
  });

  describe('⏰ Auto-Dismiss Functionality', () => {
    it('should auto-dismiss after 20 seconds', async () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      // Fast-forward 20 seconds
      vi.advanceTimersByTime(20000);
      
      await waitFor(() => {
        expect(screen.queryByText('Ready to save your progress?')).not.toBeInTheDocument();
      });
    });

    it('should not auto-dismiss before 20 seconds', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      // Fast-forward 19 seconds (just before auto-dismiss)
      vi.advanceTimersByTime(19000);
      
      expect(screen.getByText('Ready to save your progress?')).toBeInTheDocument();
    });
  });

  describe('🎯 Content & Messaging', () => {
    it('should have compelling headline', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      expect(screen.getByText('Ready to save your progress?')).toBeInTheDocument();
    });

    it('should have clear value proposition', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      expect(screen.getByText('Sign in with Google to track your goals and see your progress over time.')).toBeInTheDocument();
    });

    it('should have action-oriented button text', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });
  });

  describe('📱 Responsive Design', () => {
    it('should have proper positioning', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const banner = screen.getByText('Ready to save your progress?').closest('div');
      expect(banner).toHaveClass('fixed', 'top-4', 'right-4');
    });

    it('should have appropriate width constraints', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const banner = screen.getByText('Ready to save your progress?').closest('div');
      expect(banner).toHaveClass('max-w-sm');
    });

    it('should have proper spacing', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const banner = screen.getByText('Ready to save your progress?').closest('div');
      expect(banner).toHaveClass('p-4');
    });
  });

  describe('🎭 Psychology-Driven UX', () => {
    it('should use positive, encouraging language', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      expect(screen.getByText(/Ready/)).toBeInTheDocument();
      expect(screen.getByText(/save/)).toBeInTheDocument();
      expect(screen.getByText(/track/)).toBeInTheDocument();
    });

    it('should emphasize benefits over features', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const description = screen.getByText('Sign in with Google to track your goals and see your progress over time.');
      expect(description.textContent).toContain('track your goals');
      expect(description.textContent).toContain('see your progress over time');
    });

    it('should be non-intrusive and dismissible', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      // Should have close button
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument();
      
      // Should auto-dismiss
      vi.advanceTimersByTime(20000);
      expect(screen.queryByText('Ready to save your progress?')).not.toBeInTheDocument();
    });
  });

  describe('🔒 Security & Privacy', () => {
    it('should mention Google sign-in specifically', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      expect(screen.getByText('Sign in with Google to track your goals and see your progress over time.')).toBeInTheDocument();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('should not request unnecessary permissions', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const description = screen.getByText('Sign in with Google to track your goals and see your progress over time.');
      expect(description.textContent).toContain('track your goals');
      expect(description.textContent).toContain('see your progress');
      
      // Should not mention other permissions
      expect(description.textContent).not.toContain('personal information');
      expect(description.textContent).not.toContain('contacts');
    });
  });

  describe('🎨 Icon & Visual Elements', () => {
    it('should have appropriate icon', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const icon = screen.getByText('Ready to save your progress?').closest('div')?.querySelector('svg');
      expect(icon).toBeInTheDocument();
      expect(icon).toHaveClass('w-5', 'h-5', 'text-blue-500');
    });

    it('should have proper icon positioning', () => {
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      render(<AuthenticationBanner />);
      
      const iconContainer = screen.getByText('Ready to save your progress?').closest('div')?.querySelector('[class*="flex"]');
      expect(iconContainer).toHaveClass('items-center', 'space-x-3');
    });
  });

  describe('🔄 State Management', () => {
    it('should handle loading state correctly', () => {
      vi.mocked(mockIsLoading).mockReturnValue(true);
      
      render(<AuthenticationBanner />);
      
      expect(screen.queryByText('Ready to save your progress?')).not.toBeInTheDocument();
    });

    it('should handle authentication state changes', () => {
      // Start unauthenticated
      vi.mocked(mockIsAuthenticated).mockReturnValue(false);
      vi.mocked(mockIsLoading).mockReturnValue(false);
      
      const { rerender } = render(<AuthenticationBanner />);
      
      expect(screen.getByText('Ready to save your progress?')).toBeInTheDocument();
      
      // Change to authenticated
      vi.mocked(mockIsAuthenticated).mockReturnValue(true);
      rerender(<AuthenticationBanner />);
      
      expect(screen.queryByText('Ready to save your progress?')).not.toBeInTheDocument();
    });
  });
});
