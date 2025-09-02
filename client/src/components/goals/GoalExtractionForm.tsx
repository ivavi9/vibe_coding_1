import React, { useState, useRef } from 'react';
import { FileText, X, Upload, ArrowDown, Sparkles } from 'lucide-react';
import GoalExtractionLoader from './GoalExtractionLoader';
import LoadingSpinner from '../ui/LoadingSpinner';

interface GoalExtractionFormProps {
  onTextExtract: (text: string) => void;
  onFileExtract: (file: File) => void;
  isLoading?: boolean;
  shouldComplete?: boolean;
}

const GoalExtractionForm: React.FC<GoalExtractionFormProps> = ({
  onTextExtract,
  onFileExtract,
  isLoading = false,
  shouldComplete = false
}) => {
  const [textInput, setTextInput] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showTextSection, setShowTextSection] = useState(false);
  const textSectionRef = useRef<HTMLDivElement>(null);

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

  const scrollToTextSection = () => {
    setShowTextSection(true);
    setTimeout(() => {
      if (textSectionRef.current) {
        textSectionRef.current.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    }, 100);
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Turn Your Ideas Into Action
          </h2>
          <p className="text-gray-600 max-w-md mx-auto mb-6">
            Clarity transforms your thoughts into clear, trackable goals that actually get done.
          </p>

          {/* Dream Button */}
          <button
            onClick={scrollToTextSection}
            className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg text-lg font-medium"
          >
            ✨ Dream
          </button>
        </div>

        {/* Text Input Section - Initially Hidden */}
        {showTextSection && (
          <div ref={textSectionRef} className="mb-8 animate-in slide-in-from-top-4 duration-500">
            <div className="text-center mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Start with Text</h3>
              <p className="text-sm text-gray-500">Just type what's on your mind - we'll figure out the rest</p>
            </div>

            <div className="max-w-2xl mx-auto">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="I want to read 12 books this year, run a marathon, and learn to play guitar..."
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-center text-lg"
                rows={4}
                disabled={isLoading}
              />

              <div className="mt-4 flex justify-center">
                <button
                  onClick={handleTextExtract}
                  disabled={!textInput.trim() || isLoading}
                  className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 flex items-center space-x-2 shadow-lg"
                >
                  {isLoading ? (
                    <>
                      <LoadingSpinner size="sm" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5" />
                      <span>Make It Happen</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Flow Divider - Only show when text section is visible */}
        {showTextSection && (
          <>
            <div className="flex items-center justify-center mb-8">
              <div className="w-px h-16 bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>
            </div>

            <div className="text-center mb-4">
              <ArrowDown className="w-6 h-6 text-gray-400 mx-auto" />
              <p className="text-sm text-gray-500 mt-2">Or share your captured dreams</p>
            </div>
          </>
        )}

        {/* File Upload Section - Only show when text section is visible */}
        {showTextSection && (
          <div className="max-w-2xl mx-auto animate-in slide-in-from-bottom-4 duration-500 delay-200">
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />

              <div className="mb-4">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Upload Your Ideas</h3>
                <p className="text-sm text-gray-500 mb-4">
                  Drop your dreams captured anywhere - notes, plans, or documents. Clarity will find the goals hidden within.
                </p>
              </div>

              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload"
                disabled={isLoading}
              />

              <label
                htmlFor="file-upload"
                className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 cursor-pointer transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText className="w-5 h-5 mr-2" />
                Choose File
              </label>

              {selectedFile && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-blue-600" />
                      <div className="text-left">
                        <p className="text-sm font-medium text-blue-900">{selectedFile.name}</p>
                        <p className="text-xs text-blue-600">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={removeFile}
                      className="text-blue-500 hover:text-blue-700 transition-colors p-1"
                      disabled={isLoading}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleFileExtract}
                      className="w-full px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all duration-200 transform hover:scale-105 flex items-center justify-center space-x-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <LoadingSpinner size="sm" />
                          <span>Processing Document...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Discover Hidden Goals</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Loading Overlay */}
      <GoalExtractionLoader
        isVisible={isLoading}
        onComplete={() => {}} // This will be handled by the parent
        shouldComplete={shouldComplete}
      />
    </>
  );
};

export default GoalExtractionForm;
