import React, { useRef, useState } from 'react';

const ImageUploader = ({ onImageSelect, isLoading }) => {
  const [preview, setPreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onImageSelect(file);
    }
  };

  const handleClear = (e) => {
    e.stopPropagation();
    setPreview(null);
    onImageSelect(null);
  };

  return (
    <div className="uploader-wrapper">
      <input 
        ref={fileInputRef} 
        type="file" 
        accept="image/*"
        onChange={handleInputChange} 
        style={{ display: 'none' }} 
      />

      {!preview ? (
        <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
          <div className="folder-icon-container">
            {/* Professional Folder SVG */}
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4H4C2.89543 4 2 4.89543 2 6V18C2 19.1046 2.89543 20 4 20H20C21.1046 20 22 19.1046 22 18V8C22 6.89543 21.1046 6 20 6H12L10 4Z" fill="#FFC107"/>
            </svg>
          </div>
          <h3>Upload UI Design Image</h3>
          <p>Click to browse or drag and drop</p>
          <p className="upload-hint">PNG, JPG, JPEG, or WebP (max 10MB)</p>
        </div>
      ) : (
        <div className="preview-container">
          <div className="image-preview-wrapper">
            <img src={preview} alt="Preview" />
          </div>
          {!isLoading && (
            <button 
              className="btn-outline" 
              style={{
                marginTop: '20px', 
                width: '100%', 
                padding: '12px', 
                borderRadius: '12px', 
                border: '1px solid #eee', 
                background: 'white', 
                fontWeight: '700', 
                cursor: 'pointer',
                color: '#ff4444'
              }} 
              onClick={handleClear}
            >
              ✕ Remove Image
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;