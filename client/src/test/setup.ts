/**
 * Test setup file for Vitest
 * This file runs before all tests and sets up the testing environment
 */

import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock environment variables
vi.mock('import.meta.env', () => ({
  env: {
    VITE_API_URL: 'http://localhost:8001',
    VITE_FRONTEND_URL: 'http://localhost:3000',
    VITE_GOOGLE_CLIENT_ID: 'test-client-id',
    VITE_GOOGLE_REDIRECT_URI: 'http://localhost:3000/auth/callback',
    DEV: true,
    PROD: false
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

// Mock Element.prototype.scrollIntoView
Element.prototype.scrollIntoView = vi.fn()

// Mock Element.prototype.getBoundingClientRect
Element.prototype.getBoundingClientRect = vi.fn(() => ({
  width: 120,
  height: 120,
  top: 0,
  left: 0,
  bottom: 0,
  right: 0,
  x: 0,
  y: 0,
  toJSON: () => {}
}))

// Mock console methods to reduce noise in tests
const originalConsole = { ...console }
console.log = vi.fn()
console.warn = vi.fn()
console.error = vi.fn()

// Global test utilities
declare global {
  var mockApiResponse: (data: any, status?: number) => Promise<Response>
  var mockApiError: (status: number, message: string) => Promise<Response>
}

global.mockApiResponse = (data: any, status = 200) => {
  return Promise.resolve({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(data),
    text: () => Promise.resolve(JSON.stringify(data)),
  } as Response)
}

global.mockApiError = (status: number, message: string) => {
  return Promise.resolve({
    ok: false,
    status,
    json: () => Promise.resolve({ detail: message }),
    text: () => Promise.resolve(message),
  } as Response)
}
