/**
 * Test setup file for Vitest
 * This file runs before all tests and sets up the testing environment
 */

import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables
vi.mock('import.meta.env', () => ({
  env: {
    DEV: true,
    PROD: false,
    VITE_API_URL: 'http://localhost:8001',
    VITE_FRONTEND_URL: 'http://localhost:3000',
    VITE_GOOGLE_CLIENT_ID: 'test-google-client-id',
    VITE_GOOGLE_REDIRECT_URI: 'http://localhost:3000/auth/callback'
  }
}))

// Mock fetch globally
global.fetch = vi.fn()

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
global.localStorage = localStorageMock

// Mock sessionStorage
const sessionStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
  length: 0,
  key: vi.fn()
}
global.sessionStorage = sessionStorageMock

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 100,
  height: 100,
  top: 0,
  left: 0,
  bottom: 100,
  right: 100,
  x: 0,
  y: 0,
  toJSON: () => {}
}))

// Mock console methods in tests to reduce noise
const originalConsoleError = console.error
const originalConsoleWarn = console.warn

beforeEach(() => {
  // Reset all mocks before each test
  vi.clearAllMocks()
  
  // Reset fetch mock
  if (global.fetch) {
    (global.fetch as any).mockReset()
  }
  
  // Reset localStorage mock
  localStorageMock.getItem.mockReset()
  localStorageMock.setItem.mockReset()
  localStorageMock.removeItem.mockReset()
  localStorageMock.clear.mockReset()
  
  // Reset sessionStorage mock
  sessionStorageMock.getItem.mockReset()
  sessionStorageMock.setItem.mockReset()
  sessionStorageMock.removeItem.mockReset()
  sessionStorageMock.clear.mockReset()
  
  // Suppress console errors and warnings in tests unless explicitly needed
  console.error = vi.fn()
  console.warn = vi.fn()
})

afterEach(() => {
  // Restore console methods
  console.error = originalConsoleError
  console.warn = originalConsoleWarn
})

// Global test utilities
export const mockApiResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
    headers: new Headers(),
  })
}

export const mockApiError = (status = 500, message = 'Internal Server Error') => {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ error: message }),
    text: () => Promise.resolve(message),
    headers: new Headers(),
  })
}

export const mockFetch = (responses: Array<{ data: any; status?: number }>) => {
  let callCount = 0
  return vi.fn().mockImplementation(() => {
    const response = responses[callCount] || responses[responses.length - 1]
    callCount++
    return mockApiResponse(response.data, response.status)
  })
}
