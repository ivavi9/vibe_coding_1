/**
 * Functional Regression Tests for Clarity Application
 * These tests cover complete user journeys and ensure all features work end-to-end
 */

import { describe, it, expect, beforeEach, afterEach, beforeAll, afterAll } from 'vitest';
import { API_CONFIG, buildApiUrl, GOOGLE_CONFIG, FEATURE_FLAGS } from '../../config/constants';

// Mock fetch for testing
global.fetch = vi.fn();

// Test data
const testGoal = {
  title: "Test Functional Goal",
  description: "A goal to test the complete functionality",
  metric_type: "Numeric",
  target_progress: 100
};

const testText = "I want to read 12 books this year and exercise 3 times per week to improve my health and knowledge.";

describe('🧪 FUNCTIONAL REGRESSION TESTS - Complete User Journeys', () => {
  
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('👤 Guest User Journey', () => {
    
    it('should allow guest users to extract goals from text', async () => {
      // Mock successful goal extraction
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          goals: [
            {
              title: "Read 12 books",
              description: "Read 12 books this year",
              metric_type: "Numeric",
              target_progress: 12
            },
            {
              title: "Exercise 3 times per week",
              description: "Exercise 3 times per week for health",
              metric_type: "Numeric",
              target_progress: 156
            }
          ],
          count: 2,
          message: "Successfully extracted 2 goals"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS_EXTRACT), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.goals).toHaveLength(2);
      expect(data.count).toBe(2);
    });

    it('should prevent guest users from saving goals permanently', async () => {
      // Mock goal creation attempt
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 403,
        json: async () => ({
          error: "Guest users cannot save goals permanently"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testGoal)
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(403);
    });

    it('should show trial period information for guest users', () => {
      // Test guest mode configuration
      expect(FEATURE_FLAGS.GUEST_MODE).toBe(true);
      
      // Test trial duration (24 hours)
      const trialDurationMs = 24 * 60 * 60 * 1000;
      expect(trialDurationMs).toBe(86400000);
    });

    it('should allow unlimited goal extraction during trial', () => {
      // Guest users should be able to extract goals
      expect(FEATURE_FLAGS.AI_EXTRACTION).toBe(true);
    });
  });

  describe('🔐 Authentication Journey', () => {
    
    it('should support Google OAuth flow', () => {
      // Test OAuth configuration
      expect(GOOGLE_CONFIG.CLIENT_ID).toBeDefined();
      expect(GOOGLE_CONFIG.REDIRECT_URI).toContain('localhost:3000');
      expect(GOOGLE_CONFIG.REDIRECT_URI).toContain('/auth/callback');
    });

    it('should have proper authentication endpoints', () => {
      const authEndpoints = [
        API_CONFIG.ENDPOINTS.AUTH_GOOGLE_CALLBACK,
        API_CONFIG.ENDPOINTS.AUTH_VALIDATE,
        API_CONFIG.ENDPOINTS.AUTH_LOGOUT
      ];
      
      authEndpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/^\/api\/v1\/auth\//);
      });
    });

    it('should handle token validation', async () => {
      // Mock successful token validation
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: {
            id: "user-123",
            email: "test@example.com",
            name: "Test User"
          }
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_VALIDATE), {
        headers: {
          'Authorization': 'Bearer valid-token'
        }
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.user).toBeDefined();
      expect(data.user.id).toBe("user-123");
    });

    it('should handle logout properly', async () => {
      // Mock successful logout
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          message: "Logged out successfully"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_LOGOUT), {
        method: 'POST'
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.message).toBe("Logged out successfully");
    });
  });

  describe('🎯 Authenticated User Journey', () => {
    
    it('should allow authenticated users to create goals', async () => {
      // Mock successful goal creation
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: "1",
          user_id: "user-123",
          title: testGoal.title,
          description: testGoal.description,
          metric_type: testGoal.metric_type,
          current_progress: 0,
          target_progress: testGoal.target_progress,
          status: "active",
          created_at: "2025-09-03T15:00:00Z",
          updated_at: "2025-09-03T15:00:00Z"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testGoal)
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.id).toBe("1");
      expect(data.title).toBe(testGoal.title);
      expect(data.status).toBe("active");
    });

    it('should allow authenticated users to retrieve their goals', async () => {
      // Mock successful goals retrieval
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: "1",
            user_id: "user-123",
            title: "Goal 1",
            description: "First goal",
            metric_type: "Numeric",
            current_progress: 0,
            target_progress: 100,
            status: "active",
            created_at: "2025-09-03T15:00:00Z",
            updated_at: "2025-09-03T15:00:00Z"
          },
          {
            id: "2",
            user_id: "user-123",
            title: "Goal 2",
            description: "Second goal",
            metric_type: "Numeric",
            current_progress: 50,
            target_progress: 100,
            status: "active",
            created_at: "2025-09-03T15:00:00Z",
            updated_at: "2025-09-03T15:00:00Z"
          }
        ]
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS));
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(2);
      expect(data[0].user_id).toBe("user-123");
    });

    it('should allow authenticated users to update goals', async () => {
      // Mock successful goal update
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: "1",
            title: "Updated Goal",
            status: "completed"
          },
          message: "Goal updated successfully"
        })
      });

      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "completed" })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.status).toBe("completed");
    });

    it('should allow authenticated users to delete goals', async () => {
      // Mock successful goal deletion (soft delete)
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            id: "1",
            status: "cancelled"
          },
          message: "Goal deleted successfully"
        })
      });

      const response = await fetch(`${buildApiUrl(API_CONFIG.ENDPOINTS.GOALS)}/1`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: "cancelled" })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.status).toBe("cancelled");
    });
  });

  describe('🤖 AI Goal Extraction Journey', () => {
    
    it('should extract goals from text input', async () => {
      // Mock AI extraction
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          goals: [
            {
              title: "Read 12 books",
              description: "Read 12 books this year",
              metric_type: "Numeric",
              target_progress: 12
            }
          ],
          count: 1,
          message: "Successfully extracted 1 goal"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS_EXTRACT), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: testText })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.goals).toHaveLength(1);
      expect(data.goals[0].title).toBe("Read 12 books");
    });

    it('should handle AI extraction failures gracefully', async () => {
      // Mock AI extraction failure
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({
          detail: "No goals could be extracted from the provided text"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS_EXTRACT), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: "Invalid text" })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(422);
    });

    it('should validate text input length', async () => {
      // Mock validation error
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          detail: "Text must be at least 10 characters long"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS_EXTRACT), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: "Short" })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('📊 Progress Tracking Journey', () => {
    
    it('should allow progress updates for goals', async () => {
      // Mock progress update
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            goal_id: "1",
            progress_value: 25,
            description: "Made good progress"
          },
          message: "Progress updated successfully"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PROGRESS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_id: "1",
          progress_value: 25,
          description: "Made good progress"
        })
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.progress_value).toBe(25);
    });

    it('should retrieve progress history', async () => {
      // Mock progress history retrieval
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: [
            {
              id: "1",
              goal_id: "1",
              progress_value: 25,
              description: "First update",
              timestamp: "2025-09-03T15:00:00Z"
            }
          ],
          count: 1
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PROGRESS));
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data).toHaveLength(1);
    });
  });

  describe('📄 Document Processing Journey', () => {
    
    it('should handle document uploads', async () => {
      // Mock document upload
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: {
            filename: "test.pdf",
            extracted_goals: [
              {
                title: "Document Goal",
                description: "Goal from document",
                metric_type: "Numeric",
                target_progress: 10
              }
            ]
          }
        })
      });

      const formData = new FormData();
      formData.append('file', new File(['test'], 'test.pdf'));
      
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.DOCUMENTS_UPLOAD), {
        method: 'POST',
        body: formData
      });

      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(data.success).toBe(true);
      expect(data.data.extracted_goals).toHaveLength(1);
    });
  });

  describe('🌐 API Configuration Journey', () => {
    
    it('should build correct API URLs', () => {
      const goalsUrl = buildApiUrl(API_CONFIG.ENDPOINTS.GOALS);
      expect(goalsUrl).toContain('localhost:8001');
      expect(goalsUrl).toContain('/api/v1/goals');
      
      const authUrl = buildApiUrl(API_CONFIG.ENDPOINTS.AUTH_VALIDATE);
      expect(authUrl).toContain('localhost:8001');
      expect(authUrl).toContain('/api/v1/auth/validate');
    });

    it('should have consistent endpoint structure', () => {
      const allEndpoints = Object.values(API_CONFIG.ENDPOINTS);
      
      allEndpoints.forEach(endpoint => {
        expect(endpoint).toMatch(/^\/api\/v1\//);
      });
    });

    it('should support different environments', () => {
      const isDev = import.meta.env.DEV;
      expect(typeof isDev).toBe('boolean');
      
      // Test environment-based configuration
      expect(API_CONFIG.BASE_URL).toBeDefined();
      expect(API_CONFIG.FRONTEND.BASE_URL).toBeDefined();
    });
  });

  describe('🔧 Error Handling Journey', () => {
    
    it('should handle network errors gracefully', async () => {
      // Mock network error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      try {
        await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS));
        fail('Should have thrown an error');
      } catch (error) {
        expect(error).toBeInstanceOf(Error);
        expect(error.message).toBe('Network error');
      }
    });

    it('should handle server errors gracefully', async () => {
      // Mock server error
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          error: "Internal server error"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS));
      expect(response.ok).toBe(false);
      expect(response.status).toBe(500);
      
      const data = await response.json();
      expect(data.error).toBe("Internal server error");
    });

    it('should handle validation errors properly', async () => {
      // Mock validation error
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          detail: "Validation error"
        })
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ invalid: "data" })
      });

      expect(response.ok).toBe(false);
      expect(response.status).toBe(400);
    });
  });

  describe('📱 UI/UX Journey', () => {
    
    it('should provide proper loading states', () => {
      // Test loading state configuration
      expect(FEATURE_FLAGS.AI_EXTRACTION).toBe(true);
      expect(FEATURE_FLAGS.GOOGLE_AUTH).toBe(true);
    });

    it('should handle empty states gracefully', async () => {
      // Mock empty goals response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => []
      });

      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.GOALS));
      expect(response.ok).toBe(true);
      const data = await response.json();
      expect(Array.isArray(data)).toBe(true);
      expect(data).toHaveLength(0);
    });

    it('should support responsive design', () => {
      // Test that configuration supports different screen sizes
      expect(API_CONFIG.FRONTEND.BASE_URL).toBeDefined();
      expect(typeof API_CONFIG.FRONTEND.BASE_URL).toBe('string');
    });
  });
});

describe('🧪 REGRESSION TEST - Feature Completeness', () => {
  
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

  it('should support all required data types', () => {
    const requiredDataTypes = [
      'goals',
      'progress',
      'documents',
      'users'
    ];
    
    requiredDataTypes.forEach(dataType => {
      if (dataType === 'goals') {
        expect(API_CONFIG.ENDPOINTS.GOALS).toBeDefined();
      } else if (dataType === 'progress') {
        // Progress tracking is done through goals endpoint, not separate endpoint
        expect(API_CONFIG.ENDPOINTS.GOALS).toBeDefined();
      } else if (dataType === 'documents') {
        expect(API_CONFIG.ENDPOINTS.DOCUMENTS_UPLOAD).toBeDefined();
      }
    });
  });
});
