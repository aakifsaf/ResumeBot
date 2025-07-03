import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token refresh interceptor
let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (access) => {
  refreshSubscribers.forEach(callback => callback(access));
  refreshSubscribers = [];
};

// Helper function to get token from localStorage
const getToken = () => localStorage.getItem('access_token');

apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          refreshSubscribers.push((access) => {
            originalRequest.headers['Authorization'] = `Bearer ${access}`;
            resolve(apiClient(originalRequest));
          });
          reject(error);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refresh = localStorage.getItem('refresh_token');
        if (!refresh) {
          throw new Error('No refresh token available');
        }

        const response = await apiClient.post('/token/refresh/', { refresh });
        const { access } = response.data;
        
        if (access) {
          localStorage.setItem('access_token', access);
          originalRequest.headers['Authorization'] = `Bearer ${access}`;
          onRefreshed(access);
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Add token to requests
apiClient.interceptors.request.use(
  config => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Auth endpoints
export const loginUser = (credentials) => apiClient.post('/token/', credentials);
export const registerUser = (userData) => apiClient.post('/register/', userData);
export const fetchUserProfile = () => apiClient.get('/profile/');
export const updateUserProfile = (profileData) => apiClient.patch('/profile/', profileData);

// Skills endpoints
export const fetchSkills = () => apiClient.get('/skills/');
export const addSkill = (skillData) => apiClient.post('/skills/', skillData);
export const updateSkill = (skillId, skillData) => apiClient.patch(`/skills/${skillId}/`, skillData);
export const deleteSkill = (skillId) => apiClient.delete(`/skills/${skillId}/`);

// Work Experience endpoints
export const fetchExperiences = () => apiClient.get('/experience/');
export const addExperience = (experienceData) => apiClient.post('/experience/', experienceData);
export const updateExperience = (experienceId, experienceData) => apiClient.patch(`/experience/${experienceId}/`, experienceData);
export const deleteExperience = (experienceId) => apiClient.delete(`/experience/${experienceId}/`);

// Projects endpoints
export const fetchProjects = () => apiClient.get('/projects/');
export const addProject = (projectData) => apiClient.post('/projects/', projectData);
export const updateProject = (projectId, projectData) => apiClient.patch(`/projects/${projectId}/`, projectData);
export const deleteProject = (projectId) => apiClient.delete(`/projects/${projectId}/`);

// Certifications endpoints
export const fetchCertifications = () => apiClient.get('/certifications/');
export const addCertification = (certificationData) => apiClient.post('/certifications/', certificationData);
export const updateCertification = (certificationId, certificationData) => apiClient.patch(`/certifications/${certificationId}/`, certificationData);
export const deleteCertification = (certificationId) => apiClient.delete(`/certifications/${certificationId}/`);

// Resume endpoints
export const fetchResumeTemplates = () => apiClient.get('/templates/');
export const fetchResumeTemplate = (templateId) => apiClient.get(`/templates/${templateId}/`);
export const createResume = (resumeData) => apiClient.post('/resumes/', resumeData);
export const fetchResume = (resumeId) => apiClient.get(`/resumes/${resumeId}/`);
export const updateResume = (resumeId, resumeData) => apiClient.patch(`/resumes/${resumeId}/`, resumeData);
export const deleteResume = (resumeId) => apiClient.delete(`/resumes/${resumeId}/`);
export const fetchResumePreview = (resumeId) => apiClient.get(`/resumes/${resumeId}/preview/`);
export const fetchAIGeneratedResumePreview = (resumeId) => apiClient.get(`/generated/${resumeId}/preview/`);

export const createJobDescription = (jobDescriptionData) => apiClient.post('/job-descriptions/', jobDescriptionData);
export const generateResume = (data) => apiClient.post('/compose/', data);
export const fetchLatestGeneratedResume = () => apiClient.get('/generated-resumes/latest/');
export const fetchGeneratedResume = (resumeId) => apiClient.get(`/generated/${resumeId}/`);

export const createManualResume = (resumeData) => apiClient.post('/manual-resumes/', resumeData);

export default apiClient;