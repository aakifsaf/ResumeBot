import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchResumePreview, fetchAIGeneratedResumePreview } from '../api';
import { toast } from 'react-hot-toast';

function ResumePreviewPage() {
  const { id } = useParams();
  const [resume, setResume] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAIGenerated, setIsAIGenerated] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        // First try manual resume preview
        try {
          const response = await fetchResumePreview(id);
          setResume(response.data);
          setIsAIGenerated(false);
        } catch (manualError) {
          // If manual resume fails, try AI-generated resume
          try {
            const response = await fetchAIGeneratedResumePreview(id);
            setResume(response.data);
            setIsAIGenerated(true);
          } catch (aiError) {
            console.error('Error fetching resume:', manualError, aiError);
            toast.error('Failed to load resume');
          }
        }
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
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{resume.title}</h1>
            <p className="text-gray-600">{resume.status}</p>
          </div>

          {/* AI Generated Content */}
          {isAIGenerated && (
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap bg-gray-800 p-4 rounded-lg">
                {resume.generated_content}
              </pre>
            </div>
          )}

          {/* Manual Resume Sections */}
          {!isAIGenerated && (
            <>
              {/* Personal Information */}
              {resume.personal_info && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Personal Information</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {Object.entries(resume.personal_info).map(([key, value]) => (
                      value && (
                        <div key={key} className="space-y-1">
                          <p className="text-gray-600 font-medium">{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                          <p className="text-gray-800">{value}</p>
                        </div>
                      )
                    ))}
                  </div>
                </div>
              )}
              
              {resume.education && resume.education.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Education</h2>
                  <div className="space-y-6">
                    {resume.education.map((edu, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {edu.degree} at {edu.institution}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          {edu.start_date} - {edu.end_date || 'Present'}
                        </p>
                        <p className="text-gray-700">{edu.field_of_study}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Projects */}
              {resume.projects && resume.projects.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Projects</h2>
                  <div className="space-y-6">
                    {resume.projects.map((project, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {project.name}
                        </h3>
                        <div className="space-y-2">
                          {project.start_date && (
                            <p className="text-gray-600 mb-1">
                              {project.start_date} - {project.end_date || 'Present'}
                            </p>
                          )}
                          <p className="text-gray-700">{project.description}</p>
                          {project.technologies && (
                            <div className="mt-2">
                              <p className="text-gray-600 font-medium mb-1">Technologies:</p>
                              <div className="flex flex-wrap gap-2">
                                {Array.isArray(project.technologies) 
                                  ? project.technologies.map((tech, techIndex) => (
                                      <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {tech}
                                      </span>
                                    ))
                                  : project.technologies.split(',').map((tech, techIndex) => (
                                      <span key={techIndex} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                                        {tech.trim()}
                                      </span>
                                    ))
                                }
                              </div>
                            </div>
                          )}
                          {project.url && (
                            <div className="mt-2">
                              <a href={project.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800">
                                View Project
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.work_experiences && resume.work_experiences.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Work Experience</h2>
                  <div className="space-y-6">
                    {resume.work_experiences.map((exp, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {exp.position} at {exp.company}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          {exp.start_date} - {exp.end_date || 'Present'}
                        </p>
                        <p className="text-gray-700">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.skills && resume.skills.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Skills</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {resume.skills.map((skill, index) => (
                      <div key={index} className="bg-blue-50 p-4 rounded-lg">
                        <p className="font-medium text-gray-800">{skill.name}</p>
                        <p className="text-sm text-gray-600">{skill.proficiency}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {resume.certifications && resume.certifications.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Certifications</h2>
                  <div className="space-y-4">
                    {resume.certifications.map((cert, index) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4">
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">
                          {cert.name} - {cert.issuing_organization}
                        </h3>
                        <p className="text-gray-600 mb-1">
                          {cert.issue_date} - {cert.expiration_date || 'Valid'}
                        </p>
                        {cert.credential_id && (
                          <p className="text-gray-700">Credential ID: {cert.credential_id}</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResumePreviewPage;
