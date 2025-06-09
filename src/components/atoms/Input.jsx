import React from 'react';

const Input = ({ type = 'text', className, ...props }) => {
  if (type === 'textarea') {
    return (
      <textarea
        className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className || ''}`}
        {...props}
      />
    );
  }
  return (
    <input
      type={type}
      className={`w-full px-3 py-2 border border-surface-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent ${className || ''}`}
      {...props}
    />
  );
};

export default Input;