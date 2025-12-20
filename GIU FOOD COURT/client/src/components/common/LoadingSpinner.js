import React from 'react';

const LoadingSpinner = ({ size = 'medium', message = 'Loading...' }) => {
  const sizeClasses = {
    small: { width: '20px', height: '20px' },
    medium: { width: '30px', height: '30px' },
    large: { width: '50px', height: '50px' }
  };

  return (
    <div className="flex flex-column align-center justify-center" style={{ padding: '40px 20px' }}>
      <div 
        className="spinner" 
        style={sizeClasses[size]}
      ></div>
      {message && (
        <p style={{ marginTop: '16px', color: 'var(--dark-gray)' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;
