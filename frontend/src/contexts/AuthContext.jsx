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
  const [token, setToken] = useState(localStorage.getItem('authToken'));
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token) {
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          // console.log('AuthProvider: Found token, fetching profile...');
          const response = await apiFetchUserProfile();
          setUser(response.data);
          // console.log('AuthProvider: Profile fetched', response.data);
        } catch (err) {
          // console.error('AuthProvider: Error fetching profile with existing token', err);
          localStorage.removeItem('authToken');
          setToken(null);
          setUser(null);
          delete apiClient.defaults.headers.common['Authorization'];
          setError('Session expired or token is invalid. Please log in again.'); 
        }
      } else {
        // console.log('AuthProvider: No token found.');
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
      const { access, user: userData } = response.data; // Adjust based on your backend login response
      localStorage.setItem('authToken', access);
      setToken(access);
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${access}`;
      
      // If your /token/ endpoint doesn't return full user data, fetch it separately or adjust
      // For now, assuming /profile/ is the source of truth for user object after login.
      const profileResponse = await apiFetchUserProfile();
      setUser(profileResponse.data);
      setIsLoading(false);
      return profileResponse.data;
    } catch (err) {
      // console.error('AuthProvider: Login failed', err.response?.data || err.message);
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
    // console.log('AuthProvider: Logging out');
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
    // No need to set error here unless logout itself can fail
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
