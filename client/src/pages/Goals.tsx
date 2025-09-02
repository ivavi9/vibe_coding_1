import React, { useState, useEffect } from 'react';
import { Upload, FileText, X } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  metric_type: string;
  current_progress: number;
  target_progress: number;
  status: string;
}

const Goals: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [extractedGoals, setExtractedGoals] = useState<any[]>([]);
  const [showExtractedGoals, setShowExtractedGoals] = useState(false);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals');
      const data = await response.json();
      if (data.success) {
        setGoals(data.data);
      }
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const extractGoalsFromText = async () => {
    if (!textInput.trim()) return;
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: textInput })
      });
      
      const data = await response.json();
      if (data.success) {
        setExtractedGoals(data.goals);
        setShowExtractedGoals(true);
        setTextInput('');
      } else {
        alert('No goals extracted. Please try different text.');
      }
    } catch (error) {
      console.error('Error extracting goals:', error);
      alert('Failed to extract goals. Please try again.');
    }
  };

  const uploadDocument = async () => {
    if (!selectedFile) return;
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('description', '');
    
    try {
      const response = await fetch('http://localhost:8000/api/v1/documents/upload/document', {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      if (data.success) {
        setExtractedGoals(data.extracted_goals);
        setShowExtractedGoals(true);
        setSelectedFile(null);
      } else {
        alert('No goals extracted from document. Please try a different file.');
      }
    } catch (error) {
      console.error('Error uploading document:', error);
      alert('Failed to upload document. Please try again.');
    }
  };

  const createGoal = async (goalData: any) => {
    try {
      const response = await fetch('http://localhost:8000/api/v1/goals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: goalData.title,
          description: goalData.description,
          metric_type: goalData.metric_type,
          target_progress: goalData.target_progress,
          current_progress: 0
        })
      });
      
      if (response.ok) {
        fetchGoals();
        setExtractedGoals([]);
        setShowExtractedGoals(false);
      }
    } catch (error) {
      console.error('Error creating goal:', error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    if (!confirm('Are you sure you want to delete this goal?')) return;
    
    try {
      const response = await fetch(`http://localhost:8000/api/v1/goals/${goalId}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        fetchGoals();
      }
    } catch (error) {
      console.error('Error deleting goal:', error);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading goals...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8">
      {/* Goal Input Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Goal</h2>
        
        {/* Text Input */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Describe your goal
          </label>
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe what you want to achieve..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
          />
          <button
            onClick={extractGoalsFromText}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Extract Goals
          </button>
        </div>

        {/* File Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Or upload a document
          </label>
          <div className="flex items-center space-x-3">
            <input
              type="file"
              accept=".pdf,.docx,.txt"
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
            />
            <label
              htmlFor="file-upload"
              className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
            >
              <Upload className="w-4 h-4 mr-2" />
              Choose File
            </label>
            {selectedFile && (
              <div className="flex items-center space-x-2">
                <FileText className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{selectedFile.name}</span>
                <button
                  onClick={removeFile}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
          {selectedFile && (
            <button
              onClick={uploadDocument}
              className="mt-3 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Extract Goals from Document
            </button>
          )}
        </div>
      </div>

      {/* Extracted Goals */}
      {showExtractedGoals && extractedGoals.length > 0 && (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Extracted Goals</h3>
          <div className="space-y-4">
            {extractedGoals.map((goal, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900">{goal.title}</h4>
                <p className="text-gray-600 text-sm mt-1">{goal.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-500">
                    {goal.metric_type} • Target: {goal.target_progress}
                  </span>
                  <button
                    onClick={() => createGoal(goal)}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                  >
                    Add Goal
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Goals */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Goals</h2>
        
        {goals.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No goals yet. Create your first goal above!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {goals.map((goal) => (
              <div key={goal.id} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-900">{goal.title}</h3>
                  <button
                    onClick={() => deleteGoal(goal.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    <X className="w-4 h-4" />
                  </button>
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
                
                <div className="mt-3 text-xs text-gray-500">
                  {goal.metric_type} • {goal.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Goals;
