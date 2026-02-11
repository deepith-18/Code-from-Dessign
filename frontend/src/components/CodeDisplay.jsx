import React, { useState } from 'react';

const CodeDisplay = ({ generatedCode }) => {
  const [activeTab, setActiveTab] = useState('html'); // State for interactivity
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedCode[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="code-display-container">
      <div className="code-toolbar">
        <div className="tab-group">
          {['html', 'css', 'react'].map((tab) => (
            <button 
              key={tab}
              className={`tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.toUpperCase()}
            </button>
          ))}
        </div>
        <div className="action-group">
          <button className="action-btn" onClick={handleCopy}>
            {copied ? '✅ Copied' : '📋 Copy'}
          </button>
          <button className="action-btn">📥 Download</button>
        </div>
      </div>
      
      <div className="code-content-area">
        <pre>
          <code>{generatedCode[activeTab] || `// No ${activeTab} code generated`}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;