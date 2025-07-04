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

  const formatAIContent = (content) => {
    if (!content) return null;
  
    // Clean unwanted symbols if backend accidentally sends them
    const cleanContent = content
      .replace(/```markdown/g, '')
      .replace(/```/g, '')
      .replace(/^#+\s*/gm, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s+|\s+$/g, '')
      .replace(/\n{3,}/g, '\n\n');
  
    // Split content by sections like "Professional Summary", "Work Experience", etc.
    const processContent = (text) => {
      return text.split(/\n(?=[A-Z][^\n]+(\sExperience|\sSummary|\sProjects|\sSkills|\sCertifications))/)
        .filter(section => section.trim())
        .map(section => {
          const lines = section.trim().split('\n');
          const title = lines[0].trim();
          const content = lines.slice(1).join('\n').trim();
          return { title, content };
        });
    };
  
    const sections = processContent(cleanContent);
  
    return (
      <div className="space-y-8">
        {sections.map((section, index) => {
          const lowerTitle = section.title.toLowerCase();
          const lines = section.content.split('\n').filter(line => line.trim());
  
          // Work Experience or Projects
          if (lowerTitle.includes('experience') || lowerTitle.includes('projects')) {
            const entries = [];
            let currentEntry = null;
  
            lines.forEach(line => {
              if (!line.startsWith('-')) {
                if (currentEntry) entries.push(currentEntry);
                currentEntry = { title: line.trim(), points: [] };
              } else {
                currentEntry?.points.push(line.replace(/^-/, '').trim());
              }
            });
            if (currentEntry) entries.push(currentEntry);
  
            return (
              <div key={index}>
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-1">{section.title}</h2>
                {entries.map((entry, i) => (
                  <div key={i} className="pl-4 border-l-2 border-blue-200 mb-4">
                    <h3 className="text-base font-semibold mb-2">{entry.title}</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      {entry.points.map((point, j) => (
                        <li key={j} className="text-gray-700">{point}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            );
          }
  
          // Skills Section
          if (lowerTitle.includes('skills')) {
            const skillsSections = processContent(section.content);
            return (
              <div key={index}>
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-1">{section.title}</h2>
                {skillsSections.map((skillSection, i) => {
                  const items = skillSection.content.split('-').filter(item => item.trim());
                  return (
                    <div key={i} className="mb-2">
                      <h3 className="text-base font-semibold mb-1">{skillSection.title}</h3>
                      <div className="flex flex-wrap gap-2">
                        {items.map((item, j) => (
                          <span key={j} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {item.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          }
  
          // Certifications Section
          if (lowerTitle.includes('certifications')) {
            const items = section.content.split('-').filter(item => item.trim());
            return (
              <div key={index}>
                <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-1">{section.title}</h2>
                <ul className="list-disc pl-5 space-y-1">
                  {items.map((item, i) => (
                    <li key={i} className="text-gray-700">{item.trim()}</li>
                  ))}
                </ul>
              </div>
            );
          }
  
          // Default Paragraph Section (e.g., Professional Summary)
          return (
            <div key={index}>
              <h2 className="text-xl font-bold text-gray-800 mb-3 border-b pb-1">{section.title}</h2>
              <p className="text-gray-700">{section.content}</p>
            </div>
          );
        })}
      </div>
    );
  };
  

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
      <div className="rounded-lg shadow-lg p-8">
        <div className="space-y-8">

          {isAIGenerated && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Professional Profile</h2>
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                {formatAIContent(resume.generated_content)}
              </div>
            </div>
          )}

          {/* Manual Resume Sections */}
          {!isAIGenerated && (
  <>
    {resume.personal_info && (
      <section>
        <h2>Personal Information</h2>
        <ul>
          {Object.entries(resume.personal_info).map(([key, value]) => (
            value && (
              <li key={key}>
                <strong>{key.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}:</strong> {value}
              </li>
            )
          ))}
        </ul>
      </section>
    )}

    {resume.education && resume.education.length > 0 && (
      <section>
        <h2>Education</h2>
        <ul>
          {resume.education.map((edu, index) => (
            <li key={index}>
              <strong>{edu.degree}</strong> at {edu.institution} ({edu.start_date} - {edu.end_date || 'Present'})  
              {edu.field_of_study && <div>Field of Study: {edu.field_of_study}</div>}
            </li>
          ))}
        </ul>
      </section>
    )}

    {resume.projects && resume.projects.length > 0 && (
      <section>
        <h2>Projects</h2>
        <ul>
          {resume.projects.map((project, index) => (
            <li key={index}>
              <strong>{project.name}</strong>  
              {project.start_date && <> ({project.start_date} - {project.end_date || 'Present'})</>}  
              {project.description && <div>{project.description}</div>}
              {project.technologies && (
                <div>
                  <strong>Technologies:</strong> {Array.isArray(project.technologies) 
                    ? project.technologies.join(', ')
                    : project.technologies}
                </div>
              )}
              {project.url && (
                <div>
                  <strong>Project Link:</strong> {project.url}
                </div>
              )}
            </li>
          ))}
        </ul>
      </section>
    )}

    {resume.work_experiences && resume.work_experiences.length > 0 && (
      <section>
        <h2>Work Experience</h2>
        <ul>
          {resume.work_experiences.map((exp, index) => (
            <li key={index}>
              <strong>{exp.position}</strong> at {exp.company} ({exp.start_date} - {exp.end_date || 'Present'})  
              {exp.description && <div>{exp.description}</div>}
            </li>
          ))}
        </ul>
      </section>
    )}

    {resume.skills && resume.skills.length > 0 && (
      <section>
        <h2>Skills</h2>
        <ul>
          {resume.skills.map((skill, index) => (
            <li key={index}>
              {skill.name} {skill.proficiency && <> - {skill.proficiency}</>}
            </li>
          ))}
        </ul>
      </section>
    )}

    {resume.certifications && resume.certifications.length > 0 && (
      <section>
        <h2>Certifications</h2>
        <ul>
          {resume.certifications.map((cert, index) => (
            <li key={index}>
              <strong>{cert.name}</strong> - {cert.issuing_organization}  
              {cert.issue_date && <> ({cert.issue_date} - {cert.expiration_date || 'Valid'})</>}  
              {cert.credential_id && <div>Credential ID: {cert.credential_id}</div>}
            </li>
          ))}
        </ul>
      </section>
    )}
  </>
)}

        </div>
      </div>
    </div>
  );
}

export default ResumePreviewPage;
