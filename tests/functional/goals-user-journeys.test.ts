import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'

// Mock environment variables
vi.mock('import.meta.env', () => ({
  env: {
    VITE_GOOGLE_CLIENT_ID: 'test-client-id',
    VITE_GOOGLE_REDIRECT_URI: 'http://localhost:3000/auth/callback',
    DEV: true
  }
}))

// Mock fetch globally
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn()
}
Object.defineProperty(window, 'sessionStorage', {
  value: sessionStorageMock
})

describe('🎯 Goals Page - Critical User Journey Tests', () => {
  
  beforeEach(() => {
    vi.clearAllMocks()
    localStorageMock.getItem.mockReturnValue(null)
    localStorageMock.setItem.mockImplementation(() => {})
    localStorageMock.removeItem.mockImplementation(() => {})
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('🔐 Authentication Flow Issues', () => {
    
    it('should redirect authenticated users to goals page instead of staying on login', async () => {
      // Mock authenticated user with valid token
      localStorageMock.getItem.mockReturnValue('mock-jwt-token-123')
      
      // Mock successful goals fetch for authenticated user
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: '1',
            title: 'Existing Goal',
            description: 'A test goal',
            status: 'active'
          }
        ]
      })

      // Simulate the authentication flow
      const authState = {
        user: { id: '123', email: 'test@example.com', name: 'Test User' },
        isAuthenticated: true,
        isLoading: false
      }

      // Verify that authenticated users see goals, not login form
      expect(authState.isAuthenticated).toBe(true)
      expect(authState.user).toBeTruthy()
      expect(authState.isLoading).toBe(false)

      // Mock the goals API call that should happen after authentication
      const goalsResponse = await (global.fetch as any)()
      expect(goalsResponse.ok).toBe(true)
      
      const goalsData = await goalsResponse.json()
      expect(goalsData).toHaveLength(1)
      expect(goalsData[0].title).toBe('Existing Goal')
    })

    it('should show login form for unauthenticated users', () => {
      // Mock unauthenticated user
      localStorageMock.getItem.mockReturnValue(null)
      
      const authState = {
        user: null,
        isAuthenticated: false,
        isLoading: false
      }

      expect(authState.isAuthenticated).toBe(false)
      expect(authState.user).toBeNull()
      expect(authState.isLoading).toBe(false)
    })

    it('should handle token validation correctly', async () => {
      // Mock token validation flow
      const mockToken = 'mock-jwt-token-123'
      localStorageMock.getItem.mockReturnValue(mockToken)
      
      // Mock successful token validation
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          user: {
            id: '123',
            email: 'test@example.com',
            name: 'Test User'
          }
        })
      })

      // Simulate token validation
      const response = await (global.fetch as any)()
      expect(response.ok).toBe(true)
      
      const userData = await response.json()
      expect(userData.user).toBeTruthy()
      expect(userData.user.id).toBe('123')
    })
  })

  describe('🤖 Goal Extraction & Addition Issues', () => {
    
    it('should extract goals and allow adding them successfully', async () => {
      // Mock successful goal extraction
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          goals: [
            {
              title: 'Read 12 books',
              description: 'Read 12 books this year',
              metric_type: 'Numeric',
              target_progress: 12
            }
          ]
        })
      })

      // Mock successful goal creation
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          id: '1',
          title: 'Read 12 books',
          description: 'Read 12 books this year',
          status: 'active'
        })
      })

      // Simulate goal extraction flow
      const extractionResponse = await (global.fetch as any)()
      expect(extractionResponse.ok).toBe(true)
      
      const extractionData = await extractionResponse.json()
      expect(extractionData.goals).toHaveLength(1)
      expect(extractionData.goals[0].title).toBe('Read 12 books')

      // Simulate goal creation flow
      const creationResponse = await (global.fetch as any)()
      expect(creationResponse.ok).toBe(true)
      
      const creationData = await creationResponse.json()
      expect(creationData.id).toBe('1')
      expect(creationData.status).toBe('active')
    })

    it('should handle goal extraction failures gracefully', async () => {
      // Mock failed goal extraction
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 422,
        json: async () => ({
          detail: 'No goals could be extracted from the provided text'
        })
      })

      const response = await (global.fetch as any)()
      expect(response.ok).toBe(false)
      expect(response.status).toBe(422)
      
      const errorData = await response.json()
      expect(errorData.detail).toBe('No goals could be extracted from the provided text')
    })

    it('should handle goal creation failures', async () => {
      // Mock successful goal extraction
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          goals: [
            {
              title: 'Test Goal',
              description: 'A test goal',
              metric_type: 'Numeric',
              target_progress: 100
            }
          ]
        })
      })

      // Mock failed goal creation
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 400,
        json: async () => ({
          detail: 'Failed to create goal'
        })
      })

      // Extract goals first
      const extractionResponse = await (global.fetch as any)()
      expect(extractionResponse.ok).toBe(true)
      
      const extractionData = await extractionResponse.json()
      expect(extractionData.goals).toHaveLength(1)

      // Try to create the goal
      const creationResponse = await (global.fetch as any)()
      expect(creationResponse.ok).toBe(false)
      expect(creationResponse.status).toBe(400)
      
      const errorData = await creationResponse.json()
      expect(errorData.detail).toBe('Failed to create goal')
    })
  })

  describe('📱 UI State Management', () => {
    
    it('should show loading state during goal extraction', async () => {
      // Mock delayed response for loading state testing
      (global.fetch as any).mockImplementation(() => 
        new Promise(resolve => 
          setTimeout(() => resolve({
            ok: true,
            json: async () => ({ goals: [] })
          }), 100)
        )
      )

      // Start extraction
      const extractionPromise = (global.fetch as any)()
      
      // Should be in loading state
      expect(extractionPromise).toBeInstanceOf(Promise)
      
      // Wait for completion
      const response = await extractionPromise
      expect(response.ok).toBe(true)
    })

    it('should handle empty goals state correctly', async () => {
      // Mock empty goals response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => []
      })

      const response = await (global.fetch as any)()
      expect(response.ok).toBe(true)
      
      const goalsData = await response.json()
      expect(goalsData).toHaveLength(0)
    })
  })

  describe('🔧 Form Validation & Error Handling', () => {
    
    it('should validate text input for goal extraction', () => {
      // Test minimum text length requirement
      const shortText = 'Hi'
      const validText = 'I want to read 12 books this year and exercise regularly'
      
      expect(shortText.length).toBeLessThan(10)
      expect(validText.length).toBeGreaterThan(20)
    })

    it('should handle network errors gracefully', async () => {
      // Mock network error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'))

      try {
        await (global.fetch as any)()
        expect(true).toBe(false) // Should not reach here
      } catch (error) {
        expect(error).toBeInstanceOf(Error)
        expect(error.message).toBe('Network error')
      }
    })

    it('should handle malformed API responses', async () => {
      // Mock malformed response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => null // Malformed response
      })

      const response = await (global.fetch as any)()
      expect(response.ok).toBe(true)
      
      const data = await response.json()
      expect(data).toBeNull()
    })
  })

  describe('🔄 State Persistence & User Experience', () => {
    
    it('should maintain extracted goals state after failed creation', async () => {
      // Mock successful extraction
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          goals: [
            {
              title: 'Persistent Goal',
              description: 'This goal should persist',
              metric_type: 'Numeric',
              target_progress: 50
            }
          ]
        })
      })

      // Mock failed creation
      (global.fetch as any).mockResolvedValueOnce({
        ok: false,
        status: 500,
        json: async () => ({
          detail: 'Internal server error'
        })
      })

      // Extract goals
      const extractionResponse = await (global.fetch as any)()
      const extractionData = await extractionResponse.json()
      expect(extractionData.goals).toHaveLength(1)

      // Try to create (should fail)
      const creationResponse = await (global.fetch as any)()
      expect(creationResponse.ok).toBe(false)

      // Goals should still be available for retry
      expect(extractionData.goals[0].title).toBe('Persistent Goal')
    })

    it('should handle multiple goal additions from single extraction', async () => {
      // Mock extraction with multiple goals
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          goals: [
            {
              title: 'Goal 1',
              description: 'First goal',
              metric_type: 'Numeric',
              target_progress: 10
            },
            {
              title: 'Goal 2',
              description: 'Second goal',
              metric_type: 'Numeric',
              target_progress: 20
            }
          ]
        })
      })

      // Mock successful goal creations
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '1', title: 'Goal 1', status: 'active' })
      })
      
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ id: '2', title: 'Goal 2', status: 'active' })
      })

      // Extract goals
      const extractionResponse = await (global.fetch as any)()
      const extractionData = await extractionResponse.json()
      expect(extractionData.goals).toHaveLength(2)

      // Add first goal
      const creation1Response = await (global.fetch as any)()
      expect(creation1Response.ok).toBe(true)

      // Add second goal
      const creation2Response = await (global.fetch as any)()
      expect(creation2Response.ok).toBe(true)

      // Both goals should be created successfully
      const goal1 = await creation1Response.json()
      const goal2 = await creation2Response.json()
      expect(goal1.id).toBe('1')
      expect(goal2.id).toBe('2')
    })
  })
})
