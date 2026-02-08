/**
 * Main App Component
 * Orchestrates the entire application flow
 */
import React, { useState, useEffect } from 'react';
import ImageUploader from './components/ImageUploader';
import ErrorMessage from './components/ErrorMessage';
import CodeDisplay from './components/CodeDisplay';
import LivePreview from './components/LivePreview';
import { analyzeImage, checkBackendHealth } from './services/api';
import './styles/App.css';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [backendOnline, setBackendOnline] = useState(true);

  // Check backend health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const isOnline = await checkBackendHealth();
        setBackendOnline(isOnline);
      } catch (e) {
        console.warn("Health check failed", e);
        setBackendOnline(false); // Assume offline if check crashes
      }
    };
    checkHealth();
  }, []);

  const handleImageSelect = (file) => {
    setSelectedFile(file);
    setError(null);
    setResult(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      alert('Please select an image first');
      return;
    }

    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      console.log("Sending request to backend...");
      const response = await analyzeImage(selectedFile);
      
      // DEBUG: Log exactly what the backend sent
      console.log("Raw Backend Response:", response); 

      // --- CRITICAL FIX: Data Normalization ---
      // This ensures 'result' ALWAYS has the structure your components expect.
      // Even if backend sends flat JSON, we structure it correctly here.
      
      const standardizedResult = {
        valid: true,
        preview_data: {
          // Check various locations where backend might put the data
          element_count: response.element_count || response.preview_data?.element_count || 0,
          element_types: response.element_types || response.preview_data?.element_types || { 
            buttons: 0, 
            inputs: 0, 
            text: 0 
          }
        },
        generated_code: {
          // Check if it's top-level OR inside generated_code object
          html: response.html || response.generated_code?.html || "<!-- No HTML returned -->",
          css: response.css || response.generated_code?.css || "/* No CSS returned */",
          react: response.react || response.generated_code?.react || "// No React returned"
        }
      };

      // Validation: Ensure we actually have something to show
      if (standardizedResult.generated_code.html === "<!-- No HTML returned -->" && 
          standardizedResult.generated_code.css === "/* No CSS returned */") {
          
          console.error("Backend sent data, but no HTML/CSS found:", response);
          throw new Error("The backend analyzed the image but returned no code. Check backend console.");
      }

      setResult(standardizedResult);

    } catch (err) {
      console.error("Error Details:", err);
      setError(err.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setError(null);
    setResult(null);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="container">
          <h1 className="app-title">
            <span className="logo">🎨</span>
            Code from Design
          </h1>
          <p className="app-subtitle">
            Convert UI design images to HTML, CSS, and React code automatically
          </p>
          <div className="app-badge">AutoDev AI</div>
        </div>
      </header>

      {/* Backend Status Banner */}
      {!backendOnline && (
        <div className="status-banner error">
          ⚠️ Backend server is not running. Please start the FastAPI server on port 8000.
        </div>
      )}

      {/* Main Content */}
      <main className="main-content">
        <div className="container">
          {/* Upload Section */}
          <section className="upload-section">
            <ImageUploader
              onImageSelect={handleImageSelect}
              isLoading={isLoading}
            />

            {selectedFile && !result && (
              <div className="action-buttons">
                <button
                  className="btn btn-primary"
                  onClick={handleAnalyze}
                  disabled={isLoading || !backendOnline}
                >
                  {isLoading ? (
                    <>
                      <span className="spinner"></span>
                      Analyzing...
                    </>
                  ) : (
                    <>
                      🚀 Generate Code
                    </>
                  )}
                </button>
              </div>
            )}
          </section>

          {/* Loading State */}
          {isLoading && (
            <div className="loading-container">
              <div className="loading-spinner"></div>
              <h3>Analyzing your design...</h3>
              <p>Detecting UI elements and generating code</p>
            </div>
          )}

          {/* Error Message */}
          {error && !isLoading && (
            <ErrorMessage message={error} onClose={() => setError(null)} />
          )}

          {/* Results Section */}
          {result && (
            <div className="results-section">
              <div className="results-header">
                <div>
                  <h2>✅ Code Generated Successfully!</h2>
                  <p className="results-stats">
                     {/* Defensive coding: Use || 0 to prevent crashes if numbers are missing */}
                    Detected {result.preview_data.element_count} UI elements
                    ({result.preview_data.element_types.buttons || 0} buttons,{' '}
                    {result.preview_data.element_types.inputs || 0} inputs,{' '}
                    {result.preview_data.element_types.text || 0} text blocks)
                  </p>
                </div>
                <button className="btn btn-secondary" onClick={handleReset}>
                  🔄 Start Over
                </button>
              </div>

              {/* Code Display */}
              <div className="code-section">
                <h3>Generated Code</h3>
                {/* We pass the standardized object here */}
                <CodeDisplay generatedCode={result.generated_code} />
              </div>

              {/* Live Preview */}
              <div className="preview-section">
                <LivePreview
                  html={result.generated_code.html}
                  css={result.generated_code.css}
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <div className="container">
          <p>
            Built with React + FastAPI | 
            <a href="https://github.com" target="_blank" rel="noopener noreferrer">
              {' '}View on GitHub
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;