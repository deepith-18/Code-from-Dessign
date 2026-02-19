import React, { useState } from 'react';

const CodeDisplay = ({ generatedCode }) => {
  const [activeTab, setActiveTab] = useState('html');
  const [copied, setCopied] = useState(false);

  const codeTypes = [
    { value: 'html', label: 'HTML', extension: '.html' },
    { value: 'css', label: 'CSS', extension: '.css' },
    { value: 'react', label: 'React', extension: '.jsx' }
  ];

  const handleCopy = () => {
    const code = generatedCode[activeTab];
    if (code) {
      navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const code = generatedCode[activeTab];
    if (!code) return;

    const currentType = codeTypes.find(t => t.value === activeTab);
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `generated-code${currentType.extension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="editor-window">
      {/* macOS-style Header */}
      <div className="editor-title-bar">
        <div className="window-dots">
          <span className="w-dot r"></span>
          <span className="w-dot y"></span>
          <span className="w-dot g"></span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="editor-toolbar">
        <div className="code-selector-group">
          <label className="code-label">Code Type:</label>
          <select
            className="code-dropdown"
            value={activeTab}
            onChange={(e) => setActiveTab(e.target.value)}
          >
            {codeTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        <div className="editor-actions">
          <button className="action-btn copy-btn" onClick={handleCopy}>
            <span className="btn-icon">{copied ? '✓' : '⎘'}</span>
            <span className="btn-text">{copied ? 'Copied!' : 'Copy'}</span>
          </button>
          <button className="action-btn download-btn" onClick={handleDownload}>
            <span className="btn-icon">↓</span>
            <span className="btn-text">Download</span>
          </button>
        </div>
      </div>

      {/* Code Area */}
      <div className="editor-content">
        <pre>
          <code>{generatedCode[activeTab] || "// No code available"}</code>
        </pre>
      </div>
    </div>
  );
};

export default CodeDisplay;