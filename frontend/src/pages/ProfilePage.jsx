import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import { 
  FiUser, FiMail, FiEdit3, FiPhone, 
  FiMapPin, FiBriefcase, FiLink, 
  FiGitBranch, FiGlobe, FiFileText,
  FiPlus, FiTrash, FiClock, FiCalendar,
  FiHome, FiFolder, FiAward,
  FiCode, FiLinkedin, FiGithub
} from 'react-icons/fi';
import _ from 'lodash';
import { toast } from 'react-hot-toast';
import { 
  fetchUserProfile, 
  addSkill, addExperience, addProject, addCertification,
  deleteSkill, deleteExperience, deleteProject, deleteCertification,
  updateSkill, updateExperience, updateProject, updateCertification
} from '../api';

const ProfilePage = () => {
  const { user, updateUserProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('personal');
  const [profileData, setProfileData] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [isFormDirty, setIsFormDirty] = useState(false);

  // State for inputs
  const [skillInputs, setSkillInputs] = useState([]);
  const [experienceInputs, setExperienceInputs] = useState([]);
  const [projectInputs, setProjectInputs] = useState([]);
  const [certificationInputs, setCertificationInputs] = useState([]);

  // Add a new empty skill input
  const addSkillInput = () => {
    setSkillInputs(prev => [...prev, { name: '', proficiency: 'beginner' }]);
  };

  // Remove a skill input
  const removeSkillInput = (index) => {
    setSkillInputs(prev => prev.filter((_, i) => i !== index));
  };

  // Handle skill input change
  const handleSkillInputChange = (index, field) => (e) => {
    setSkillInputs(prev => {
      const newInputs = [...prev];
      newInputs[index] = {
        ...newInputs[index],
        [field]: e.target.value
      };
      return newInputs;
    });
  };

  // Handle proficiency change
  const handleProficiencyChange = (index) => (e) => {
    setSkillInputs(prev => {
      const newInputs = [...prev];
      newInputs[index] = {
        ...newInputs[index],
        proficiency: e.target.value
      };
      return newInputs;
    });
  };

  // Save all skill inputs
  const saveSkills = async () => {
    try {
      setIsLoading(true);
      const newSkills = await Promise.all(
        skillInputs.map(async (skill) => {
          if (skill.name.trim()) {
            return addSkill(skill);
          }
          return null;
        })
      );
      
      // Filter out null values (empty skills)
      const validSkills = newSkills.filter(skill => skill !== null);
      
      if (validSkills.length > 0) {
        setProfileData(prev => ({
          ...prev,
          skills: [...(prev.skills || []), ...validSkills.map(skill => skill.data)]
        }));
        toast.success('Skills added successfully');
      }
      
      // Clear the input fields after saving
      setSkillInputs([]);
    } catch (error) {
      console.error('Error adding skills:', error);
      toast.error('Failed to add skills');
    } finally {
      setIsLoading(false);
    }
  };

  // Input handlers for experiences
  const addExperienceInput = () => {
    setExperienceInputs(prev => [...prev, {
      company_name: '',
      job_title: '',
      start_date: '',
      end_date: '',
      location: '',
      description: ''
    }]);
  };

  const removeExperienceInput = (index) => {
    setExperienceInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleExperienceInputChange = (index, field) => (e) => {
    setExperienceInputs(prev => {
      const newInputs = [...prev];
      newInputs[index] = {
        ...newInputs[index],
        [field]: e.target.value
      };
      return newInputs;
    });
  };

  const saveExperiences = async () => {
    try {
      setIsLoading(true);
      const newExperiences = await Promise.all(
        experienceInputs.map(async (exp) => {
          if (exp.company_name.trim()) {
            const { profile, ...experienceData } = exp;
            return addExperience(experienceData);
          }
          return null;
        })
      );
      
      const validExperiences = newExperiences.filter(exp => exp !== null);
      
      if (validExperiences.length > 0) {
        setProfileData(prev => ({
          ...prev,
          experiences: [...(prev.experiences || []), ...validExperiences.map(exp => exp.data)]
        }));
        toast.success('Experiences added successfully');
      }
      
      setExperienceInputs([]);
    } catch (error) {
      console.error('Error adding experiences:', error);
      toast.error('Failed to add experiences');
    } finally {
      setIsLoading(false);
    }
  };

  // Input handlers for projects
  const addProjectInput = () => {
    setProjectInputs(prev => [...prev, {
      project_name: '',
      description: '',
      project_url: '',
      technologies_used: ''
    }]);
  };

  const removeProjectInput = (index) => {
    setProjectInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleProjectInputChange = (index, field) => (e) => {
    setProjectInputs(prev => {
      const newInputs = [...prev];
      newInputs[index] = {
        ...newInputs[index],
        [field]: e.target.value
      };
      return newInputs;
    });
  };

  const saveProjects = async () => {
    try {
      setIsLoading(true);
      const newProjects = await Promise.all(
        projectInputs.map(async (proj) => {
          if (proj.project_name.trim()) {
            return addProject(proj);
          }
          return null;
        })
      );
      
      const validProjects = newProjects.filter(proj => proj !== null);
      
      if (validProjects.length > 0) {
        setProfileData(prev => ({
          ...prev,
          projects: [...(prev.projects || []), ...validProjects.map(proj => proj.data)]
        }));
        toast.success('Projects added successfully');
      }
      
      setProjectInputs([]);
    } catch (error) {
      console.error('Error adding projects:', error);
      toast.error('Failed to add projects');
    } finally {
      setIsLoading(false);
    }
  };

  // Input handlers for certifications
  const addCertificationInput = () => {
    setCertificationInputs(prev => [...prev, {
      name: '',
      issuing_organization: '',
      issue_date: '',
      expiration_date: '',
      credential_id: '',
      credential_url: ''
    }]);
  };

  const removeCertificationInput = (index) => {
    setCertificationInputs(prev => prev.filter((_, i) => i !== index));
  };

  const handleCertificationInputChange = (index, field) => (e) => {
    setCertificationInputs(prev => {
      const newInputs = [...prev];
      newInputs[index] = {
        ...newInputs[index],
        [field]: e.target.value
      };
      return newInputs;
    });
  };

  const saveCertifications = async () => {
    try {
      setIsLoading(true);
      const newCertifications = await Promise.all(
        certificationInputs.map(async (cert) => {
          if (cert.name.trim()) {
            return addCertification(cert);
          }
          return null;
        })
      );
      
      const validCertifications = newCertifications.filter(cert => cert !== null);
      
      if (validCertifications.length > 0) {
        setProfileData(prev => ({
          ...prev,
          certifications: [...(prev.certifications || []), ...validCertifications.map(cert => cert.data)]
        }));
        toast.success('Certifications added successfully');
      }
      
      setCertificationInputs([]);
    } catch (error) {
      console.error('Error adding certifications:', error);
      toast.error('Failed to add certifications');
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize form data when user changes
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setIsLoading(true);
        setMessage({ type: '', content: '' });

        // Fetch user profile
        const profileResponse = await fetchUserProfile();
        const profileData = profileResponse.data;
        setUserId(profileData.id);
        setProfileData(profileData);

      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ type: 'error', content: 'Failed to load profile data' });
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchUserData();
    }
  }, [user]);

  // Handle adding new items
  const addToArray = async (type) => {
    try {
      setIsLoading(true);
      switch (type) {
        case 'skills':
          const newSkill = await addSkill({
            name: '',
            proficiency: 'beginner'
          });
          setProfileData(prev => ({
            ...prev,
            skills: [...(prev.skills || []), newSkill.data]
          }));
          break;

        case 'experiences':
          const newExperience = await addExperience({
            company_name: '',
            job_title: '',
            start_date: '',
            end_date: '',
            description: '',
            location: ''
          });
          setProfileData(prev => ({
            ...prev,
            experiences: [...(prev.experiences || []), newExperience.data]
          }));
          break;

        case 'projects':
          const newProject = await addProject({
            project_name: '',
            description: '',
            project_url: '',
            technologies_used: ''
          });
          setProfileData(prev => ({
            ...prev,
            projects: [...(prev.projects || []), newProject.data]
          }));
          break;

        case 'certifications':
          const newCertification = await addCertification({
            name: '',
            issuing_organization: '',
            issue_date: '',
            expiration_date: '',
            credential_id: '',
            credential_url: ''
          });
          setProfileData(prev => ({
            ...prev,
            certifications: [...(prev.certifications || []), newCertification.data]
          }));
          break;
      }
      toast.success('Item added successfully');
    } catch (error) {
      console.error('Error adding item:', error);
      toast.error('Failed to add item');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing items
  const removeFromArray = async (type, index) => {
    try {
      setIsLoading(true);
      switch (type) {
        case 'skills':
          await deleteSkill(profileData.skills[index].id);
          break;

        case 'experiences':
          await deleteExperience(profileData.experiences[index].id);
          break;

        case 'projects':
          await deleteProject(profileData.projects[index].id);
          break;

        case 'certifications':
          await deleteCertification(profileData.certifications[index].id);
          break;
      }
      setProfileData(prev => ({
        ...prev,
        [type]: prev[type].filter((_, i) => i !== index)
      }));
      toast.success('Item removed successfully');
    } catch (error) {
      console.error('Error removing item:', error);
      toast.error('Failed to remove item');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle updating items
  const handleArrayInputChange = async (type, index, field, value) => {
    try {
      setIsLoading(true);
      const itemId = profileData[type][index].id;
      switch (type) {
        case 'skills':
          await updateSkill(itemId, {
            [field]: value
          });
          break;

        case 'experiences':
          await updateExperience(itemId, {
            [field]: value
          });
          break;

        case 'projects':
          await updateProject(itemId, {
            [field]: value
          });
          break;

        case 'certifications':
          await updateCertification(itemId, {
            [field]: value
          });
          break;
      }
      setProfileData(prev => ({
        ...prev,
        [type]: prev[type].map((item, i) => 
          i === index ? { ...item, [field]: value } : item
        )
      }));
      toast.success('Item updated successfully');
    } catch (error) {
      console.error('Error updating item:', error);
      toast.error('Failed to update item');
    } finally {
      setIsLoading(false);
    }
  };

  // Track form changes
  useEffect(() => {
    if (profileData && user) {
      setIsFormDirty(!_.isEqual(profileData, user));
    }
  }, [profileData, user]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      // Prepare the data to send to backend
      const dataToSend = {
        full_name: profileData.full_name,
        email: profileData.email,
        phone_number: profileData.phone_number,
        location: profileData.location,
        summary: profileData.summary,
        linkedin_url: profileData.linkedin_url,
        github_url: profileData.github_url,
        portfolio_url: profileData.portfolio_url,
        skills: profileData.skills,
        experiences: profileData.experiences,
        projects: profileData.projects,
        certifications: profileData.certifications
      };

      // Update user profile
      await updateUserProfile(dataToSend);
      
      // Switch back to view mode
      setIsEditing(false);
      
      // Show success message
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error in handleSaveChanges:', error);
      toast.error('Failed to update profile. Please try again.');
    }
  };

  const handleCancelEdit = () => {
    if (user) {
      setProfileData({
        ...user,
        skills: Array.isArray(user.skills) ? user.skills : [],
        experiences: Array.isArray(user.experiences) ? user.experiences : [],
        projects: Array.isArray(user.projects) ? user.projects : [],
        certifications: Array.isArray(user.certifications) ? user.certifications : []
      });
    }
    setIsEditing(false);
  };

  if (!user) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 text-gray-400">
        Loading profile...
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-dark-900 text-dark-50 py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-2">Profile Details</h2>
          <p className="text-gray-400">Manage your professional information and showcase your skills and experience.</p>
        </div>
        {/* Show tabs only in edit mode */}
        {isEditing && (
          <div className="border-b border-gray-700 mb-6">
            <nav className="-mb-px flex flex-wrap">
              <button
                onClick={() => setActiveTab('personal')}
                className={`px-4 py-2 text-sm font-medium text-gray-300 border-b-2 ${
                  activeTab === 'personal'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent hover:text-gray-200'
                }`}
              >
                <FiUser className="inline-block mr-2" /> Personal Details
              </button>
              <button
                onClick={() => setActiveTab('skills')}
                className={`px-4 py-2 text-sm font-medium text-gray-300 border-b-2 ${
                  activeTab === 'skills'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent hover:text-gray-200'
                }`}
              >
                <FiCode className="inline-block mr-2" /> Skills
              </button>
              <button
                onClick={() => setActiveTab('experience')}
                className={`px-4 py-2 text-sm font-medium text-gray-300 border-b-2 ${
                  activeTab === 'experience'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent hover:text-gray-200'
                }`}
              >
                <FiBriefcase className="inline-block mr-2" /> Experience
              </button>
              <button
                onClick={() => setActiveTab('projects')}
                className={`px-4 py-2 text-sm font-medium text-gray-300 border-b-2 ${
                  activeTab === 'projects'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent hover:text-gray-200'
                }`}
              >
                <FiFolder className="inline-block mr-2" /> Projects
              </button>
              <button
                onClick={() => setActiveTab('certifications')}
                className={`px-4 py-2 text-sm font-medium text-gray-300 border-b-2 ${
                  activeTab === 'certifications'
                    ? 'border-primary-500 text-primary-400'
                    : 'border-transparent hover:text-gray-200'
                }`}
              >
                <FiAward className="inline-block mr-2" /> Certifications
              </button>
            </nav>
          </div>
        )}
        {message.content && (
          <motion.div 
            className={`mb-6 p-4 rounded-custom ${
              message.type === 'success' 
                ? 'bg-green-500/20 text-green-300' 
                : 'bg-red-500/20 text-red-300'
            }`}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {message.content}
          </motion.div>
        )}

{isEditing ? (
          <div className="space-y-6">
            {activeTab === 'personal' && (
              <div>
                <h3 className="text-lg font-semibold text-gray-300 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-300 mb-1">Full Name</label>
                    <div className="relative">
                      <FiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                      <input 
                        type="text" 
                        name="full_name" 
                        id="full_name" 
                        value={profileData?.full_name || ''} 
                        onChange={handleInputChange} 
                        className="w-full pl-10 pr-3 py-2.5 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                        placeholder="Your full name"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <div className="relative">
                      <FiMail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                      <input 
                        type="email" 
                        name="email" 
                        id="email" 
                        value={profileData?.email || ''} 
                        onChange={handleInputChange} 
                        className="w-full pl-10 pr-3 py-2.5 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                        placeholder="Your email address"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-300 mb-1">Phone</label>
                    <div className="relative">
                      <FiPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                      <input 
                        type="tel" 
                        name="phone_number" 
                        id="phone_number" 
                        value={profileData?.phone_number || ''} 
                        onChange={handleInputChange} 
                        className="w-full pl-10 pr-3 py-2.5 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                        placeholder="Your phone number"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="location" className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                    <div className="relative">
                      <FiMapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                      <input 
                        type="text" 
                        name="location" 
                        id="location" 
                        value={profileData?.location || ''} 
                        onChange={handleInputChange} 
                        className="w-full pl-10 pr-3 py-2.5 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                        placeholder="City, Country"
                        required
                      />
                    </div>
                  </div>

                  <div className="col-span-2">
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-300 mb-1">Professional Summary</label>
                    <textarea 
                      name="summary" 
                      id="summary" 
                      value={profileData?.summary || ''} 
                      onChange={handleInputChange} 
                      className="w-full py-2 px-3 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                      placeholder="A brief summary of your professional experience and skills"
                      rows="4"
                    />
                  </div>

                  <div className="col-span-2">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="linkedin_url" className="block text-sm font-medium text-gray-300 mb-1">LinkedIn</label>
                        <div className="relative">
                          <FiLinkedin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                          <input 
                            type="url" 
                            name="linkedin_url" 
                            id="linkedin_url" 
                            value={profileData?.linkedin_url || ''} 
                            onChange={handleInputChange} 
                            className="w-full pl-10 pr-3 py-2.5 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                            placeholder="https://linkedin.com/in/your-profile"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="github_url" className="block text-sm font-medium text-gray-300 mb-1">GitHub</label>
                        <div className="relative">
                          <FiGithub className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                          <input 
                            type="url" 
                            name="github_url" 
                            id="github_url" 
                            value={profileData?.github_url || ''} 
                            onChange={handleInputChange} 
                            className="w-full pl-10 pr-3 py-2.5 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                            placeholder="https://github.com/your-username"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="portfolio_url" className="block text-sm font-medium text-gray-300 mb-1">Portfolio</label>
                        <div className="relative">
                          <FiGlobe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-400" />
                          <input 
                            type="url" 
                            name="portfolio_url" 
                            id="portfolio_url" 
                            value={profileData?.portfolio_url || ''} 
                            onChange={handleInputChange} 
                            className="w-full pl-10 pr-3 py-2.5 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                            placeholder="https://your-portfolio.com"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'skills' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">Skills</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={addSkillInput}
                      className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
                    >
                      Add Skill
                    </button>
                    {skillInputs.length > 0 && (
                      <button 
                        onClick={saveSkills}
                        className="px-4 py-2 bg-green-600/20 text-green-400 rounded-custom hover:bg-green-600/30 transition-custom"
                      >
                        Save All
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Dynamic skill inputs */}
                {skillInputs.map((skill, index) => (
                  <div key={index} className="flex gap-4 bg-dark-700/30 p-3 rounded-custom">
                    <input
                      type="text"
                      placeholder="Enter skill name"
                      value={skill.name}
                      onChange={handleSkillInputChange(index, 'name')}
                      className="flex-1 px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                    />
                    <select
                      value={skill.proficiency}
                      onChange={handleProficiencyChange(index)}
                      className="px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                      <option value="expert">Expert</option>
                    </select>
                    <button
                      onClick={() => removeSkillInput(index)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <FiTrash />
                    </button>
                  </div>
                ))}

                {/* Existing skills */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {profileData?.skills?.map((skill, index) => (
                    <div key={index} className="bg-dark-700/30 p-3 rounded-custom flex items-center justify-between">
                      <input 
                        type="text" 
                        value={typeof skill === 'string' ? skill : skill.name || ''} 
                        onChange={(e) => handleArrayInputChange('skills', index, 'name', e.target.value)}
                        className="flex-grow py-1 px-2 bg-dark-800 text-dark-50 rounded-custom focus:ring-2 focus:ring-primary-500 transition-custom"
                        placeholder="Enter a skill"
                      />
                      <button 
                        onClick={() => removeFromArray('skills', index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'experience' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">Work Experience</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={addExperienceInput}
                      className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
                    >
                      Add Experience
                    </button>
                    {experienceInputs.length > 0 && (
                      <button 
                        onClick={saveExperiences}
                        className="px-4 py-2 bg-green-600/20 text-green-400 rounded-custom hover:bg-green-600/30 transition-custom"
                      >
                        Save All
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Dynamic experience inputs */}
                {experienceInputs.map((exp, index) => (
                  <div key={index} className="bg-dark-700/30 p-4 rounded-custom space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Company Name</label>
                        <input
                          type="text"
                          value={exp.company_name}
                          onChange={handleExperienceInputChange(index, 'company_name')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Job Title</label>
                        <input
                          type="text"
                          value={exp.job_title}
                          onChange={handleExperienceInputChange(index, 'job_title')}
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
                          onChange={handleExperienceInputChange(index, 'start_date')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">End Date</label>
                        <input
                          type="date"
                          value={exp.end_date}
                          onChange={handleExperienceInputChange(index, 'end_date')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Location</label>
                        <input
                          type="text"
                          value={exp.location}
                          onChange={handleExperienceInputChange(index, 'location')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="flex justify-end">
                        <button
                          onClick={() => removeExperienceInput(index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea
                        rows="3"
                        value={exp.description}
                        onChange={handleExperienceInputChange(index, 'description')}
                        className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                  </div>
                ))}

                {/* Existing experiences */}
                <div className="space-y-4">
                  {profileData?.experiences?.map((exp, index) => (
                    <div key={index} className="bg-dark-700/30 p-4 rounded-custom">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-300">{exp.job_title}</h4>
                        <button 
                          onClick={() => removeFromArray('experiences', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">{exp.company_name}</p>
                      <p className="text-xs text-gray-400">{exp.start_date} - {exp.end_date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'projects' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">Projects</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={addProjectInput}
                      className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
                    >
                      Add Project
                    </button>
                    {projectInputs.length > 0 && (
                      <button 
                        onClick={saveProjects}
                        className="px-4 py-2 bg-green-600/20 text-green-400 rounded-custom hover:bg-green-600/30 transition-custom"
                      >
                        Save All
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Dynamic project inputs */}
                {projectInputs.map((proj, index) => (
                  <div key={index} className="bg-dark-700/30 p-4 rounded-custom space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Project Name</label>
                        <input
                          type="text"
                          value={proj.project_name}
                          onChange={handleProjectInputChange(index, 'project_name')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Project URL</label>
                        <input
                          type="url"
                          value={proj.project_url}
                          onChange={handleProjectInputChange(index, 'project_url')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Description</label>
                      <textarea
                        rows="3"
                        value={proj.description}
                        onChange={handleProjectInputChange(index, 'description')}
                        className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1">Technologies Used</label>
                      <input
                        type="text"
                        value={proj.technologies_used}
                        onChange={handleProjectInputChange(index, 'technologies_used')}
                        className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Comma-separated list"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeProjectInput(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Existing projects */}
                <div className="space-y-4">
                  {profileData?.projects?.map((proj, index) => (
                    <div key={index} className="bg-dark-700/30 p-4 rounded-custom">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-300">{proj.project_name}</h4>
                        <button 
                          onClick={() => removeFromArray('projects', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">{proj.description}</p>
                      <p className="text-xs text-gray-400">Technologies: {proj.technologies_used}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'certifications' && (
              <div className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-300">Certifications</h3>
                  <div className="flex gap-4">
                    <button 
                      onClick={addCertificationInput}
                      className="px-4 py-2 bg-blue-600/20 text-blue-400 rounded-custom hover:bg-blue-600/30 transition-custom"
                    >
                      Add Certification
                    </button>
                    {certificationInputs.length > 0 && (
                      <button 
                        onClick={saveCertifications}
                        className="px-4 py-2 bg-green-600/20 text-green-400 rounded-custom hover:bg-green-600/30 transition-custom"
                      >
                        Save All
                      </button>
                    )}
                  </div>
                </div>
                
                {/* Dynamic certification inputs */}
                {certificationInputs.map((cert, index) => (
                  <div key={index} className="bg-dark-700/30 p-4 rounded-custom space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Certification Name</label>
                        <input
                          type="text"
                          value={cert.name}
                          onChange={handleCertificationInputChange(index, 'name')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Issuing Organization</label>
                        <input
                          type="text"
                          value={cert.issuing_organization}
                          onChange={handleCertificationInputChange(index, 'issuing_organization')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Issue Date</label>
                        <input
                          type="date"
                          value={cert.issue_date}
                          onChange={handleCertificationInputChange(index, 'issue_date')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Expiration Date</label>
                        <input
                          type="date"
                          value={cert.expiration_date}
                          onChange={handleCertificationInputChange(index, 'expiration_date')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Credential ID</label>
                        <input
                          type="text"
                          value={cert.credential_id}
                          onChange={handleCertificationInputChange(index, 'credential_id')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-1">Credential URL</label>
                        <input
                          type="url"
                          value={cert.credential_url}
                          onChange={handleCertificationInputChange(index, 'credential_url')}
                          className="w-full px-4 py-2 bg-dark-800 rounded-custom focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={() => removeCertificationInput(index)}
                        className="text-red-400 hover:text-red-300"
                      >
                        <FiTrash />
                      </button>
                    </div>
                  </div>
                ))}

                {/* Existing certifications */}
                <div className="space-y-4">
                  {profileData?.certifications?.map((cert, index) => (
                    <div key={index} className="bg-dark-700/30 p-4 rounded-custom">
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-gray-300">{cert.name}</h4>
                        <button 
                          onClick={() => removeFromArray('certifications', index)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <FiTrash />
                        </button>
                      </div>
                      <p className="text-xs text-gray-400">Issued by: {cert.issuing_organization}</p>
                      <p className="text-xs text-gray-400">Issue Date: {cert.issue_date}</p>
                      {cert.expiration_date && (
                        <p className="text-xs text-gray-400">Expires: {cert.expiration_date}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isEditing && (
              <div className="flex justify-end space-x-4 mt-8">
                <button 
                  onClick={handleCancelEdit}
                  className="px-6 py-2 bg-gray-600 text-gray-200 rounded-custom hover:bg-gray-700 transition-custom"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  className="px-6 py-2 bg-primary-600 text-white rounded-custom hover:bg-primary-700 transition-custom"
                >
                  {isLoading ? (
                    <>
                      <FiClock className="inline-block mr-1 animate-spin" />
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-6">
            {(
              <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Full Name</p>
                  <p className="text-gray-300">{user?.full_name || 'Not provided'}</p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-400 mb-1">Email</p>
                  <p className="text-gray-300">{user?.email || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Phone</p>
                  <p className="text-gray-300">{user?.phone_number || 'Not provided'}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-400 mb-1">Location</p>
                  <p className="text-gray-300">{user?.location || 'Not provided'}</p>
                </div>

                <div className="col-span-2">
                  <p className="text-sm text-gray-400 mb-1">Professional Summary</p>
                  <p className="text-gray-300">{user?.summary || 'No summary provided'}</p>
                </div>

                <div className="col-span-2">
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-gray-400 mb-1">LinkedIn</p>
                      {user?.linkedin_url ? (
                        <a 
                          href={user.linkedin_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {user.linkedin_url}
                        </a>
                      ) : (
                        <p className="text-gray-400">Not connected</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">GitHub</p>
                      {user?.github_url ? (
                        <a 
                          href={user.github_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {user.github_url}
                        </a>
                      ) : (
                        <p className="text-gray-400">Not connected</p>
                      )}
                    </div>

                    <div>
                      <p className="text-sm text-gray-400 mb-1">Portfolio</p>
                      {user?.portfolio_url ? (
                        <a 
                          href={user.portfolio_url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 transition-colors"
                        >
                          {user.portfolio_url}
                        </a>
                      ) : (
                        <p className="text-gray-400">Not provided</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

            {(
              <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Skills</h3>
              {user?.skills?.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {user?.skills?.map((skill, index) => (
                    <div 
                      key={index} 
                      className="bg-dark-700/30 p-3 rounded-custom"
                    >
                      <span className="text-gray-300 font-medium">
                        {typeof skill === 'string' ? skill : skill.name}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No skills added yet.
                </div>
              )}
            </div>
            )}

            {(
              <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Work Experience</h3>
              {user?.experiences?.length > 0 ? (
                <div className="space-y-4">
                  {user?.experiences?.map((exp, index) => (
                    <div key={index} className="bg-dark-700/30 p-4 rounded-custom">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h4 className="text-lg font-semibold text-gray-200">{exp.job_title}</h4>
                          <p className="text-gray-400">{exp.company_name}</p>
                        </div>
                        <p className="text-sm text-gray-400">
                          {exp.start_date} - {exp.end_date || 'Present'}
                        </p>
                      </div>
                      <p className="text-gray-300">{exp.description}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No work experience added yet.
                </div>
              )}
            </div>
            )}

            {(
              <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Projects</h3>
              {user?.projects?.length > 0 ? (
                <div className="space-y-4">
                  {user?.projects?.map((project, index) => (
                    <div key={index} className="bg-dark-700/30 p-4 rounded-custom">
                      <h4 className="text-lg font-semibold text-gray-200 mb-2">{project.project_name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 mb-2">{project.technologies_used}</p>
                          <p className="text-sm text-gray-400">{project.start_date}</p>
                        </div>
                        <div>
                          <p className="text-gray-300">{project.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No projects added yet.
                </div>
              )}
            </div>
            )}

            {(
              <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-300 mb-4">Certifications</h3>
              {user?.certifications?.length > 0 ? (
                <div className="space-y-4">
                  {user?.certifications?.map((cert, index) => (
                    <div key={index} className="bg-dark-700/30 p-4 rounded-custom">
                      <h4 className="text-lg font-semibold text-gray-200 mb-2">{cert.name}</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-gray-400 mb-2">{cert.issuing_organization}</p>
                          <p className="text-sm text-gray-400">{cert.issue_date}</p>
                        </div>
                        <div>
                          <p className="text-gray-300">{cert.description}</p>
                        </div>
                      </div>
                      {cert.credential_id && (
                        <div className="mt-2">
                          <p className="text-sm text-gray-400">Credential ID: {cert.credential_id}</p>
                        </div>
                      )}
                      {cert.credential_url && (
                        <div className="mt-2">
                          <a 
                            href={cert.credential_url} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-400 hover:text-blue-300 transition-colors text-sm"
                          >
                            View Credential
                          </a>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-400 py-4">
                  No certifications added yet.
                </div>
              )}
            </div>
            )}

            <div className="flex justify-end">
              <button 
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-custom shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-custom"
              >
                <FiEdit3 className="mr-2 h-5 w-5" />
                Edit Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProfilePage;
