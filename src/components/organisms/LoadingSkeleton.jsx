import React from 'react';

const LoadingSkeleton = ({ count = 20 }) => {
  return (
    <div className="p-6">
      <div className="grid grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
        {[...Array(count)].map((_, i) => (
          <div key={i} className="bg-surface-100 rounded-lg h-20 animate-pulse"></div>
        ))}
      </div>
    </div>
  );
};

export default LoadingSkeleton;