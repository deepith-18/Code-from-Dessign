import React from 'react';

const LivePreview = ({ html, css }) => {
  const extractBodyContent = (htmlString) => {
    if (!htmlString) return '';
    // If it's a full document, get body. If not, return whole string.
    const bodyMatch = htmlString.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    return bodyMatch ? bodyMatch[1] : htmlString;
  };

  const bodyContent = extractBodyContent(html);
  
  const srcDoc = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <style>
        body { 
          margin: 0; 
          padding: 20px; 
          font-family: 'Inter', sans-serif; 
          background: white; 
          color: #111;
        }
        ${css || ''}
      </style>
    </head>
    <body>
      ${bodyContent || '<div style="color: #999;">Preview will appear here...</div>'}
    </body>
    </html>
  `;

  return (
    <div className="preview-container-wrapper" style={{ border: '1px solid #eee', borderRadius: '12px', overflow: 'hidden', background: 'white' }}>
      <div className="preview-header" style={{ padding: '15px 20px', borderBottom: '1px solid #eee', background: '#fcfdfa' }}>
        <h3 style={{ margin: 0, fontSize: '16px', fontWeight: 700 }}>Live Preview</h3>
        <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#666' }}>Interactive rendering of your design</p>
      </div>
      <div className="preview-frame" style={{ height: '600px', width: '100%' }}>
        <iframe
          title="Live Preview"
          srcDoc={srcDoc}
          sandbox="allow-scripts" 
          style={{ width: '100%', height: '100%', border: 'none' }}
        />
      </div>
    </div>
  );
};

export default LivePreview;