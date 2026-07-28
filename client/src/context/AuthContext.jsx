import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const formatSalary = (salaryObj) => {
  if (!salaryObj) return "Not specified";
  if (typeof salaryObj === 'string') return salaryObj;
  if (salaryObj.min !== undefined && salaryObj.max !== undefined) {
    if (salaryObj.min === salaryObj.max) {
      return `$${salaryObj.min.toLocaleString()}`;
    }
    return `$${salaryObj.min.toLocaleString()} - $${salaryObj.max.toLocaleString()}`;
  }
  if (salaryObj.min !== undefined) return `$${salaryObj.min.toLocaleString()}+`;
  return "Not specified";
};

export const parseSalary = (salaryInput) => {
  if (!salaryInput) return { min: 0, max: 0 };
  if (typeof salaryInput === 'object') {
    return {
      min: Number(salaryInput.min) || 0,
      max: Number(salaryInput.max) || 0
    };
  }
  const str = String(salaryInput);
  const clean = str.replace(/[$,\s]/g, '');
  const parts = clean.split('-');
  if (parts.length === 2) {
    return {
      min: parseInt(parts[0], 10) || 0,
      max: parseInt(parts[1], 10) || 0
    };
  }
  const val = parseInt(clean, 10) || 0;
  return { min: val, max: val };
};

const mapExperience = (exp) => {
  if (!exp) return 'Fresher';
  const str = String(exp).toLowerCase();
  if (str.includes('fresher') || str.includes('intern')) return 'Fresher';
  if (str.includes('0-1') || str.includes('1-2') || str.includes('1-3')) return '1-2 Years';
  if (str.includes('2-4') || str.includes('3-5')) return '2-4 Years';
  if (str.includes('4-6') || str.includes('5+')) return '4-6 Years';
  if (str.includes('6+')) return '6+ Years';
  return 'Fresher';
};

const mapJobType = (type) => {
  if (!type) return 'full-time';
  const str = String(type).toLowerCase();
  if (str.includes('part')) return 'part-time';
  if (str.includes('contract')) return 'contract';
  if (str.includes('intern')) return 'internship';
  return 'full-time';
};

const mapUser = (backendUser) => {
  if (!backendUser) return null;
  return {
    ...backendUser,
    id: backendUser._id || backendUser.id,
    role: backendUser.role === 'recruiter' ? 'Employer' : 'Job Seeker',
    avatar: backendUser.avatar?.url || (typeof backendUser.avatar === 'string' ? backendUser.avatar : '') || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
    resume: backendUser.resume || null,
    resumeName: backendUser.resumeName || (backendUser.resume?.url ? (backendUser.resume.public_id ? backendUser.resume.public_id.split('/').pop() + '.pdf' : 'Uploaded_Resume.pdf') : ''),
    resumeUrl: backendUser.resume?.url || '',
    resumeSize: backendUser.resumeSize || '',
    resumeUploadDate: backendUser.resumeUploadDate || '',
    atsScore: backendUser.aiReport?.atsScore || backendUser.atsScore || 0,
    recommendedSkills: backendUser.aiReport?.missingSkills || [],
    suggestions: backendUser.aiReport?.recommendations || [],
    profileCompletion: backendUser.profileCompletion || 40,
    skills: (backendUser.skills && backendUser.skills.length > 0) ? backendUser.skills : (backendUser.aiReport?.skills || []),
    applications: []
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch candidate/recruiter dynamic data
  const fetchUserData = useCallback(async (currentUser, currentToken) => {
    if (!currentUser || !currentToken) return;

    try {
      if (currentUser.role === 'Employer') {
        // Fetch Employer's posted jobs via GET /api/jobs/myjobs
        const jobsRes = await api.get('/jobs/myjobs');
        const formattedMyJobs = (jobsRes.data.jobs || []).map(j => ({
          ...j,
          id: j._id,
          type: j.jobType || j.type || 'Full-time',
          salary: formatSalary(j.salary),
          postedTime: j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'
        }));

        // Sync employer's posted jobs into jobs state
        setJobs(formattedMyJobs);
        
        // Fetch applicants for each job via GET /api/applications/job/:jobId
        const appsPromises = formattedMyJobs.map(job => 
          api.get(`/jobs/${job.id}/applicants`).catch(() => ({ data: { applications: [] } }))
        );
        const appsResponses = await Promise.all(appsPromises);
        
        const allApplicants = [];
        appsResponses.forEach(res => {
          if (res.data && res.data.applications) {
            res.data.applications.forEach(app => {
              allApplicants.push({
                id: app._id,
                jobId: app.job?._id || app.job,
                jobTitle: app.job?.title || "Role",
                company: app.job?.company || currentUser.companyName || "Company",
                candidateName: app.applicant?.name || "Candidate",
                candidateEmail: app.applicant?.email || "",
                candidateTitle: app.applicant?.title || "Software Engineer",
                candidateSkills: app.applicant?.skills || [],
                candidateResume: app.applicant?.resume?.url || "",
                candidateResumeName: app.applicant?.resumeName || (app.applicant?.resume?.url ? 'Uploaded_Resume.pdf' : ''),
                candidateAtsScore: app.applicant?.aiReport?.atsScore || app.applicant?.atsScore || 70,
                dateApplied: new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
                status: app.status === 'accepted' ? 'Shortlisted' : (app.status === 'rejected' ? 'Rejected' : 'Reviewing'),
                feedback: app.feedback || null,
                coverLetter: app.coverLetter || ''
              });
            });
          }
        });
        
        setApplications(allApplicants);
      } else {
        // Candidate profile - fetch applications via GET /api/applications/myapplications
        const appsRes = await api.get('/applications/myapplications');
        const myAppsMapped = (appsRes.data.applications || []).map(app => ({
          id: app._id,
          jobId: app.job?._id || app.job,
          jobTitle: app.job?.title || "Role",
          company: app.job?.company || "Company",
          dateApplied: new Date(app.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
          status: app.status === 'accepted' ? 'Shortlisted' : (app.status === 'rejected' ? 'Rejected' : 'Reviewing'),
          feedback: app.feedback || null,
          coverLetter: app.coverLetter || ''
        }));

        setUser(prev => prev ? {
          ...prev,
          applications: myAppsMapped
        } : null);
      }
    } catch (err) {
      console.error("Error loading user context data:", err);
    }
  }, []);

  // Initialize and load default job listings via GET /api/jobs
  const initializeJobs = useCallback(async () => {
    try {
      const res = await api.get('/jobs');
      const loadedJobs = (res.data.jobs || []).map(j => ({
        ...j,
        id: j._id,
        type: j.jobType || j.type || 'Full-time',
        salary: formatSalary(j.salary),
        postedTime: j.createdAt ? new Date(j.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : 'Recently'
      }));
      setJobs(loadedJobs);
    } catch (err) {
      console.error("Error loading jobs:", err);
    }
  }, []);

  useEffect(() => {
    const bootstrap = async () => {
      setLoading(true);
      await initializeJobs();
      
      if (token) {
        try {
          const profileRes = await api.get('/auth/profile');
          const mapped = mapUser(profileRes.data.user);
          setUser(mapped);
          if (mapped.role === "Job Seeker") {
             const savedRes = await api.get("/saved-jobs");
             setSavedJobs(
                savedRes.data.savedJobs.map(job => job._id)
              );
          }

          await fetchUserData(mapped, token);
        } catch (err) {
          console.error("Session bootstrap failed:", err);
          localStorage.removeItem('token');
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    bootstrap();
  }, [token, initializeJobs, fetchUserData]);

  // Login via POST /api/auth/login
  const login = async (email, password) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      const { token: userToken, user: backendUser } = res.data;
      localStorage.setItem('token', userToken);
      setToken(userToken);
      const mapped = mapUser(backendUser);
      setUser(mapped);
      if (mapped.role === "Job Seeker") {
        const savedRes = await api.get("/saved-jobs");
        setSavedJobs(
          savedRes.data.savedJobs.map(job => job._id)
        );
      }
      await fetchUserData(mapped, userToken);
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  };

  // Register via POST /api/auth/register
  const register = async (name, email, password, role) => {
    try {
      const backendRole = role.toLowerCase().includes('employer') || role === 'recruiter' ? 'recruiter' : 'student';
      await api.post('/auth/register', { name, email, password, role: backendRole });
      return await login(email, password);
    } catch (error) {
      console.error("Registration failed:", error);
      throw error;
    }
  };



  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setApplications([]);
    setSavedJobs([]);
  };

  // Fallback for missing backend profile update endpoint
  const updateProfile = async (updatedData) => {
  try {

    const res = await api.put("/users/profile", updatedData);

    const mapped = mapUser(res.data.user);

    setUser(prev => ({
      ...prev,
      ...mapped,
      applications: prev?.applications || []
    }));

    return true;

  } catch (error) {

    console.error("Profile update failed:", error);

    throw error;

  }
  };

  // Apply to job via POST /api/applications/:jobId
  const applyToJob = async (jobId, coverLetter = '') => {
    try {
      await api.post(`/applications/${jobId}`, { coverLetter });
      await initializeJobs();
      if (user) await fetchUserData(user, token);
      return true;
    } catch (error) {
      console.error("Job application failed:", error);
      throw error;
    }
  };

  // Withdraw application via DELETE /api/applications/:applicationId
  const withdrawApplication = async (applicationId) => {
    try {
      await api.delete(`/applications/${applicationId}`);
      if (user) await fetchUserData(user, token);
      return true;
    } catch (error) {
      console.error("Withdraw application failed:", error);
      throw error;
    }
  };

  // Upload resume via PUT /api/users/upload-resume
  const uploadResume = async (file, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const res = await api.put('/users/upload-resume', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Immediately trigger AI analysis for ATS report
      let aiReport = null;
      try {
        const aiRes = await api.post('/ai/analyze');
        aiReport = aiRes?.data?.aiReport;
      } catch (aiErr) {
        console.warn("AI analysis failed or timed out during upload, falling back:", aiErr);
      }

      const resumeObj = res.data.resume;

      setUser(prev => {
        if (!prev) return null;
        const updatedUser = {
          ...prev,
          resume: resumeObj,
          resumeName: file.name,
          resumeUrl: resumeObj?.url || '',
          atsScore: aiReport?.atsScore || 0,
          recommendedSkills: aiReport?.missingSkills || [],
          suggestions: aiReport?.recommendations || []
        };
        updatedUser.skills = (prev.skills && prev.skills.length > 0) ? prev.skills : (aiReport?.skills || []);
        return updatedUser;
      });

      if (user) await fetchUserData(user, token);
      
      return {
        ...res.data,
        user: {
          resume: resumeObj,
          atsScore: aiReport?.atsScore || 0,
          skills: (user?.skills && user.skills.length > 0) ? user.skills : (aiReport?.skills || []),
          recommendedSkills: aiReport?.missingSkills || [],
          suggestions: aiReport?.recommendations || []
        }
      };
    } catch (error) {
      console.error("Resume upload failed:", error);
      throw error;
    }
  };

  // Upload avatar
  const uploadAvatar = async (file) => {
    try {
      const formData = new FormData();
      formData.append('avatar', file);
      const res = await api.put('/profile/upload-avatar', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const avatarObj = res.data.avatar;
      const avatarUrl = avatarObj?.url || '';
      setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
      return avatarObj;
    } catch (error) {
      const avatarUrl = URL.createObjectURL(file);
      setUser(prev => prev ? { ...prev, avatar: avatarUrl } : null);
      return avatarUrl;
    }
  };

  // Delete resume via DELETE /api/users/delete-resume
  const deleteResume = async () => {
    try {
      const res = await api.delete('/users/delete-resume');
      const mapped = mapUser(res.data.user);
      setUser(prev => prev ? {
        ...prev,
        ...mapped,
        applications: prev?.applications || []
      } : null);
      if (user) await fetchUserData(mapped, token);
      return true;
    } catch (error) {
      console.error("Resume deletion failed:", error);
      throw error;
    }
  };

  // Delete avatar via DELETE /api/profile/delete-avatar
  const deleteAvatar = async () => {
    try {
      await api.delete('/profile/delete-avatar');
      setUser(prev => prev ? {
        ...prev,
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'
      } : null);
      return true;
    } catch (error) {
      console.error("Avatar deletion failed:", error);
      throw error;
    }
  };

  // Toggle save job 
  const toggleSaveJob = async (jobId) => {

  try {

    if (savedJobs.includes(jobId)) {

      // Remove Saved Job
      await api.delete(`/saved-jobs/${jobId}`);

      setSavedJobs(prev =>
        prev.filter(id => id !== jobId)
      );

    } else {

      // Save Job
      await api.post(`/saved-jobs/${jobId}`);

      setSavedJobs(prev => [
        ...prev,
        jobId
      ]);

    }

    return true;

  } catch (error) {

    console.error("Failed to save/remove job:", error);

    throw error;

  }

  };

  // Create job via POST /api/jobs
  const postJob = async (jobData) => {
    try {
      const salaryObj = parseSalary(jobData.salary);
      const payload = {
        title: jobData.title,
        company: jobData.company,
        description: jobData.description,
        location: jobData.location,
        salary: salaryObj,
        skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills ? [jobData.skills] : ['JavaScript']),
        jobType: mapJobType(jobData.jobType || jobData.type),
        experience: mapExperience(jobData.experience),
        category: jobData.category || 'Software Development'
      };

      const res = await api.post('/jobs', payload);

      if (!res.data || !res.data.success) {
        throw new Error(res.data?.message || "Failed to post job.");
      }

      await initializeJobs();
      if (user && token) {
        await fetchUserData(user, token);
      }
      return res.data.job;
    } catch (error) {
      console.error("ERROR posting job:", error?.response?.data || error.message);
      throw error;
    }
  };

  // Update job via PUT /api/jobs/:id
  const updateJob = async (jobId, jobData) => {
    try {
      const salaryObj = parseSalary(jobData.salary);
      const payload = {
        ...jobData,
        salary: salaryObj,
        skills: Array.isArray(jobData.skills) ? jobData.skills : (jobData.skills ? [jobData.skills] : ['JavaScript']),
        jobType: mapJobType(jobData.jobType || jobData.type),
        experience: mapExperience(jobData.experience)
      };
      const res = await api.put(`/jobs/${jobId}`, payload);
      await initializeJobs();
      if (user && token) await fetchUserData(user, token);
      return res.data.job;
    } catch (error) {
      console.error("ERROR updating job:", error?.response?.data || error.message);
      throw error;
    }
  };

  // Delete job via DELETE /api/jobs/:id
  const deleteJob = async (jobId) => {
    try {
      await api.delete(`/jobs/${jobId}`);
      await initializeJobs();
      if (user && token) await fetchUserData(user, token);
      return true;
    } catch (error) {
      console.error("ERROR deleting job:", error?.response?.data || error.message);
      throw error;
    }
  };

  // Upload company logo via PUT /api/jobs/:jobId/upload-logo
  const uploadJobLogo = async (jobId, logoFile) => {
    try {
      const formData = new FormData();
      formData.append('logo', logoFile);
      const res = await api.put(`/jobs/${jobId}/upload-logo`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await initializeJobs();
      return res.data;
    } catch (error) {
      console.error("ERROR uploading logo:", error?.response?.data || error.message);
      throw error;
    }
  };

  const getAIRejectionFeedback = async (applicationId) => {
    try {
      const res = await api.post('/ai/rejection-feedback', { applicationId });
      return res.data.feedback;
    } catch (error) {
      console.error("Failed to generate AI rejection feedback:", error);
      throw error;
    }
  };

  // Update application status (missing backend endpoint fallback)
  const updateApplicationStatus = async (appId, status, feedback) => {

  // Backend values -> Frontend values
  const displayStatus =
    status === "accepted"
      ? "Shortlisted"
      : status === "rejected"
      ? "Rejected"
      : "Reviewing";

  // Backup current state (for rollback)
  const previousApplications = applications;

  // Optimistic UI Update
  setApplications(prev =>
    prev.map(app =>
      app.id === appId
        ? {
            ...app,
            status: displayStatus,
            feedback,
          }
        : app
    )
  );

  try {

    const res = await api.put(
      `/jobs/applications/${appId}/status`,
      {
        status,
        feedback,
      }
    );

    return res.data;

  } catch (error) {

    console.error("Failed to update application status:", error);

    // Rollback UI if backend update fails
    setApplications(previousApplications);

    throw error;
  }
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateProfile,
      applyToJob,
      withdrawApplication,
      uploadResume,
      uploadAvatar,
      deleteResume,
      deleteAvatar,
      savedJobs,
      toggleSaveJob,
      isLoggedIn: !!user,
      isEmployer: user?.role === 'Employer',
      jobs,
      applications,
      postJob,
      updateJob,
      deleteJob,
      uploadJobLogo,
      updateApplicationStatus,
      getAIRejectionFeedback,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
