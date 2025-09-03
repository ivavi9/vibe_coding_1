import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface User {
  id: string
  email: string
  name: string
  picture?: string
  created_at: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  loginWithGoogle: () => Promise<void>
  logout: () => void
  isGoogleLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Google OAuth configuration
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id'
const GOOGLE_REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URI || 'http://localhost:3000/auth/callback'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isGoogleLoading, setIsGoogleLoading] = useState(false)

  useEffect(() => {
    // Check for existing auth token
    const token = localStorage.getItem('auth_token')
    console.log('Checking for existing auth token:', token ? 'Found' : 'Not found');
    if (token) {
      // Validate token with backend
      console.log('Validating existing token...');
      validateToken(token)
    } else {
      console.log('No token found, setting loading to false');
      setIsLoading(false)
    }
  }, [])

  const validateToken = async (token: string) => {
    try {
      // TESTING: Handle mock tokens for development
      if (token.startsWith('mock-jwt-token-')) {
        // Mock token validation - always valid in development
        console.log('Validating mock token...');
        const mockUser = {
          id: 'test-user-123',
          email: 'sonali@example.com',
          name: 'Sonali',
          picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          created_at: new Date().toISOString()
        };
        setUser(mockUser);
        setIsLoading(false);
        return;
      }

      // Real token validation with backend (when implemented)
      console.log('Validating real token with backend...');
      const response = await fetch('http://localhost:8000/api/v1/auth/validate', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      
      if (response.ok) {
        const userData = await response.json()
        setUser(userData.user)
      } else {
        // Token invalid, remove it
        localStorage.removeItem('auth_token')
      }
    } catch (error) {
      console.error('Token validation failed:', error)
      // Only remove token if it's not a mock token
      if (!token.startsWith('mock-jwt-token-')) {
        localStorage.removeItem('auth_token')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const loginWithGoogle = async () => {
    setIsGoogleLoading(true);
    try {
      // TESTING: Mock authentication for development
      if (import.meta.env.DEV && false) { // Set to false to test real OAuth
        // Simulate Google OAuth delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock user data
        const mockUser = {
          id: 'test-user-123',
          email: 'sonali@example.com',
          name: 'Sonali',
          picture: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
          created_at: new Date().toISOString()
        };
        
        // Mock token
        const mockToken = 'mock-jwt-token-' + Date.now();
        
        // Store mock data
        localStorage.setItem('auth_token', mockToken);
        setUser(mockUser);
        setIsGoogleLoading(false);
        return;
      }
      
      // Generate Google OAuth URL
      const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
        `client_id=${GOOGLE_CLIENT_ID}&` +
        `redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}&` +
        `response_type=code&` +
        `scope=${encodeURIComponent('openid email profile')}&` +
        `access_type=offline&` +
        `prompt=consent`

      // Store state for security
      const state = Math.random().toString(36).substring(7)
      localStorage.setItem('google_oauth_state', state)
      
      // Add state to URL
      const authUrl = `${googleAuthUrl}&state=${state}`
      
      // Open Google OAuth popup
      const popup = window.open(
        authUrl,
        'google-oauth',
        'width=500,height=600,scrollbars=yes,resizable=yes'
      )

      // Listen for OAuth callback
      const handleMessage = async (event: MessageEvent) => {
        if (event.origin !== window.location.origin) return
        
        if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
          const { code, state: returnedState } = event.data
          
          // Verify state for security
          const storedState = localStorage.getItem('google_oauth_state')
          if (returnedState !== storedState) {
            throw new Error('OAuth state mismatch')
          }
          
          // Exchange code for token
          await exchangeCodeForToken(code)
          
          // Clean up
          localStorage.removeItem('google_oauth_state')
          popup?.close()
          window.removeEventListener('message', handleMessage)
        }
      }

      window.addEventListener('message', handleMessage)

      // Fallback: check for URL changes (for mobile/redirect flow)
      const checkUrl = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkUrl)
          window.removeEventListener('message', handleMessage)
          setIsGoogleLoading(false)
        }
      }, 1000)

    } catch (error) {
      console.error('Google login failed:', error)
      setIsGoogleLoading(false)
    }
  }

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/auth/google/callback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      })

      if (response.ok) {
        const data = await response.json()
        const { access_token, user: userData } = data
        
        // Store token
        localStorage.setItem('auth_token', access_token)
        
        // Set user
        setUser(userData)
      } else {
        throw new Error('Failed to exchange code for token')
      }
    } catch (error) {
      console.error('Token exchange failed:', error)
      throw error
    } finally {
      setIsGoogleLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call backend logout endpoint
      const token = localStorage.getItem('auth_token')
      if (token) {
        await fetch('http://localhost:8000/api/v1/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
      }
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      // Clear local state
      setUser(null)
      localStorage.removeItem('auth_token')
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    loginWithGoogle,
    logout,
    isGoogleLoading
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
