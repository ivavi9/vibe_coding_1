import React from 'react';

const GoalSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <div className="animate-pulse">
        {/* Header */}
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        
        {/* Skeleton Goals */}
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-4 border border-gray-200 rounded-lg">
              {/* Title */}
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
              
              {/* Description */}
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3 mb-3"></div>
              
              {/* Meta info */}
              <div className="h-3 bg-gray-200 rounded w-1/4 mb-3"></div>
              
              {/* Buttons */}
              <div className="flex space-x-2">
                <div className="h-8 bg-gray-200 rounded w-16"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GoalSkeleton;
