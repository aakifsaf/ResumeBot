import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { FiPlusSquare, FiList, FiUser, FiLayout } from 'react-icons/fi';

const DashboardPage = () => {
  const { user } = useAuth(); // Get user info if needed for a personalized greeting

  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
    out: { opacity: 0, y: -20 },
  };

  const itemVariants = {
    initial: { opacity: 0, y: 20 },
    in: { opacity: 1, y: 0 },
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
      className="min-h-[calc(100vh-4rem)] p-4 sm:p-8 text-white"
      style={{
        background: 'linear-gradient(to right bottom, #374151, #4B5563, #6B7280)', // Dashboard specific gradient
      }}
    >
      <div className="max-w-4xl mx-auto">
        <motion.h1 
          className="text-3xl sm:text-4xl font-bold mb-8 text-blue-300"
          variants={itemVariants}
        >
          Welcome to your Dashboard, {user?.username || 'User'}!
        </motion.h1>

        <motion.p 
          className="text-lg text-gray-300 mb-12"
          variants={itemVariants}
          transition={{ delay: 0.1 }}
        >
          Manage your resumes, create new ones, and keep track of your applications here.
        </motion.p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Create New Resume */}
          <motion.div 
            className="bg-gray-700/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-blue-500/30 transition-shadow duration-300"
            variants={itemVariants}
            transition={{ delay: 0.2 }}
          >
            <FiPlusSquare className="text-4xl text-blue-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-100">Create New Resume</h2>
            <p className="text-gray-300 mb-4">Start fresh and build a new, tailored resume for your next job application.</p>
            <Link 
              to="/create-resume" // This route doesn't exist yet
              className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Get Started <FiLayout className="ml-2" />
            </Link>
          </motion.div>

          {/* Card 2: View Existing Resumes */}
          <motion.div 
            className="bg-gray-700/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-green-500/30 transition-shadow duration-300"
            variants={itemVariants}
            transition={{ delay: 0.3 }}
          >
            <FiList className="text-4xl text-green-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-100">My Resumes</h2>
            <p className="text-gray-300 mb-4">View, edit, and manage all your previously created resumes.</p>
            <Link 
              to="/my-resumes" // This route doesn't exist yet
              className="inline-flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              View List <FiList className="ml-2" />
            </Link>
          </motion.div>

          {/* Card 3: Profile Settings (Optional - can link to existing profile page or a dedicated settings page) */}
          <motion.div 
            className="bg-gray-700/50 backdrop-blur-md p-6 rounded-xl shadow-lg hover:shadow-purple-500/30 transition-shadow duration-300"
            variants={itemVariants}
            transition={{ delay: 0.4 }}
          >
            <FiUser className="text-4xl text-purple-400 mb-4" />
            <h2 className="text-2xl font-semibold mb-2 text-gray-100">Profile Settings</h2>
            <p className="text-gray-300 mb-4">Update your account details and preferences.</p>
            <Link 
              to="/profile"
              className="inline-flex items-center px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors duration-300"
            >
              Go to Profile <FiUser className="ml-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default DashboardPage;
