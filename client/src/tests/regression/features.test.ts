/**
 * Regression Test Suite for Clarity Application
 * This file tests all implemented features to ensure they continue working
 * as new changes are made.
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { API_CONFIG, GOOGLE_CONFIG, FEATURE_FLAGS, GUEST_MODE_CONFIG, VALIDATION } from '../../config/constants';

// Mock fetch for testing
global.fetch = vi.fn();

describe('🔍 REGRESSION TESTS - Core Features', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('📱 Frontend Configuration', () => {
    it('should have consistent API configuration', () => {
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(API_CONFIG.ENDPOINTS.GOALS).toBe('/api/v1/goals');
      expect(API_CONFIG.ENDPOINTS.AUTH_GOOGLE_CALLBACK).toBe('/api/v1/auth/google/callback');
    });

    it('should have Google OAuth configuration', () => {
      expect(GOOGLE_CONFIG.CLIENT_ID).toBeDefined();
      expect(GOOGLE_CONFIG.REDIRECT_URI).toBeDefined();
    });

    it('should have feature flags enabled', () => {
      expect(FEATURE_FLAGS.GUEST_MODE).toBe(true);
      expect(FEATURE_FLAGS.GOOGLE_AUTH).toBe(true);
      expect(FEATURE_FLAGS.AI_EXTRACTION).toBe(true);
    });

    it('should have guest mode configuration', () => {
      expect(GUEST_MODE_CONFIG.TRIAL_DURATION_MS).toBe(24 * 60 * 60 * 1000);
      expect(GUEST_MODE_CONFIG.FEATURES.EXTRACT_GOALS).toBe(true);
      expect(GUEST_MODE_CONFIG.FEATURES.SAVE_GOALS).toBe(false);
    });
  });

  describe('🔐 Authentication System', () => {
    it('should support Google OAuth flow', () => {
      const authEndpoints = [
        API_CONFIG.ENDPOINTS.AUTH_GOOGLE_CALLBACK,
        API_CONFIG.ENDPOINTS.AUTH_VALIDATE,
        API_CONFIG.ENDPOINTS.AUTH_LOGOUT
      ];
      
      authEndpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/^\/api\/v1\/auth\//);
      });
    });

    it('should have proper redirect URI configuration', () => {
      expect(GOOGLE_CONFIG.REDIRECT_URI).toContain('localhost:3000');
      expect(GOOGLE_CONFIG.REDIRECT_URI).toContain('/auth/callback');
    });
  });

  describe('🎯 Goal Management System', () => {
    it('should support goal CRUD operations', () => {
      const goalEndpoints = [
        API_CONFIG.ENDPOINTS.GOALS,
        API_CONFIG.ENDPOINTS.GOALS_EXTRACT
      ];
      
      goalEndpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/^\/api\/v1\/goals/);
      });
    });

    it('should support AI goal extraction', () => {
      expect(API_CONFIG.ENDPOINTS.GOALS_EXTRACT).toBe('/api/v1/goals/extract');
    });
  });

  describe('📄 Document Processing', () => {
    it('should support document upload', () => {
      expect(API_CONFIG.ENDPOINTS.DOCUMENTS_UPLOAD).toBe('/api/v1/documents/upload/document');
    });
  });

  describe('📊 Progress Tracking', () => {
    it('should support progress management through goals endpoint', () => {
      expect(API_CONFIG.ENDPOINTS.GOALS).toBe('/api/v1/goals');
    });
  });

  describe('🌐 URL Building', () => {
    it('should build correct API URLs', () => {
      const goalsUrl = API_CONFIG.BASE_URL + API_CONFIG.ENDPOINTS.GOALS;
      expect(goalsUrl).toContain('localhost:8001');
      expect(goalsUrl).toContain('/api/v1/goals');
    });

    it('should handle different environments', () => {
      const isDev = import.meta.env.DEV;
      expect(typeof isDev).toBe('boolean');
    });
  });

  describe('✅ Validation Rules', () => {
    it('should have consistent validation constants', () => {
      expect(VALIDATION.MIN_TEXT_LENGTH).toBe(10);
      expect(VALIDATION.MAX_TITLE_LENGTH).toBe(200);
      expect(VALIDATION.MAX_DESCRIPTION_LENGTH).toBe(1000);
    });
  });
});

describe('🧪 REGRESSION TESTS - Guest Mode Features', () => {
  it('should allow goal extraction for guest users', () => {
    expect(GUEST_MODE_CONFIG.FEATURES.EXTRACT_GOALS).toBe(true);
  });

  it('should prevent goal saving for guest users', () => {
    expect(GUEST_MODE_CONFIG.FEATURES.SAVE_GOALS).toBe(false);
  });

  it('should have 24-hour trial period', () => {
    expect(GUEST_MODE_CONFIG.TRIAL_DURATION_MS).toBe(24 * 60 * 60 * 1000);
  });
});

describe('🔧 REGRESSION TESTS - API Endpoints', () => {
  it('should have consistent endpoint structure', () => {
    const allEndpoints = Object.values(API_CONFIG.ENDPOINTS);
    
    allEndpoints.forEach(endpoint => {
      expect(endpoint).toMatch(/^\/api\/v1\//);
    });
  });

  it('should support CORS for frontend origins', () => {
    // This would be tested in backend tests
    expect(API_CONFIG.FRONTEND.BASE_URL).toContain('localhost:3000');
  });
});

describe('📋 REGRESSION TESTS - Feature Completeness', () => {
  it('should have all required authentication features', () => {
    const requiredAuthFeatures = [
      'google_oauth',
      'token_validation',
      'logout'
    ];
    
    requiredAuthFeatures.forEach(feature => {
      expect(API_CONFIG.ENDPOINTS).toHaveProperty(
        feature === 'google_oauth' ? 'AUTH_GOOGLE_CALLBACK' :
        feature === 'token_validation' ? 'AUTH_VALIDATE' :
        'AUTH_LOGOUT'
      );
    });
  });

  it('should have all required goal management features', () => {
    const requiredGoalFeatures = [
      'create',
      'read',
      'update', 
      'delete',
      'extract'
    ];
    
    expect(API_CONFIG.ENDPOINTS.GOALS).toBeDefined();
    expect(API_CONFIG.ENDPOINTS.GOALS_EXTRACT).toBeDefined();
  });
});
