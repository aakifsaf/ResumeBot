import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom'; // Import useLocation
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiLogIn, FiUser, FiLock } from 'react-icons/fi';

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading, error, clearError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation(); // Get location object

  const handleSubmit = async (e) => {
    e.preventDefault();
    clearError();
    try {
      await login({ username, password });
      const from = location.state?.from?.pathname || "/"; // Determine redirect path
      navigate(from, { replace: true }); // Redirect to intended page or fallback
    } catch (err) {
      // Error is handled by AuthContext and displayed
    }
  };

  const pageVariants = {
    initial: { opacity: 0, x: -100 },
    in: { opacity: 1, x: 0 },
    out: { opacity: 0, x: 100 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.6,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4"
      style={{
        background: 'linear-gradient(to right bottom, #1A202C, #2D3748, #4A5568)', // Dark sophisticated gradient
      }}
    >
      <motion.div 
        className="w-full max-w-md bg-white/5 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden"
        initial={{ opacity:0, scale: 0.8 }}
        animate={{ opacity:1, scale: 1}}
        transition={{ delay: 0.2, duration: 0.5, type: 'spring'}}
      >
        <div className="p-8 sm:p-10">
          <div className="text-center mb-8">
            <FiLogIn className="mx-auto text-5xl text-blue-400 mb-3" />
            <h1 className="text-3xl font-bold text-gray-100">Welcome Back!</h1>
            <p className="text-gray-400 text-sm mt-1">Sign in to continue to AI Resume Composer.</p>
          </div>
          
          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 mb-6 text-sm text-red-200 bg-red-500/30 rounded-lg text-center border border-red-500/50"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 text-gray-200 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition duration-150 ease-in-out"
                placeholder="Username"
              />
            </div>

            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full pl-10 pr-3 py-3 text-gray-200 bg-gray-700/50 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent placeholder-gray-500 transition duration-150 ease-in-out"
                placeholder="Password"
              />
            </div>

            <div>
              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full px-4 py-3 text-lg font-semibold text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-60 flex items-center justify-center shadow-lg hover:shadow-blue-500/50"
              >
                {isLoading ? (
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                ) : 'Login'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-sm text-center text-gray-400">
            Don't have an account?{' '}
            <Link to="/register" className="font-medium text-blue-400 hover:text-blue-300 hover:underline">
              Sign up here
            </Link>
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default LoginPage;
