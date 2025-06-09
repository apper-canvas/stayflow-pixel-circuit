import React, { useState } from 'react';
import Button from '@/components/atoms/Button';

const StatusUpdateForm = ({ initialStatus, onSubmit, onCancel }) => {
  const [selectedStatus, setSelectedStatus] = useState(initialStatus);

  const statusOptions = [
    { value: 'occupied', label: 'Occupied', color: 'bg-red-500' },
    { value: 'vacant-clean', label: 'Available (Clean)', color: 'bg-green-500' },
    { value: 'vacant-dirty', label: 'Cleaning Required', color: 'bg-yellow-500' },
    { value: 'maintenance', label: 'Maintenance', color: 'bg-gray-500' },
    { value: 'out-of-order', label: 'Out of Order', color: 'bg-red-700' }
  ];

  const handleSubmit = () => {
    onSubmit(selectedStatus);
  };

  return (
    <>
      <div className="space-y-3">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelectedStatus(option.value)}
            className={`w-full p-3 rounded-lg border text-left transition-all duration-150 ${
              selectedStatus === option.value
                ? 'border-primary bg-primary/10'
                : 'border-surface-300 hover:border-surface-400'
            }`}
          >
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${option.color}`}></div>
              <span className="font-medium">{option.label}</span>
            </div>
          </button>
        ))}
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <Button
          onClick={onCancel}
          className="px-4 py-2 text-gray-700 border border-surface-300 rounded-lg hover:bg-surface-50"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-150"
        >
          Update Status
        </Button>
      </div>
    </>
  );
};

export default StatusUpdateForm;