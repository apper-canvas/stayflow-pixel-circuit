import React from 'react';
import ApperIcon from '@/components/ApperIcon';

const StatCard = ({ iconName, iconBgColor, iconTextColor, count, label }) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-sm border border-surface-200">
      <div className="flex items-center">
        <div className={`${iconBgColor} rounded-full p-3`}>
          <ApperIcon name={iconName} className={`w-6 h-6 ${iconTextColor}`} />
        </div>
        <div className="ml-4">
          <h3 className="text-2xl font-semibold text-gray-900">
            {count}
          </h3>
          <p className="text-sm text-gray-500">{label}</p>
        </div>
      </div>
    </div>
  );
};

export default StatCard;