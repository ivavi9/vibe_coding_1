import { useState, useEffect } from 'react'

interface GuestModeState {
  isGuest: boolean
  canExtractGoals: boolean
  canSaveGoals: boolean
  canTrackProgress: boolean
  canManageGoals: boolean
  trialStartTime: number | null
  trialDuration: number // 24 hours in milliseconds
}

export function useGuestMode() {
  const [guestState, setGuestState] = useState<GuestModeState>({
    isGuest: true,
    canExtractGoals: true, // Unlimited extractions
    canSaveGoals: false,   // Cannot save permanently
    canTrackProgress: false, // Cannot track progress
    canManageGoals: false,   // Cannot manage goals
    trialStartTime: null,
    trialDuration: 24 * 60 * 60 * 1000 // 24 hours
  })

  useEffect(() => {
    // Check if user has already started a trial session
    const storedTrialStart = localStorage.getItem('guest_trial_start')
    const trialStart = storedTrialStart ? parseInt(storedTrialStart, 10) : null
    
    if (!trialStart) {
      // Start new trial
      const now = Date.now()
      localStorage.setItem('guest_trial_start', now.toString())
      setGuestState(prev => ({
        ...prev,
        trialStartTime: now
      }))
    } else {
      // Check if trial is still valid
      const now = Date.now()
      const trialEndTime = trialStart + guestState.trialDuration
      const isTrialExpired = now > trialEndTime
      
      if (isTrialExpired) {
        // Trial expired, reset to basic guest mode
        localStorage.removeItem('guest_trial_start')
        setGuestState(prev => ({
          ...prev,
          trialStartTime: null,
          canSaveGoals: false,
          canTrackProgress: false,
          canManageGoals: false
        }))
      } else {
        // Trial still active
        setGuestState(prev => ({
          ...prev,
          trialStartTime: trialStart,
          canSaveGoals: true,
          canTrackProgress: true,
          canManageGoals: true
        }))
      }
    }
  }, [])

  const getTrialTimeRemaining = () => {
    if (!guestState.trialStartTime) return 0
    
    const now = Date.now()
    const trialEndTime = guestState.trialStartTime + guestState.trialDuration
    const remaining = trialEndTime - now
    
    return Math.max(0, remaining)
  }

  const getTrialTimeRemainingFormatted = () => {
    const remaining = getTrialTimeRemaining()
    if (remaining === 0) return 'Expired'
    
    const hours = Math.floor(remaining / (1000 * 60 * 60))
    const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60))
    
    if (hours > 0) {
      return `${hours}h ${minutes}m remaining`
    }
    return `${minutes}m remaining`
  }

  const resetGuestMode = () => {
    localStorage.removeItem('guest_trial_start')
    setGuestState(prev => ({
      ...prev,
      trialStartTime: null,
      canSaveGoals: false,
      canTrackProgress: false,
      canManageGoals: false
    }))
  }

  return {
    ...guestState,
    getTrialTimeRemaining,
    getTrialTimeRemainingFormatted,
    resetGuestMode
  }
}
