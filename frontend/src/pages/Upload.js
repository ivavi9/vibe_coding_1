import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useDropzone } from 'react-dropzone';
import { useNavigate } from 'react-router-dom';
import { 
  Upload as UploadIcon, 
  FileText, 
  CheckCircle, 
  AlertCircle,
  Loader2
} from 'lucide-react';
import axios from 'axios';

const Upload = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const onDrop = useCallback(async (acceptedFiles) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setUploading(true);
    setError(null);
    setUploadResult(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post('/upload-document', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setUploadResult(response.data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt'],
    },
    maxFiles: 1,
    disabled: uploading,
  });

  const getFileIcon = (filename) => {
    const extension = filename.split('.').pop().toLowerCase();
    switch (extension) {
      case 'pdf':
        return '📄';
      case 'docx':
        return '📝';
      case 'txt':
        return '📄';
      default:
        return '📄';
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
            Upload Your Goals Document
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Upload a document containing your goals and we'll automatically extract them 
            for you to track your progress with beautiful visualizations.
          </p>
        </div>

        {/* Upload Area */}
        <div className="max-w-2xl mx-auto mb-8">
          <motion.div
            {...getRootProps()}
            className={`
              relative border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer
              transition-all duration-200
              ${isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${uploading ? 'pointer-events-none opacity-50' : ''}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <input {...getInputProps()} />
            
            {uploading ? (
              <div className="space-y-4">
                <Loader2 className="w-12 h-12 text-blue-600 animate-spin mx-auto" />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Processing your document...
                  </h3>
                  <p className="text-gray-600">
                    We're extracting your goals using AI. This may take a moment.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                  <UploadIcon className="w-8 h-8 text-blue-600" />
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {isDragActive ? 'Drop your file here' : 'Choose a file or drag it here'}
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Supports PDF, DOCX, and TXT files up to 10MB
                  </p>
                  
                  <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>PDF</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>DOCX</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <FileText className="w-4 h-4" />
                      <span>TXT</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
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
        {uploadResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-green-800">
                  Document processed successfully!
                </h3>
              </div>
              <p className="text-green-700 mb-4">
                We've extracted {uploadResult.goals?.length || 0} goals from your document.
              </p>
              <button
                onClick={() => navigate('/goals')}
                className="btn btn-primary"
              >
                View All Goals
              </button>
            </div>

            {/* Extracted Goals */}
            {uploadResult.goals && uploadResult.goals.length > 0 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 text-center">
                  Extracted Goals
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {uploadResult.goals.map((goal, index) => (
                    <motion.div
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="card p-6"
                    >
                      <div className="flex items-start justify-between mb-3">
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
                      
                      {goal.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-3">
                          {goal.description}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <span className="capitalize">{goal.category}</span>
                        {goal.target_date && (
                          <span>
                            Due {new Date(goal.target_date).toLocaleDateString()}
                          </span>
                        )}
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
                  <li>• Include target dates when possible</li>
                  <li>• Use action-oriented language</li>
                  <li>• Organize goals by category</li>
                </ul>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">❌ Avoid:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Vague or unclear objectives</li>
                  <li>• Too many goals in one document</li>
                  <li>• Goals without measurable outcomes</li>
                  <li>• Poorly formatted text</li>
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
