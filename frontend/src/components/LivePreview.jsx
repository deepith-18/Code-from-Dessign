import React from 'react';

const LivePreview = ({ html, css }) => {
  const srcDoc = `
    <html>
      <head>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
          body { margin: 0; padding: 24px; font-family: sans-serif; background: white; }
          ${css || ''}
        </style>
      </head>
      <body>${html || ''}</body>
    </html>
  `;

  return (
    <div className="preview-card">
      <div className="preview-card-header">
        <h3>Live Preview</h3>
        <p>Interactive rendering of your design</p>
      </div>
      <div className="preview-canvas">
        <iframe title="preview" srcDoc={srcDoc} />
      </div>
    </div>
  );
};

export default LivePreview;