import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  FiUser, FiBookOpen, FiBriefcase, FiAward, 
  FiCode, FiGlobe, FiCheckCircle, FiPlus, FiTrash,
  FiEdit3, FiCalendar, FiMapPin, FiMail, FiPhone, FiHome
} from 'react-icons/fi';
import { 
  fetchResumeTemplates, 
  createResume, 
  generateResume,
  createJobDescription,
  fetchLatestGeneratedResume 
} from '../api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-hot-toast';

const ICON_MAP = {
  'minimal': FiUser,
  'creative': FiCode,
  'executive': FiBriefcase
};

function CreateResumePage() {
  const { user } = useAuth();
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [creationMode, setCreationMode] = useState('manual'); // 'manual' or 'ai'
  const [resumeData, setResumeData] = useState({
    template: null,
    title: '',
    status: 'draft',
    resume_file: null,
    job_description: '',
    file: null,
    raw_text: '',
  });
  const [workExperiences, setWorkExperiences] = useState([]);
  const [skills, setSkills] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      const response = await fetchResumeTemplates();
      setTemplates(response.data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Failed to load resume templates');
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    setResumeData(prev => ({
      ...prev,
      template: template.id
    }));
    setCurrentStep(2);
  };

  const addWorkExperience = () => {
    setWorkExperiences(prev => [...prev, {
      company: '',
      position: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: ''
    }]);
  };

  const removeWorkExperience = (index) => {
    setWorkExperiences(prev => prev.filter((_, i) => i !== index));
  };

  const handleWorkExperienceChange = (index, field) => (e) => {
    setWorkExperiences(prev => {
      const newExperiences = [...prev];
      newExperiences[index] = {
        ...newExperiences[index],
        [field]: e.target.value
      };
      return newExperiences;
    });
  };

  const addSkill = () => {
    setSkills(prev => [...prev, {
      name: '',
      proficiency: 'beginner'
    }]);
  };

  const removeSkill = (index) => {
    setSkills(prev => prev.filter((_, i) => i !== index));
  };

  const handleSkillChange = (index, field) => (e) => {
    setSkills(prev => {
      const newSkills = [...prev];
      newSkills[index] = {
        ...newSkills[index],
        [field]: e.target.value
      };
      return newSkills;
    });
  };

  const handleCreateResume = async () => {
    try {
      setIsLoading(true);
      const resumeDataToSend = {
        ...resumeData,
        work_experiences: workExperiences,
        skills: skills
      };

      const response = await createResume(resumeDataToSend);
      toast.success('Resume created successfully');
      // Redirect to preview page
      window.location.href = `/resume/${response.data.id}`;
    } catch (error) {
      console.error('Error creating resume:', error);
      toast.error('Failed to create resume');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    try {
      setIsLoading(true);
      // First create a job description
      const jobDescriptionResponse = await createJobDescription({
        raw_text: resumeData.raw_text
      });
      
      // Then generate the resume using the job description ID
      const response = await generateResume({
        job_description_id: jobDescriptionResponse.data.id
      });
      
      // Get the generated resume ID from the backend
      const generatedResumeResponse = await fetchLatestGeneratedResume();
      
      setResumeData(prev => ({
        ...prev,
        resume_file: response.data
      }));
      toast.success('Resume generated successfully');
      // Redirect to preview page
      window.location.href = `/resume/${generatedResumeResponse.data.id}`;
    } catch (error) {
      console.error('Error generating resume:', error);
      toast.error('Failed to generate resume');
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = ICON_MAP[selectedTemplate?.category];
  const renderStep1 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Choose a Template</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {templates.map((template) => (
          <motion.div
            key={template.id}
            className={`p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 ${
              selectedTemplate?.id === template.id 
                ? 'bg-blue-600/20 border-2 border-blue-600' 
                : 'hover:bg-blue-600/10'
            }`}
            whileHover={{ scale: 1.02 }}
            onClick={() => handleTemplateSelect(template)}
          >
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center">
                <div className="w-6 h-6 text-blue-600">
                {Icon ? (
                  <Icon className="w-6 h-6 text-blue-600" />
                ) : (
                  <FiBookOpen className="w-6 h-6 text-blue-600" />
                )}
                </div>
              </div>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{template.name}</h3>
            <p className="text-gray-400 text-sm">{template.description}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: template.primary_color }}></span>
              <span className="w-4 h-4 rounded-full" style={{ backgroundColor: template.secondary_color }}></span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">Resume Creation Mode</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div
          className={`p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 ${
            creationMode === 'manual' 
              ? 'bg-green-600/20 border-2 border-green-600' 
              : 'hover:bg-green-600/10'
          }`}
          whileHover={{ scale: 1.02 }}
          onClick={() => setCreationMode('manual')}
        >
          <h3 className="text-lg font-semibold text-white mb-2">Manual Creation</h3>
          <p className="text-gray-400 text-sm">Create your resume manually with full control over content and formatting.</p>
        </motion.div>
        <motion.div
          className={`p-6 rounded-lg shadow-lg cursor-pointer transition-all duration-300 ${
            creationMode === 'ai' 
              ? 'bg-blue-600/20 border-2 border-blue-600' 
              : 'hover:bg-blue-600/10'
          }`}
          whileHover={{ scale: 1.02 }}
          onClick={() => setCreationMode('ai')}
        >
          <h3 className="text-lg font-semibold text-white mb-2">AI Generation</h3>
          <p className="text-gray-400 text-sm">Generate a resume using AI based on your job description and profile.</p>
        </motion.div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    if (creationMode === 'manual') {
      return (
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Work Experience</h2>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Experience Details</h3>
              <button 
                onClick={addWorkExperience}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
              >
                Add Experience
              </button>
            </div>
            {workExperiences.map((exp, index) => (
              <div key={index} className="bg-dark-700/30 p-4 rounded-custom space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={handleWorkExperienceChange(index, 'company')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={handleWorkExperienceChange(index, 'position')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={exp.start_date}
                      onChange={handleWorkExperienceChange(index, 'start_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={exp.end_date}
                      onChange={handleWorkExperienceChange(index, 'end_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                  </div>
                </div>
                <div className="flex items-center mb-4">
                  <input
                    type="checkbox"
                    checked={exp.is_current}
                    onChange={(e) => handleWorkExperienceChange(index, 'is_current')(e)}
                    className="w-4 h-4 text-blue-400"
                  />
                  <label className="ml-2 text-gray-300">Current Position</label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                  <textarea
                    rows="3"
                    value={exp.description}
                    onChange={handleWorkExperienceChange(index, 'description')}
                    className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeWorkExperience(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">Skills</h2>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-300">Skills</h3>
              <button 
                onClick={addSkill}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
              >
                Add Skill
              </button>
            </div>
            {skills.map((skill, index) => (
              <div key={index} className="bg-dark-700/30 p-4 rounded-custom space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Skill Name</label>
                  <input
                    type="text"
                    value={skill.name}
                    onChange={handleSkillChange(index, 'name')}
                    className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-1">Proficiency</label>
                  <select
                    value={skill.proficiency}
                    onChange={handleSkillChange(index, 'proficiency')}
                    className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                    <option value="expert">Expert</option>
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => removeSkill(index)}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
      // AI generation step
      return (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white">Job Description</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Paste Job Description</label>
              <textarea
                rows="6"
                value={resumeData.raw_text}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  raw_text: e.target.value
                }))}
                className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Paste the job description here..."
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-1">Or Upload Job Description</label>
              <input
                type="file"
                accept=".txt,.pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (event) => {
                      setResumeData(prev => ({
                        ...prev,
                        job_description: event.target.result
                      }));
                    };
                    reader.readAsText(file);
                  }
                }}
                className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          </div>
          <button
            onClick={handleGenerateResume}
            className="w-full px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
          >
            Generate Resume
          </button>
        </div>
      );
    }
  };

  const renderNavigation = () => {
    const isLastStep = currentStep === 4;
    return (
      <div className="flex justify-between items-center mt-8">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            className="px-4 py-2 bg-gray-600/20 text-gray-400 rounded-custom hover:bg-gray-600/30 transition-custom"
          >
            Back
          </button>
        )}
        {isLastStep ? (
          <button
            onClick={handleCreateResume}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
          >
            Create Resume
          </button>
        ) : (
          <button
            onClick={() => setCurrentStep(prev => prev + 1)}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
          >
            Next
          </button>
        )}
      </div>
    );
  };

  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      className="min-h-screen bg-dark-900 text-dark-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Create Your Resume</h1>
          <p className="text-gray-400">Choose your preferred creation method and create a professional resume</p>
        </div>
        
        {errorMessage && (
          <div className="bg-red-600/20 text-red-400 p-4 rounded-custom mb-6">
            {errorMessage}
          </div>
        )}

        {currentStep === 1 && renderStep1()}
        {currentStep === 2 && renderStep2()}
        {currentStep === 3 && renderStep3()}
        {currentStep === 4 && renderNavigation()}

        {renderNavigation()}
      </div>
    </motion.div>
  );
}

export default CreateResumePage;
