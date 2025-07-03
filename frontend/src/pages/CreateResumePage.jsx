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
  fetchLatestGeneratedResume,
  createManualResume 
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
    personal_info: {
      full_name: '',
      email: '',
      phone: '',
      address: '',
      linkedin: '',
      github: '',
      website: ''
    }
  });
  const [education, setEducation] = useState([]);
  const [projects, setProjects] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [languages, setLanguages] = useState([]);
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
    // Move to next step automatically after template selection
    handleNext();
  };

  const handleCreationModeSelect = (mode) => {
    setCreationMode(mode);
    // Move to next step automatically after mode selection
    handleNext();
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

  const addEducation = () => {
    setEducation(prev => [...prev, {
      institution: '',
      degree: '',
      field_of_study: '',
      start_date: '',
      end_date: '',
      is_current: false,
      description: ''
    }]);
  };

  const addProject = () => {
    setProjects(prev => [...prev, {
      name: '',
      description: '',
      technologies: '',
      start_date: '',
      end_date: '',
      is_current: false,
      url: ''
    }]);
  };

  const addCertification = () => {
    setCertifications(prev => [...prev, {
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiration_date: '',
      credential_id: '',
      credential_url: ''
    }]);
  };

  const addLanguage = () => {
    setLanguages(prev => [...prev, {
      name: '',
      proficiency: 'basic' // basic, conversational, proficient, fluent, native
    }]);
  };

  const handleArrayFieldChange = (array, setArray, index, field) => (e) => {
    const newArray = [...array];
    newArray[index] = {
      ...newArray[index],
      [field]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
    };
    setArray(newArray);
  };

  // Step 1: Template Selection
  const validateStep1 = () => {
    const errors = [];
    if (!resumeData.template) {
      errors.push('Please select a template');
    }
    return errors;
  };

  // Step 2: Creation Mode Selection (no validation needed as both options are valid)
  const validateStep2 = () => {
    return [];
  };

  // Step 3: Personal Information (for manual mode) or Job Description (for AI mode)
  const validateStep3 = () => {
    const errors = [];
    
    if (creationMode === 'manual') {
      if (!resumeData.template) {
        errors.push('Please select a template');
      }
      if (!resumeData.title) {
        errors.push('Please enter a title for your resume');
      }
      
      // Check if we have at least one work experience
      if (workExperiences.length === 0) {
        errors.push('Please add at least one work experience');
      }
      
      // Check if we have at least one skill
      if (skills.length === 0) {
        errors.push('Please add at least one skill');
      }
    } else {
      // AI mode validation
      if (!resumeData.raw_text) {
        errors.push('Please enter or paste the job description');
      }
    }
    
    return errors;
  };

  // Step 4: Additional Information (manual mode only)
  const validateStep4 = () => {
    if (creationMode === 'ai') return [];
    
    const errors = [];
    
    if (workExperiences.length === 0) {
      errors.push('Please add at least one work experience');
    } else {
      workExperiences.forEach((exp, index) => {
        if (!exp.company) {
          errors.push(`Company name is required for work experience #${index + 1}`);
        }
        if (!exp.position) {
          errors.push(`Position is required for work experience #${index + 1}`);
        }
      });
    }

    if (skills.length === 0) {
      errors.push('Please add at least one skill');
    }

    if (education.length === 0) {
      errors.push('Please add at least one education entry');
    }
    
    return errors;
  };

  // Check if current step is valid (without showing errors)
  const isCurrentStepValid = () => {
    const validators = {
      1: validateStep1,
      2: validateStep2,
      3: validateStep3,
      4: validateStep4,
    };
    const validator = validators[currentStep];
    return !validator || validator().length === 0;
  };

  // Show validation errors for current step
  const showCurrentStepErrors = () => {
    const validators = {
      1: validateStep1,
      2: validateStep2,
      3: validateStep3,
      4: validateStep4,
    };
    const validator = validators[currentStep];
    if (validator) {
      const errors = validator();
      errors.forEach(error => toast.error(error));
      return errors.length === 0;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1) {
      // After template selection, go to mode selection
      setCurrentStep(2);
    } else if (currentStep === 2) {
      // After mode selection, go to the final step
      setCurrentStep(3);
    } else if (showCurrentStepErrors()) {
      // For both modes, proceed to next step if validation passes
      setCurrentStep(prevStep => Math.min(prevStep + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prevStep => Math.max(prevStep - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate only the relevant steps
    const allErrors = [
      ...validateStep1(),
      ...validateStep2(),
      ...validateStep3()
    ];

    if (allErrors.length > 0) {
      allErrors.forEach(error => toast.error(error));
      return;
    }

    await handleCreateResume();
  };

  // Update the navigation buttons to use isCurrentStepValid for disabled state
  // This prevents the validation from running on every render
  const isNextDisabled = currentStep === 3 || !isCurrentStepValid();

  const handleCreateResume = async () => {
    try {
      // Validate only the relevant steps
      const allErrors = [
        ...validateStep1(),
        ...validateStep2(),
        ...validateStep3()
      ];

      if (allErrors.length > 0) {
        allErrors.forEach(error => toast.error(error));
        return;
      }

      setIsLoading(true);
      
      // Prepare the resume data based on the creation mode
      const resumeDataToSend = {
        user: user.id,  // Add the user ID
        template: resumeData.template,
        title: resumeData.title,
        status: 'completed',
        personal_info: resumeData.personal_info,
        work_experiences: workExperiences,
        education,
        projects,
        certifications,
        languages,
        skills
      };

      console.log('Sending resume data:', resumeDataToSend);

      let response;
      if (creationMode === 'ai') {
        // For AI mode, first create a job description
        const jobDescResponse = await createJobDescription({
          raw_text: resumeData.raw_text
        });
        
        // Then generate the resume
        response = await generateResume({
          job_description_id: jobDescResponse.data.id,
          template_id: resumeData.template
        });
      } else {
        // For manual mode, create the resume directly
        response = await createManualResume(resumeDataToSend);
      }
      
      if (response && response.data && response.data.id) {
        toast.success('Resume created successfully');
        window.location.href = `/resume/${response.data.id}`;
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error) {
      console.error('Error creating resume:', error);
      
      if (error.response) {
        // The request was made and the server responded with an error
        const errorMessage = error.response.data?.detail || error.response.statusText;
        toast.error(`Server error: ${errorMessage}`);
      } else if (error.request) {
        // The request was made but no response was received
        toast.error('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request
        toast.error(`Request error: ${error.message}`);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateResume = async () => {
    try {
      setIsLoading(true);
      
      const jobDescriptionResponse = await createJobDescription({
        raw_text: resumeData.raw_text
      });
      
      const response = await generateResume({
        job_description_id: jobDescriptionResponse.data.id
      });
      
      const generatedResumeResponse = await fetchLatestGeneratedResume();
      
      setResumeData(prev => ({
        ...prev,
        resume_file: response.data
      }));
      toast.success('Resume generated successfully');
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
          onClick={() => handleCreationModeSelect('manual')}
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
          onClick={() => handleCreationModeSelect('ai')}
        >
          <h3 className="text-lg font-semibold text-white mb-2">AI-Powered Creation</h3>
          <p className="text-gray-400 text-sm">Let our AI generate a resume based on a job description.</p>
        </motion.div>
      </div>
    </div>
  );

  const renderStep3 = () => {
    if (creationMode === 'manual') {
      return (
        <div className="space-y-6">
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Resume Title</label>
                <input
                  type="text"
                  value={resumeData.title}
                  onChange={(e) => setResumeData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter a title for your resume"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                <input
                  type="text"
                  value={resumeData.personal_info.full_name}
                  onChange={(e) => handleArrayFieldChange([resumeData.personal_info], (newVal) => setResumeData(prev => ({...prev, personal_info: newVal[0]})), 0, 'full_name')(e)}
                  className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                <input
                  type="email"
                  value={resumeData.personal_info.email}
                  onChange={(e) => handleArrayFieldChange([resumeData.personal_info], (newVal) => setResumeData(prev => ({...prev, personal_info: newVal[0]})), 0, 'email')(e)}
                  className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                <input
                  type="tel"
                  value={resumeData.personal_info.phone}
                  onChange={(e) => handleArrayFieldChange([resumeData.personal_info], (newVal) => setResumeData(prev => ({...prev, personal_info: newVal[0]})), 0, 'phone')(e)}
                  className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Address</label>
                <input
                  type="text"
                  value={resumeData.personal_info.address}
                  onChange={(e) => handleArrayFieldChange([resumeData.personal_info], (newVal) => setResumeData(prev => ({...prev, personal_info: newVal[0]})), 0, 'address')(e)}
                  className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">LinkedIn</label>
                <input
                  type="url"
                  value={resumeData.personal_info.linkedin}
                  onChange={(e) => handleArrayFieldChange([resumeData.personal_info], (newVal) => setResumeData(prev => ({...prev, personal_info: newVal[0]})), 0, 'linkedin')(e)}
                  className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">GitHub</label>
                <input
                  type="url"
                  value={resumeData.personal_info.github}
                  onChange={(e) => handleArrayFieldChange([resumeData.personal_info], (newVal) => setResumeData(prev => ({...prev, personal_info: newVal[0]})), 0, 'github')(e)}
                  className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Website</label>
                <input
                  type="url"
                  value={resumeData.personal_info.website}
                  onChange={(e) => handleArrayFieldChange([resumeData.personal_info], (newVal) => setResumeData(prev => ({...prev, personal_info: newVal[0]})), 0, 'website')(e)}
                  className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Education</h2>
              <button
                onClick={addEducation}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
              >
                Add Education
              </button>
            </div>
            {education.map((edu, index) => (
              <div key={index} className="bg-dark-700/30 p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">Education #{index + 1}</h3>
                  <button
                    onClick={() => {
                      const newEdus = [...education];
                      newEdus.splice(index, 1);
                      setEducation(newEdus);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Institution</label>
                    <input
                      type="text"
                      value={edu.institution}
                      onChange={handleArrayFieldChange(education, setEducation, index, 'institution')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Degree</label>
                    <input
                      type="text"
                      value={edu.degree}
                      onChange={handleArrayFieldChange(education, setEducation, index, 'degree')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Field of Study</label>
                    <input
                      type="text"
                      value={edu.field_of_study}
                      onChange={handleArrayFieldChange(education, setEducation, index, 'field_of_study')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={edu.start_date}
                      onChange={handleArrayFieldChange(education, setEducation, index, 'start_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`edu-current-${index}`}
                        checked={edu.is_current}
                        onChange={(e) => {
                          const newEdus = [...education];
                          newEdus[index] = {
                            ...newEdus[index],
                            is_current: e.target.checked,
                            end_date: e.target.checked ? '' : newEdus[index].end_date
                          };
                          setEducation(newEdus);
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`edu-current-${index}`} className="ml-2 text-sm text-gray-300">
                        Currently Attending
                      </label>
                    </div>
                  </div>
                  {!edu.is_current && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                      <input
                        type="date"
                        value={edu.end_date}
                        onChange={handleArrayFieldChange(education, setEducation, index, 'end_date')}
                        className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                      />
                    </div>
                  )}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      rows="3"
                      value={edu.description}
                      onChange={handleArrayFieldChange(education, setEducation, index, 'description')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Projects</h2>
              <button
                onClick={addProject}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
              >
                Add Project
              </button>
            </div>
            {projects.map((project, index) => (
              <div key={index} className="bg-dark-700/30 p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">Project #{index + 1}</h3>
                  <button
                    onClick={() => {
                      const newProjects = [...projects];
                      newProjects.splice(index, 1);
                      setProjects(newProjects);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                    <input
                      type="text"
                      value={project.name}
                      onChange={handleArrayFieldChange(projects, setProjects, index, 'name')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Technologies</label>
                    <input
                      type="text"
                      value={project.technologies}
                      onChange={handleArrayFieldChange(projects, setProjects, index, 'technologies')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                      placeholder="React, Node.js, etc."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={project.start_date}
                      onChange={handleArrayFieldChange(projects, setProjects, index, 'start_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={project.end_date}
                      onChange={handleArrayFieldChange(projects, setProjects, index, 'end_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Project URL</label>
                    <input
                      type="url"
                      value={project.url}
                      onChange={handleArrayFieldChange(projects, setProjects, index, 'url')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                      placeholder="https://example.com/project"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      rows="3"
                      value={project.description}
                      onChange={handleArrayFieldChange(projects, setProjects, index, 'description')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Work Experience</h2>
              <button
                onClick={addWorkExperience}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
              >
                Add Experience
              </button>
            </div>
            {workExperiences.map((exp, index) => (
              <div key={index} className="bg-dark-700/30 p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">Experience #{index + 1}</h3>
                  <button
                    onClick={() => {
                      const newExps = [...workExperiences];
                      newExps.splice(index, 1);
                      setWorkExperiences(newExps);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Company</label>
                    <input
                      type="text"
                      value={exp.company}
                      onChange={handleArrayFieldChange(workExperiences, setWorkExperiences, index, 'company')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Position</label>
                    <input
                      type="text"
                      value={exp.position}
                      onChange={handleArrayFieldChange(workExperiences, setWorkExperiences, index, 'position')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={exp.start_date}
                      onChange={handleArrayFieldChange(workExperiences, setWorkExperiences, index, 'start_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                    <input
                      type="date"
                      value={exp.end_date}
                      onChange={handleArrayFieldChange(workExperiences, setWorkExperiences, index, 'end_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id={`exp-current-${index}`}
                        checked={exp.is_current}
                        onChange={(e) => {
                          const newExps = [...workExperiences];
                          newExps[index] = {
                            ...newExps[index],
                            is_current: e.target.checked,
                            end_date: e.target.checked ? '' : newExps[index].end_date
                          };
                          setWorkExperiences(newExps);
                        }}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                      />
                      <label htmlFor={`exp-current-${index}`} className="ml-2 text-sm text-gray-300">
                        Currently Working
                      </label>
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                    <textarea
                      rows="3"
                      value={exp.description}
                      onChange={handleArrayFieldChange(workExperiences, setWorkExperiences, index, 'description')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Certifications</h2>
              <button
                onClick={addCertification}
                className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-colors"
              >
                Add Certification
              </button>
            </div>
            {certifications.map((cert, index) => (
              <div key={index} className="bg-dark-700/30 p-6 rounded-xl space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">Certification #{index + 1}</h3>
                  <button
                    onClick={() => {
                      const newCerts = [...certifications];
                      newCerts.splice(index, 1);
                      setCertifications(newCerts);
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    <FiTrash />
                  </button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Certification Name</label>
                    <input
                      type="text"
                      value={cert.name}
                      onChange={handleArrayFieldChange(certifications, setCertifications, index, 'name')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Issuing Organization</label>
                    <input
                      type="text"
                      value={cert.issuing_organization}
                      onChange={handleArrayFieldChange(certifications, setCertifications, index, 'issuing_organization')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Issue Date</label>
                    <input
                      type="date"
                      value={cert.issue_date}
                      onChange={handleArrayFieldChange(certifications, setCertifications, index, 'issue_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expiration Date</label>
                    <input
                      type="date"
                      value={cert.expiration_date}
                      onChange={handleArrayFieldChange(certifications, setCertifications, index, 'expiration_date')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Credential ID</label>
                    <input
                      type="text"
                      value={cert.credential_id}
                      onChange={handleArrayFieldChange(certifications, setCertifications, index, 'credential_id')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Credential URL</label>
                    <input
                      type="url"
                      value={cert.credential_url}
                      onChange={handleArrayFieldChange(certifications, setCertifications, index, 'credential_url')}
                      className="w-full px-4 py-2 bg-dark-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    } else {
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
    const isLastStep = currentStep === 3;
    const isNextDisabled = currentStep === 3 || !isCurrentStepValid();
  
    return (
      <div className="flex justify-between items-center mt-8">
        {currentStep > 1 && (
          <button
            onClick={() => setCurrentStep(prev => prev - 1)}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-600/20 text-gray-400 rounded-custom hover:bg-gray-600/30 transition-custom disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Back
          </button>
        )}
        {isLastStep ? (
          <button
            onClick={handleSubmit}
            disabled={isLoading || !isCurrentStepValid()}
            className={`px-4 py-2 rounded-custom transition-custom ${
              isLoading || !isCurrentStepValid()
                ? 'bg-blue-600/10 text-blue-400/50 cursor-not-allowed'
                : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
            }`}
          >
            {isLoading ? 'Creating...' : 'Create Resume'}
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className={`px-4 py-2 rounded-custom transition-custom ${
              isNextDisabled
                ? 'bg-blue-600/10 text-blue-400/50 cursor-not-allowed'
                : 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30'
            }`}
          >
            Next
          </button>
        )}
      </div>
    );
  };

  const renderFormContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return null;
    }
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

        {renderFormContent()}
        {renderNavigation()}
      </div>
    </motion.div>
  );
}

export default CreateResumePage;
