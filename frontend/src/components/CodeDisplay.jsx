/**
 * CodeDisplay Component
 * Displays generated HTML, CSS, and React code with syntax highlighting
 */
import React, { useState } from 'react';

const CodeDisplay = ({ generatedCode }) => {
  const [activeTab, setActiveTab] = useState('html');

  const copyToClipboard = (code) => {
    navigator.clipboard.writeText(code);
    alert('Code copied to clipboard!');
  };

  const downloadCode = (code, filename) => {
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { id: 'html', label: 'HTML', code: generatedCode.html, filename: 'index.html' },
    { id: 'css', label: 'CSS', code: generatedCode.css, filename: 'styles.css' },
    { id: 'react', label: 'React', code: generatedCode.react, filename: 'Component.jsx' },
  ];

  const currentTab = tabs.find(tab => tab.id === activeTab);

  return (
    <div className="code-display">
      <div className="code-header">
        <div className="code-tabs">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`code-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="code-actions">
          <button
            className="action-button"
            onClick={() => copyToClipboard(currentTab.code)}
            title="Copy to clipboard"
          >
            📋 Copy
          </button>
          <button
            className="action-button"
            onClick={() => downloadCode(currentTab.code, currentTab.filename)}
            title="Download file"
          >
            💾 Download
          </button>
        </div>
      </div>

      <div className="code-content">
        <pre>
          <code>{currentTab.code}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;