import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FiLogOut, FiLogIn, FiUserPlus, FiHome, FiUser, FiGrid } from 'react-icons/fi'; // Added FiGrid for Dashboard
import { motion } from 'framer-motion';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItemVariants = {
    hover: { scale: 1.1, color: '#60A5FA' /* blue-400 */ },
    tap: { scale: 0.95 }
  };

  return (
    <nav 
      className="bg-gray-800/30 backdrop-blur-md text-white p-4 shadow-lg sticky top-0 z-50"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors duration-300">
          AI Resume Composer
        </Link>
        <div className="flex items-center space-x-5">
          {!user && (
            <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
              <Link to="/" className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-300">
                <FiHome />
                <span>Home</span>
              </Link>
            </motion.div>
          )}

          {user ? (
            <>
              <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                <Link to="/dashboard" className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-300">
                  <FiGrid /> 
                  <span>Dashboard</span>
                </Link>
              </motion.div>
              
              <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                <Link to="/profile" className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-300">
                   <FiUser />
                  <span>Profile</span>
                </Link>
              </motion.div>

              <motion.button
                onClick={handleLogout}
                className="flex items-center space-x-1 bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg text-white transition-colors duration-300"
                variants={navItemVariants}
                whileHover="hover"
                whileTap="tap"
              >
                <FiLogOut />
                <span>Logout</span>
              </motion.button>
              <span className="text-gray-300 text-sm">Hi, {user.username}!</span>
            </>
          ) : (
            <>
              <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                <Link to="/login" className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-300">
                  <FiLogIn />
                  <span>Login</span>
                </Link>
              </motion.div>
              <motion.div variants={navItemVariants} whileHover="hover" whileTap="tap">
                <Link to="/register" className="flex items-center space-x-1 hover:text-blue-400 transition-colors duration-300">
                  <FiUserPlus />
                  <span>Register</span>
                </Link>
              </motion.div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
