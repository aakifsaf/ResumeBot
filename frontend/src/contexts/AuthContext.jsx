import React, { createContext, useContext, useState, useEffect } from 'react';
import apiClient, { 
  loginUser as apiLoginUser, 
  registerUser as apiRegisterUser, 
  fetchUserProfile as apiFetchUserProfile,
  updateUserProfile as apiUpdateUserProfile // Added import for updateUserProfile
} from '../api'; // Assuming api.js is in src/

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token')); // Changed from authToken
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const response = await apiFetchUserProfile();
          setUser(response.data);
        } catch (err) {
          // Handle token expiration
          if (err.response?.status === 401) {
            localStorage.removeItem('access_token');
            setToken(null);
            setUser(null);
            delete apiClient.defaults.headers.common['Authorization'];
            setError('Session expired. Please log in again.');
            // Redirect to login page
            window.location.href = '/login';
          } else {
            throw err;
          }
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, [token]);

  const login = async (credentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiLoginUser(credentials);
      const { access } = response.data; // Get the access token
      localStorage.setItem('access_token', access); // Changed from authToken
      setToken(access);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      const profileResponse = await apiFetchUserProfile();
      setUser(profileResponse.data);
      setIsLoading(false);
      return profileResponse.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Login failed. Please check your credentials.');
      setIsLoading(false);
      throw err;
    }
  };

  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      // Assuming your register endpoint creates the user but doesn't log them in directly
      // or doesn't return a token. Adjust if it does.
      const response = await apiRegisterUser(userData);
      setIsLoading(false);
      // Optionally, you could automatically log the user in here by calling login()
      // or direct them to the login page with a success message.
      return response.data; // Or whatever your register endpoint returns
    } catch (err) {
      // console.error('AuthProvider: Registration failed', err.response?.data || err.message);
      let errorMessage = 'Registration failed. Please try again.';
      if (err.response?.data) {
        // Attempt to parse DRF error messages
        const errors = err.response.data;
        const messages = [];
        for (const key in errors) {
          if (Array.isArray(errors[key])) {
            messages.push(`${key}: ${errors[key].join(', ')}`);
          }
        }
        if (messages.length > 0) errorMessage = messages.join('; ');
      }
      setError(errorMessage);
      setIsLoading(false);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('access_token'); // Changed from authToken
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
    // Redirect to login page
    window.location.href = '/login';
  };

  const updateUserProfile = async (updatedData) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiUpdateUserProfile(updatedData);
      setUser(response.data);
      setIsLoading(false);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to update profile');
      setIsLoading(false);
      throw err;
    }
  };

  const refreshToken = async () => {
    try {
      const refresh = localStorage.getItem('refresh_token');
      if (refresh) {
        const response = await apiClient.post('/token/refresh/', { refresh });
        const { access } = response.data;
        localStorage.setItem('access_token', access);
        setToken(access);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        error,
        login,
        register,
        logout,
        updateUserProfile,
        refreshToken,
        setUser,
        setToken,
        isAuthenticated: !!token && !!user,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
