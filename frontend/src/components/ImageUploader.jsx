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

  return (
    <div className="uploader-wrapper">
      <input ref={fileInputRef} type="file" onChange={handleInputChange} style={{ display: 'none' }} />

      {!preview ? (
        <div className="upload-zone" onClick={() => fileInputRef.current.click()}>
          <div className="folder-icon">📂</div>
          <h3 style={{fontWeight: 800, fontSize: '24px', marginBottom: '10px'}}>Upload UI Design Image</h3>
          <p style={{color: '#666'}}>Click to browse or drag and drop</p>
          <p style={{fontSize: '12px', color: '#aaa', marginTop: '10px'}}>PNG, JPG, JPEG, or WebP (max 10MB)</p>
        </div>
      ) : (
        <div className="preview-container" style={{textAlign: 'center'}}>
          <img src={preview} alt="Preview" style={{maxWidth: '100%', borderRadius: '12px', border: '1px solid #eee'}} />
          {!isLoading && (
            <button className="btn-outline" style={{marginTop: '20px'}} onClick={() => {setPreview(null); onImageSelect(null)}}>
              ✕ Remove Image
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUploader;