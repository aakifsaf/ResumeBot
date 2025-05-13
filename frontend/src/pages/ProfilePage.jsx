import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiEdit3 } from 'react-icons/fi';

const ProfilePage = () => {
  const { user } = useAuth();

  if (!user) {
    // This should ideally be handled by a protected route, 
    // but as a fallback, show a loading or redirect message.
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 text-gray-400">
        Loading user profile or not logged in...
      </div>
    );
  }

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const pageTransition = {
    type: "tween",
    ease: "anticipate",
    duration: 0.5,
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 sm:p-8"
      style={{
        background: 'linear-gradient(to right bottom, #1F2937, #374151, #4B5563)', // Slightly different dark gradient
      }}
    >
      <motion.div 
        className="w-full max-w-xl bg-white/10 backdrop-blur-lg rounded-xl shadow-2xl overflow-hidden p-8 sm:p-10"
        initial={{ opacity:0, scale: 0.9 }}
        animate={{ opacity:1, scale: 1}}
        transition={{ delay: 0.1, duration: 0.4, type: 'spring'}}
      >
        <div className="text-center mb-8">
          <FiUser className="mx-auto text-6xl text-blue-400 mb-4" />
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100">Your Profile</h1>
        </div>

        <div className="space-y-6 text-gray-200">
          <div className="flex items-center p-4 bg-gray-700/50 rounded-lg">
            <FiUser className="text-blue-400 mr-4 text-xl" />
            <div>
              <p className="text-xs text-gray-400">Username</p>
              <p className="text-lg font-semibold">{user.username}</p>
            </div>
          </div>

          <div className="flex items-center p-4 bg-gray-700/50 rounded-lg">
            <FiMail className="text-blue-400 mr-4 text-xl" />
            <div>
              <p className="text-xs text-gray-400">Email</p>
              {/* Assuming email is part of the user object, if not, this needs adjustment */}
              <p className="text-lg font-semibold">{user.email || 'Email not available'}</p>
            </div>
          </div>
          
          {/* Placeholder for additional profile information */}
          {/* Example: 
          <div className="flex items-center p-4 bg-gray-700/50 rounded-lg">
            <FiBriefcase className="text-blue-400 mr-4 text-xl" />
            <div>
              <p className="text-xs text-gray-400">Joined</p>
              <p className="text-lg font-semibold">{new Date(user.date_joined).toLocaleDateString() || 'Date not available'}</p>
            </div>
          </div> 
          */}

          <div className="mt-8 text-center">
            <button 
              className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors duration-300 disabled:opacity-50"
              // onClick={() => navigate('/profile/edit')} // Example navigation for an edit page
              disabled // Remove disabled when edit functionality is ready
            >
              <FiEdit3 className="mr-2" />
              Edit Profile (Coming Soon)
            </button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ProfilePage;
