import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Briefcase, 
  Calendar, 
  CheckCircle, 
  AlertTriangle, 
  Bookmark, 
  Sparkles, 
  Share2, 
  Building2 
} from 'lucide-react';
import { getCompanyLogo } from '../utils/logos';

export const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { savedJobs, toggleSaveJob, applyToJob, user, jobs } = useAuth();

  const job = jobs.find((j) => j.id === id);

  if (!job) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Job opening not found</h2>
        <Link to="/jobs" className="text-sm text-indigo-500 hover:underline">Back to Job Listings</Link>
      </div>
    );
  }

  const isSaved = savedJobs.includes(job.id);
  const isApplied = user?.applications.some(app => app.jobId === job.id);

  // Divide skills into matching and missing based on user profiles
  const userSkills = user?.skills || [];
  const matchingSkills = job.skills.filter(skill => userSkills.includes(skill));
  const missingSkills = job.skills.filter(skill => !userSkills.includes(skill));

  const handleApply = () => {
    if (isApplied) return;
    applyToJob(job.id, job.title, job.company);
  };

  return (
    <div className="relative min-h-screen py-10 px-4">
      {/* Background mesh glows */}
      <div className="bg-glow bg-glow-right"></div>
      <div className="bg-glow bg-glow-left"></div>

      <div className="relative max-w-5xl mx-auto z-10 space-y-6">
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          {/* Left Column (Job Description) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Main Header glass panel */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="flex items-start space-x-4">
                  {/* Company Logo */}
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-md bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2.5 flex-shrink-0 mt-1">
                    {getCompanyLogo(job.company, "w-9 h-9")}
                  </div>
                  <div className="space-y-1.5">
                    <h1 className="text-xl sm:text-2xl font-black text-slate-800 dark:text-white leading-tight">
                      {job.title}
                    </h1>
                    <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-slate-400 font-semibold">
                      <span className="flex items-center"><Building2 size={14} className="mr-1.5" />{job.company}</span>
                      <span className="flex items-center"><MapPin size={14} className="mr-1.5" />{job.location}</span>
                      <span className="flex items-center"><Briefcase size={14} className="mr-1.5" />{job.type}</span>
                    </div>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleSaveJob(job.id)}
                    className={`p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${
                      isSaved ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
                    }`}
                  >
                    <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
                  </button>
                  <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-850 text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>

              {/* Stats highlights */}
              <div className="grid grid-cols-2 gap-4 border-t border-b border-slate-100 dark:border-slate-800/80 py-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Compensation</span>
                  <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 flex items-center mt-1">
                    <DollarSign size={16} className="text-slate-400 mr-0.5" />
                    {job.salary}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Posted Date</span>
                  <span className="text-sm font-semibold text-slate-500 dark:text-slate-350 flex items-center mt-1">
                    <Calendar size={16} className="text-slate-400 mr-1.5" />
                    {job.postedTime}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">About the Role</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                  {job.description}
                </p>
                
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 pt-2">Core Responsibilities</h3>
                <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400 list-disc pl-4 leading-relaxed font-medium">
                  <li>Formulate robust structures using clean engineering patterns and reusable code templates.</li>
                  <li>Coordinate with backend teams to integrate RESTful routes and manage data integrity constraints.</li>
                  <li>Audit application logs to isolate client errors and optimize responsiveness metrics.</li>
                  <li>Incorporate accessibility checks and localization parameters across frontend views.</li>
                </ul>
              </div>

            </div>

          </div>

          {/* Right Column (AI Compatibility Panel) */}
          <div className="space-y-6 text-left">
            
            {/* AI match card */}
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center">
                  <Sparkles size={16} className="text-indigo-500 mr-1.5" />
                  AI Match Report
                </h3>
                <span className="text-[9px] font-bold bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 px-2 py-0.5 rounded-full">
                  Compatibility Status
                </span>
              </div>

              {/* Score visual badge */}
              <div className="flex items-center space-x-3.5 bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                <div className="text-center">
                  <span className="text-3xl font-black text-indigo-600 dark:text-indigo-400">{job.aiMatch || 60}%</span>
                  <span className="block text-[8px] text-slate-400 font-bold uppercase mt-0.5 tracking-wider">Score</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                  Your profile matches <strong>{matchingSkills.length}</strong> of the <strong>{job.skills.length}</strong> required technologies.
                </p>
              </div>

              {/* Skill mapping lists */}
              <div className="space-y-4">
                {/* Matching Skills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Matching Skills ({matchingSkills.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {matchingSkills.length > 0 ? (
                      matchingSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center text-[10px] font-semibold bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-2 py-0.5 rounded border border-green-150 dark:border-green-900/30">
                          <CheckCircle size={10} className="mr-1 text-green-500" />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-400 italic">None identified in CV</span>
                    )}
                  </div>
                </div>

                {/* Missing Skills */}
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Missing Skills ({missingSkills.length})</span>
                  <div className="flex flex-wrap gap-1.5">
                    {missingSkills.length > 0 ? (
                      missingSkills.map(skill => (
                        <span key={skill} className="inline-flex items-center text-[10px] font-semibold bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded border border-amber-150 dark:border-amber-900/30">
                          <AlertTriangle size={10} className="mr-1 text-amber-500" />
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-green-500 font-semibold flex items-center">
                        <CheckCircle size={12} className="mr-1" /> All match!
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleApply}
                  disabled={isApplied}
                  className={`w-full py-3 text-xs font-bold rounded-xl transition-all flex items-center justify-center space-x-2 ${
                    isApplied
                      ? 'bg-slate-100 text-slate-450 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed border border-slate-200 dark:border-slate-800'
                      : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-md hover:shadow-indigo-500/10 cursor-pointer'
                  }`}
                >
                  <span>{isApplied ? 'Application Submitted' : 'Apply for this Role'}</span>
                </button>

                {missingSkills.length > 0 && (
                  <Link
                    to="/resume"
                    className="w-full py-2.5 text-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-250 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-750 transition-colors block"
                  >
                    Optimize CV for this role
                  </Link>
                )}
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
