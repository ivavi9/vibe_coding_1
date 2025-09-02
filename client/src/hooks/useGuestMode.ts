import { useState, useEffect } from 'react'

interface GuestModeState {
  isGuest: boolean
  canExtractGoals: boolean
  extractionCount: number
  maxExtractions: number
}

export function useGuestMode() {
  const [guestState, setGuestState] = useState<GuestModeState>({
    isGuest: true,
    canExtractGoals: true,
    extractionCount: 0,
    maxExtractions: 1
  })

  useEffect(() => {
    // Check if user has already extracted goals in this session
    const storedCount = localStorage.getItem('guest_extraction_count')
    const count = storedCount ? parseInt(storedCount, 10) : 0
    
    setGuestState(prev => ({
      ...prev,
      extractionCount: count,
      canExtractGoals: count < prev.maxExtractions
    }))
  }, [])

  const incrementExtractionCount = () => {
    const newCount = guestState.extractionCount + 1
    localStorage.setItem('guest_extraction_count', newCount.toString())
    
    setGuestState(prev => ({
      ...prev,
      extractionCount: newCount,
      canExtractGoals: newCount < prev.maxExtractions
    }))
  }

  const resetGuestMode = () => {
    localStorage.removeItem('guest_extraction_count')
    setGuestState(prev => ({
      ...prev,
      extractionCount: 0,
      canExtractGoals: true
    }))
  }

  return {
    ...guestState,
    incrementExtractionCount,
    resetGuestMode
  }
}
