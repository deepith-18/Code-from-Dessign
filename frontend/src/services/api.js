/**
 * API Service
 * Handles all communication with the FastAPI backend
 */
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

/**
 * Upload and analyze a UI design image
 * @param {File} file - Image file to analyze
 * @returns {Promise} - Analysis response
 */
export const analyzeImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      // Show upload progress
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percentCompleted}%`);
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.detail || 'Server error occurred');
    } else if (error.request) {
      // Request made but no response
      throw new Error('No response from server. Please ensure backend is running.');
    } else {
      // Something else went wrong
      throw new Error('Failed to send request: ' + error.message);
    }
  }
};

/**
 * Validate if image is a UI design (without full processing)
 * @param {File} file - Image file to validate
 * @returns {Promise} - Validation result
 */
export const validateImage = async (file) => {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_BASE_URL}/validate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.detail || 'Validation failed');
  }
};

/**
 * Check if backend is reachable
 * @returns {Promise<boolean>}
 */
export const checkBackendHealth = async () => {
  try {
    const response = await axios.get('http://localhost:8000/');
    return response.status === 200;
  } catch (error) {
    return false;
  }
};