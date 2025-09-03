import React, { useEffect, useState } from 'react';
import { CheckCircle, Sparkles, Trophy } from 'lucide-react';

interface GoalCompletionCelebrationProps {
  isVisible: boolean;
  goalTitle: string;
  onComplete: () => void;
}

const GoalCompletionCelebration: React.FC<GoalCompletionCelebrationProps> = ({
  isVisible,
  goalTitle,
  onComplete
}) => {
  const [animationPhase, setAnimationPhase] = useState<'idle' | 'entering' | 'celebrating' | 'exiting'>('idle');

  useEffect(() => {
    if (isVisible) {
      setAnimationPhase('entering');
      
      // Celebration sequence
      const timer = setTimeout(() => setAnimationPhase('celebrating'), 100);
      const exitTimer = setTimeout(() => {
        setAnimationPhase('exiting');
        setTimeout(() => {
          setAnimationPhase('idle');
          onComplete();
        }, 500);
      }, 2000);

      return () => {
        clearTimeout(timer);
        clearTimeout(exitTimer);
      };
    }
  }, [isVisible, onComplete]);

  if (!isVisible || animationPhase === 'idle') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-500 ${
          animationPhase === 'entering' ? 'opacity-0' : 
          animationPhase === 'celebrating' ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {/* Celebration Card */}
      <div 
        className={`relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20 
          transform transition-all duration-500 ease-out ${
            animationPhase === 'entering' ? 'scale-75 opacity-0 translate-y-8' : 
            animationPhase === 'celebrating' ? 'scale-100 opacity-100 translate-y-0' : 
            'scale-110 opacity-0 translate-y-4'
          }`}
      >
        {/* Floating Sparkles */}
        <div className="absolute -top-4 -left-4 animate-bounce">
          <Sparkles className="w-6 h-6 text-yellow-400" />
        </div>
        <div className="absolute -top-2 -right-2 animate-bounce" style={{ animationDelay: '0.2s' }}>
          <Sparkles className="w-5 h-5 text-blue-400" />
        </div>
        <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 animate-bounce" style={{ animationDelay: '0.4s' }}>
          <Sparkles className="w-4 h-4 text-purple-400" />
        </div>

        {/* Main Content */}
        <div className="text-center space-y-4">
          {/* Trophy Icon */}
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full blur-lg opacity-30 animate-pulse" />
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto relative z-10" />
          </div>

          {/* Congratulations Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Congratulations!
            </h2>
            <p className="text-gray-600 text-lg">
              You've completed your goal
            </p>
            <p className="text-gray-800 font-semibold text-xl">
              "{goalTitle}"
            </p>
          </div>

          {/* Success Checkmark */}
          <div className="flex justify-center">
            <div className="bg-green-100 rounded-full p-3">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
          </div>

          {/* Subtle Message */}
          <p className="text-gray-500 text-sm">
            Keep up the amazing work! 🎉
          </p>
        </div>
      </div>
    </div>
  );
};

export default GoalCompletionCelebration;
