import React from 'react';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';

const ErrorState = ({ errorMessage, onRetry }) => {
  return (
    <div className="p-6 text-center">
      <ApperIcon name="AlertCircle" className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error Loading Data</h3>
      <p className="text-gray-500 mb-4">{errorMessage}</p>
      <Button
        onClick={onRetry}
        className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
      >
        Try Again
      </Button>
    </div>
  );
};

export default ErrorState;