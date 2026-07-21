import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getCompanyLogo } from '../utils/logos';
import api from '../utils/api';
import { 
  Briefcase, 
  Users, 
  BarChart2, 
  PlusCircle, 
  Building, 
  MapPin, 
  Mail, 
  Phone, 
  Globe, 
  Upload, 
  X, 
  CheckCircle2, 
  Sparkles, 
  TrendingUp,
  FileText,
  LogOut,
  Trash2,
} from 'lucide-react';
import { motion } from 'framer-motion';
import Swal from "sweetalert2";
export const EmployerDashboard = () => {
  const { user, jobs, applications, postJob,updateJob, updateApplicationStatus, updateProfile, logout } = useAuth();
  const navigate = useNavigate();
  
  const employerCompany = user.companyName || user.company || 'Stripe';
  
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedJobFilter, setSelectedJobFilter] = useState('All');
  const [selectedAppId, setSelectedAppId] = useState(null);
  
  // Job Post states
  const [postTitle, setPostTitle] = useState('');
  const [postLocation, setPostLocation] = useState('');
  const [postType, setPostType] = useState('Full-time');
  const [postSalary, setPostSalary] = useState('');
  const [postCategory, setPostCategory] = useState('Software Development');
  const [postExp, setPostExp] = useState('1-3 years');
  const [postSkills, setPostSkills] = useState('');
  const [postDesc, setPostDesc] = useState('');
  const [showPostSuccess, setShowPostSuccess] = useState(false);
  
  // Custom feedback state
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectFeedback, setRejectFeedback] = useState('');
  const [rejectingAppId, setRejectingAppId] = useState(null);

  // Edit profile states
  const [editIndustry, setEditIndustry] = useState(user.industry || 'Technology');
  const [editSize, setEditSize] = useState(user.companySize || '11-50 employees');
  const [editWebsite, setEditWebsite] = useState(user.website || 'https://stripe.com');
  const [editDesc, setEditDesc] = useState(user.companyDescription || 'Leading financial infrastructure for the internet.');
  const [showProfileSuccess, setShowProfileSuccess] = useState(false);
  const [logoUploading, setLogoUploading] = useState(false);

  // Get jobs posted by this company
  const myJobs = jobs.filter(j => 
    (j.postedBy && (j.postedBy._id === user?.id || j.postedBy === user?.id)) ||
    j.postedBy === user?.id ||
    (j.company && j.company.toLowerCase() === employerCompany.toLowerCase())
  );

  const handleLogoUpload = async (e) => {
  if (e.target.files && e.target.files[0]) {

    const file = e.target.files[0];

    const result = await Swal.fire({
      title: "Upload Logo?",
      text: "Do you want to update company logo?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Upload",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) {
      e.target.value = "";
      return;
    }

    setLogoUploading(true);

    try {

      const formData = new FormData();
      formData.append('logo', file);

      if (myJobs.length > 0) {

        const targetJobId = myJobs[0].id || myJobs[0]._id;

        await api.put(`/jobs/${targetJobId}/upload-logo`, formData, {
          headers: { 
            'Content-Type': 'multipart/form-data' 
          }
        });

        await updateProfile({ logoName: file.name });

        await Swal.fire({
          icon: "success",
          title: "Uploaded!",
          text: "Company logo uploaded successfully.",
          timer: 1500,
          showConfirmButton: false,
        });

      } else {

        Swal.fire({
          icon: "warning",
          title: "No Job Found",
          text: "Please post a job first to upload a company logo.",
        });

      }

    } catch (err) {

      console.error('Logo upload error:', err);

      Swal.fire({
        icon: "error",
        title: "Upload Failed",
        text: "Logo upload failed. Please try again.",
      });

    } finally {

      setLogoUploading(false);

    }
  }
  };

  // Get applications for my jobs
  const myApplications = applications;

  // Filter applications by job selection
  const filteredApps = selectedJobFilter === 'All' 
    ? myApplications 
    : myApplications.filter(app => app.jobId === selectedJobFilter);

  // Selected applicant details
  const activeApp = selectedAppId 
    ? filteredApps.find(app => app.id === selectedAppId) 
    : filteredApps[0];

  const handlePostJob = async (e) => {
    e.preventDefault();
    console.log("--> [EmployerDashboard.handlePostJob] Post job form submitted");

    if (!postTitle || !postSalary || !postLocation || !postDesc) {
      alert('Please fill out all required fields (Job Title, Salary, Location, Description).');
      return;
    }

    const skillsArray = postSkills 
      ? postSkills.split(',').map(s => s.trim()).filter(Boolean) 
      : ['React', 'JavaScript'];

    const jobData = {
      title: postTitle,
      company: employerCompany,
      location: postLocation,
      jobType: postType,
      type: postType,
      salary: postSalary,
      category: postCategory,
      experience: postExp,
      description: postDesc,
      skills: skillsArray,
      aiMatch: 85
    };

    console.log("--> [EmployerDashboard.handlePostJob] Sending jobData to postJob context function:", jobData);

    try {
      const savedJob = await postJob(jobData);
      console.log("--> [EmployerDashboard.handlePostJob] Job saved successfully:", savedJob);

      setPostTitle('');
      setPostLocation('');
      setPostSalary('');
      setPostSkills('');
      setPostDesc('');
      setShowPostSuccess(true);

      setTimeout(() => {
        setShowPostSuccess(false);
        setActiveTab('manage-jobs');
      }, 1500);
    } catch (err) {
      console.error("--> [EmployerDashboard.handlePostJob] Error posting job:", err);
      const errorMessage = err?.response?.data?.message || err?.message || 'Failed to post job. Please try again.';
      alert(`Job Post Failed: ${errorMessage}`);
    }
  };
  //Edit job
  const handleEditJob = async (job) => {
  const result = await Swal.fire({
    title: "Edit Job?",
    text: "Do you want to update this job details?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#2563eb",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, Edit",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  navigate(`/edit-job/${job.id || job._id}`, {
    state: job
  });
  };
 //Delete job
  const handleDeleteJob = async (jobId) => {
  const result = await Swal.fire({
    title: "Delete Job?",
    text: "This job will be permanently deleted.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#dc2626",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, Delete",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await api.delete(`/jobs/${jobId}`);

    await Swal.fire({
      icon: "success",
      title: "Deleted!",
      text: "Job deleted successfully.",
      timer: 1500,
      showConfirmButton: false,
    });


  } catch (error) {

    Swal.fire({
      icon: "error",
      title: "Oops...",
      text:
        error.response?.data?.message ||
        "Failed to delete job.",
    });

  }
};

  const handleShortlist = (appId) => {
    updateApplicationStatus(
      appId, 
      'Shortlisted', 
      'Your profile matches our skill requirements. We would love to schedule a introductory technical call next week!'
    );
  };

  const triggerReject = (appId) => {
    setRejectingAppId(appId);
    setRejectFeedback('We reviewed your profile, but currently require additional hands-on experience in our specific backend tech stack (Spring Boot, microservices). We will keep your CV on file for future openings.');
    setShowRejectModal(true);
  };

  const handleRejectSubmit = () => {
    if (!rejectFeedback.trim()) {
      alert('Please provide feedback reasons.');
      return;
    }
    updateApplicationStatus(rejectingAppId, 'Rejected', rejectFeedback);
    setShowRejectModal(false);
    setRejectingAppId(null);
  };

  // save company profile
  const handleSaveProfile = async (e) => {
  e.preventDefault();

  const result = await Swal.fire({
    title: "Save Changes?",
    text: "Do you want to update your company profile?",
    icon: "question",
    showCancelButton: true,
    confirmButtonColor: "#10b981",
    cancelButtonColor: "#64748b",
    confirmButtonText: "Yes, Save",
    cancelButtonText: "Cancel",
    reverseButtons: true,
  });

  if (!result.isConfirmed) return;

  try {
    await updateProfile({
      industry: editIndustry,
      companySize: editSize,
      website: editWebsite,
      companyDescription: editDesc,
    });

    await Swal.fire({
      icon: "success",
      title: "Profile Updated!",
      text: "Company profile updated successfully.",
      timer: 1800,
      showConfirmButton: false,
    });

  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "Update Failed",
      text:
        error.response?.data?.message ||
        "Unable to update company profile.",
    });
  }
  };

  // Math metrics for overview
  const totalApplicants = myApplications.length;
  const activeJobsCount = myJobs.length;
  const shortlistedCount = myApplications.filter(a => a.status === 'Shortlisted').length;
  const rejectedCount = myApplications.filter(a => a.status === 'Rejected').length;
  const pendingCount = myApplications.filter(a => a.status === 'Reviewing').length;

  const averageAts = totalApplicants > 0
    ? Math.round(myApplications.reduce((acc, a) => acc + (a.candidateAtsScore || 70), 0) / totalApplicants)
    : 0;

  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'post-job', label: 'Post a Job', icon: PlusCircle },
    { id: 'manage-jobs', label: 'Manage Jobs', icon: Briefcase, count: activeJobsCount },
    { id: 'applicants', label: 'Candidate Screen', icon: Users, count: pendingCount },
    { id: 'profile', label: 'Company Profile', icon: Building }
  ];

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-right bg-emerald-500/10"></div>
      <div className="bg-glow bg-glow-left bg-teal-500/10"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-2.5 flex-shrink-0">
              {getCompanyLogo(employerCompany, "w-8 h-8")}
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">
                {employerCompany} Hiring Portal
              </h1>
              <p className="text-xs text-slate-400">Review talent pipelines, compile job requirements, and screen applications.</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-900/30 px-3 py-1.5 rounded-lg">
              Role: <strong className="font-bold">{user.title || 'Recruitment Lead'}</strong>
            </span>
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Recruiter Sidebar Menu */}
          <aside className="w-full md:w-64 flex-shrink-0">
            <div className="glass-card rounded-2xl p-4 sticky top-20 border border-slate-200 dark:border-slate-800">
              <ul className="space-y-1.5">
                {tabs.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          setActiveTab(item.id);
                          if (item.id === 'applicants' && filteredApps.length > 0 && !selectedAppId) {
                            setSelectedAppId(filteredApps[0].id);
                          }
                        }}
                        className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-emerald-600 text-white dark:bg-emerald-500 shadow-md shadow-emerald-500/10'
                            : 'text-slate-600 dark:text-slate-450 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-emerald-600 dark:hover:text-emerald-400'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                          <span>{item.label}</span>
                        </div>

                        {item.count !== undefined && item.count > 0 && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            isActive ? 'bg-white text-emerald-600' : 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-450'
                          }`}>
                            {item.count}
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Recruiter Main Panels */}
          <div className="flex-1 w-full space-y-6">

            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* Metric Cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Active Jobs</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white block">{activeJobsCount}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold flex items-center">
                      <TrendingUp size={10} className="mr-0.5" /> +1 this week
                    </span>
                  </div>

                  <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Total Candidates</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white block">{totalApplicants}</span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Across all listings
                    </span>
                  </div>

                  <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Shortlisted</span>
                    <span className="text-2xl font-black text-emerald-650 dark:text-emerald-450 block">{shortlistedCount}</span>
                    <span className="text-[10px] text-emerald-600 font-semibold block">
                      {totalApplicants > 0 ? `${Math.round((shortlistedCount/totalApplicants)*100)}% Match rate` : 'No applicants'}
                    </span>
                  </div>

                  <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-1.5 text-left">
                    <span className="text-[10px] font-bold text-slate-450 uppercase tracking-wider block">Average ATS Quality</span>
                    <span className="text-2xl font-black text-slate-800 dark:text-white block">{averageAts}%</span>
                    <span className="text-[10px] text-slate-400 font-medium block">
                      Compliance ratio
                    </span>
                  </div>
                </div>

                {/* Sourcing funnel analytics */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  
                  {/* Funnel chart card */}
                  <div className="lg:col-span-7 glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5 text-left">
                    <div>
                      <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recruitment Funnel Analytics</h3>
                      <p className="text-xs text-slate-400">Pipeline progression of applicants for this company</p>
                    </div>

                    <div className="space-y-4 pt-2">
                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500 dark:text-slate-400">Applications Received</span>
                          <span className="text-slate-800 dark:text-white font-extrabold">{totalApplicants} (100%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                          <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: '100%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500 dark:text-slate-400">Shortlisted for Review</span>
                          <span className="text-slate-800 dark:text-white font-extrabold">{shortlistedCount} ({totalApplicants > 0 ? Math.round((shortlistedCount/totalApplicants)*100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                          <div className="bg-emerald-600 h-2.5 rounded-full" style={{ width: totalApplicants > 0 ? `${(shortlistedCount/totalApplicants)*100}%` : '0%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500 dark:text-slate-400">Under Initial Review</span>
                          <span className="text-slate-800 dark:text-white font-extrabold">{pendingCount} ({totalApplicants > 0 ? Math.round((pendingCount/totalApplicants)*100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                          <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: totalApplicants > 0 ? `${(pendingCount/totalApplicants)*100}%` : '0%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex justify-between text-xs font-semibold">
                          <span className="text-slate-500 dark:text-slate-400">Rejected (ATS Deficient)</span>
                          <span className="text-slate-800 dark:text-white font-extrabold">{rejectedCount} ({totalApplicants > 0 ? Math.round((rejectedCount/totalApplicants)*100) : 0}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                          <div className="bg-rose-500 h-2.5 rounded-full" style={{ width: totalApplicants > 0 ? `${(rejectedCount/totalApplicants)*100}%` : '0%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick actions box */}
                  <div className="lg:col-span-5 glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4 text-left">
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">Recruitment Resources</h3>
                    
                    <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-850">
                        <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">Post an opening</strong>
                        Submit structured specifications to fetch automated candidates matches.
                      </div>
                      <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-850">
                        <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">ATS Review Metrics</strong>
                        Verify keyword occurrences in profiles before inviting to panel loops.
                      </div>
                    </div>
                  </div>

                </div>

              </div>
            )}

            {/* TAB: POST A JOB */}
            {activeTab === 'post-job' && (
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-6">
                
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Post a New Job Opening</h2>
                  <p className="text-xs text-slate-400">Fill in the fields to immediately publish the job to the search directory.</p>
                </div>

                {showPostSuccess && (
                  <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 p-3.5 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs font-semibold">
                    <CheckCircle2 size={16} />
                    <span>Job successfully published! Redirecting...</span>
                  </div>
                )}

                <form onSubmit={handlePostJob} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  
                  {/* Job Title */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Job Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Senior React Engineer"
                      value={postTitle}
                      onChange={(e) => setPostTitle(e.target.value)}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Category</label>
                    <select
                      value={postCategory}
                      onChange={(e) => setPostCategory(e.target.value)}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300"
                    >
                      <option value="Software Development">Software Development</option>
                      <option value="Artificial Intelligence & ML">Artificial Intelligence & ML</option>
                      <option value="Data Science & Analytics">Data Science & Analytics</option>
                      <option value="Product Management">Product Management</option>
                      <option value="Design & UX/UI">Design & UX/UI</option>
                      <option value="Marketing & Growth">Marketing & Growth</option>
                    </select>
                  </div>

                  {/* Job Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Job Type</label>
                    <select
                      value={postType}
                      onChange={(e) => setPostType(e.target.value)}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Remote">Remote</option>
                      <option value="Contract">Contract</option>
                    </select>
                  </div>

                  {/* Compensation / Salary */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Salary Range <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. $120,000 - $150,000"
                      value={postSalary}
                      onChange={(e) => setPostSalary(e.target.value)}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Location */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Location <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Remote (US) or San Francisco, CA"
                      value={postLocation}
                      onChange={(e) => setPostLocation(e.target.value)}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                      required
                    />
                  </div>

                  {/* Experience Level */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Experience Level</label>
                    <select
                      value={postExp}
                      onChange={(e) => setPostExp(e.target.value)}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300"
                    >
                      <option value="Fresher">Fresher / Intern</option>
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5+ years">5+ years</option>
                    </select>
                  </div>

                  {/* Required Skills */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Skills Required <span className="text-slate-400 font-normal">(comma-separated)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. React, TypeScript, Tailwind, Redux"
                      value={postSkills}
                      onChange={(e) => setPostSkills(e.target.value)}
                      className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                    />
                  </div>

                  {/* Job Description */}
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Job Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows="5"
                      placeholder="Provide details about core responsibilities, engineering culture, and tech stack details..."
                      value={postDesc}
                      onChange={(e) => setPostDesc(e.target.value)}
                      className="w-full text-xs p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white leading-relaxed resize-none"
                      required
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <div className="md:col-span-2 pt-2">
                    <button
                      type="submit"
                      className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                    >
                      Publish Job Listing
                    </button>
                  </div>

                </form>
              </div>
            )}

            {/* TAB: MANAGE JOBS */}
            {activeTab === 'manage-jobs' && (
              <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Active Job Listings</h2>
                  <p className="text-xs text-slate-400">View posted positions and monitor recruitment pipelines.</p>
                </div>

                <div className="overflow-x-auto border border-slate-100 dark:border-slate-850 rounded-xl">
                  <table className="min-w-full text-left text-sm text-slate-500 dark:text-slate-400">
                    <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      <tr>
                        <th className="px-4 py-3 rounded-l-xl">Title & Location</th>
                        <th className="px-4 py-3">Job Type</th>
                        <th className="px-4 py-3">Compensation</th>
                        <th className="px-4 py-3">Total Candidates</th>
                        <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-150 dark:divide-slate-850">
                      {myJobs.length > 0 ? (
                        myJobs.map((job) => {
                          const appCount = myApplications.filter(a => a.jobId === job.id).length;
                          return (
                            <tr key={job.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                              <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-200">
                                <div className="leading-tight">{job.title}</div>
                                <span className="text-xs font-semibold text-slate-450 flex items-center mt-1">
                                  <MapPin size={11} className="mr-0.5" />
                                  {job.location}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-xs font-semibold">{job.type}</td>
                              <td className="px-4 py-4 text-xs font-semibold">{job.salary}</td>
                              <td className="px-4 py-4">
                                <span className="inline-flex items-center text-xs font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/10">
                                  {appCount} Applied
                                </span>
                              </td>
                              <td className="px-4 py-4 text-right">
                                <div className="flex justify-end gap-2">

                                  <button
                                    onClick={() => {
                                    setSelectedJobFilter(job.id || job._id);
                                    setActiveTab("applicants");

                                    const jobApps = myApplications.filter(
                                    (a) => a.jobId === (job.id || job._id)
                                    );

                                    if (jobApps.length > 0) {
                                      setSelectedAppId(jobApps[0].id);
                                    }
                                    }}
                                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 dark:bg-slate-800 dark:hover:bg-emerald-950/40 dark:hover:text-emerald-400 border border-slate-250 dark:border-slate-700 hover:border-emerald-200 rounded-lg text-xs font-bold transition-all cursor-pointer"
                                    >
                                    View Pipeline
                                  </button>
                                    <button
                                      onClick={() => handleEditJob(job)}
                                      className="flex items-center gap-1 px-3.5 py-1.5 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                                      >
                                      Edit
                                    </button>
                                  <button
                                    onClick={() => handleDeleteJob(job.id || job._id)}
                                    className="flex items-center gap-1 px-3.5 py-1.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
                                    >
                                    <Trash2 size={14} />
                                    Delete
                                  </button>

                                </div>
                              </td>
                            </tr>
                          );
                        })
                      ) : (
                        <tr>
                          <td colSpan="5" className="px-4 py-8 text-center text-xs text-slate-400 font-medium">
                            No listings published yet.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB: CANDIDATE SCREENING & LIST */}
            {activeTab === 'applicants' && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 text-left">
                
                {/* Applicants side list */}
                <div className="lg:col-span-4 glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-extrabold text-sm text-slate-800 dark:text-slate-100">Applicant Pipelines</h3>
                      <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">Filter by published positions</span>
                    </div>
                    
                    <select
                      value={selectedJobFilter}
                      onChange={(e) => {
                        setSelectedJobFilter(e.target.value);
                        const jobApps = e.target.value === 'All' 
                          ? myApplications 
                          : myApplications.filter(a => a.jobId === e.target.value);
                        if (jobApps.length > 0) {
                          setSelectedAppId(jobApps[0].id);
                        } else {
                          setSelectedAppId(null);
                        }
                      }}
                      className="w-full text-xs px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none"
                    >
                      <option value="All">All Posted Jobs ({myApplications.length})</option>
                      {myJobs.map(job => (
                        <option key={job.id} value={job.id}>
                          {job.title} ({myApplications.filter(a => a.jobId === job.id).length})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                    {filteredApps.length > 0 ? (
                      filteredApps.map((app) => {
                        const isSelected = activeApp?.id === app.id;
                        return (
                          <div
                            key={app.id}
                            onClick={() => setSelectedAppId(app.id)}
                            className={`p-3 rounded-xl border transition-all cursor-pointer text-left space-y-1.5 ${
                              isSelected
                                ? 'bg-emerald-500/5 border-emerald-500 shadow-sm'
                                : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-900 hover:border-slate-350 dark:hover:border-slate-700'
                            }`}
                          >
                            <div className="flex justify-between items-start">
                              <h4 className="font-extrabold text-xs text-slate-850 dark:text-slate-100 truncate">{app.candidateName}</h4>
                              <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full border ${
                                app.status === 'Shortlisted'
                                  ? 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-150'
                                  : app.status === 'Rejected'
                                    ? 'bg-red-50 dark:bg-red-950/20 text-red-500 dark:text-red-400 border-red-150'
                                    : 'bg-blue-50 dark:bg-blue-950/20 text-blue-500 dark:text-blue-400 border-blue-150'
                              }`}>
                                {app.status}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 font-semibold truncate leading-none">{app.candidateTitle}</p>
                            <div className="flex items-center justify-between text-[9px] text-slate-400 pt-1">
                              <span className="flex items-center">
                                <FileText size={9} className="mr-0.5" />
                                ATS: <strong className="ml-0.5 text-slate-650 dark:text-slate-300 font-bold">{app.candidateAtsScore || 70}%</strong>
                              </span>
                              <span>{app.dateApplied}</span>
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-center text-xs text-slate-400 py-8 font-medium">No candidates in pipeline</p>
                    )}
                  </div>
                </div>

                {/* Applicant screening details panel */}
                <div className="lg:col-span-8 space-y-6">
                  {activeApp ? (
                    <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                      
                      {/* Top profile brief */}
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-5">
                        <div className="space-y-1">
                          <span className="text-[9px] font-black uppercase text-emerald-600 bg-emerald-50 border border-emerald-100 dark:bg-emerald-950/20 dark:border-emerald-900/30 px-2 py-0.5 rounded-full inline-block mb-1">
                            Candidate Profile Audit
                          </span>
                          <h3 className="text-lg font-black text-slate-850 dark:text-white leading-tight">{activeApp.candidateName}</h3>
                          <span className="text-xs font-bold text-slate-450 block">{activeApp.candidateTitle}</span>
                        </div>

                        <div className="flex space-x-2 w-full sm:w-auto">
                          {activeApp.status === 'Reviewing' && (
                            <>
                              <button
                                onClick={() => handleShortlist(activeApp.id)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-all"
                              >
                                Shortlist
                              </button>
                              <button
                                onClick={() => triggerReject(activeApp.id)}
                                className="flex-1 sm:flex-none px-4 py-2 bg-slate-150 hover:bg-red-50 hover:text-red-650 dark:bg-slate-850 dark:hover:bg-red-950/20 dark:hover:text-red-400 text-slate-700 dark:text-slate-250 border border-slate-200 dark:border-slate-700 hover:border-red-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {activeApp.status === 'Shortlisted' && (
                            <span className="text-xs text-green-600 font-extrabold flex items-center bg-green-50 dark:bg-green-950/20 border border-green-150 px-3.5 py-2 rounded-xl">
                              <CheckCircle2 size={14} className="mr-1 text-green-500" />
                              Candidate Shortlisted
                            </span>
                          )}
                          {activeApp.status === 'Rejected' && (
                            <span className="text-xs text-red-500 font-extrabold flex items-center bg-red-50 dark:bg-red-950/20 border border-red-150 px-3.5 py-2 rounded-xl">
                              <X size={14} className="mr-1 text-red-500" />
                              Candidate Rejected
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Contact metadata */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-semibold text-slate-450 border-b border-slate-100 dark:border-slate-850 pb-5">
                        <div className="flex items-center">
                          <Mail size={13} className="text-slate-400 mr-2 shrink-0" />
                          <span>{activeApp.candidateEmail}</span>
                        </div>
                        <div className="flex items-center">
                          <Phone size={13} className="text-slate-400 mr-2 shrink-0" />
                          <span>+91 98765 43210</span>
                        </div>
                      </div>

                      {/* AI Match & ATS Gauge comparison */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-150 dark:border-slate-850">
                        <div className="flex items-center space-x-4">
                          {/* Radial ATS score */}
                          <div className="relative flex items-center justify-center w-20 h-20 flex-shrink-0">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle cx="40" cy="40" r="32" className="stroke-slate-200 dark:stroke-slate-800 fill-none" strokeWidth="6" />
                              <circle cx="40" cy="40" r="32" className="stroke-emerald-500 fill-none" strokeWidth="6" strokeDasharray={2 * Math.PI * 32} strokeDashoffset={2 * Math.PI * 32 * (1 - (activeApp.candidateAtsScore || 70) / 100)} strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-sm font-black text-slate-800 dark:text-white">{activeApp.candidateAtsScore || 70}%</span>
                          </div>
                          
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">ATS Score</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Compliance quality score based on keyword audits.</p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-4 border-t sm:border-t-0 sm:border-l border-slate-200 dark:border-slate-850 pt-4 sm:pt-0 sm:pl-6">
                          <div className="relative flex items-center justify-center w-20 h-20 flex-shrink-0">
                            <Sparkles size={28} className="text-emerald-500 animate-pulse fill-emerald-500/10" />
                          </div>
                          <div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">AI Match Quality</span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">Matches candidate skills profile targeting specific requirements.</p>
                          </div>
                        </div>
                      </div>

                      {/* Candidate details */}
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-450 block uppercase tracking-wider">Candidate Skills Checklist:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {activeApp.candidateSkills && activeApp.candidateSkills.length > 0 ? (
                              activeApp.candidateSkills.map(skill => (
                                <span key={skill} className="inline-flex items-center text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 px-2.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/10">
                                  <CheckCircle2 size={10} className="mr-1 text-emerald-500" />
                                  {skill}
                                </span>
                              ))
                            ) : (
                              ['React.js', 'JavaScript', 'HTML/CSS'].map(skill => (
                                <span key={skill} className="inline-flex items-center text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 px-2.5 py-0.5 rounded border border-emerald-100 dark:border-emerald-900/10">
                                  <CheckCircle2 size={10} className="mr-1 text-emerald-500" />
                                  {skill}
                                </span>
                              ))
                            )}
                          </div>
                        </div>

                        {/* Resume preview card */}
                        <div className="space-y-2">
                          <span className="text-xs font-bold text-slate-450 block uppercase tracking-wider">Indexed Resume Document:</span>
                          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850">
                            <div className="flex items-center space-x-3">
                              <div className="p-2 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-450 rounded-lg">
                                <FileText size={16} />
                              </div>
                              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                                {activeApp.candidateResume || 'Alex_Mercer_CV.pdf'}
                              </span>
                            </div>
                            <a
                              href="#"
                              onClick={(e) => { e.preventDefault(); alert("Mock download initiated."); }}
                              className="text-[10px] text-emerald-600 dark:text-emerald-450 font-bold hover:underline"
                            >
                              Download Resume
                            </a>
                          </div>
                        </div>

                        {/* Custom feedback displays if already processed */}
                        {activeApp.feedback && (
                          <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 p-4 rounded-xl space-y-1.5">
                            <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Recruiter Feedback Comment:</span>
                            <pre className="font-sans text-xs text-slate-650 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                              {activeApp.feedback}
                            </pre>
                          </div>
                        )}

                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-20 glass-card rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
                      <Users size={40} className="mx-auto text-slate-350 dark:text-slate-600 mb-2" />
                      <h3 className="font-extrabold text-slate-700 dark:text-white text-base">Select Candidate to Screen</h3>
                      <p className="text-xs text-slate-400 max-w-sm mx-auto">Select an applicant from the sidebar menu to verify parsed resume structures and change application statuses.</p>
                    </div>
                  )}
                </div>

              </div>
            )}

            {/* TAB: COMPANY PROFILE */}
            {activeTab === 'profile' && (
              <div className="glass-card p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 text-left space-y-6">
                <div>
                  <h2 className="text-lg font-bold text-slate-800 dark:text-white">Company Profile Settings</h2>
                  <p className="text-xs text-slate-400">Manage corporate info, size, industry filters, and customer overview pages.</p>
                </div>

                {showProfileSuccess && (
                  <div className="flex items-center space-x-2 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-450 p-3 rounded-xl border border-emerald-100 dark:border-emerald-900/30 text-xs font-semibold animate-pulse">
                    <CheckCircle2 size={16} />
                    <span>Company profile updated successfully!</span>
                  </div>
                )}

                <form onSubmit={handleSaveProfile} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    
                    {/* Industry */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Industry Type</label>
                      <input
                        type="text"
                        value={editIndustry}
                        onChange={(e) => setEditIndustry(e.target.value)}
                        className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white font-semibold"
                      />
                    </div>

                    {/* Company Size */}
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Company Size</label>
                      <select
                        value={editSize}
                        onChange={(e) => setEditSize(e.target.value)}
                        className="w-full text-xs px-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-700 dark:text-slate-300"
                      >
                        <option value="1-10 employees">1-10 employees</option>
                        <option value="11-50 employees">11-50 employees</option>
                        <option value="51-200 employees">51-200 employees</option>
                        <option value="201-500 employees">201-500 employees</option>
                        <option value="501+ employees">501+ employees</option>
                      </select>
                    </div>

                    {/* Website */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Company Website</label>
                      <div className="relative flex items-center">
                        <Globe className="absolute left-4.5 text-slate-400" size={16} />
                        <input
                          type="url"
                          value={editWebsite}
                          onChange={(e) => setEditWebsite(e.target.value)}
                          className="w-full text-xs pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white"
                        />
                      </div>
                    </div>

                    {/* Overview description */}
                    <div className="space-y-1.5 md:col-span-2">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Company Overview</label>
                      <textarea
                        rows="4"
                        value={editDesc}
                        onChange={(e) => setEditDesc(e.target.value)}
                        className="w-full text-xs p-4 rounded-xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-emerald-500 text-slate-900 dark:text-white leading-relaxed resize-none"
                      ></textarea>
                    </div>
                  </div>

                  {/* Logo Uploader */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">Company Brand Logo</label>
                    <input
                      type="file"
                      id="logo-upload-input"
                      className="hidden"
                      accept=".png,.jpg,.jpeg"
                      onChange={handleLogoUpload}
                      disabled={logoUploading}
                    />
                    <label htmlFor="logo-upload-input" className="block cursor-pointer">
                      <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center bg-white dark:bg-slate-950 hover:border-emerald-500 transition-colors">
                        <Upload className="mx-auto text-slate-400 mb-1.5" size={20} />
                        <span className="text-xs font-semibold text-slate-650 dark:text-slate-300 block">
                          {logoUploading ? 'Uploading logo...' : (user.logoName ? `Current logo: ${user.logoName}` : 'Click to browse new corporate logo')}
                        </span>
                        <span className="text-[10px] text-slate-400 block mt-1">PNG, JPG (Max 2MB)</span>
                      </div>
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    Save Company Profile
                  </button>

                </form>
              </div>
            )}

          </div>

        </div>

      </div>

      {/* REJECTION MODAL */}
      {showRejectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-250 dark:border-slate-800 p-6 space-y-4 shadow-2xl relative text-left"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-850">
              <h3 className="font-extrabold text-sm text-slate-800 dark:text-white">Provide Rejection Audit Feedback</h3>
              <button 
                onClick={() => { setShowRejectModal(false); setRejectingAppId(null); }} 
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3.5">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                Please enter the specific skills deficiencies or structural parsing issues you identified. This comment will display directly in the candidate's ATS feedback center to help them optimize their profile.
              </p>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-450 uppercase block tracking-wider">Feedback comments:</label>
                <textarea
                  rows="5"
                  value={rejectFeedback}
                  onChange={(e) => setRejectFeedback(e.target.value)}
                  className="w-full text-xs p-3.5 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-red-500 text-slate-905 dark:text-white leading-relaxed resize-none"
                ></textarea>
              </div>
            </div>

            <div className="flex justify-end space-x-3.5 pt-2 border-t border-slate-100 dark:border-slate-850">
              <button
                type="button"
                onClick={() => { setShowRejectModal(false); setRejectingAppId(null); }}
                className="px-4 py-2 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-250 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleRejectSubmit}
                className="px-4 py-2 bg-red-500 hover:bg-red-650 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer"
              >
                Confirm Rejection
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
};
