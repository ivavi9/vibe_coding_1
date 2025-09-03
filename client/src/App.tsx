import React, { useState, useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Goals from './pages/Goals'
import { Analytics } from './pages/Analytics'
import Auth from './pages/Auth'
import GoogleAuthCallback from './pages/GoogleAuthCallback'
import { Layout } from './components/Layout'
import { AuthProvider } from './hooks/useAuth'
import { GoalProvider } from './contexts/GoalContext'
import { Toaster } from './components/ui/Toaster'
import GoalCompletionCelebration from './components/goals/GoalCompletionCelebration'
import AuthenticationBanner from './components/ui/AuthenticationBanner'

function App() {
  const [celebrationState, setCelebrationState] = useState({
    isVisible: false,
    goalTitle: ''
  });

  useEffect(() => {
    const handleGoalCompleted = (event: CustomEvent) => {
      setCelebrationState({
        isVisible: true,
        goalTitle: event.detail.goalTitle
      });
    };

    window.addEventListener('goalCompleted', handleGoalCompleted as EventListener);
    return () => window.removeEventListener('goalCompleted', handleGoalCompleted as EventListener);
  }, []);

  return (
    <AuthProvider>
      <GoalProvider>
      <Routes>
        {/* Public routes */}
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/callback" element={<GoogleAuthCallback />} />
        
        {/* App routes - accessible to all users */}
        <Route
          path="/"
          element={
            <Layout>
              <Dashboard />
            </Layout>
          }
        />
        <Route
          path="/goals"
          element={
            <Layout>
              <Goals />
            </Layout>
          }
        />
        <Route
          path="/analytics"
          element={
            <Layout>
              <Analytics />
            </Layout>
          }
        />
      </Routes>
      <Toaster />
      <GoalCompletionCelebration
        isVisible={celebrationState.isVisible}
        goalTitle={celebrationState.goalTitle}
        onComplete={() => setCelebrationState({ isVisible: false, goalTitle: '' })}
      />
      <AuthenticationBanner />
      </GoalProvider>
    </AuthProvider>
  )
}

export default App
