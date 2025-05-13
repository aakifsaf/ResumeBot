import axios from 'axios';

const API_URL = 'http://localhost:8000/api'; // Your Django backend URL

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to add JWT token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;

// Example usage for auth (you'll build these out later)
export const loginUser = (credentials) => apiClient.post('/token/', credentials);
export const registerUser = (userData) => apiClient.post('/register/', userData);
export const fetchUserProfile = () => apiClient.get('/profile/');

// Add other API functions as needed for JD parsing, composing, etc.
