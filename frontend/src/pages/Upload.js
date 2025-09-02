import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Send,
  Sparkles
} from 'lucide-react';
import axios from 'axios';

const Upload = () => {
  const [processing, setProcessing] = useState(false);
  const [extractionResult, setExtractionResult] = useState(null);
  const [error, setError] = useState(null);
  const [text, setText] = useState('');
  const navigate = useNavigate();

  const handleExtractGoals = async () => {
    if (!text.trim()) {
      setError('Please enter some text to extract goals from.');
      return;
    }

    setProcessing(true);
    setError(null);
    setExtractionResult(null);

    try {
      const response = await axios.post('/goals/extract', {
        text: text.trim()
      });

      setExtractionResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Goal extraction failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCreateGoals = async () => {
    if (!extractionResult?.goals || extractionResult.goals.length === 0) {
      return;
    }

    setProcessing(true);
    try {
      // Create each goal using the extracted data
      const createdGoals = [];
      for (const goalData of extractionResult.goals) {
        const response = await axios.post('/goals', {
          title: goalData.title,
          description: goalData.description,
          metric_type: goalData.metric_type,
          target_progress: goalData.target_progress
        });
        createdGoals.push(response.data);
      }

      // Navigate to goals page to see the newly created goals
      navigate('/goals');
    } catch (err) {
      setError('Failed to create goals. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Extract Goals with AI
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Describe your goals in natural language and our AI will automatically extract 
            and structure them for you to track your progress.
          </p>
        </div>

        {/* Text Input Area */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-8">
            <div className="mb-6">
              <label htmlFor="goal-text" className="block text-sm font-medium text-gray-700 mb-2">
                Describe Your Goals
              </label>
              <textarea
                id="goal-text"
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Example: I need to read 12 books this year to expand my knowledge. I should also finish my certification exam by June to advance my career. Additionally, I want to run 100km to improve my fitness and prepare for a marathon..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                disabled={processing}
              />
            </div>

            <div className="flex justify-center">
              <button
                onClick={handleExtractGoals}
                disabled={processing || !text.trim()}
                className={`
                  flex items-center gap-2 px-8 py-3 rounded-xl font-medium text-white
                  transition-all duration-200
                  ${processing || !text.trim()
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-blue-600 hover:bg-blue-700 hover:scale-105'
                  }
                `}
              >
                {processing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Extract Goals with AI
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto mb-8"
          >
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
              <p className="text-red-800">{error}</p>
            </div>
          </motion.div>
        )}

        {/* Success Message */}
        {extractionResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Goals extracted successfully!
                </h3>
              </div>
              <p className="text-green-700 mb-4">
                We've extracted {extractionResult.goals?.length || 0} goals from your text.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleCreateGoals}
                  disabled={processing}
                  className="btn btn-primary"
                >
                  {processing ? 'Creating Goals...' : 'Create These Goals'}
                </button>
                <button
                  onClick={() => navigate('/goals')}
                  className="btn btn-secondary"
                >
                  View All Goals
                </button>
              </div>
            </div>

            {/* Extracted Goals */}
            {extractionResult.goals && extractionResult.goals.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Extracted Goals
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {extractionResult.goals.map((goal, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white rounded-xl shadow-md border border-slate-100 p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-900 line-clamp-2">
                          {goal.title}
                        </h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          goal.metric_type === 'Numeric'
                            ? 'bg-green-100 text-green-600'
                            : goal.metric_type === 'Checklist'
                            ? 'bg-purple-100 text-purple-600'
                            : 'bg-blue-100 text-blue-600'
                        }`}>
                          {goal.metric_type}
                        </span>
                      </div>
                      
                      {goal.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {goal.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span>Target: {goal.target_progress}</span>
                        <span className="capitalize">{goal.metric_type}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}

        {/* Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="max-w-4xl mx-auto mt-12"
        >
          <div className="bg-gray-50 rounded-2xl p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Tips for Better Goal Extraction
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">✅ Do:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Write clear, specific goals</li>
                  <li>• Include measurable targets (numbers, dates)</li>
                  <li>• Use action-oriented language</li>
                  <li>• Describe the purpose or benefit</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">❌ Avoid:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Vague or unclear objectives</li>
                  <li>• Too many goals in one description</li>
                  <li>• Goals without measurable outcomes</li>
                  <li>• Complex or ambiguous language</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Upload;
