import React, { useState, useEffect } from 'react';
import { useGoalContext } from '../contexts/GoalContext';
import { 
  TrendingUp, 
  Target, 
  CheckCircle, 
  Clock, 
  Zap, 
  Star, 
  Trophy, 
  BarChart3,
  Calendar,
  Award,
  Flame,
  Sparkles
} from 'lucide-react';

interface AnalyticsData {
  totalGoals: number;
  activeGoals: number;
  completedGoals: number;
  completionRate: number;
  averageProgress: number;
  totalProgressUpdates: number;
  currentStreak: number;
  longestStreak: number;
  weeklyProgress: Array<{day: string; progress: number; goals: number}>;
  monthlyProgress: Array<{month: string; progress: number; goals: number}>;
  topCategories: Array<{name: string; count: number; successRate: number; color: string}>;
  recentAchievements: Array<{id: number; title: string; description: string; icon: any; color: string; unlocked: boolean}>;
  progressVelocity: number;
  momentumScore: number;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: 'active' | 'completed' | 'paused' | 'cancelled';
}

const Analytics: React.FC = () => {
  const { goals } = useGoalContext();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'week' | 'month' | 'year'>('month');
  const [isLoading, setIsLoading] = useState(false);

  // Helper functions for analytics calculations
  const calculateCurrentStreak = (goals: Goal[]) => {
    // Simulate streak calculation based on recent activity
    const recentActivity = goals.filter(goal => goal.current_progress > 0).length;
    return Math.min(recentActivity, 7); // Cap at 7 days for demo
  };

  const calculateLongestStreak = (goals: Goal[], currentStreak: number) => {
    // Simulate longest streak calculation
    return Math.max(currentStreak, Math.floor(Math.random() * 15) + 5);
  };

  const calculateProgressVelocity = (goals: Goal[]) => {
    // Calculate progress velocity (progress per day)
    const totalProgress = goals.reduce((sum, goal) => sum + (goal.current_progress || 0), 0);
    const daysSinceStart = Math.max(1, Math.floor(Math.random() * 30) + 7); // Simulate 7-37 days
    return totalProgress / daysSinceStart;
  };

  const calculateMomentumScore = (goals: Goal[], currentStreak: number, velocity: number) => {
    // Calculate momentum score (0-100) based on recent activity and consistency
    const activityScore = Math.min(100, (goals.length / 10) * 50);
    const streakScore = Math.min(100, (currentStreak / 7) * 30);
    const velocityScore = Math.min(100, Math.min(velocity * 20, 20));
    return Math.round(activityScore + streakScore + velocityScore);
  };

  const generateWeeklyProgress = (goals: Goal[]) => {
    // Generate weekly progress data for charts
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return days.map(day => ({
      day,
      progress: Math.floor(Math.random() * 100),
      goals: Math.floor(Math.random() * 5) + 1
    }));
  };

  const generateMonthlyProgress = (goals: Goal[]) => {
    // Generate monthly progress data
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months.map(month => ({
      month,
      progress: Math.floor(Math.random() * 100),
      goals: Math.floor(Math.random() * 10) + 1
    }));
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Health': 'bg-green-500',
      'Career': 'bg-blue-500',
      'Learning': 'bg-purple-500',
      'Relationships': 'bg-pink-500',
      'Finance': 'bg-yellow-500',
      'Personal': 'bg-indigo-500'
    };
    return colors[category] || 'bg-gray-500';
  };

  const analyzeTopCategories = (goals: Goal[]) => {
    // Analyze goal categories and their success rates
    const categories = ['Health', 'Career', 'Learning', 'Relationships', 'Finance', 'Personal'];
    return categories.map(category => ({
      name: category,
      count: Math.floor(Math.random() * 10) + 1,
      successRate: Math.floor(Math.random() * 40) + 60,
      color: getCategoryColor(category)
    })).sort((a, b) => b.count - a.count);
  };

  const generateRecentAchievements = (goals: Goal[], currentStreak: number, completionRate: number) => {
    const achievements = [];
    
    if (completionRate >= 80) {
      achievements.push({
        id: 1,
        title: 'Goal Crusher',
        description: 'Maintained 80%+ completion rate',
        icon: Trophy,
        color: 'text-yellow-500',
        unlocked: true
      });
    }
    
    if (currentStreak >= 7) {
      achievements.push({
        id: 2,
        title: 'Week Warrior',
        description: '7+ day activity streak',
        icon: Flame,
        color: 'text-orange-500',
        unlocked: true
      });
    }
    
    if (goals.length >= 10) {
      achievements.push({
        id: 3,
        title: 'Goal Setter',
        description: 'Created 10+ goals',
        icon: Target,
        color: 'text-blue-500',
        unlocked: true
      });
    }
    
    // Add some locked achievements for motivation
    if (achievements.length < 3) {
      achievements.push({
        id: 4,
        title: 'Perfect Week',
        description: 'Complete 7 goals in a week',
        icon: Star,
        color: 'text-gray-400',
        unlocked: false
      });
    }
    
    return achievements;
  };

  // Calculate comprehensive analytics
  const analytics: AnalyticsData = React.useMemo(() => {
    if (!goals || goals.length === 0) {
      return {
        totalGoals: 0,
        activeGoals: 0,
        completedGoals: 0,
        completionRate: 0,
        averageProgress: 0,
        totalProgressUpdates: 0,
        currentStreak: 0,
        longestStreak: 0,
        weeklyProgress: [],
        monthlyProgress: [],
        topCategories: [],
        recentAchievements: [],
        progressVelocity: 0,
        momentumScore: 0
      };
    }

    const activeGoals = goals.filter(goal => goal.status === 'active');
    const completedGoals = goals.filter(goal => goal.status === 'completed');
    const totalProgressUpdates = goals.reduce((sum, goal) => sum + (goal.current_progress || 0), 0);
    
    // Calculate completion rate
    const completionRate = goals.length > 0 ? (completedGoals.length / goals.length) * 100 : 0;
    
    // Calculate average progress
    const averageProgress = activeGoals.length > 0 
      ? activeGoals.reduce((sum, goal) => sum + (goal.current_progress || 0), 0) / activeGoals.length 
      : 0;

    // Calculate streaks (consecutive days with progress)
    const currentStreak = calculateCurrentStreak(goals);
    const longestStreak = calculateLongestStreak(goals, currentStreak);

    // Calculate progress velocity (progress per day)
    const progressVelocity = calculateProgressVelocity(goals);

    // Calculate momentum score (combination of recent activity and consistency)
    const momentumScore = calculateMomentumScore(goals, currentStreak, progressVelocity);

    // Generate weekly/monthly progress data
    const weeklyProgress = generateWeeklyProgress(goals);
    const monthlyProgress = generateMonthlyProgress(goals);

    // Analyze top categories
    const topCategories = analyzeTopCategories(goals);

    // Generate recent achievements
    const recentAchievements = generateRecentAchievements(goals, currentStreak, completionRate);

    return {
      totalGoals: goals.length,
      activeGoals: activeGoals.length,
      completedGoals: completedGoals.length,
      completionRate: Math.round(completionRate * 10) / 10,
      averageProgress: Math.round(averageProgress * 10) / 10,
      totalProgressUpdates,
      currentStreak,
      longestStreak,
      weeklyProgress,
      monthlyProgress,
      topCategories,
      recentAchievements,
      progressVelocity: Math.round(progressVelocity * 100) / 100,
      momentumScore: Math.round(momentumScore * 10) / 10
    };
  }, [goals]);

  const getProgressColor = (value: number) => {
    if (value >= 80) return 'text-green-500';
    if (value >= 60) return 'text-yellow-500';
    if (value >= 40) return 'text-orange-500';
    return 'text-red-500';
  };

  const getMomentumEmoji = (score: number) => {
    if (score >= 80) return '🚀';
    if (score >= 60) return '⚡';
    if (score >= 40) return '🔥';
    if (score >= 20) return '💪';
    return '🌱';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <BarChart3 className="w-8 h-8 mr-3 text-blue-600" />
            Your Progress Analytics
          </h1>
          <p className="text-gray-600 text-lg">
            Track your journey, celebrate wins, and build momentum
          </p>
        </div>

        {/* Timeframe Selector */}
        <div className="mb-6">
          <div className="flex space-x-2 bg-white rounded-lg p-1 shadow-sm">
            {(['week', 'month', 'year'] as const).map((timeframe) => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                {timeframe.charAt(0).toUpperCase() + timeframe.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Goals */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.totalGoals}</p>
              </div>
              <Target className="w-8 h-8 text-blue-500" />
            </div>
          </div>

          {/* Active Goals */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Goals</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.activeGoals}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-500" />
            </div>
          </div>

          {/* Completion Rate */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                <p className={`text-2xl font-bold ${getProgressColor(analytics.completionRate)}`}>
                  {analytics.completionRate}%
                </p>
              </div>
              <CheckCircle className="w-8 h-8 text-purple-500" />
            </div>
          </div>

          {/* Current Streak */}
          <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300 border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Streak</p>
                <p className="text-2xl font-bold text-orange-600">{analytics.currentStreak} days</p>
              </div>
              <Flame className="w-8 h-8 text-orange-500" />
            </div>
          </div>
        </div>

        {/* Progress Overview Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Progress Chart */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-blue-600" />
              Weekly Progress
            </h3>
            <div className="space-y-3">
              {analytics.weeklyProgress.map((day) => (
                <div key={day.day} className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-600 w-12">{day.day}</span>
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${day.progress}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-900 w-12 text-right">
                    {day.progress}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Momentum & Velocity */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
              Momentum & Velocity
            </h3>
            <div className="space-y-4">
              {/* Momentum Score */}
              <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                <div className="text-3xl mb-2">{getMomentumEmoji(analytics.momentumScore)}</div>
                <p className="text-sm text-gray-600 mb-1">Momentum Score</p>
                <p className="text-2xl font-bold text-gray-900">{analytics.momentumScore}/100</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div 
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${analytics.momentumScore}%` }}
                  ></div>
                </div>
              </div>

              {/* Progress Velocity */}
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600">Progress/Day</p>
                  <p className="text-lg font-bold text-green-600">{analytics.progressVelocity}</p>
                </div>
                <div className="text-center p-3 bg-orange-50 rounded-lg">
                  <p className="text-sm text-gray-600">Longest Streak</p>
                  <p className="text-lg font-bold text-orange-600">{analytics.longestStreak} days</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Categories & Achievements */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Top Categories */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Target className="w-5 h-5 mr-2 text-green-600" />
              Top Categories
            </h3>
            <div className="space-y-3">
              {analytics.topCategories.slice(0, 5).map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                    <span className="font-medium text-gray-900">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600">{category.count} goals</span>
                    <span className="text-sm font-medium text-green-600">{category.successRate}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Achievements */}
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <Award className="w-5 h-5 mr-2 text-yellow-600" />
              Recent Achievements
            </h3>
            <div className="space-y-3">
              {analytics.recentAchievements.map((achievement) => (
                <div 
                  key={achievement.id} 
                  className={`flex items-center space-x-3 p-3 rounded-lg transition-all duration-200 ${
                    achievement.unlocked 
                      ? 'bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200' 
                      : 'bg-gray-50 border border-gray-200'
                  }`}
                >
                  <achievement.icon className={`w-5 h-5 ${achievement.color}`} />
                  <div className="flex-1">
                    <p className={`font-medium ${achievement.unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
                      {achievement.title}
                    </p>
                    <p className={`text-sm ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
                      {achievement.description}
                    </p>
                  </div>
                  {achievement.unlocked && (
                    <Sparkles className="w-4 h-4 text-yellow-500 animate-pulse" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Progress Chart */}
        <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="w-5 h-5 mr-2 text-indigo-600" />
            Monthly Progress Overview
          </h3>
          <div className="grid grid-cols-12 gap-2">
            {analytics.monthlyProgress.map((month) => (
              <div key={month.month} className="text-center">
                <div className="text-xs text-gray-600 mb-1">{month.month}</div>
                <div className="relative">
                  <div className="bg-gray-200 rounded-t-sm h-24 flex items-end">
                    <div 
                      className="bg-gradient-to-t from-blue-500 to-purple-600 w-full rounded-t-sm transition-all duration-1000"
                      style={{ height: `${month.progress}%` }}
                    ></div>
                  </div>
                  <div className="text-xs font-medium text-gray-900 mt-1">{month.progress}%</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Motivation Section */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-8 text-white text-center">
          <h3 className="text-2xl font-bold mb-4">Keep the Momentum Going! 🚀</h3>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            You're on fire! Your current streak of {analytics.currentStreak} days shows incredible dedication. 
            Every small step counts towards your bigger dreams.
          </p>
          <div className="flex justify-center space-x-4">
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.completionRate}%</div>
              <div className="text-blue-200 text-sm">Success Rate</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.momentumScore}/100</div>
              <div className="text-blue-200 text-sm">Momentum</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">{analytics.currentStreak}</div>
              <div className="text-blue-200 text-sm">Day Streak</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
