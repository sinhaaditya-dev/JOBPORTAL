import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Eye, 
  EyeOff, 
  Building, 
  Globe, 
  Upload, 
  Sparkles, 
  ListTodo, 
  Award, 
  PlusCircle, 
  UserCheck, 
  Users, 
  BarChart2,
  AlertCircle,
  X,
  FileText
} from 'lucide-react';

const Linkedin = ({ size = 24, ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <circle cx="4" cy="4" r="2" />
    <rect x="2" y="9" width="4" height="12" />
  </svg>
);

const Github = ({ size = 24, ...props }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />
  </svg>
);



export const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Tab State: 'seeker' or 'employer'
  const [roleType, setRoleType] = useState('seeker');

  // Input states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Job Seeker specific states
  const [experience, setExperience] = useState('');
  const [resume, setResume] = useState(null);
  const [linkedin, setLinkedin] = useState('');
  const [github, setGithub] = useState('');

  // Employer specific states
  const [companyName, setCompanyName] = useState('');
  const [industry, setIndustry] = useState('');
  const [companySize, setCompanySize] = useState('');
  const [website, setWebsite] = useState('');
  const [companyLogo, setCompanyLogo] = useState(null);

  // General States
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // File Upload drag states
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (roleType === 'seeker') {
        setResume(file);
      } else {
        setCompanyLogo(file);
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (roleType === 'seeker') {
        setResume(file);
      } else {
        setCompanyLogo(file);
      }
    }
  };

  const removeUploadedFile = () => {
    if (roleType === 'seeker') {
      setResume(null);
    } else {
      setCompanyLogo(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword || !mobile) {
      setError('Please fill in all required fields.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!agreeTerms) {
      setError('You must agree to the Terms of Service & Privacy Policy.');
      return;
    }

    // Role mapping
    const finalRole = roleType === 'seeker' 
      ? (experience === 'Fresher' ? 'Job Seeker (Fresher)' : 'Job Seeker')
      : 'Employer';

    // Register User
    register(name, email, password, finalRole);

    // Save extra profile details to localStorage if mock update is needed
    const extraDetails = roleType === 'seeker' 
      ? {
          phone: `+91 ${mobile}`,
          title: experience === 'Fresher' ? 'Graduate Apprentice' : 'Software Engineer',
          resumeName: resume ? resume.name : '',
          resumeSize: resume ? `${(resume.size / 1024 / 1024).toFixed(2)} MB` : '',
          resumeUploadDate: resume ? new Date().toLocaleDateString() : '',
          skills: ['React', 'JavaScript', 'HTML/CSS'],
          atsScore: resume ? 84 : 0,
          linkedin,
          github
        }
      : {
          phone: `+91 ${mobile}`,
          title: 'Lead Hiring Partner',
          companyName,
          industry,
          companySize,
          website,
          logoName: companyLogo ? companyLogo.name : ''
        };

    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      localStorage.setItem('user', JSON.stringify({ ...parsedUser, ...extraDetails }));
    }

    navigate('/dashboard');
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-8 bg-[rgb(var(--bg-base))] transition-colors duration-300">
      {/* Background Glows */}
      <div className="bg-glow bg-glow-right"></div>
      <div className="bg-glow bg-glow-left"></div>

      <div className="w-full max-w-6xl bg-white dark:bg-slate-900 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10 text-slate-800 dark:text-slate-200 overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        
        {/* LEFT COLUMN: Sidebar Dynamic Theme */}
        <div className={`lg:col-span-4 p-8 md:p-12 flex flex-col justify-between transition-colors duration-500 relative overflow-hidden ${
          roleType === 'seeker' 
            ? 'bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-950 dark:text-indigo-100' 
            : 'bg-emerald-50/50 dark:bg-emerald-950/20 text-emerald-950 dark:text-emerald-100'
        }`}>
          
          <div className="space-y-8 relative z-10">
            {/* dynamic avatar logo */}
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500 ${
              roleType === 'seeker' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
            }`}>
              {roleType === 'seeker' ? <User size={28} /> : <Building size={28} />}
            </div>

            <div className="space-y-3">
              <h2 className="text-3xl font-extrabold tracking-tight">
                {roleType === 'seeker' ? 'Job Seeker' : 'Employer'}
              </h2>
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                {roleType === 'seeker' 
                  ? 'Join thousands of job seekers finding their dream jobs with AI-powered matching' 
                  : 'Post jobs, find talented candidates, and build your dream team'
                }
              </p>
            </div>

            {/* Checklist */}
            <ul className="space-y-4 pt-4">
              {roleType === 'seeker' ? (
                <>
                  <li className="flex items-start space-x-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Sparkles size={16} />
                    </div>
                    <div>
                      <span className="font-bold block">AI-Powered Job Matching</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Get job recommendations that match your skills</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <FileText size={16} />
                    </div>
                    <div>
                      <span className="font-bold block">ATS Resume Analysis</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Improve your resume score and get better opportunities</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <ListTodo size={16} />
                    </div>
                    <div>
                      <span className="font-bold block">Track Applications</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Monitor your application status in one place</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shrink-0">
                      <Award size={16} />
                    </div>
                    <div>
                      <span className="font-bold block">Career Growth</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Get insights and resources to grow your career</span>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="flex items-start space-x-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <PlusCircle size={16} />
                    </div>
                    <div>
                      <span className="font-bold block">Post Unlimited Jobs</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Reach thousands of qualified candidates</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <UserCheck size={16} />
                    </div>
                    <div>
                      <span className="font-bold block">Smart Candidate Matching</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">AI helps you find the best matching candidates</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <Users size={16} />
                    </div>
                    <div>
                      <span className="font-bold block">Applicant Management</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Manage applications and shortlist candidates easily</span>
                    </div>
                  </li>
                  <li className="flex items-start space-x-3 text-sm">
                    <div className="p-1.5 rounded-lg bg-white dark:bg-slate-800 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <BarChart2 size={16} />
                    </div>
                    <div>
                      <span className="font-bold block">Analytics & Insights</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400">Get detailed insights about your job postings</span>
                    </div>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Character illustration matching theme */}
          <div className="pt-8 flex justify-center items-end relative z-10 min-h-[160px]">
            {roleType === 'seeker' ? (
              <svg className="w-full max-w-[210px] h-auto drop-shadow-lg" viewBox="0 0 200 150" fill="none">
                <circle cx="100" cy="115" r="35" className="fill-indigo-100 dark:fill-indigo-900/40" />
                <path d="M100 80c22 0 40 18 40 40H60c0-22 18-40 40-40z" className="fill-indigo-600/15" />
                {/* Character */}
                <rect x="75" y="70" width="50" height="70" rx="25" className="fill-indigo-600 dark:fill-indigo-500" />
                <circle cx="100" cy="50" r="18" className="fill-orange-100" />
                {/* Laptop */}
                <path d="M70 120h60v8H70z" fill="#cbd5e1" />
                <path d="M85 95h30v25H85z" fill="#94a3b8" />
                <path d="M100 110v5" stroke="#cbd5e1" strokeWidth="2" />
                {/* Floating details */}
                <circle cx="45" cy="40" r="14" className="fill-white dark:fill-slate-850" />
                <path d="M40 40h10M45 35v10" stroke="#6366f1" strokeWidth="2" strokeLinecap="round" />
                <circle cx="160" cy="70" r="12" className="fill-white dark:fill-slate-850" />
                <rect x="153" y="67" width="14" height="6" rx="2" className="fill-orange-400" />
              </svg>
            ) : (
              <svg className="w-full max-w-[210px] h-auto drop-shadow-lg" viewBox="0 0 200 150" fill="none">
                <circle cx="100" cy="115" r="35" className="fill-emerald-100 dark:fill-emerald-900/40" />
                <path d="M100 80c22 0 40 18 40 40H60c0-22 18-40 40-40z" className="fill-emerald-600/15" />
                {/* Character */}
                <rect x="75" y="70" width="50" height="70" rx="25" className="fill-emerald-600 dark:fill-emerald-500" />
                <circle cx="100" cy="50" r="18" className="fill-orange-100" />
                {/* Glasses and Beard */}
                <rect x="91" y="47" width="6" height="5" rx="1" stroke="#334155" strokeWidth="2" />
                <rect x="103" y="47" width="6" height="5" rx="1" stroke="#334155" strokeWidth="2" />
                <line x1="97" y1="50" x2="103" y2="50" stroke="#334155" strokeWidth="2" />
                <path d="M85 58c0 8 6 12 15 12s15-4 15-12z" className="fill-amber-950/20" />
                {/* Laptop */}
                <path d="M70 120h60v8H70z" fill="#cbd5e1" />
                <path d="M85 95h30v25H85z" fill="#94a3b8" />
                {/* Floating details */}
                <circle cx="45" cy="80" r="14" className="fill-white dark:fill-slate-850" />
                <path d="M38 80l4 4 8-8" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="160" cy="50" r="12" className="fill-white dark:fill-slate-850" />
                <path d="M155 55v-8h10" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}
          </div>

          {/* Decorative Backdrops */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-slate-200/20 rounded-full blur-xl translate-x-12 -translate-y-12"></div>
        </div>

        {/* RIGHT COLUMN: Overhauled Forms */}
        <div className="lg:col-span-8 p-8 md:p-12 space-y-8 flex flex-col justify-between">
          
          <div className="space-y-6">
            
            {/* Segmented Tab Switcher with Hover Activation */}
            <div className="flex bg-slate-100 dark:bg-slate-950 p-1.5 rounded-2xl max-w-sm border border-slate-200/50 dark:border-slate-800">
              <button
                type="button"
                onMouseEnter={() => setRoleType('seeker')}
                onClick={() => setRoleType('seeker')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  roleType === 'seeker'
                    ? 'bg-white dark:bg-slate-900 text-indigo-650 dark:text-indigo-400 shadow-sm border border-slate-200/50 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <User size={14} />
                <span>Job Seeker</span>
              </button>
              
              <button
                type="button"
                onMouseEnter={() => setRoleType('employer')}
                onClick={() => setRoleType('employer')}
                className={`flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
                  roleType === 'employer'
                    ? 'bg-white dark:bg-slate-900 text-emerald-650 dark:text-emerald-400 shadow-sm border border-slate-200/50 dark:border-slate-800'
                    : 'text-slate-500 hover:text-slate-850 dark:text-slate-400 dark:hover:text-slate-200'
                }`}
              >
                <Building size={14} />
                <span>Employer</span>
              </button>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-2xl border border-red-100 dark:border-red-900/30 text-xs font-semibold">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {/* Heading details */}
            <div className="space-y-1 text-left">
              <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {roleType === 'seeker' ? 'Create your account' : 'Create your company account'}
              </h1>
              <p className="text-xs text-slate-400 font-semibold">
                {roleType === 'seeker' ? 'Fill in your details to get started' : 'Fill in your company details to get started'}
              </p>
            </div>

            {/* MAIN FORM */}
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
              
              {/* Full Name */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  {roleType === 'seeker' ? 'Full Name' : 'Your Full Name'}<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <User className="absolute left-4 text-slate-400" size={16} />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs pl-10 pr-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Dynamic Field: Email / Company Email */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  {roleType === 'seeker' ? 'Email Address' : 'Company Email'}<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-4 text-slate-400" size={16} />
                  <input
                    type="email"
                    placeholder={roleType === 'seeker' ? 'Enter your email address' : 'Enter official company email'}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full text-xs pl-10 pr-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Employer Specific: Company Name */}
              {roleType === 'employer' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                    Company Name<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <div className="relative flex items-center">
                    <Building className="absolute left-4 text-slate-400" size={16} />
                    <input
                      type="text"
                      placeholder="Enter company name"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full text-xs pl-10 pr-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Mobile Number */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  Mobile Number<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <div className="absolute left-4 flex items-center space-x-1 text-slate-400">
                    <Phone size={14} className="mr-1" />
                    <span className="text-xs font-bold text-slate-650 dark:text-slate-300">+91</span>
                    <span className="text-slate-300 dark:text-slate-800">|</span>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your mobile number"
                    value={mobile}
                    onChange={(e) => setMobile(e.target.value)}
                    className="w-full text-xs pl-20 pr-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  Password<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-slate-400" size={16} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  Confirm Password<span className="text-red-500 ml-0.5">*</span>
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-4 text-slate-400" size={16} />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full text-xs pl-10 pr-10 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 text-slate-400 hover:text-slate-600 focus:outline-none cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Dynamic: Experience dropdown for Seeker / Industry & Size for Employer */}
              {roleType === 'seeker' ? (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                    Work Experience<span className="text-red-500 ml-0.5">*</span>
                  </label>
                  <select
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full text-xs px-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
                    required
                  >
                    <option value="">Select your experience level</option>
                    <option value="Fresher">Fresher</option>
                    <option value="0-1">0-1 years</option>
                    <option value="1-3">1-3 years</option>
                    <option value="3-5">3-5 years</option>
                    <option value="5+">5+ years</option>
                  </select>
                  <span className="text-[10px] text-slate-400 block font-semibold pl-1">
                    Fresher, 0-1 years, 1-3 years, 3-5 years, 5+ years
                  </span>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Industry Type<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <select
                      value={industry}
                      onChange={(e) => setIndustry(e.target.value)}
                      className="w-full text-xs px-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
                      required
                    >
                      <option value="">Select industry</option>
                      <option value="Technology">Technology</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Education">Education</option>
                      <option value="Marketing">Marketing</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      Company Size<span className="text-red-500 ml-0.5">*</span>
                    </label>
                    <select
                      value={companySize}
                      onChange={(e) => setCompanySize(e.target.value)}
                      className="w-full text-xs px-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-700 dark:text-slate-300 cursor-pointer"
                      required
                    >
                      <option value="">Select size</option>
                      <option value="1-10">1-10 employees</option>
                      <option value="11-50">11-50 employees</option>
                      <option value="51-200">51-200 employees</option>
                      <option value="201-500">201-500 employees</option>
                      <option value="501+">501+ employees</option>
                    </select>
                  </div>
                </>
              )}

              {/* Employer Specific: Company Website */}
              {roleType === 'employer' && (
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                    Company Website (Optional)
                  </label>
                  <div className="relative flex items-center">
                    <Globe className="absolute left-4.5 text-slate-400" size={16} />
                    <input
                      type="url"
                      placeholder="https://www.yourcompany.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      className="w-full text-xs pl-10 pr-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-905 dark:text-white transition-all placeholder-slate-400"
                    />
                  </div>
                </div>
              )}

              {/* Drag and Drop File Uploaders */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                  {roleType === 'seeker' ? 'Upload Resume (Optional)' : 'Company Logo (Optional)'}
                </label>
                
                {/* Uploader UI Card */}
                {(roleType === 'seeker' ? resume : companyLogo) ? (
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-850">
                    <div className="flex items-center space-x-3 truncate">
                      <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-650 dark:text-indigo-400">
                        <FileText size={18} />
                      </div>
                      <span className="text-xs font-semibold truncate text-slate-800 dark:text-slate-200">
                        {roleType === 'seeker' ? resume.name : companyLogo.name}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={removeUploadedFile}
                      className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 cursor-pointer"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragEnter={handleDrag}
                    onDragOver={handleDrag}
                    onDragLeave={handleDrag}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current && fileInputRef.current.click()}
                    className={`border-2 border-dashed rounded-2xl p-5 text-center cursor-pointer transition-all ${
                      dragActive
                        ? 'border-indigo-500 bg-indigo-50/10'
                        : 'border-slate-200 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 bg-white dark:bg-slate-950'
                    }`}
                  >
                    <Upload className="mx-auto text-slate-400 mb-1.5" size={20} />
                    <span className="text-xs font-semibold text-slate-650 dark:text-slate-300 block">
                      Drag & drop {roleType === 'seeker' ? 'your resume' : 'logo'} here or{' '}
                      <span className={roleType === 'seeker' ? 'text-indigo-600 dark:text-indigo-400 hover:underline' : 'text-emerald-600 dark:text-emerald-400 hover:underline'}>
                        browse file
                      </span>
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1">
                      {roleType === 'seeker' ? 'PDF, DOC, DOCX (Max 5MB)' : 'JPG, PNG (Max 2MB)'}
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      accept={roleType === 'seeker' ? '.pdf,.doc,.docx' : '.jpg,.jpeg,.png'}
                    />
                  </div>
                )}
              </div>

              {/* Seeker Specific: LinkedIn & GitHub Profiles */}
              {roleType === 'seeker' && (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      LinkedIn Profile (Optional)
                    </label>
                    <div className="relative flex items-center">
                      <Linkedin className="absolute left-4.5 text-slate-400" size={16} />
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/your-profile"
                        value={linkedin}
                        onChange={(e) => setLinkedin(e.target.value)}
                        className="w-full text-xs pl-10 pr-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-350">
                      GitHub Profile (Optional)
                    </label>
                    <div className="relative flex items-center">
                      <Github className="absolute left-4.5 text-slate-400" size={16} />
                      <input
                        type="url"
                        placeholder="https://github.com/your-username"
                        value={github}
                        onChange={(e) => setGithub(e.target.value)}
                        className="w-full text-xs pl-10 pr-5 py-3 rounded-2xl bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-slate-900 dark:text-white transition-all placeholder-slate-400"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Agree Checkbox */}
              <div className="flex items-start md:col-span-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer mr-3 mt-0.5 flex-shrink-0 ${
                    agreeTerms
                      ? roleType === 'seeker'
                        ? 'bg-indigo-650 border-indigo-650 text-white dark:bg-indigo-500 dark:border-indigo-500'
                        : 'bg-emerald-600 border-emerald-600 text-white dark:bg-emerald-500 dark:border-emerald-500'
                      : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950'
                  }`}
                >
                  {agreeTerms && (
                    <svg className="w-3 h-3 fill-current" viewBox="0 0 20 20">
                      <path d="M0 11l2-2 5 5L18 3l2 2L7 18z" />
                    </svg>
                  )}
                </button>
                <span
                  onClick={() => setAgreeTerms(!agreeTerms)}
                  className="text-xs text-slate-500 dark:text-slate-400 font-semibold select-none cursor-pointer leading-normal"
                >
                  I agree to the{' '}
                  <span className={roleType === 'seeker' ? 'text-indigo-600 dark:text-indigo-400 hover:underline font-bold' : 'text-emerald-600 dark:text-emerald-400 hover:underline font-bold'}>
                    Terms of Service
                  </span>{' '}
                  and{' '}
                  <span className={roleType === 'seeker' ? 'text-indigo-600 dark:text-indigo-400 hover:underline font-bold' : 'text-emerald-600 dark:text-emerald-400 hover:underline font-bold'}>
                    Privacy Policy
                  </span>
                </span>
              </div>

              {/* Submit Button */}
              <div className="md:col-span-2 pt-2">
                <button
                  type="submit"
                  className={`w-full py-4 text-white rounded-2xl font-bold text-sm shadow-md transition-all cursor-pointer ${
                    roleType === 'seeker'
                      ? 'bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 hover:shadow-indigo-500/25'
                      : 'bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 hover:shadow-emerald-500/25'
                  }`}
                >
                  {roleType === 'seeker' ? 'Create Account' : 'Create Company Account'}
                </button>
              </div>

            </form>

            {/* Separator line */}
            <div className="flex items-center justify-center my-6 relative">
              <div className="w-full h-px bg-slate-200 dark:bg-slate-800"></div>
              <span className="absolute bg-white dark:bg-slate-900 px-4 text-xs font-bold text-slate-400">
                or continue with
              </span>
            </div>

            {/* Social Logins Grid */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-bold text-xs cursor-pointer text-slate-700 dark:text-slate-200"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335" />
                </svg>
                <span>Google</span>
              </button>
              <button
                type="button"
                className="flex items-center justify-center space-x-2 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors font-bold text-xs cursor-pointer text-slate-700 dark:text-slate-200"
              >
                <svg className="w-4 h-4 fill-current text-[#0077B5]" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7h-3.56V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z"/>
                </svg>
                <span>LinkedIn</span>
              </button>
            </div>

            {/* Bottom terms agreements */}
            <p className="text-[10px] text-slate-450 font-semibold leading-relaxed text-center pt-2">
              By creating an account, you agree to our{' '}
              <a href="#" className={roleType === 'seeker' ? 'text-indigo-600 dark:text-indigo-400 hover:underline font-bold' : 'text-emerald-600 dark:text-emerald-400 hover:underline font-bold'}>
                Terms & Conditions
              </a>
            </p>

          </div>
          
        </div>

      </div>
    </div>
  );
};
