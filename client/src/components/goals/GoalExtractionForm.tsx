import React, { useState } from 'react';
import { FileText, X } from 'lucide-react';

interface GoalExtractionFormProps {
  onTextExtract: (text: string) => void;
  onFileExtract: (file: File) => void;
}

const GoalExtractionForm: React.FC<GoalExtractionFormProps> = ({ onTextExtract, onFileExtract }) => {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleTextExtract = () => {
    if (textInput.trim()) {
      onTextExtract(textInput);
      setTextInput('');
    }
  };

  const handleFileExtract = () => {
    if (selectedFile) {
      onFileExtract(selectedFile);
      setSelectedFile(null);
    }
  };

  const removeFile = () => {
    setSelectedFile(null);
  };

  return (
    <div className="space-y-6">
      {/* Text Input for Goal Extraction */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Extract Goals from Text</h2>
        <div className="space-y-4">
          <textarea
            value={textInput}
            onChange={(e) => setTextInput(e.target.value)}
            placeholder="Describe your goals, training plan, or what you want to achieve..."
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
          <button
            onClick={handleTextExtract}
            disabled={!textInput.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Extract Goals
          </button>
        </div>
      </div>

      {/* File Upload for Goal Extraction */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Extract Goals from Document</h2>
        <div className="space-y-4">
          <input
            type="file"
            accept=".pdf,.docx,.txt"
            onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {selectedFile && (
            <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded-lg">
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
          {selectedFile && (
            <button
              onClick={handleFileExtract}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Extract Goals from Document
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GoalExtractionForm;
