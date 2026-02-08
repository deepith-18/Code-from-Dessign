/**
 * LivePreview Component
 * Renders a live preview of the generated HTML/CSS
 * Fixed: Uses srcDoc to prevent Cross-Origin/Sandbox errors
 */
import React from 'react';

const LivePreview = ({ html, css }) => {
  
  // Helper: Extract body content if the backend sent a full <html> document
  // otherwise just use the html string as is.
  const extractBodyContent = (htmlString) => {
    if (!htmlString) return '';
    const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : htmlString;
  };

  // Prepare the full HTML string for the iframe
  // We combine the CSS and HTML here securely
  const bodyContent = extractBodyContent(html);
  
  const srcDoc = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        /* Reset margins for the preview */
        body { margin: 0; padding: 0; font-family: sans-serif; }
        /* Inject the generated CSS */
        ${css || ''}
      </style>
    </head>
    <body>
      ${bodyContent || '<div style="padding: 20px; color: #666;">Waiting for code...</div>'}
    </body>
    </html>
  `;

  return (
    <div className="preview-container-wrapper">
      <div className="preview-header">
        <h3>Live Preview</h3>
        <p className="preview-hint">Interactive preview of generated code</p>
      </div>
      <div className="preview-frame">
        <iframe
          title="Live Preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts" 
          className="preview-iframe"
          style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
        />
      </div>
    </div>
  );
};

export default LivePreview;