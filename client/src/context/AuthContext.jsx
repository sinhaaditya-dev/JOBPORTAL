import { createContext, useContext, useState, useEffect } from 'react';
import { mockUserData, mockJobs } from '../data/mockData';

const AuthContext = createContext();

const defaultApplications = [
  {
    id: 'app_1',
    jobId: 'job2',
    candidateName: 'Alex Mercer',
    candidateEmail: 'alex.mercer@gmail.com',
    candidateTitle: 'Full Stack Software Engineer',
    candidateSkills: ['Java', 'Spring Boot', 'MongoDB', 'JavaScript', 'React.js'],
    candidateResume: 'Alex_Mercer_CV.pdf',
    candidateAtsScore: 78,
    dateApplied: 'May 24, 2026',
    status: 'Reviewing',
    feedback: null,
    company: 'Google'
  },
  {
    id: 'app_2',
    jobId: 'job3',
    candidateName: 'Alex Mercer',
    candidateEmail: 'alex.mercer@gmail.com',
    candidateTitle: 'Full Stack Software Engineer',
    candidateSkills: ['Java', 'Spring Boot', 'MongoDB', 'JavaScript', 'React.js'],
    candidateResume: 'Alex_Mercer_CV.pdf',
    candidateAtsScore: 78,
    dateApplied: 'May 22, 2026',
    status: 'Shortlisted',
    feedback: 'Great fit! The technical interview is scheduled for next Monday.',
    company: 'Meta'
  },
  {
    id: 'app_3',
    jobId: 'job4',
    candidateName: 'Alex Mercer',
    candidateEmail: 'alex.mercer@gmail.com',
    candidateTitle: 'Full Stack Software Engineer',
    candidateSkills: ['Java', 'Spring Boot', 'MongoDB', 'JavaScript', 'React.js'],
    candidateResume: 'Alex_Mercer_CV.pdf',
    candidateAtsScore: 78,
    dateApplied: 'May 18, 2026',
    status: 'Rejected',
    feedback: 'Required MERN stack experience missing\nResume formatting needs improvement\nProjects section is weak',
    company: 'Netflix'
  },
  {
    id: 'app_4',
    jobId: 'job1',
    candidateName: 'Sarah Jenkins',
    candidateEmail: 'sarah.j@gmail.com',
    candidateTitle: 'Senior React Developer',
    candidateSkills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST APIs'],
    candidateResume: 'Sarah_Jenkins_CV.pdf',
    candidateAtsScore: 94,
    dateApplied: 'May 28, 2026',
    status: 'Reviewing',
    feedback: null,
    company: 'Stripe'
  },
  {
    id: 'app_5',
    jobId: 'job1',
    candidateName: 'David Chen',
    candidateEmail: 'dchen@gmail.com',
    candidateTitle: 'React Developer',
    candidateSkills: ['React.js', 'JavaScript', 'CSS'],
    candidateResume: 'David_Chen_Resume.pdf',
    candidateAtsScore: 82,
    dateApplied: 'May 27, 2026',
    status: 'Shortlisted',
    feedback: 'Excellent UI portfolio.',
    company: 'Stripe'
  },
  {
    id: 'app_6',
    jobId: 'job5',
    candidateName: 'Emily Rodriguez',
    candidateEmail: 'emily.r@gmail.com',
    candidateTitle: 'Backend Engineer',
    candidateSkills: ['Java', 'Spring Boot', 'SQL'],
    candidateResume: 'Emily_Rodriguez_CV.pdf',
    candidateAtsScore: 71,
    dateApplied: 'May 25, 2026',
    status: 'Rejected',
    feedback: 'Needs more architectural leadership experience.',
    company: 'Amazon'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockUserData;
      }
    }
    return mockUserData;
  });

  const [savedJobs, setSavedJobs] = useState(['job1', 'job5']);

  const [jobs, setJobs] = useState(() => {
    const saved = localStorage.getItem('jobs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return mockJobs;
      }
    }
    return mockJobs;
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('applications');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return defaultApplications;
      }
    }
    return defaultApplications;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('applications', JSON.stringify(applications));
  }, [applications]);

  const login = (email, password, role = 'Job Seeker') => {
    setUser({
      ...mockUserData,
      email: email,
      role: role,
      name: role === 'Employer' ? 'Tech Recruiter' : mockUserData.name,
      title: role === 'Employer' ? 'Lead Talent Acquisition' : mockUserData.title,
    });
    return true;
  };

  const register = (name, email, password, role) => {
    setUser({
      name,
      email,
      role,
      phone: '+1 (555) 000-0000',
      location: 'San Francisco, CA',
      title: role === 'Employer' ? 'HR Manager' : 'Software Engineer',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
      skills: [],
      resumeName: '',
      resumeSize: '',
      resumeUploadDate: '',
      atsScore: 0,
      profileCompletion: 40,
      applications: []
    });
    return true;
  };

  const loginWithGoogle = (googleUserData) => {
    setUser(googleUserData);
    return true;
  };

  const logout = () => {
    setUser(null);
  };

  const updateProfile = (updatedData) => {
    setUser(prev => ({
      ...prev,
      ...updatedData
    }));
  };

  const applyToJob = (jobId, jobTitle, company) => {
    if (!user) return;
    const appId = `app_${Date.now()}`;
    const newApplication = {
      id: appId,
      jobId,
      jobTitle,
      company,
      dateApplied: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      status: 'Reviewing',
      feedback: null
    };

    // Update global applications
    const globalApp = {
      ...newApplication,
      candidateName: user.name,
      candidateEmail: user.email,
      candidateTitle: user.title || 'Software Engineer',
      candidateSkills: user.skills || [],
      candidateResume: user.resumeName || 'Resume.pdf',
      candidateAtsScore: user.atsScore || 70,
    };
    setApplications(prev => [globalApp, ...prev]);

    // Update local user state
    setUser(prev => ({
      ...prev,
      applications: [newApplication, ...prev.applications]
    }));
  };

  const uploadResume = (fileName, fileSize) => {
    if (!user) return;
    setUser(prev => ({
      ...prev,
      resumeName: fileName,
      resumeSize: fileSize,
      resumeUploadDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' }),
      atsScore: 78,
      skills: Array.from(new Set([...prev.skills, 'Java', 'Spring Boot', 'MongoDB'])),
      profileCompletion: Math.min(prev.profileCompletion + 15, 100)
    }));
  };

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => 
      prev.includes(jobId) 
        ? prev.filter(id => id !== jobId) 
        : [...prev, jobId]
    );
  };

  const postJob = (jobData) => {
    const newJob = {
      id: `job_${Date.now()}`,
      postedTime: 'Just now',
      ...jobData,
    };
    setJobs(prev => [newJob, ...prev]);
    return newJob;
  };

  const updateApplicationStatus = (appId, status, feedback) => {
    setApplications(prev => prev.map(app => 
      app.id === appId ? { ...app, status, feedback } : app
    ));

    const targetApp = applications.find(a => a.id === appId);
    if (targetApp) {
      const applicantEmail = targetApp.candidateEmail;
      
      if (user && user.email === applicantEmail) {
        setUser(prev => ({
          ...prev,
          applications: prev.applications.map(app => 
            app.id === appId || (app.jobId === targetApp.jobId && app.jobTitle === targetApp.jobTitle)
              ? { ...app, status, feedback } 
              : app
          )
        }));
      } else {
        const savedUserStr = localStorage.getItem('user');
        if (savedUserStr) {
          try {
            const savedUser = JSON.parse(savedUserStr);
            if (savedUser.email === applicantEmail) {
              const updatedApps = savedUser.applications.map(app => 
                app.id === appId || app.jobId === targetApp.jobId
                  ? { ...app, status, feedback }
                  : app
              );
              localStorage.setItem('user', JSON.stringify({ ...savedUser, applications: updatedApps }));
            }
          } catch (e) {
            console.error('Error syncing localStorage applicant data:', e);
          }
        }
      }
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
      uploadResume,
      savedJobs,
      toggleSaveJob,
      loginWithGoogle,
      isLoggedIn: !!user,
      isEmployer: user?.role === 'Employer',
      jobs,
      applications,
      postJob,
      updateApplicationStatus
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
