import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { Layout } from '../Layout';

// Mock the useAuth hook
const mockUseAuth = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

// Mock the Sidebar component
vi.mock('../Sidebar', () => ({
  default: () => <div data-testid="sidebar">Sidebar</div>
}));

// Mock the UserProfile component
vi.mock('../auth/UserProfile', () => ({
  default: () => <div data-testid="user-profile">User Profile</div>
}));

const renderWithProviders = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  );
};

describe('Layout Component - Authentication UX', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('📱 Header Rendering', () => {
    it('should render the Clarity logo', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      expect(screen.getByText('Clarity')).toBeInTheDocument();
      expect(screen.getByText('Clarity')).toHaveClass('text-xl', 'font-bold', 'text-gray-900');
    });

    it('should render navigation items', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      expect(screen.getByTestId('sidebar')).toBeInTheDocument();
    });
  });

  describe('🔐 Guest Mode State', () => {
    it('should show guest mode indicator when not authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      expect(screen.getByText('Guest Mode')).toBeInTheDocument();
      expect(screen.getByText('• Progress not saved')).toBeInTheDocument();
      expect(screen.getByText('Ready to save progress?')).toBeInTheDocument();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
    });

    it('should show yellow pulsing dot for guest mode', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      const guestModeIndicator = screen.getByText('Guest Mode').closest('div');
      const yellowDot = guestModeIndicator?.querySelector('.bg-yellow-400');
      expect(yellowDot).toBeInTheDocument();
    });
  });

  describe('👤 Authenticated User State', () => {
    it('should show user profile when authenticated', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
      expect(screen.queryByText('Guest Mode')).not.toBeInTheDocument();
      expect(screen.queryByText('Sign in via the banner above to save your progress')).not.toBeInTheDocument();
    });
  });

  describe('⏳ Loading State', () => {
    it('should show loading spinner when checking authentication', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      const loadingSpinner = screen.getByTestId('loading-spinner');
      expect(loadingSpinner).toBeInTheDocument();
      expect(loadingSpinner).toHaveClass('animate-spin');
    });

    it('should not show guest mode indicator during loading', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      expect(screen.queryByText('Guest Mode')).not.toBeInTheDocument();
    });
  });

  describe('🎯 Content Rendering', () => {
    it('should render children content in main area', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });

      renderWithProviders(
        <Layout>
          <div data-testid="test-content">Test Content</div>
        </Layout>
      );
      
      expect(screen.getByTestId('test-content')).toBeInTheDocument();
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });

    it('should have proper layout structure', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      expect(screen.getByRole('banner')).toBeInTheDocument(); // Header
      expect(screen.getByTestId('sidebar')).toBeInTheDocument(); // Sidebar
      expect(screen.getByRole('main')).toBeInTheDocument(); // Main content
    });
  });

  describe('🔒 Authentication Flow Integration', () => {
    it('should transition from guest to authenticated state', () => {
      const { rerender } = renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      // Start with guest mode
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });
      
      expect(screen.getByText('Guest Mode')).toBeInTheDocument();
      
      // Transition to authenticated
      mockUseAuth.mockReturnValue({
        isAuthenticated: true,
        isLoading: false
      });
      
      rerender(<Layout><div>Test Content</div></Layout>);
      
      expect(screen.queryByText('Guest Mode')).not.toBeInTheDocument();
      expect(screen.getByTestId('user-profile')).toBeInTheDocument();
    });

    it('should handle loading state transitions', () => {
      // Test loading state
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: true
      });

      const { rerender } = renderWithProviders(<Layout><div>Test Content</div></Layout>);
      expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
      
      // Test guest mode state
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });
      
      rerender(<Layout><div>Test Content</div></Layout>);
      expect(screen.getByText('Guest Mode')).toBeInTheDocument();
      expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
    });
  });

  describe('🎨 UI/UX Best Practices', () => {
    it('should have proper spacing and layout classes', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      const header = screen.getByRole('banner');
      expect(header).toHaveClass('bg-white', 'border-b', 'border-gray-200', 'px-6', 'py-4');
      
      const main = screen.getByRole('main');
      expect(main).toHaveClass('flex-1', 'p-6');
    });

    it('should have responsive design classes', () => {
      mockUseAuth.mockReturnValue({
        isAuthenticated: false,
        isLoading: false
      });

      renderWithProviders(<Layout><div>Test Content</div></Layout>);
      
      const container = screen.getByRole('banner').closest('.min-h-screen');
      expect(container).toHaveClass('min-h-screen', 'bg-gray-50');
    });
  });
});
