import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Trophy, 
  Star, 
  Sparkles, 
  Zap, 
  Fire, 
  Crown,
  Heart,
  Rocket,
  Target,
  Award
} from 'lucide-react';

interface GoalCompletionCelebrationProps {
  isVisible: boolean;
  goalTitle: string;
  onClose: () => void;
}

const GoalCompletionCelebration: React.FC<GoalCompletionCelebrationProps> = ({
  isVisible,
  goalTitle,
  onClose
}) => {
  const [celebrationLevel, setCelebrationLevel] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showFireworks, setShowFireworks] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Start celebration sequence
      const timer1 = setTimeout(() => setCelebrationLevel(2), 1000);
      const timer2 = setTimeout(() => setCelebrationLevel(3), 2000);
      const timer3 = setTimeout(() => setShowConfetti(true), 500);
      const timer4 = setTimeout(() => setShowFireworks(true), 1500);
      const timer5 = setTimeout(() => {
        setShowConfetti(false);
        setShowFireworks(false);
        onClose();
      }, 5000);

      return () => {
        clearTimeout(timer1);
        clearTimeout(timer2);
        clearTimeout(timer3);
        clearTimeout(timer4);
        clearTimeout(timer5);
      };
    }
  }, [isVisible, onClose]);

  const getCelebrationContent = () => {
    switch (celebrationLevel) {
      case 1:
        return {
          icon: <Trophy className="w-16 h-16 text-yellow-500" />,
          title: 'Goal Completed! 🎉',
          subtitle: 'You did it!',
          message: `Congratulations on completing "${goalTitle}"!`,
          color: 'from-yellow-400 to-orange-500'
        };
      case 2:
        return {
          icon: <Crown className="w-16 h-16 text-purple-500" />,
          title: 'You\'re Amazing! 👑',
          subtitle: 'Keep the momentum going!',
          message: 'Every completed goal brings you closer to your dreams.',
          color: 'from-purple-400 to-pink-500'
        };
      case 3:
        return {
          icon: <Rocket className="w-16 h-16 text-blue-500" />,
          title: 'Unstoppable! 🚀',
          subtitle: 'Ready for the next challenge?',
          message: 'Your dedication is inspiring. What\'s your next goal?',
          color: 'from-blue-400 to-indigo-500'
        };
      default:
        return {
          icon: <Trophy className="w-16 h-16 text-yellow-500" />,
          title: 'Goal Completed! 🎉',
          subtitle: 'You did it!',
          message: `Congratulations on completing "${goalTitle}"!`,
          color: 'from-yellow-400 to-orange-500'
        };
    }
  };

  const content = getCelebrationContent();

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Confetti Background */}
        {showConfetti && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(50)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-yellow-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: -10,
                  rotate: 0
                }}
                animate={{
                  y: window.innerHeight + 10,
                  rotate: 360,
                  x: Math.random() * window.innerWidth
                }}
                transition={{
                  duration: Math.random() * 3 + 2,
                  ease: "linear",
                  repeat: Infinity
                }}
                style={{
                  left: Math.random() * window.innerWidth,
                  animationDelay: Math.random() * 2
                }}
              />
            ))}
          </div>
        )}

        {/* Fireworks */}
        {showFireworks && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(8)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{
                  scale: 0,
                  opacity: 1
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [1, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  ease: "easeOut"
                }}
                style={{
                  left: Math.random() * window.innerWidth,
                  top: Math.random() * window.innerHeight
                }}
              >
                <div className="w-4 h-4 bg-gradient-to-r from-yellow-400 to-red-500 rounded-full" />
              </motion.div>
            ))}
          </div>
        )}

        {/* Main Celebration Card */}
        <motion.div
          className="relative bg-white rounded-2xl p-8 max-w-md mx-4 text-center shadow-2xl"
          initial={{ scale: 0.5, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.5, y: 50 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30 
          }}
        >
          {/* Floating Icons */}
          <div className="absolute -top-4 -left-4">
            <motion.div
              animate={{ 
                rotate: [0, 360],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 3, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Star className="w-6 h-6 text-yellow-400" />
            </motion.div>
          </div>

          <div className="absolute -top-4 -right-4">
            <motion.div
              animate={{ 
                rotate: [360, 0],
                scale: [1, 1.2, 1]
              }}
              transition={{ 
                duration: 2.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Sparkles className="w-6 h-6 text-purple-400" />
            </motion.div>
          </div>

          <div className="absolute -bottom-4 -left-4">
            <motion.div
              animate={{ 
                y: [0, -10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 2, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Heart className="w-6 h-6 text-pink-400" />
            </motion.div>
          </div>

          <div className="absolute -bottom-4 -right-4">
            <motion.div
              animate={{ 
                y: [0, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 1.8, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <Zap className="w-6 h-6 text-blue-400" />
            </motion.div>
          </div>

          {/* Main Content */}
          <motion.div
            key={celebrationLevel}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="relative z-10"
          >
            {/* Icon */}
            <motion.div
              animate={{ 
                rotate: [0, -10, 10, 0],
                scale: [1, 1.1, 1]
              }}
              transition={{ 
                duration: 0.6,
                repeat: Infinity,
                repeatDelay: 2
              }}
              className="mb-6"
            >
              {content.icon}
            </motion.div>

            {/* Title */}
            <motion.h2
              className="text-3xl font-bold text-gray-900 mb-2"
              animate={{ 
                scale: [1, 1.05, 1],
                textShadow: [
                  "0 0 0px rgba(0,0,0,0)",
                  "0 0 20px rgba(255,215,0,0.5)",
                  "0 0 0px rgba(0,0,0,0)"
                ]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              {content.title}
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              className="text-lg font-medium text-gray-700 mb-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              {content.subtitle}
            </motion.p>

            {/* Message */}
            <motion.p
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              {content.message}
            </motion.p>

            {/* Progress Bar */}
            <motion.div
              className="w-full bg-gray-200 rounded-full h-3 mb-6 overflow-hidden"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              <motion.div
                className={`h-3 bg-gradient-to-r ${content.color} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ delay: 1, duration: 1.5 }}
              />
            </motion.div>

            {/* Action Button */}
            <motion.button
              onClick={onClose}
              className={`px-6 py-3 bg-gradient-to-r ${content.color} text-white font-medium rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Continue Journey 🚀
            </motion.button>
          </motion.div>

          {/* Background Glow */}
          <div className={`absolute inset-0 bg-gradient-to-r ${content.color} opacity-10 rounded-2xl blur-3xl -z-10`} />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default GoalCompletionCelebration;
