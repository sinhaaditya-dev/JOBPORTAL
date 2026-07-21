import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bookmark, MapPin, DollarSign, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCompanyLogo } from '../utils/logos';

export const JobCard = ({ job, onApply }) => {
  const { savedJobs, toggleSaveJob, applyToJob, user } = useAuth();
  const isSaved = savedJobs.includes(job.id);
  const isApplied = user?.applications.some(app => app.jobId === job.id) || false;


  const getMatchColor = (score) => {
    if (score >= 90) return 'from-emerald-500 to-teal-500 text-white';
    if (score >= 80) return 'from-indigo-500 to-purple-500 text-white';
    return 'from-amber-500 to-orange-500 text-white';
  };

  const handleApply = (e) => {
    e.preventDefault();
    if (isApplied) return;
    applyToJob(job.id);
    if (onApply) onApply(job);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 glass-card-hover relative"
    >
      {/* Header (Company Logo, Title, Saved) */}
      <div className="flex items-start justify-between">
        <div className="flex space-x-3.5">
          {/* Company Logo */}
          <div className="w-12 h-12 rounded-xl flex items-center justify-center shadow-sm bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-2 flex-shrink-0">
          {job.companyLogo?.url ? (
            <img
              src={job.companyLogo.url}
              alt={job.company}
              className="w-8 h-8 object-contain"
            />
          ) : (
          getCompanyLogo(job.company, "w-8 h-8")
          )}
          </div>
          <div>
            <Link to={`/jobs/${job.id}`} className="font-bold text-base text-slate-800 dark:text-slate-100 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors block leading-tight">
              {job.title}
            </Link>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">{job.company}</span>
          </div>
        </div>

        <button
          onClick={() => toggleSaveJob(job.id)}
          className={`p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ${
            isSaved ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'
          }`}
          aria-label="Save job"
        >
          <Bookmark size={18} fill={isSaved ? "currentColor" : "none"} />
        </button>
      </div>

      {/* AI Match Badge */}
      {job.aiMatch && (
        <div className="mt-3">
          <span className={`inline-flex items-center text-[10px] font-bold px-2.5 py-1 rounded-full bg-gradient-to-r ${getMatchColor(job.aiMatch)} shadow-sm`}>
            <Sparkles size={10} className="mr-1 fill-current" />
            {job.aiMatch}% AI Match
          </span>
        </div>
      )}

      {/* Job Description Brief */}
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-3 line-clamp-2 leading-relaxed">
        {job.description}
      </p>

      {/* Skills Chips */}
      <div className="flex flex-wrap gap-1 mt-4">
        {job.skills.slice(0, 3).map((skill) => (
          <span
            key={skill}
            className="text-[10px] font-medium bg-slate-100 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded-md"
          >
            {skill}
          </span>
        ))}
        {job.skills.length > 3 && (
          <span className="text-[9px] font-semibold text-slate-400 px-1 py-0.5">
            +{job.skills.length - 3} more
          </span>
        )}
      </div>

      {/* Divider */}
      <div className="border-t border-slate-100 dark:border-slate-800/80 my-4"></div>

      {/* Footer Info & Actions */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col space-y-1">
          <div className="flex items-center text-[11px] text-slate-400">
            <MapPin size={12} className="mr-1" />
            {job.location}
          </div>
          <div className="flex items-center text-[11px] text-slate-500 dark:text-indigo-400 font-semibold">
            <DollarSign size={12} className="mr-0.5" />
            {job.salary}
          </div>
        </div>

        <button
          onClick={handleApply}
          disabled={isApplied}
          className={`px-4 py-2 text-xs font-semibold rounded-xl transition-all ${
            isApplied
              ? 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700 text-white dark:bg-indigo-500 dark:hover:bg-indigo-600 shadow-sm hover:shadow-indigo-500/10'
          }`}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    </motion.div>
  );
};
