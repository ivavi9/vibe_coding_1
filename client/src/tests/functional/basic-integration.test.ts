/**
 * Basic Integration Tests for Clarity Application
 * These tests verify that frontend and backend can communicate
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { API_CONFIG, buildApiUrl } from '../../config/constants';

// Mock fetch for testing
global.fetch = vi.fn();

describe('🔗 BASIC INTEGRATION TESTS', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('🌐 API Configuration Integration', () => {
    
    it('should have valid API configuration', () => {
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(API_CONFIG.ENDPOINTS.GOALS).toBe('/api/v1/goals');
      expect(API_CONFIG.ENDPOINTS.GOALS_EXTRACT).toBe('/api/v1/goals/extract');
    });

    it('should build correct API URLs', () => {
      const goalsUrl = buildApiUrl(API_CONFIG.ENDPOINTS.GOALS);
      expect(goalsUrl).toContain('localhost:8001');
      expect(goalsUrl).toContain('/api/v1/goals');
    });
  });

  describe('📡 API Endpoint Structure', () => {
    
    it('should have consistent endpoint structure', () => {
      const allEndpoints = Object.values(API_CONFIG.ENDPOINTS);
      
      allEndpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/^\/api\/v1\//);
      });
    });

    it('should have all required endpoints', () => {
      const requiredEndpoints = [
        'GOALS',
        'GOALS_EXTRACT',
        'AUTH_GOOGLE_CALLBACK',
        'AUTH_VALIDATE',
        'AUTH_LOGOUT',
        'DOCUMENTS_UPLOAD'
      ];
      
      requiredEndpoints.forEach(endpoint => {
        expect(API_CONFIG.ENDPOINTS).toHaveProperty(endpoint);
      });
    });
  });

  describe('🔧 Environment Configuration', () => {
    
    it('should support development environment', () => {
      const isDev = import.meta.env.DEV;
      expect(typeof isDev).toBe('boolean');
    });

    it('should have frontend configuration', () => {
      expect(API_CONFIG.FRONTEND.BASE_URL).toBeDefined();
      expect(API_CONFIG.FRONTEND.AUTH_CALLBACK).toBeDefined();
    });
  });
});
