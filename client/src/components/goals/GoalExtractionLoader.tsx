import React, { useState, useEffect } from 'react';
import { Brain, Sparkles, Target, Zap } from 'lucide-react';

interface GoalExtractionLoaderProps {
  isVisible: boolean;
  onComplete?: () => void;
}

const GoalExtractionLoader: React.FC<GoalExtractionLoaderProps> = ({ 
  isVisible, 
  onComplete 
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  const steps = [
    {
      title: "Analyzing Content",
      description: "Reading through your text to understand context",
      icon: Brain,
      color: "text-blue-600"
    },
    {
      title: "Identifying Goals",
      description: "Finding potential objectives and milestones",
      icon: Target,
      color: "text-green-600"
    },
    {
      title: "AI Processing",
      description: "Using Gemini AI to extract meaningful goals",
      icon: Sparkles,
      color: "text-purple-600"
    },
    {
      title: "Finalizing Results",
      description: "Preparing your personalized goal recommendations",
      icon: Zap,
      color: "text-orange-600"
    }
  ];

  useEffect(() => {
    if (!isVisible) {
      setCurrentStep(0);
      setProgress(0);
      return;
    }

    // Simulate progress through steps
    const progressInterval = 30; // Update progress every 30ms for smoother animation
    
    let stepTimer: NodeJS.Timeout;
    let progressTimer: NodeJS.Timeout;

    const startStep = (stepIndex: number) => {
      if (stepIndex >= steps.length) {
        onComplete?.();
        return;
      }

      setCurrentStep(stepIndex);
      setProgress(0);

      // Progress through current step
      progressTimer = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressTimer);
            // Move to next step with a shorter delay
            stepTimer = setTimeout(() => startStep(stepIndex + 1), 300);
            return 100;
          }
          return prev + 3; // Slightly faster progress for smoother feel
        });
      }, progressInterval);
    };

    startStep(0);

    return () => {
      clearTimeout(stepTimer);
      clearInterval(progressTimer);
    };
  }, [isVisible, onComplete]);

  if (!isVisible) return null;

  // Calculate overall progress percentage
  const overallProgress = Math.round(((currentStep + progress / 100) / steps.length) * 100);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full mx-4 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            AI Goal Extraction
          </h3>
          <p className="text-gray-600 text-sm">
            Our AI is analyzing your content to extract meaningful goals
          </p>
        </div>

        {/* Current Step */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              {steps[currentStep]?.title}
            </span>
            <span className="text-sm text-gray-500">
              {overallProgress}% Complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
          
          {/* Subtle Step Indicator */}
          <div className="flex justify-center mt-2">
            <div className="flex space-x-1">
              {steps.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index < currentStep 
                      ? 'bg-blue-500' 
                      : index === currentStep 
                        ? 'bg-purple-500' 
                        : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Step Details */}
        <div className="text-center mb-6">
          <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3 ${steps[currentStep]?.color}`}>
            {(() => {
              const IconComponent = steps[currentStep]?.icon;
              return IconComponent ? <IconComponent className="w-6 h-6" /> : null;
            })()}
          </div>
          <p className="text-sm text-gray-600">
            {steps[currentStep]?.description}
          </p>
        </div>

        {/* Fun Facts */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4 border border-blue-100">
          <div className="flex items-center space-x-2 mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-900">AI Insight</span>
          </div>
          <p className="text-xs text-blue-800">
            {currentStep === 0 && "Analyzing language patterns and context..."}
            {currentStep === 1 && "Identifying measurable objectives and timeframes..."}
            {currentStep === 2 && "Processing with Google's Gemini AI model..."}
            {currentStep === 3 && "Structuring goals for optimal tracking..."}
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center mt-6">
          <div className="flex space-x-1">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.1}s` }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GoalExtractionLoader;
