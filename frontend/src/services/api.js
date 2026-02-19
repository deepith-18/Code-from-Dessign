import axios from 'axios';

// Determine the base host (e.g., http://localhost:8000)
const BACKEND_HOST = import.meta.env.VITE_APP_BACKEND_URL || 'http://localhost:8000';
// API calls use the /api suffix
const API_BASE_URL = `${BACKEND_HOST}/api`;

/**
 * Check if backend is reachable
 * Hits the root URL (/) of the backend host
 */
export const checkBackendHealth = async () => {
  try {
    // This calls http://localhost:8000/
    const response = await axios.get(`${BACKEND_HOST}/`); 
    return response.status === 200;
  } catch (error) {
    console.error("Backend health check failed:", error);
    return false;
  }
};

/**
 * Upload and analyze a UI design image
 */
export const analyzeImage = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await axios.post(`${API_BASE_URL}/analyze`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return response.data;
};