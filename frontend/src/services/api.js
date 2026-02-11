/**
 * API Service
 * Handles all communication with the FastAPI backend
 */
import axios from 'axios';

// CRITICAL FIX: Dynamically determine API_BASE_URL
// In development, Vite uses the .env file or falls back to localhost.
// In Docker, the VITE_APP_BACKEND_URL environment variable is injected during build.
const BACKEND_HOST = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8000';
const API_BASE_URL = `${BACKEND_HOST}/api`; // Assuming all API endpoints are under /api

console.log("Frontend API Base URL:", API_BASE_URL); // Debugging: Check this in browser console

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
      // Server responded with error (e.g., 4xx, 5xx)
      throw new Error(error.response.data.detail || `Server error (${error.response.status}) occurred`);
    } else if (error.request) {
      // Request made but no response received (e.g., network error, backend down)
      console.error("No response from server:", error.request);
      throw new Error('No response from backend server. Please ensure the backend is running and accessible.');
    } else {
      // Something else went wrong (e.g., config error)
      console.error("Axios request setup error:", error.message);
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
    throw new Error(error.response?.data?.detail || 'Image validation failed');
  }
};

/**
 * Check if backend is reachable
 * @returns {Promise<boolean>}
 */
export const checkBackendHealth = async () => {
  try {
    // Health check hits the root of the backend host, not /api/
    const response = await axios.get(`${BACKEND_HOST}/`); 
    return response.status === 200;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
};