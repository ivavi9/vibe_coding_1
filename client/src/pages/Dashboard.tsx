import React, { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { useGoalContext } from '../contexts/GoalContext';
import { API_CONFIG, buildApiUrl } from '../config/constants';

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: string;
}

interface ProgressEntry {
  id: string;
  goal_id: string;
  description: string;
  progress_value: number;
  timestamp: number;
}

const Dashboard: React.FC = () => {
  const { goals, isLoading: goalsLoading } = useGoalContext();
  const [progressHistory, setProgressHistory] = useState<ProgressEntry[]>([]);
  const [progressInput, setProgressInput] = useState('');
  const [selectedGoalId, setSelectedGoalId] = useState('');
  const [progressValue, setProgressValue] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressHistory();
  }, []);

  // Goals are now managed by GoalContext

  const fetchProgressHistory = async () => {
    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PROGRESS));
      const data = await response.json();
      if (data.success) {
        setProgressHistory(data.data);
      }
    } catch (error) {
      console.error('Error fetching progress history:', error);
    } finally {
      setLoading(false);
    }
  };

  const trackProgress = async () => {
    if (!selectedGoalId || !progressInput.trim() || progressValue <= 0) return;

    try {
      const response = await fetch(buildApiUrl(API_CONFIG.ENDPOINTS.PROGRESS), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal_id: selectedGoalId,
          description: progressInput,
          progress_value: progressValue
        })
      });

      if (response.ok) {
        setProgressInput('');
        setProgressValue(1);
        setSelectedGoalId('');
        await fetchProgressHistory();
      }
    } catch (error) {
      console.error('Error tracking progress:', error);
    }
  };

  const getActiveGoalsCount = () => goals.filter(goal => goal.status === 'active').length;
  const getCompletedGoalsCount = () => goals.filter(goal => goal.current_progress >= goal.target_progress).length;
  const getProgressUpdatesCount = () => progressHistory.length;

  if (loading || goalsLoading) {
    return <div className="flex justify-center items-center h-64">Loading dashboard...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Goals</p>
              <p className="text-2xl font-bold text-gray-900">{getActiveGoalsCount()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Progress Updates</p>
              <p className="text-2xl font-bold text-gray-900">{getProgressUpdatesCount()}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-gray-900">{getCompletedGoalsCount()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Input */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Track Progress</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Goal</label>
            <select
              value={selectedGoalId}
              onChange={(e) => setSelectedGoalId(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">Choose a goal...</option>
              {goals.map((goal) => (
                <option key={goal.id} value={goal.id}>
                  {goal.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Progress Value</label>
            <input
              type="number"
              min="1"
              value={progressValue}
              onChange={(e) => setProgressValue(Number(e.target.value))}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <input
              type="text"
              value={progressInput}
              onChange={(e) => setProgressInput(e.target.value)}
              placeholder="What did you accomplish?"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <button
          onClick={trackProgress}
          disabled={!selectedGoalId || !progressInput.trim()}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          Track Progress
        </button>
      </div>

      {/* Recent Goals */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Goals</h2>
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No goals yet. Create your first goal!</p>
        ) : (
          <div className="space-y-4">
            {goals.slice(0, 5).map((goal) => (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium text-gray-900">{goal.title}</h3>
                  <span className="text-sm text-gray-500">{goal.metric_type}</span>
                </div>
                <p className="text-gray-600 text-sm mb-3">{goal.description}</p>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Progress</span>
                    <span className="text-gray-900">
                      {goal.current_progress} / {goal.target_progress}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((goal.current_progress / goal.target_progress) * 100, 100)}%`
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Progress Updates */}
      {progressHistory.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Progress Updates</h2>
          <div className="space-y-3">
            {progressHistory.slice(0, 5).map((entry) => {
              const goal = goals.find(g => g.id === entry.goal_id);
              return (
                <div key={entry.id} className="p-3 border border-gray-200 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-gray-900">
                        {goal ? goal.title : 'Unknown Goal'}
                      </p>
                      <p className="text-sm text-gray-600">{entry.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-blue-600">+{entry.progress_value}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.timestamp * 1000).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
