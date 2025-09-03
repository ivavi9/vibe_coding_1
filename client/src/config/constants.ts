/**
 * Centralized configuration constants for the Clarity application
 * This file should be the single source of truth for all URLs and configuration values
 */

// Environment-based configuration
const isDevelopment = import.meta.env.DEV;
const isProduction = import.meta.env.PROD;

// API Configuration
export const API_CONFIG = {
  // Base URLs
  BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8001',
  
  // API Endpoints
  ENDPOINTS: {
    // Goals
    GOALS: '/api/v1/goals/',
    GOALS_EXTRACT: '/api/v1/goals/extract',
    
    // Authentication
    AUTH_GOOGLE_CALLBACK: '/api/v1/auth/google/callback',
    AUTH_VALIDATE: '/api/v1/auth/validate',
    AUTH_LOGOUT: '/api/v1/auth/logout',
    
    // Documents
    DOCUMENTS_UPLOAD: '/api/v1/documents/upload/document',
    
    // Progress tracking is done through goal updates
    // PROGRESS: '/api/v1/progress', // Removed - progress tracking through goals endpoint
  },
  
  // Frontend URLs
  FRONTEND: {
    BASE_URL: import.meta.env.VITE_FRONTEND_URL || 'http://localhost:3000',
    AUTH_CALLBACK: '/auth/callback',
  }
} as const;

// Google OAuth Configuration
export const GOOGLE_CONFIG = {
  CLIENT_ID: import.meta.env.VITE_GOOGLE_CLIENT_ID,
  REDIRECT_URI: import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  GUEST_MODE: true,
  GOOGLE_AUTH: true,
  AI_EXTRACTION: true,
} as const;

// Guest Mode Configuration
export const GUEST_MODE_CONFIG = {
  TRIAL_DURATION_MS: 24 * 60 * 60 * 1000, // 24 hours
  FEATURES: {
    EXTRACT_GOALS: true,
    SAVE_GOALS: false,
    TRACK_PROGRESS: false,
    MANAGE_GOALS: false,
  }
} as const;

// Validation
export const VALIDATION = {
  MIN_TEXT_LENGTH: 10,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 1000,
} as const;

// Helper function to build full API URLs
export const buildApiUrl = (endpoint: string): string => {
  return `${API_CONFIG.BASE_URL}${endpoint}`;
};

// Helper function to check if we're in development
export const isDev = (): boolean => isDevelopment;

// Helper function to check if we're in production
export const isProd = (): boolean => isProduction;
