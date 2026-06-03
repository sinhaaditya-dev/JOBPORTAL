import React from 'react';
import { CheckCircle2, AlertTriangle, Upload } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

export const ATSScoreCard = ({ score = 0, skills = [] }) => {
  const hasSkills = skills && skills.length > 0;

  // SVG Math for Radial Gauge
  const radius = 50;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const missingSkills = ['Docker', 'Microservices', 'AWS', 'Kubernetes'];

  const getScoreColor = (s) => {
    if (s >= 90) return 'text-green-500 stroke-green-500';
    if (s >= 70) return 'text-amber-500 stroke-amber-500';
    return 'text-red-500 stroke-red-500';
  };

  const getScoreBg = (s) => {
    if (s >= 90) return 'bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400';
    if (s >= 70) return 'bg-amber-50 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400';
    return 'bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400';
  };

  return (
    <div className="glass-card p-6 rounded-2xl relative overflow-hidden border border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">AI ATS Score Card</h3>
          <p className="text-xs text-slate-400">Based on your active resume & skills profile</p>
        </div>
        {hasSkills && (
          <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getScoreBg(score)}`}>
            Needs Optimization
          </span>
        )}
      </div>

      {!hasSkills ? (
        // Empty state for new users
        <div className="space-y-6">
          <div className="flex flex-col items-center justify-center py-6 text-center space-y-4 bg-slate-50/50 dark:bg-slate-900/30 rounded-xl border border-dashed border-slate-200 dark:border-slate-800">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-full">
              <Upload size={24} className="animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-slate-700 dark:text-slate-250">Upload Resume To Generate ATS Score</h4>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">Get automated feedback and unlock smart recommendations by indexing your PDF/DOCX resume.</p>
            </div>
            <Link to="/resume" className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors">
              <span>Go to Upload</span>
            </Link>
          </div>

          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block">Skills Profile:</span>
            <p className="text-xs font-medium text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-3 rounded-lg border border-slate-150 dark:border-slate-800 text-center">
              No Skills Added Yet
            </p>
          </div>
        </div>
      ) : (
        // Full score card state when skills exist
        <>
          <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-6 sm:space-y-0 py-4">
            {/* Radial SVG Gauge */}
            <div className="relative flex items-center justify-center w-36 h-36">
              <svg className="w-full h-full transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className="stroke-slate-200 dark:stroke-slate-800 fill-none"
                  strokeWidth="10"
                />
                {/* Foreground circle */}
                <motion.circle
                  cx="72"
                  cy="72"
                  r={radius}
                  className={`fill-none ${getScoreColor(score)}`}
                  strokeWidth="10"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-3xl font-extrabold text-slate-800 dark:text-slate-100">{score}%</span>
                <p className="text-[10px] text-slate-400 font-semibold tracking-wider uppercase">ATS Match</p>
              </div>
            </div>

            {/* ATS Insights Breakdown */}
            <div className="flex-1 space-y-3 w-full">
              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Detected Skills Match:</span>
                <div className="flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center text-[10px] font-medium bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-100 dark:border-indigo-900/30"
                    >
                      <CheckCircle2 size={10} className="mr-1 text-indigo-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">AI Recommendation - Missing Skills:</span>
                <div className="flex flex-wrap gap-1.5">
                  {missingSkills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center text-[10px] font-medium bg-amber-50 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-2.5 py-0.5 rounded-full border border-amber-100 dark:border-amber-900/20"
                    >
                      <AlertTriangle size={10} className="mr-1 text-amber-500" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Suggested Actions Checklist */}
          <div className="border-t border-slate-200 dark:border-slate-800/80 pt-4 mt-2 space-y-2">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Actionable Feedback:</span>
            <ul className="space-y-1.5 text-xs text-slate-500 dark:text-slate-400">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2"></span>
                Add metrics to project descriptions (e.g. "Improved performance by 25%")
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mt-1.5 mr-2"></span>
                Integrate 2-3 missing skills into your active work experience section
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full mt-1.5 mr-2"></span>
                Format sections using standard headings to prevent parsing errors
              </li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};
