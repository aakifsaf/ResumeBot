import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiEye, FiEdit, FiTrash2, FiFileText, FiAward, FiUser } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { fetchUserResumes, fetchAIGeneratedResumes, deleteResume, deleteAIGeneratedResume } from '../api';

function MyResumesPage() {
  const [manualResumes, setManualResumes] = useState([]);
  const [aiResumes, setAiResumes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('manual'); // 'manual' or 'ai'

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        setIsLoading(true);
        // Fetch both types of resumes in parallel
        const [manualResponse, aiResponse] = await Promise.all([
          fetchUserResumes(),
          fetchAIGeneratedResumes()
        ]);
        
        setManualResumes(manualResponse.data || []);
        setAiResumes(aiResponse.data || []);
      } catch (error) {
        console.error('Error fetching resumes:', error);
        toast.error('Failed to load resumes');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResumes();
  }, []);

  const handleDelete = async (id, isAI = false) => {
    if (window.confirm('Are you sure you want to delete this resume?')) {
      try {
        if (isAI) {
          await deleteAIGeneratedResume(id);
          setAiResumes(aiResumes.filter(resume => resume.id !== id));
        } else {
          await deleteResume(id);
          setManualResumes(manualResumes.filter(resume => resume.id !== id));
        }
        toast.success('Resume deleted successfully');
      } catch (error) {
        console.error('Error deleting resume:', error);
        toast.error('Failed to delete resume');
      }
    }
  };

  const renderResumeCard = (resume, isAI = false) => (
    <motion.div
      key={resume.id}
      className="bg-dark-800/50 backdrop-blur-md p-6 rounded-lg shadow-lg hover:shadow-accent-500/30 transition-all duration-300"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          {isAI ? (
            <FiAward className="text-accent-400 text-2xl mr-3" />
          ) : (
            <FiUser className="text-blue-400 text-2xl mr-3" />
          )}
          <div>
            <h3 className="text-xl font-semibold text-white">
              {resume.title || 'Untitled Resume'}
            </h3>
            <p className="text-gray-400 text-sm">
              {new Date(resume.updated_at || resume.created_at).toLocaleDateString()}
              {isAI && resume.job_description && (
                <span className="ml-2 text-gray-500">
                  • {resume.job_description.job_title || 'AI Generated'}
                </span>
              )}
            </p>
          </div>
        </div>
        {isAI && (
          <span className="px-2 py-1 bg-accent-600/20 text-accent-400 rounded-full text-xs">
            AI Generated
          </span>
        )}
      </div>

      <div className="flex justify-between mt-6">
        <Link
          to={`/resume/${resume.id}${isAI ? '?type=ai' : ''}`}
          className="flex items-center px-3 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg text-sm transition-colors"
        >
          <FiEye className="mr-1" /> View
        </Link>
        <div className="flex space-x-2">
          {!isAI && (
            <Link
              to={`/resume/${resume.id}/edit`}
              className="flex items-center px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
            >
              <FiEdit className="mr-1" /> Edit
            </Link>
          )}
          <button
            onClick={() => handleDelete(resume.id, isAI)}
            className="flex items-center px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors"
          >
            <FiTrash2 className="mr-1" /> Delete
          </button>
        </div>
      </div>
    </motion.div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-accent-500" />
      </div>
    );
  }

  const allResumes = activeTab === 'ai' ? aiResumes : manualResumes;
  const hasResumes = allResumes.length > 0;

  return (
    <div className="min-h-screen bg-dark-900 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div className="flex items-center">
            <h1 className="text-3xl font-bold">My Resumes</h1>
          </div>
          <Link
            to="/create-resume"
            className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 bg-accent-600 hover:bg-accent-700 text-white font-semibold rounded-lg transition-colors"
          >
            <FiFileText className="mr-2" /> Create New Resume
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-700 mb-6">
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'manual'
                ? 'text-accent-400 border-b-2 border-accent-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('manual')}
          >
            Manual Resumes
            <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
              {manualResumes.length}
            </span>
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              activeTab === 'ai'
                ? 'text-accent-400 border-b-2 border-accent-400'
                : 'text-gray-400 hover:text-white'
            }`}
            onClick={() => setActiveTab('ai')}
          >
            AI Generated
            <span className="ml-2 bg-gray-700 text-gray-300 text-xs px-2 py-1 rounded-full">
              {aiResumes.length}
            </span>
          </button>
        </div>

        {/* Resumes Grid */}
        {hasResumes ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {allResumes.map((resume) => renderResumeCard(resume, activeTab === 'ai'))}
          </div>
        ) : (
          <div className="text-center py-16 bg-dark-800/50 rounded-lg">
            <FiFileText className="mx-auto text-5xl text-gray-600 mb-4" />
            <h3 className="text-xl font-medium text-gray-300">
              No {activeTab === 'ai' ? 'AI-generated' : 'manual'} resumes found
            </h3>
            <p className="text-gray-500 mt-2 mb-6">
              {activeTab === 'ai'
                ? "You haven't generated any AI resumes yet."
                : "You haven't created any manual resumes yet."}
            </p>
            <Link
              to="/create-resume"
              className="inline-flex items-center px-6 py-2 bg-accent-600 hover:bg-accent-700 text-white rounded-lg transition-colors"
            >
              <FiFileText className="mr-2" /> Create New Resume
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default MyResumesPage;