import { useState, useEffect, Fragment } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { mockJobs, mockNotifications } from '../data/mockData';
import { Sidebar } from '../components/Sidebar';
import { EmployerDashboard } from './EmployerDashboard';
import { ATSScoreCard } from '../components/ATSScoreCard';
import { JobCard } from '../components/JobCard';
import { 
  MapPin, 
  Mail, 
  CheckCircle, 
  FileText, 
  HelpCircle, 
  XCircle, 
  ChevronDown, 
  ChevronUp, 
  Bell, 
  Clock, 
  Edit3,
  Bookmark,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { getCompanyLogo } from '../utils/logos';

export const Dashboard = () => {
  const { user, savedJobs, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [expandedApp, setExpandedApp] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  if (!user) {
    return null;
  }

  if (user.role === 'Employer') {
    return <EmployerDashboard />;
  }

  // Get matching jobs (AI match >= 80)
  const matchedJobs = mockJobs.filter(job => job.aiMatch && job.aiMatch >= 80);

  // Get saved jobs details
  const savedJobsDetails = mockJobs.filter(job => savedJobs.includes(job.id));

  const hasResume = !!user.resumeName;
  const hasSkills = user.skills && user.skills.length > 0;
  const hasGithub = !!user.githubVerified;

  const profileCompletion = 40 + (hasResume ? 30 : 0) + (hasSkills ? 15 : 0) + (hasGithub ? 15 : 0);

  // Toggle feedback expand
  const toggleExpand = (appId) => {
    setExpandedApp(expandedApp === appId ? null : appId);
  };

  const getStatusBadge = (status) => {
    const styles = {
      Reviewing: 'bg-blue-50 dark:bg-blue-950/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/30',
      Shortlisted: 'bg-green-50 dark:bg-green-950/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-900/30',
      Rejected: 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30',
    };
    return (
      <span className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full border ${styles[status] || ''}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="relative min-h-screen">
      {/* Mesh Glow Backgrounds */}
      <div className="bg-glow bg-glow-right"></div>
      <div className="bg-glow bg-glow-left"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              User Dashboard
            </h1>
            <p className="text-xs text-slate-400">Manage your applications, profile settings, and ATS optimizations.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850">
            Account Type: <strong className="text-indigo-600 dark:text-indigo-400">{user.role}</strong>
          </span>
        </div>

        {/* Dashboard Grid Layout */}
        <div className="flex flex-col md:flex-row gap-8">
          
          {/* Sidebar Left Column */}
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Right Column Content Area */}
          <div className="flex-1 space-y-6">
            
            {/* TAB: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                
                {/* User Summary Widget */}
                <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-5 text-center sm:text-left">
                    <img
                      className="h-20 w-20 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shadow-indigo-500/10"
                      src={user.avatar}
                      alt={user.name}
                    />
                    <div className="space-y-1.5">
                      <h2 className="text-xl font-bold text-slate-800 dark:text-white leading-tight">{user.name}</h2>
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{user.title}</p>
                      
                      <div className="flex flex-col sm:flex-row sm:items-center text-xs text-slate-400 gap-1.5 sm:gap-4 pt-1">
                        <span className="flex items-center justify-center sm:justify-start">
                          <MapPin size={12} className="mr-1 text-slate-400" />
                          {user.location}
                        </span>
                        <span className="flex items-center justify-center sm:justify-start">
                          <Mail size={12} className="mr-1 text-slate-400" />
                          {user.email}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  <button className="flex items-center space-x-1.5 px-4 py-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700/80 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 border border-slate-250 dark:border-slate-700 cursor-pointer transition-colors">
                    <Edit3 size={12} />
                    <span>Edit Profile</span>
                  </button>
                </div>

                {/* ATS Widget Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <ATSScoreCard score={user.atsScore} skills={user.skills} />
                  
                  {/* Quick Profile Stats */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-5">
                    <div>
                      <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Profile Readiness</h3>
                      <p className="text-xs text-slate-400">Complete these to reach 100% visibility to top headhunters</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-slate-600 dark:text-slate-350">Completion</span>
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{profileCompletion}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2">
                        <div 
                          className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${profileCompletion}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800/80 pt-4 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          {hasResume ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-350 dark:border-slate-600 inline-block flex-shrink-0"></span>
                          )}
                          <span className="text-slate-500 dark:text-slate-400">Upload primary resume</span>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-400">{user.resumeName || 'Missing'}</span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          {hasSkills ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-350 dark:border-slate-600 inline-block flex-shrink-0"></span>
                          )}
                          <span className="text-slate-500 dark:text-slate-400">Core skills matching profile</span>
                        </div>
                        <span className="text-[10px] font-semibold text-indigo-500">
                          {hasSkills ? `${user.skills.length} Loaded` : '0 Skills Added'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center space-x-2">
                          {hasGithub ? (
                            <CheckCircle size={14} className="text-green-500" />
                          ) : (
                            <span className="w-3.5 h-3.5 rounded-full border-2 border-slate-350 dark:border-slate-600 inline-block flex-shrink-0"></span>
                          )}
                          <span className="text-slate-500 dark:text-slate-400">Verify GitHub portfolio URL</span>
                        </div>
                        {hasGithub ? (
                          <span className="text-[10px] font-bold text-green-500">Verified</span>
                        ) : (
                          <span 
                            onClick={() => updateProfile({ githubVerified: true })}
                            className="text-[10px] text-amber-500 font-bold hover:underline cursor-pointer"
                          >
                            Verify Now
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Applied Jobs Widget */}
                <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
                  <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">Recently Applied</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-left text-sm text-slate-500 dark:text-slate-400">
                      <thead className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                        <tr>
                          <th className="px-4 py-3 rounded-l-xl">Role & Company</th>
                          <th className="px-4 py-3">Date Applied</th>
                          <th className="px-4 py-3">Status</th>
                          <th className="px-4 py-3 rounded-r-xl text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                        {user.applications && user.applications.length > 0 ? (
                          user.applications.map((app) => (
                            <Fragment key={app.id}>
                              <tr className="hover:bg-slate-100/50 dark:hover:bg-slate-800/20 transition-colors">
                                <td className="px-4 py-4 font-bold text-slate-800 dark:text-slate-200">
                                  <div className="flex items-center space-x-3">
                                    {/* Company Logo */}
                                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-sm bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1.5 flex-shrink-0">
                                      {getCompanyLogo(app.company, "w-6 h-6")}
                                    </div>
                                    <div>
                                      <div className="leading-tight">{app.jobTitle}</div>
                                      <span className="text-xs font-semibold text-slate-400 leading-none">{app.company}</span>
                                    </div>
                                  </div>
                                </td>
                                <td className="px-4 py-4 text-xs font-medium">{app.dateApplied}</td>
                                <td className="px-4 py-4">{getStatusBadge(app.status)}</td>
                                <td className="px-4 py-4 text-right">
                                  {app.status === 'Rejected' ? (
                                    <button
                                      onClick={() => toggleExpand(app.id)}
                                      className="text-xs font-bold text-red-500 hover:text-red-650 hover:underline flex items-center justify-end ml-auto cursor-pointer"
                                    >
                                      <span>AI Audit Feedback</span>
                                      {expandedApp === app.id ? <ChevronUp size={14} className="ml-1" /> : <ChevronDown size={14} className="ml-1" />}
                                    </button>
                                  ) : app.status === 'Shortlisted' ? (
                                    <span className="text-xs font-semibold text-green-500">Interview Scheduled</span>
                                  ) : (
                                    <span className="text-xs font-semibold text-slate-400">Under Review</span>
                                  )}
                                </td>
                              </tr>
                              
                              {/* Expandable smart rejection feedback */}
                              {app.status === 'Rejected' && expandedApp === app.id && (
                                <tr>
                                  <td colSpan="4" className="px-4 py-3 bg-red-500/5 rounded-xl border border-red-500/10">
                                    <div className="p-3 space-y-2">
                                      <div className="flex items-center space-x-2 text-red-500 font-bold text-xs">
                                        <XCircle size={14} />
                                        <span>Recruiter & ATS Rejection Audit Details</span>
                                      </div>
                                      <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                                        <p className="font-semibold text-slate-700 dark:text-slate-350">Reason & Deficiencies Identified:</p>
                                        <pre className="font-sans text-[11px] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg whitespace-pre-line leading-relaxed">
                                          {typeof app.feedback === 'object' ? app.feedback.reason : app.feedback}
                                        </pre>
                                      </div>
                                      <div className="text-[10px] text-slate-400 flex items-center space-x-1 pt-1.5">
                                        <HelpCircle size={10} className="text-slate-400" />
                                        <span>Action: Upload an optimized copy targeting these criteria in the <strong>ATS Resume tab</strong>.</span>
                                      </div>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </Fragment>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="4" className="px-4 py-8 text-center text-xs text-slate-400 dark:text-slate-500 font-medium">
                              No applications submitted yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

              </div>
            )}

            {/* TAB: MATCHES */}
            {activeTab === 'matches' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                    <Sparkles size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
                    AI Profile Matches
                  </h2>
                  <p className="text-xs text-slate-400">
                    {user.skills && user.skills.length > 0 
                      ? `Based on your analyzed resume profile containing skills: ${user.skills.join(', ')}`
                      : "Add skills to generate smart AI recommendations"
                    }
                  </p>
                </div>

                {user.skills && user.skills.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {matchedJobs.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Sparkles size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3 animate-pulse" />
                    <p className="text-sm font-semibold text-slate-500">No recommendations available yet.</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Please upload your resume or add skills to generate smart job recommendations.</p>
                    <Link to="/resume" className="text-xs text-indigo-500 font-bold hover:underline mt-3 inline-block">Upload Resume</Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB: SAVED */}
            {activeTab === 'saved' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                    <Bookmark size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
                    Saved Openings
                  </h2>
                  <p className="text-xs text-slate-400">Manage saved applications and verify closing dates</p>
                </div>

                {savedJobsDetails.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {savedJobsDetails.map((job) => (
                      <JobCard key={job.id} job={job} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
                    <Bookmark size={32} className="mx-auto text-slate-350 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-semibold text-slate-500">No jobs saved yet.</p>
                    <Link to="/jobs" className="text-xs text-indigo-500 font-bold hover:underline mt-2 inline-block">Browse job opportunities</Link>
                  </div>
                )}
              </div>
            )}

            {/* TAB: ATS RESUME */}
            {activeTab === 'ats' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                    <FileText size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
                    ATS Optimization Center
                  </h2>
                  <p className="text-xs text-slate-400">Optimize and scan your resume drafts dynamically</p>
                </div>

                <ATSScoreCard score={user.atsScore} skills={user.skills} />

                <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 text-center space-y-4">
                  <FileText size={32} className="mx-auto text-indigo-500" />
                  <h3 className="text-sm font-bold">Have an updated resume?</h3>
                  <p className="text-xs text-slate-400 max-w-sm mx-auto">Upload your updated resume PDF/DOCX to re-scan for improvements and fetch updated match suggestions.</p>
                  <Link to="/resume" className="inline-block px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors">
                    Upload & Audit Now
                  </Link>
                </div>
              </div>
            )}

            {/* TAB: FEEDBACK SYSTEM */}
            {activeTab === 'feedback' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                    <AlertTriangle size={20} className="text-red-500 mr-2" />
                    Smart Rejection Feedback Audits
                  </h2>
                  <p className="text-xs text-slate-400">Review rejection rationales from employers to upgrade your skills</p>
                </div>

                {user.applications && user.applications.filter(app => app.status === 'Rejected').length > 0 ? (
                  <div className="space-y-4">
                    {user.applications.filter(app => app.status === 'Rejected').map((app) => (
                      <div key={app.id} className="glass-card p-5 rounded-2xl border border-red-500/15 bg-red-550/5 space-y-3">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            {/* Company Logo */}
                            <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-sm bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 p-1.5 flex-shrink-0">
                              {getCompanyLogo(app.company, "w-7 h-7")}
                            </div>
                            <div>
                              <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 leading-tight">{app.jobTitle}</h3>
                              <span className="text-xs font-semibold text-slate-400 leading-none">{app.company}</span>
                            </div>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-150 dark:border-red-900 bg-red-50 dark:bg-red-950/20 text-red-500">
                            Audited Rejection
                          </span>
                        </div>

                        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3">
                          <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">Feedback Breakdown:</span>
                          <pre className="font-sans text-xs text-slate-600 dark:text-slate-350 whitespace-pre-line leading-relaxed">
                            {typeof app.feedback === 'object' ? app.feedback.reason : app.feedback}
                          </pre>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-[10px] text-slate-400 gap-2 border-t border-slate-100 dark:border-slate-800/80 pt-3">
                          <span>Applied: {app.dateApplied}</span>
                          <div className="flex space-x-3">
                            <Link to="/resume" className="text-indigo-500 font-bold hover:underline">Re-upload optimized resume</Link>
                            <Link to="/jobs" className="text-indigo-500 font-bold hover:underline">Find similar roles</Link>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12 glass-card rounded-2xl border border-slate-200 dark:border-slate-800">
                    <AlertTriangle size={32} className="mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                    <p className="text-sm font-semibold text-slate-500">No rejection audit records found.</p>
                    <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">Applications that receive feedback will appear here to help you optimize your profile.</p>
                  </div>
                )}
              </div>
            )}

            {/* TAB: NOTIFICATIONS */}
            {activeTab === 'notifications' && (
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 dark:text-white flex items-center">
                    <Bell size={20} className="text-indigo-600 dark:text-indigo-400 mr-2" />
                    System Notifications
                  </h2>
                  <p className="text-xs text-slate-400">Keep track of direct recruiter messages and automated resume evaluations</p>
                </div>

                <div className="glass-card rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden divide-y divide-slate-100 dark:divide-slate-850">
                  {mockNotifications.map((notif) => (
                    <div 
                      key={notif.id} 
                      className={`p-4 flex items-start space-x-3.5 transition-colors ${
                        !notif.read ? 'bg-indigo-50/20 dark:bg-indigo-950/10' : ''
                      }`}
                    >
                      <div className={`p-2 rounded-xl mt-0.5 flex-shrink-0 ${
                        !notif.read ? 'bg-indigo-500 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
                      }`}>
                        <Bell size={14} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex justify-between items-center">
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">{notif.title}</h4>
                          <span className="text-[10px] text-slate-400 flex items-center">
                            <Clock size={10} className="mr-1" />
                            {notif.time}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">{notif.message}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};
