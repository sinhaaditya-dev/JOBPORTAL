import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Upload,
  CheckCircle,
  AlertTriangle,
  FileText,
  Sparkles,
  RefreshCw,
  X,
  FileCheck,
  Briefcase,
  Globe,
  Loader2,
  TrendingUp,
  Target,
  BadgeCheck,
  ChevronRight,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const JOB_TITLE_SUGGESTIONS = [
  'Java Developer',
  'Frontend Developer',
  'Backend Developer',
  'React Developer',
  'Spring Boot Developer',
  'Data Analyst',
  'Software Engineer',
  'Full Stack Developer',
  'Python Developer',
  'DevOps Engineer',
  'UI/UX Designer',
  'Mobile App Developer'
];

const EXPERIENCE_LEVELS = [
  { id: 'Fresher', label: 'Fresher' },
  { id: '1-2 Years', label: '1–2 Years' },
  { id: '3-5 Years', label: '3–5 Years' },
  { id: '5+ Years', label: '5+ Years' }
];

export const ResumeUpload = () => {
  const { uploadResume, user } = useAuth();

  // Form State
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [jobDescription, setJobDescription] = useState('');
  const [jobUrl, setJobUrl] = useState('');
  const [urlError, setUrlError] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('Fresher');

  // UI & Processing State
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzingStep, setAnalyzingStep] = useState('');
  const [progress, setProgress] = useState(0);
  const [analysisDone, setAnalysisDone] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  const suggestionsRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Filtered Job Title Suggestions
  const filteredSuggestions = JOB_TITLE_SUGGESTIONS.filter((title) =>
    title.toLowerCase().includes(targetJobTitle.toLowerCase())
  );

  // File validation
  const validateFile = (selectedFile) => {
    if (!selectedFile) return false;
    const fileType = selectedFile.type;
    const extension = selectedFile.name.split('.').pop().toLowerCase();
    const allowedExtensions = ['pdf', 'doc', 'docx'];
    const allowedMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedExtensions.includes(extension) && !allowedMimeTypes.includes(fileType)) {
      setErrorMessage('Invalid file format! Please upload a PDF or DOCX file.');
      return false;
    }

    if (selectedFile.size > 5 * 1024 * 1024) {
      setErrorMessage('File size exceeds limit! Maximum allowed size is 5 MB.');
      return false;
    }

    setErrorMessage('');
    return true;
  };

  // Drag & drop handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
      }
    }
  };

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
      }
    }
  };

  const removeFile = () => {
    setFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // URL Validation
  const handleUrlChange = (e) => {
    const val = e.target.value;
    setJobUrl(val);
    if (val && !/^https?:\/\/.+/i.test(val)) {
      setUrlError('Please enter a valid URL starting with http:// or https://');
    } else {
      setUrlError('');
    }
  };

  // Form Submission / Analysis Trigger
  const handleAnalyze = async (e) => {
    e.preventDefault();
    if (!file) {
      setErrorMessage('Please upload a resume before analyzing.');
      return;
    }

    if (jobUrl && urlError) {
      return;
    }

    setAnalyzing(true);
    setAnalysisDone(false);
    setProgress(0);
    setErrorMessage('');

    const steps = [
      'Extracting resume text & document structure...',
      'Matching against target job requirements...',
      'Evaluating keyword density & ATS compliance...',
      'Generating AI suggestions & gap analysis...'
    ];

    let currentStepIdx = 0;
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        const next = prev + 15;
        currentStepIdx = Math.min(Math.floor((next / 90) * steps.length), steps.length - 1);
        setAnalyzingStep(steps[currentStepIdx]);
        return next;
      });
    }, 200);

    try {
      const metadata = {
        targetJobTitle: targetJobTitle.trim(),
        jobDescription: jobDescription.trim(),
        jobUrl: jobUrl.trim(),
        experienceLevel
      };

      const res = await uploadResume(file, metadata);
      clearInterval(interval);
      setProgress(100);
      setAnalyzingStep('Analysis complete!');

      setTimeout(() => {
        setAnalyzing(false);
        setAnalysisDone(true);
        setAnalysisResult(res?.user || user);
        // Scroll smoothly to results
        const resultsEl = document.getElementById('ats-results-section');
        if (resultsEl) {
          resultsEl.scrollIntoView({ behavior: 'smooth' });
        }
      }, 500);

    } catch (err) {
      clearInterval(interval);
      setAnalyzing(false);
      const msg = err?.response?.data?.message || err.message || 'Failed to process resume. Please try again.';
      setErrorMessage(msg);
    }
  };

  // Helper for file size display
  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full py-10 px-4 sm:px-6 lg:px-8">
      {/* Background Glow Effects */}
      <div className="bg-glow bg-glow-right"></div>
      <div className="bg-glow bg-glow-left"></div>

      <div className="relative max-w-6xl mx-auto z-10 space-y-8">

        {/* ================================= PAGE HEADER ================================= */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-indigo-50 dark:bg-indigo-950/50 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 text-xs font-bold shadow-sm">
            <Sparkles size={14} />
            <span>AI-Powered ATS Evaluator</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            AI Resume & ATS Analyzer
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-350 leading-relaxed max-w-2xl mx-auto">
            Upload your resume and compare it with your target job to receive an AI-powered ATS score and improvement suggestions.
          </p>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          {/* ================================= MAIN CARD & FORM (Col-span-2) ================================= */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl">
              <form onSubmit={handleAnalyze} className="space-y-8">

                {/* Error Banner */}
                {errorMessage && (
                  <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-xs font-bold flex items-start space-x-3">
                    <AlertTriangle size={18} className="flex-shrink-0 mt-0.5" />
                    <span>{errorMessage}</span>
                  </div>
                )}

                {/* -------------------------- SECTION 1: Upload Resume -------------------------- */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                    <FileText size={18} className="text-indigo-500" />
                    <span>Upload Resume <span className="text-red-500">*</span></span>
                  </label>

                  {!file ? (
                    <div
                      onDragEnter={handleDrag}
                      onDragOver={handleDrag}
                      onDragLeave={handleDrag}
                      onDrop={handleDrop}
                      onClick={() => fileInputRef.current?.click()}
                      className={`relative p-8 sm:p-10 rounded-2xl border-2 border-dashed text-center transition-all cursor-pointer ${
                        dragActive
                          ? 'border-indigo-500 bg-indigo-50/20 dark:bg-indigo-950/30 scale-[1.01]'
                          : 'border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-600 hover:bg-slate-50/50 dark:hover:bg-slate-900/50'
                      }`}
                    >
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileSelect}
                        className="hidden"
                      />
                      <div className="space-y-4">
                        <div className="w-14 h-14 mx-auto bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm">
                          <Upload size={26} />
                        </div>
                        <div>
                          <span className="font-extrabold text-slate-800 dark:text-white text-base block">
                            Drag & Drop Resume
                          </span>
                          <span className="text-xs text-slate-400 font-medium mt-1 block">
                            Supported: PDF, DOCX (Max Size: 5 MB)
                          </span>
                        </div>
                        <span className="inline-flex py-2.5 px-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md transition-all">
                          Browse Files
                        </span>
                      </div>
                    </div>
                  ) : (
                    /* Show uploaded file details */
                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div className="flex items-center space-x-3.5 min-w-0">
                        <div className="p-3 bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 rounded-xl flex-shrink-0">
                          <FileCheck size={24} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-800 dark:text-white text-sm truncate max-w-xs sm:max-w-md">
                            {file.name}
                          </p>
                          <p className="text-xs text-slate-400 font-medium">
                            {formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="flex-1 sm:flex-none px-3.5 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        >
                          Replace Resume
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={handleFileSelect}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={removeFile}
                          className="p-2 rounded-xl text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors cursor-pointer"
                          title="Remove Resume"
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* -------------------------- SECTION 2: Target Job Title -------------------------- */}
                <div className="space-y-2 relative" ref={suggestionsRef}>
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                    <Briefcase size={18} className="text-indigo-500" />
                    <span>Target Job Title <span className="text-red-500">*</span></span>
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      value={targetJobTitle}
                      onChange={(e) => {
                        setTargetJobTitle(e.target.value);
                        setShowSuggestions(true);
                      }}
                      onFocus={() => setShowSuggestions(true)}
                      placeholder="Example: Java Full Stack Developer"
                      className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all"
                    />

                    {/* Suggestions Dropdown */}
                    {showSuggestions && filteredSuggestions.length > 0 && (
                      <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white dark:bg-slate-900 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-800 max-h-56 overflow-y-auto py-1.5 no-scrollbar">
                        <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                          Suggested Titles
                        </div>
                        {filteredSuggestions.map((suggestion) => (
                          <button
                            key={suggestion}
                            type="button"
                            onClick={() => {
                              setTargetJobTitle(suggestion);
                              setShowSuggestions(false);
                            }}
                            className="w-full text-left px-4 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center justify-between"
                          >
                            <span>{suggestion}</span>
                            <ChevronRight size={14} className="opacity-40" />
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* -------------------------- SECTION 3: Job Description & URL -------------------------- */}
                <div className="space-y-6">
                  {/* Job Description Textarea */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                        <FileText size={18} className="text-indigo-500" />
                        <span>Job Description <span className="text-xs font-normal text-slate-400">(Optional)</span></span>
                      </label>
                      <span className="text-[11px] font-medium text-slate-400">
                        {jobDescription.length} / 5000 characters
                      </span>
                    </div>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value.slice(0, 5000))}
                      placeholder="Paste complete Job Description here..."
                      rows={6}
                      className="w-full h-[180px] p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all resize-none"
                    />
                  </div>

                  {/* CENTER OR DIVIDER */}
                  <div className="relative flex items-center justify-center my-4">
                    <div className="border-t border-slate-200 dark:border-slate-800 w-full"></div>
                    <span className="absolute bg-white dark:bg-slate-900 px-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest border border-slate-200 dark:border-slate-800 rounded-full py-0.5">
                      OR
                    </span>
                  </div>

                  {/* Job URL Input */}
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                      <Globe size={18} className="text-indigo-500" />
                      <span>Job URL <span className="text-xs font-normal text-slate-400">(Optional)</span></span>
                    </label>
                    <input
                      type="url"
                      value={jobUrl}
                      onChange={handleUrlChange}
                      placeholder="https://careers.company.com/job/software-engineer"
                      className={`w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all ${
                        urlError ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'
                      }`}
                    />
                    {urlError ? (
                      <p className="text-xs text-red-500 font-medium">{urlError}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 font-medium">
                        Accepts job URLs from LinkedIn, Naukri, Indeed, or Company Career Sites.
                      </p>
                    )}
                  </div>

                  {!jobDescription.trim() && !jobUrl.trim() && (
                    <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-indigo-700 dark:text-indigo-300 text-xs font-medium flex items-center space-x-2">
                      <Info size={14} className="flex-shrink-0" />
                      <span>If both Job Description and URL are empty, a General ATS Analysis will be performed.</span>
                    </div>
                  )}
                </div>

                {/* -------------------------- SECTION 4: Experience Level -------------------------- */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center space-x-2">
                    <BadgeCheck size={18} className="text-indigo-500" />
                    <span>Experience Level <span className="text-red-500">*</span></span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {EXPERIENCE_LEVELS.map((lvl) => {
                      const isSelected = experienceLevel === lvl.id;
                      return (
                        <label
                          key={lvl.id}
                          className={`flex items-center justify-center space-x-2.5 p-3 rounded-xl border text-xs font-bold cursor-pointer transition-all ${
                            isSelected
                              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-500/10'
                              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700'
                          }`}
                        >
                          <input
                            type="radio"
                            name="experienceLevel"
                            value={lvl.id}
                            checked={isSelected}
                            onChange={() => setExperienceLevel(lvl.id)}
                            className="hidden"
                          />
                          <div
                            className={`w-3.5 h-3.5 rounded-full border-2 flex items-center justify-center ${
                              isSelected ? 'border-white bg-white' : 'border-slate-400'
                            }`}
                          >
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                          </div>
                          <span>{lvl.label}</span>
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* -------------------------- BOTTOM: Analyze Button -------------------------- */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={!file || analyzing}
                    className="w-full py-4 px-8 rounded-2xl font-extrabold text-sm sm:text-base text-white bg-gradient-to-r from-indigo-600 via-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center space-x-3"
                  >
                    {analyzing ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        <span>Analyzing Resume ({progress}%)...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles size={20} />
                        <span>Analyze Resume</span>
                      </>
                    )}
                  </button>

                  {/* Progress Indicator when analyzing */}
                  {analyzing && (
                    <div className="mt-4 space-y-2">
                      <div className="flex justify-between items-center text-xs font-bold text-slate-500 dark:text-slate-400">
                        <span>{analyzingStep}</span>
                        <span>{progress}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

              </form>
            </div>
          </div>

          {/* ================================= RIGHT SIDE INFORMATION CARD ================================= */}
          <div className="space-y-6">
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-5 shadow-lg">
              <div className="flex items-center space-x-3 text-indigo-600 dark:text-indigo-400 border-b border-slate-100 dark:border-slate-800/80 pb-4">
                <div className="p-2.5 bg-indigo-50 dark:bg-indigo-950/50 rounded-xl">
                  <Target size={20} />
                </div>
                <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                  Why provide Job Title?
                </h3>
              </div>

              <ul className="space-y-4 text-xs font-semibold text-slate-600 dark:text-slate-300">
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></span>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-100 block font-bold">Better ATS accuracy</strong>
                    Target role context enables precise keyword matching algorithm.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-purple-500 mt-1.5"></span>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-100 block font-bold">Better keyword detection</strong>
                    Extracts crucial technical skills expected for your specific domain.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-emerald-500 mt-1.5"></span>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-100 block font-bold">Better job matching</strong>
                    Aligns your experiences with market requirements for your target title.
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <span className="flex-shrink-0 w-2 h-2 rounded-full bg-amber-500 mt-1.5"></span>
                  <div>
                    <strong className="text-slate-800 dark:text-slate-100 block font-bold">Personalized AI suggestions</strong>
                    Actionable checklist specifically formulated for your target vacancy.
                  </div>
                </li>
              </ul>
            </div>

            {/* Quick Tips Card */}
            <div className="glass-card p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                Pro Tip for High Scores
              </span>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
                Pasting the full Job Description significantly increases missing skill discovery, helping you optimize bullet points for maximum recruiter visibility.
              </p>
            </div>
          </div>

        </div>

        {/* ================================= AFTER ANALYSIS RESULTS ================================= */}
        <AnimatePresence>
          {analysisDone && (
            <motion.div
              id="ats-results-section"
              initial={{ opacity: 0, y: 25 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 25 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="space-y-8 pt-6 border-t border-slate-200 dark:border-slate-800"
            >
              {/* Header Summary Card */}
              <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="flex items-center space-x-4 text-left">
                  <div className="p-3.5 bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 rounded-2xl flex-shrink-0">
                    <CheckCircle size={28} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 dark:text-white text-lg sm:text-xl">
                      Analysis Complete
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                      Evaluated against <span className="font-bold text-slate-700 dark:text-slate-200">{targetJobTitle || 'General Software Engineering'}</span> ({experienceLevel})
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 w-full sm:w-auto">
                  <button
                    onClick={() => {
                      setAnalysisDone(false);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2.5 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
                  >
                    <RefreshCw size={14} />
                    <span>New Analysis</span>
                  </button>
                </div>
              </div>

              {/* Detailed Breakdown Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                {/* Score Gauge Card */}
                <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 text-center space-y-6 shadow-lg">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                    ATS Match Score
                  </h4>

                  <div className="relative flex items-center justify-center w-36 h-36 mx-auto">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="54"
                        className="stroke-slate-100 dark:stroke-slate-800 fill-none"
                        strokeWidth="10"
                      />
                      <circle
                        cx="72"
                        cy="72"
                        r="54"
                        className={`${
                          (analysisResult?.atsScore || user?.atsScore || 0) >= 85
                            ? 'stroke-emerald-500'
                            : (analysisResult?.atsScore || user?.atsScore || 0) >= 70
                            ? 'stroke-indigo-500'
                            : 'stroke-amber-500'
                        } fill-none transition-all duration-1000`}
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 54}
                        strokeDashoffset={
                          2 * Math.PI * 54 * (1 - (analysisResult?.atsScore || user?.atsScore || 0) / 100)
                        }
                        strokeLinecap="round"
                      />
                    </svg>
                    <div className="absolute text-center">
                      <span className="text-3xl font-black text-slate-900 dark:text-white block">
                        {analysisResult?.atsScore || user?.atsScore || 0}%
                      </span>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                        MATCH SCORE
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300">
                    {(analysisResult?.atsScore || user?.atsScore || 0) >= 80
                      ? '🚀 Excellent resume match! High probability of passing automated screening filters.'
                      : (analysisResult?.atsScore || user?.atsScore || 0) >= 65
                      ? '⚡ Good match score. Incorporating missing keywords below can boost your score past 85%.'
                      : '⚠️ Resume needs keyword optimization to better align with target role requirements.'}
                  </div>
                </div>

                {/* Skills & Gap Analysis (Col-span-2) */}
                <div className="lg:col-span-2 space-y-6">

                  {/* Skills Grid */}
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 shadow-lg">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
                      <TrendingUp size={16} className="text-indigo-500" />
                      <span>Skill & Keyword Breakdown</span>
                    </h4>

                    {/* Detected Skills */}
                    <div className="space-y-2.5">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Detected Skills in Resume ({ (analysisResult?.skills || user?.skills || []).length })
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(analysisResult?.skills || user?.skills || []).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-200 dark:border-emerald-900/40"
                          >
                            <CheckCircle size={12} className="mr-1.5 text-emerald-500" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Missing Skills */}
                    <div className="space-y-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                        Recommended Missing Skills to Add
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {(analysisResult?.recommendedSkills || user?.recommendedSkills || []).map((skill) => (
                          <span
                            key={skill}
                            className="inline-flex items-center px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-xs font-bold border border-amber-200 dark:border-amber-900/40"
                          >
                            <Sparkles size={12} className="mr-1.5 text-amber-500" />
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* AI Suggestions Checklist Card */}
                  <div className="glass-card p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-lg">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3 flex items-center space-x-2">
                      <Sparkles size={16} className="text-indigo-500" />
                      <span>Actionable AI Improvement Checklist</span>
                    </h4>

                    <ul className="space-y-3">
                      {(analysisResult?.suggestions || user?.suggestions || []).map((suggestion, idx) => (
                        <li
                          key={idx}
                          className="flex items-start space-x-3 text-xs font-medium text-slate-700 dark:text-slate-200 bg-slate-50 dark:bg-slate-900/50 p-3.5 rounded-xl border border-slate-200/60 dark:border-slate-800/80"
                        >
                          <AlertTriangle size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
                          <span className="leading-relaxed">{suggestion}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
};
