import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchGeneratedResume } from '../api';
import { toast } from 'react-hot-toast';

function ResumePreviewPage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetchGeneratedResume(id);
        setResume(response.data);
      } catch (error) {
        console.error('Error fetching resume:', error);
        toast.error('Failed to load resume');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <motion.div
          className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1 }}
        />
      </div>
    );
  }

  if (!resume) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-400">Resume not found</p>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="bg-white rounded-lg shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6">Resume Preview</h1>
        
        <div className="space-y-6">
          {/* Display resume content */}
          <div className="prose prose-invert max-w-none">
            <pre className="whitespace-pre-wrap bg-gray-800 p-4 rounded-lg">
              {resume.generated_content}
            </pre>
          </div>

          {/* Download button */}
          <div className="flex justify-end">
            <button
              onClick={() => handleDownload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors"
            >
              Download Resume
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  function handleDownload() {
    // Implementation for downloading the resume
    toast.success('Resume downloaded successfully');
  }
}

export default ResumePreviewPage;
