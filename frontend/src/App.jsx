import React, { useState, useEffect, useRef } from 'react';
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
  
  const uploadRef = useRef(null);

  useEffect(() => {
    checkBackendHealth().then(setBackendOnline).catch(() => setBackendOnline(false));
  }, []);

  const scrollToUpload = () => uploadRef.current?.scrollIntoView({ behavior: 'smooth' });

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);
    try {
      const response = await analyzeImage(selectedFile);
      const standardized = {
        preview_data: { element_count: response.element_count || 0, element_types: response.element_types || {} },
        generated_code: {
          html: response.html || response.generated_code?.html || "",
          css: response.css || response.generated_code?.css || "",
          react: response.react || response.generated_code?.react || ""
        }
      };
      setResult(standardized);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // UI rendering
  if (result) {
    return (
      <div className="workspace">
        <div className="container">
          <header style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom: '40px'}}>
             <h2 style={{fontWeight: 800}}>Code From Design</h2>
             <button className="btn-outline" onClick={() => setResult(null)}>New Upload</button>
          </header>
          
          <div className="results-grid" style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px'}}>
             <div className="code-view">
                <h3>Generated Code</h3>
                <div className="code-card">
                  <div className="code-header">
                    <div className="circle red"></div>
                    <div className="circle yellow"></div>
                    <div className="circle green"></div>
                  </div>
                  <CodeDisplay generatedCode={result.generated_code} />
                </div>
             </div>
             <div className="preview-view">
                <h3>Live Preview</h3>
                <LivePreview html={result.generated_code.html} css={result.generated_code.css} />
             </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="bg-pattern"></div>
      
      {!backendOnline && <div className="status-bar">⚠️ Backend server offline. Port 8000 required.</div>}

      <section className="hero">
        <div className="badge"><span className="dot"></span> DESIGN TO CODE</div>
        <h1>Transform <span>Sketches</span> into Production Code</h1>
        <p>Advanced AI-powered conversion engine that analyzes your UI designs and generates clean, production-ready HTML code in seconds.</p>
        
        <div className="btn-group">
          <button className="btn-main" onClick={scrollToUpload}>Upload Design →</button>
          <button className="btn-outline">How It Works</button>
        </div>

        <div className="features">
           <span><span className="dot"></span> Instant Generation</span>
           <span><span className="dot"></span> Clean Code</span>
           <span><span className="dot"></span> Live Preview</span>
        </div>
      </section>

      <section ref={uploadRef} className="upload-container">
        <ImageUploader onImageSelect={setSelectedFile} isLoading={isLoading} />
        
        {selectedFile && (
          <div style={{textAlign: 'center', marginTop: '30px'}}>
            <button className="btn-main" style={{width: '100%', justifyContent: 'center'}} onClick={handleAnalyze} disabled={isLoading}>
              {isLoading ? "Analyzing Design..." : "Generate Code"}
            </button>
          </div>
        )}
        
        {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
      </section>

      <footer style={{textAlign:'center', padding: '40px', color: '#888', borderTop: '1px solid #eee'}}>
        Built with React + FastAPI | View on GitHub
      </footer>
    </div>
  );
}

export default App;