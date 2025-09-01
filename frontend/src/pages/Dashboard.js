import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, 
  TrendingUp, 
  Calendar, 
  CheckCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [goals, setGoals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalGoals: 0,
    completedGoals: 0,
    inProgress: 0,
    averageProgress: 0
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await axios.get('/goals');
      setGoals(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (goalsData) => {
    const total = goalsData.length;
    const completed = goalsData.filter(goal => {
      // This would need to be calculated based on progress entries
      return false; // Placeholder
    }).length;
    const inProgress = total - completed;
    const averageProgress = total > 0 ? 
      goalsData.reduce((sum, goal) => sum + (goal.currentProgress || 0), 0) / total : 0;

    setStats({
      totalGoals: total,
      completedGoals: completed,
      inProgress: inProgress,
      averageProgress: Math.round(averageProgress)
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back! 👋
          </h1>
          <p className="text-lg text-gray-600">
            Track your progress and achieve your goals with beautiful insights.
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={itemVariants}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Goals</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalGoals}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedGoals}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">In Progress</p>
                <p className="text-3xl font-bold text-orange-600">{stats.inProgress}</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </div>

          <div className="card p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Progress</p>
                <p className="text-3xl font-bold text-purple-600">{stats.averageProgress}%</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div variants={itemVariants} className="mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/upload"
              className="btn btn-primary btn-lg flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              Upload New Document
            </Link>
            <Link
              to="/goals"
              className="btn btn-secondary btn-lg flex items-center gap-3"
            >
              View All Goals
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </motion.div>

        {/* Recent Goals */}
        <motion.div variants={itemVariants}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Recent Goals</h2>
            <Link
              to="/goals"
              className="text-blue-600 hover:text-blue-700 font-medium flex items-center gap-2"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {goals.length === 0 ? (
            <div className="card p-12 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No goals yet
              </h3>
              <p className="text-gray-600 mb-6">
                Upload a document to extract your goals and start tracking your progress.
              </p>
              <Link
                to="/upload"
                className="btn btn-primary"
              >
                Upload Document
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {goals.slice(0, 6).map((goal, index) => (
                <motion.div
                  key={goal.id}
                  variants={itemVariants}
                  whileHover={{ y: -4 }}
                  className="card p-6 cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 line-clamp-2">
                      {goal.title}
                    </h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      goal.priority === 'high' 
                        ? 'bg-red-100 text-red-600'
                        : goal.priority === 'medium'
                        ? 'bg-yellow-100 text-yellow-600'
                        : 'bg-green-100 text-green-600'
                    }`}>
                      {goal.priority}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {goal.description}
                  </p>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-medium text-gray-900">0%</span>
                    </div>
                    <div className="progress">
                      <div className="progress-bar" style={{ width: '0%' }}></div>
                    </div>
                  </div>
                  
                  {goal.target_date && (
                    <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>
                        Due {new Date(goal.target_date).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
