import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ImageUploader from './components/ImageUploader';
import ErrorMessage from './components/ErrorMessage';
import CodeDisplay from './components/CodeDisplay';
import LivePreview from './components/LivePreview';
import { analyzeImage } from './services/api'; 
import './styles/App.css';

// --- Page 1: How It Works ---
const HowItWorksView = ({ onBack }) => {
  const steps = [
    { title: "Select your Design", desc: "Upload a clean image of your UI mockup. We support PNG, JPG, and WebP." },
    { title: "AI Visual Analysis", desc: "Our system uses YOLO to map out the structure of your design." },
    { title: "Code Generation", desc: "Powered by Gemini AI to write pixel-perfect code automatically." }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="full-page-view how-it-works-page"
    >
      <button className="back-btn" onClick={onBack}>← Back</button>
      <div className="how-to-content">
        <h1 className="page-title">How it <span className="text-lime">Works</span></h1>
        {steps.map((step, i) => (
          <div className="how-to-step" key={i}>
            <div className="step-number">{i + 1}</div>
            <div className="step-info">
              <h2>{step.title}</h2>
              <p>{step.desc}</p>
            </div>
          </div>
        ))}
        <button className="btn-main" onClick={onBack}>Got it, let's go!</button>
      </div>
    </motion.div>
  );
};

// --- Main App Component ---
function App() {
  /**
   * Views: 
   * 'landing' - The Hero section
   * 'how-it-works' - Instructional page
   * 'upload' - The dedicated upload page
   * 'workspace' - The code/preview result page
   */
  const [view, setView] = useState('landing'); 
  const [selectedFile, setSelectedFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!selectedFile) return;
    setIsLoading(true);
    setError(null);

    try {
      const response = await analyzeImage(selectedFile);
      let finalData = response;

      if (response.generated_code && typeof response.generated_code === 'string') {
        try {
          const cleanedString = response.generated_code.replace(/```json|```/g, '').trim();
          finalData.generated_code = JSON.parse(cleanedString);
        } catch (e) { console.error("Parse failed"); }
      }

      setResult(finalData);
      setView('workspace'); // Move to the result "page"
    } catch (err) {
      setError(err.message || "Analysis failed.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetToLanding = () => {
    setResult(null);
    setSelectedFile(null);
    setView('landing');
  };

  return (
    <div className="app-root">
      {/* Persistent Background Orbs */}
      <div className="orb-container">
        <div className="orb orb-1"></div>
        <div className="orb orb-2"></div>
      </div>

      <AnimatePresence mode="wait">
        
        {/* VIEW 1: LANDING PAGE */}
        {view === 'landing' && (
          <motion.section key="landing" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="hero full-page-view">
            <div className="badge"><span className="dot"></span> DESIGN TO CODE</div>
            <h1>Transform <span>Sketches</span> into Production Code</h1>
            <p>Advanced AI-powered conversion engine that analyzes your UI designs and generates clean code in seconds.</p>
            <div className="btn-group">
              <button className="btn-main" onClick={() => setView('upload')}>Get Started →</button>
              <button className="btn-outline" onClick={() => setView('how-it-works')}>How It Works</button>
            </div>
          </motion.section>
        )}

        {/* VIEW 2: HOW IT WORKS */}
        {view === 'how-it-works' && (
          <HowItWorksView key="how" onBack={() => setView('landing')} />
        )}

        {/* VIEW 3: UPLOAD PAGE */}
        {view === 'upload' && (
          <motion.section
            key="upload"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="full-page-view flex-center"
          >
            <button className="back-btn" onClick={() => setView('landing')}>← Back</button>
            <div className="upload-container glass-card">
              <ImageUploader onImageSelect={setSelectedFile} isLoading={isLoading} />

              {selectedFile && !isLoading && (
                <button className="btn-main w-full mt-6" onClick={handleAnalyze}>
                  Analyze & Generate Code
                </button>
              )}
              {isLoading && (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>AI is analyzing your design...</p>
                </div>
              )}
              {error && <ErrorMessage message={error} onClose={() => setError(null)} />}
            </div>
          </motion.section>
        )}

        {/* VIEW 4: WORKSPACE PAGE */}
        {view === 'workspace' && result && (
          <motion.section key="workspace" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="workspace-view">
            {/* Top Navbar */}
            <header className="workspace-nav">
                <div className="flex items-center gap-4">
                  <button className="back-btn-small" onClick={() => setView('upload')}>← Back</button>
                  <h2 className="workspace-logo">Project Workspace</h2>
                </div>
                <button className="btn-main-sm" onClick={resetToLanding}>New Upload</button>
            </header>

            {/* Split Screen Content */}
            <main className="workspace-main">
              <div className="workspace-column editor-side">
                <CodeDisplay generatedCode={result.generated_code} />
              </div>
              <div className="workspace-column preview-side">
                <LivePreview html={result.generated_code.html} css={result.generated_code.css} />
              </div>
            </main>
          </motion.section>
        )}

      </AnimatePresence>
    </div>
  );
}

export default App;