/**
 * ErrorMessage Component
 * Displays validation errors and warnings
 */
import React from 'react';

const ErrorMessage = ({ message, onClose }) => {
  return (
    <div className="error-container">
      <div className="error-icon">⚠️</div>
      <div className="error-content">
        <h3>Invalid Image</h3>
        <p>{message}</p>
        <div className="error-tips">
          <strong>Tips:</strong>
          <ul>
            <li>Upload a UI design mockup or wireframe</li>
            <li>Make sure it contains UI elements (buttons, inputs, text)</li>
            <li>Avoid uploading photos of people or landscapes</li>
            <li>Screenshots of websites or apps work well</li>
          </ul>
        </div>
      </div>
      {onClose && (
        <button className="error-close" onClick={onClose}>
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;