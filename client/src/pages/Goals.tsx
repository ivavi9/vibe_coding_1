import React, { useState, useEffect } from 'react';
import {
  GoalExtractionForm,
  ExtractedGoalsList,
  GoalManagement
} from '../components/goals';
// AuthenticationBanners removed - now using global AuthenticationBanner
import { useGoalExtraction } from '../components/goals/GoalExtractionManager';
import { useGoalContext } from '../contexts/GoalContext';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/ui/ToastContainer';
import GoalExtractionLoader from '../components/goals/GoalExtractionLoader';

const Goals: React.FC = () => {
  const { toasts, removeToast } = useToast();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Custom hooks for goal management
  const goalState = useGoalContext();
  const goalExtraction = useGoalExtraction();

  // Show loading state during authentication
  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state during goal extraction
  if (goalExtraction.isExtracting) {
    return (
      <GoalExtractionLoader
        isVisible={goalExtraction.isExtracting}
        onComplete={() => {}}
        shouldComplete={goalExtraction.shouldCompleteLoader}
      />
    );
  }

  return (
    <>
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Authentication is now handled globally via AuthenticationBanner */}

        {/* Goal Extraction Form */}
        <GoalExtractionForm
          onTextExtract={goalExtraction.handleTextExtract}
          onFileExtract={goalExtraction.handleFileExtract}
          isLoading={goalExtraction.isExtracting}
          shouldComplete={goalExtraction.shouldCompleteLoader}
          disabled={false}
        />

        {/* Extracted Goals List */}
        {goalExtraction.showExtractedGoals && (
          <div ref={goalExtraction.extractedGoalsRef} className="transition-all duration-500 ease-out">
            <ExtractedGoalsList
              goals={goalExtraction.extractedGoals}
              onEditGoal={goalExtraction.handleEditGoal}
              onCreateGoal={goalExtraction.handleCreateGoal}
              isLoading={goalExtraction.isExtracting}
              addedGoals={goalExtraction.addedGoals}
            />
          </div>
        )}

        {/* Goal Management (for authenticated users) */}
        {isAuthenticated && (
          <GoalManagement
            goals={goalState.goals}
            onDeleteGoal={goalState.deleteGoal}
            onCompleteGoal={goalState.completeGoal}
            onRecoverGoal={goalState.reactivateGoal}
          />
        )}
      </div>

      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </>
  );
};

export default Goals;
