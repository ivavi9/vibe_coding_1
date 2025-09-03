import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import GoogleSignInButton from '../auth/GoogleSignInButton';

// Mock the useAuth hook
const mockLoginWithGoogle = vi.fn();
const mockUseAuth = vi.fn();

vi.mock('../../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}));

describe('GoogleSignInButton Component - Authentication UX', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseAuth.mockReturnValue({
      loginWithGoogle: mockLoginWithGoogle,
      isGoogleLoading: false
    });
  });

  describe('📱 Button Rendering', () => {
    it('should render with default props', () => {
      render(<GoogleSignInButton />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
      expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');
    });

    it('should render with small size', () => {
      render(<GoogleSignInButton size="sm" />);
      
      expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-xs');
    });

    it('should render with large size', () => {
      render(<GoogleSignInButton size="lg" />);
      
      expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');
    });

    it('should render with header variant', () => {
      render(<GoogleSignInButton variant="header" />);
      
      expect(screen.getByRole('button')).toHaveClass('bg-blue-600', 'hover:bg-blue-700', 'text-white', 'border-0');
    });

    it('should render with default variant', () => {
      render(<GoogleSignInButton variant="default" />);
      
      expect(screen.getByRole('button')).toHaveClass('bg-white', 'border', 'border-gray-300', 'text-gray-700');
    });
  });

  describe('🔐 Authentication Functionality', () => {
    it('should call loginWithGoogle when clicked', () => {
      render(<GoogleSignInButton />);
      
      const button = screen.getByRole('button');
      fireEvent.click(button);
      
      expect(mockLoginWithGoogle).toHaveBeenCalledTimes(1);
    });

    it('should be disabled when loading', () => {
      mockUseAuth.mockReturnValue({
        loginWithGoogle: mockLoginWithGoogle,
        isGoogleLoading: true
      });

      render(<GoogleSignInButton />);
      
      const button = screen.getByRole('button');
      expect(button).toBeDisabled();
      expect(button).toHaveClass('disabled:opacity-50', 'disabled:cursor-not-allowed');
    });

    it('should show loading spinner when loading', () => {
      mockUseAuth.mockReturnValue({
        loginWithGoogle: mockLoginWithGoogle,
        isGoogleLoading: true
      });

      render(<GoogleSignInButton />);
      
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(screen.getByRole('button').querySelector('.animate-spin')).toBeInTheDocument();
    });
  });

  describe('🎨 Visual States', () => {
    it('should show Google logo when not loading', () => {
      render(<GoogleSignInButton />);
      
      const svg = screen.getByRole('button').querySelector('svg');
      expect(svg).toBeInTheDocument();
      expect(svg).toHaveAttribute('viewBox', '0 0 24 24');
    });

    it('should show loading text when loading', () => {
      mockUseAuth.mockReturnValue({
        loginWithGoogle: mockLoginWithGoogle,
        isGoogleLoading: true
      });

      render(<GoogleSignInButton />);
      
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
      expect(screen.queryByText('Continue with Google')).not.toBeInTheDocument();
    });

    it('should have proper hover effects', () => {
      render(<GoogleSignInButton />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-gray-50', 'transition-all', 'duration-200');
    });

    it('should have header variant hover effects', () => {
      render(<GoogleSignInButton variant="header" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('hover:bg-blue-700', 'hover:shadow-md');
    });
  });

  describe('🔧 Props and Variants', () => {
    it('should combine size and variant props correctly', () => {
      render(<GoogleSignInButton size="sm" variant="header" />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-3', 'py-1.5', 'text-xs', 'bg-blue-600', 'text-white');
    });

    it('should use default props when not specified', () => {
      render(<GoogleSignInButton />);
      
      const button = screen.getByRole('button');
      expect(button).toHaveClass('px-4', 'py-2', 'text-sm', 'bg-white', 'border-gray-300');
    });

    it('should handle all size variants', () => {
      const { rerender } = render(<GoogleSignInButton size="sm" />);
      expect(screen.getByRole('button')).toHaveClass('px-3', 'py-1.5', 'text-xs');
      
      rerender(<GoogleSignInButton size="md" />);
      expect(screen.getByRole('button')).toHaveClass('px-4', 'py-2', 'text-sm');
      
      rerender(<GoogleSignInButton size="lg" />);
      expect(screen.getByRole('button')).toHaveClass('px-6', 'py-3', 'text-base');
    });
  });

  describe('🎯 Accessibility', () => {
    it('should have proper button role', () => {
      render(<GoogleSignInButton />);
      
      expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should be keyboard accessible', () => {
      render(<GoogleSignInButton />);
      
      const button = screen.getByRole('button');
      button.focus();
      expect(button).toHaveFocus();
    });

    it('should show loading state to screen readers', () => {
      mockUseAuth.mockReturnValue({
        loginWithGoogle: mockLoginWithGoogle,
        isGoogleLoading: true
      });

      render(<GoogleSignInButton />);
      
      expect(screen.getByText('Signing in...')).toBeInTheDocument();
    });
  });
});
