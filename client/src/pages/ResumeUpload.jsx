import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Upload, CheckCircle, AlertTriangle, Cpu, ArrowRight, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ResumeUpload = () => {
  const { uploadResume } = useAuth();
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [analyzingStep, setAnalyzingStep] = useState('');
  const [showResults, setShowResults] = useState(false);

  const steps = [
    'Scanning document structure...',
    'Extracting semantic textual nodes...',
    'Identifying skills & credentials...',
    'Evaluating ATS compliance and keyword gaps...',
    'Finalizing match scores...'
  ];

  useEffect(() => {
    let interval;
    if (uploading) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            setTimeout(() => {
              setUploading(false);
              setShowResults(true);
              // Call uploadResume from context to update mock profile
              uploadResume(file.name, (file.size / (1024 * 1024)).toFixed(1) + ' MB');
            }, 800);
            return 100;
          }
          
          // Update analysis steps based on progress percent
          const stepIndex = Math.min(Math.floor((prev / 100) * steps.length), steps.length - 1);
          setAnalyzingStep(steps[stepIndex]);
          
          return prev + 5;
        });
      }, 150);
    }
    return () => clearInterval(interval);
  }, [uploading, file]);

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
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        startUpload();
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        startUpload();
      }
    }
  };

  const validateFile = (selectedFile) => {
    const fileType = selectedFile.type;
    const isDoc = fileType === 'application/pdf' || 
                  fileType === 'application/msword' || 
                  fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';
    if (!isDoc) {
      alert("Invalid format! Please drop PDF or Word Documents (.docx)");
      return false;
    }
    return true;
  };

  const startUpload = () => {
    setProgress(0);
    setUploading(true);
    setShowResults(false);
  };

  const handleReset = () => {
    setFile(null);
    setProgress(0);
    setShowResults(false);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] py-12 px-4">
      {/* Glow Effects */}
      <div className="bg-glow bg-glow-right"></div>
      <div className="bg-glow bg-glow-left"></div>

      <div className="relative max-w-4xl mx-auto z-10 space-y-8">
        
        {/* Title */}
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h1 className="text-3xl font-black text-slate-800 dark:text-white leading-tight">
            AI-Powered Resume Scanner
          </h1>
          <p className="text-xs text-slate-400">
            Upload your CV in PDF or DOCX format to receive instant ATS evaluations and matching recommendations.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Main Area (Drag/Progress/Results) */}
          <div className="lg:col-span-2 space-y-6">
            
            <AnimatePresence mode="wait">
              
              {/* STATE 1: Dropzone Upload */}
              {!uploading && !showResults && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`glass-card p-12 rounded-3xl border-2 border-dashed text-center transition-all ${
                    dragActive 
                      ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10 scale-[1.01]' 
                      : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleChange}
                  />
                  
                  <label htmlFor="file-upload" className="cursor-pointer space-y-5 block">
                    <div className="w-16 h-16 mx-auto bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center shadow-sm">
                      <Upload size={28} />
                    </div>
                    <div>
                      <span className="font-extrabold text-slate-800 dark:text-white text-base block">
                        Drag & Drop Resume
                      </span>
                      <span className="text-xs text-slate-400 font-semibold mt-1.5 block">
                        Supports PDF, DOCX, and DOC (Max 5MB)
                      </span>
                    </div>
                    
                    <span className="inline-flex py-2.5 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md hover:shadow-indigo-500/10 transition-colors">
                      Browse Files
                    </span>
                  </label>
                </motion.div>
              )}

              {/* STATE 2: Upload Progress Loading */}
              {uploading && (
                <motion.div
                  key="uploading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-6 text-center"
                >
                  <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
                    <div className="absolute inset-0 border-4 border-slate-100 dark:border-slate-800 rounded-full"></div>
                    <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <Cpu size={24} className="text-indigo-600 dark:text-indigo-400 fill-indigo-500/10" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-bold text-slate-800 dark:text-white block">
                      AI Analyzing CV...
                    </span>
                    <span className="text-xs text-indigo-500 font-bold block h-4 transition-all">
                      {analyzingStep}
                    </span>
                  </div>

                  <div className="max-w-md mx-auto space-y-1.5">
                    <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
                      <span>{file?.name}</span>
                      <span>{progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 dark:bg-slate-850 rounded-full h-2">
                      <div 
                        className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-150" 
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* STATE 3: Results Display */}
              {showResults && (
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-6"
                >
                  {/* Summary Card */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center space-x-3.5 text-left">
                      <div className="p-3 bg-green-50 dark:bg-green-950/40 text-green-600 dark:text-green-400 rounded-xl">
                        <CheckCircle size={24} />
                      </div>
                      <div>
                        <h3 className="font-extrabold text-slate-800 dark:text-white text-sm">Upload Success</h3>
                        <p className="text-xs text-slate-400 font-medium truncate max-w-xs">{file?.name}</p>
                      </div>
                    </div>
                    <div className="flex space-x-2 w-full sm:w-auto">
                      <button
                        onClick={handleReset}
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold border border-slate-200 dark:border-slate-700 transition-colors"
                      >
                        <RefreshCw size={12} />
                        <span>Re-upload</span>
                      </button>
                      <Link
                        to="/dashboard"
                        className="flex-1 sm:flex-none flex items-center justify-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer transition-colors"
                      >
                        <span>Dashboard</span>
                        <ArrowRight size={12} />
                      </Link>
                    </div>
                  </div>

                  {/* Dummy AI Analysis Results */}
                  <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-6">
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-850 pb-3">
                      AI Parsing Report
                    </h3>

                    {/* ATS Score Radial & Skills breakdown */}
                    <div className="flex flex-col sm:flex-row items-center sm:space-x-8 space-y-6 sm:space-y-0 py-2">
                      
                      {/* ATS Gauge */}
                      <div className="relative flex items-center justify-center w-28 h-28 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          <circle cx="56" cy="56" r="42" className="stroke-slate-100 dark:stroke-slate-800 fill-none" strokeWidth="8" />
                          <circle cx="56" cy="56" r="42" className="stroke-amber-500 fill-none" strokeWidth="8" strokeDasharray={2 * Math.PI * 42} strokeDashoffset={2 * Math.PI * 42 * (1 - 78 / 100)} strokeLinecap="round" />
                        </svg>
                        <div className="absolute text-center">
                          <span className="text-2xl font-black text-slate-800 dark:text-white">78%</span>
                          <span className="block text-[8px] text-slate-400 font-bold uppercase tracking-wider">ATS MATCH</span>
                        </div>
                      </div>

                      {/* Text details */}
                      <div className="flex-1 space-y-4 text-left w-full">
                        {/* Detected Skills */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Detected Skills:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Java', 'Spring Boot', 'MongoDB'].map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center text-[10px] font-bold bg-green-50 dark:bg-green-950/20 text-green-700 dark:text-green-400 px-3 py-1 rounded-full border border-green-150 dark:border-green-900/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Missing Skills */}
                        <div className="space-y-1.5">
                          <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Recommended Skills to Add:</span>
                          <div className="flex flex-wrap gap-1.5">
                            {['Docker', 'AWS', 'Microservices'].map((skill) => (
                              <span
                                key={skill}
                                className="inline-flex items-center text-[10px] font-bold bg-amber-50/70 dark:bg-amber-950/20 text-amber-600 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-150 dark:border-amber-900/30"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Text block output as requested */}
                    <div className="bg-slate-50 dark:bg-slate-900/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-left">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block mb-2 tracking-wider">Raw Output:</span>
                      <pre className="font-mono text-xs text-slate-600 dark:text-slate-300 leading-relaxed overflow-x-auto whitespace-pre-wrap">
{`Detected Skills:
Java
Spring Boot
MongoDB

ATS Score:
78%`}
                      </pre>
                    </div>

                    {/* Improvements checklist */}
                    <div className="border-t border-slate-100 dark:border-slate-850 pt-4 space-y-3 text-left">
                      <h4 className="text-xs font-bold text-slate-700 dark:text-slate-350">Improvement Suggestions Checklist:</h4>
                      <ul className="space-y-2 text-xs text-slate-500 dark:text-slate-400">
                        <li className="flex items-start">
                          <AlertTriangle size={14} className="text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Include quantifiable achievements in your Java projects section (e.g. "reduced server response times by 30%").</span>
                        </li>
                        <li className="flex items-start">
                          <AlertTriangle size={14} className="text-amber-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Add AWS and Docker keyword associations within your core technology definitions.</span>
                        </li>
                        <li className="flex items-start">
                          <CheckCircle size={14} className="text-indigo-500 mr-2 flex-shrink-0 mt-0.5" />
                          <span>Document header styling parses cleanly; no structural outline block issues found.</span>
                        </li>
                      </ul>
                    </div>

                  </div>
                </motion.div>
              )}

            </AnimatePresence>

          </div>

          {/* Sidebar Right Column (Instructions/Features) */}
          <div className="space-y-6 text-left">
            <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center">
                <Cpu size={16} className="text-indigo-500 mr-2" />
                How AI Audit Works
              </h3>
              
              <div className="space-y-3.5 text-xs text-slate-500 dark:text-slate-450 leading-relaxed">
                <div>
                  <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">1. Text Parsing</strong>
                  Our algorithms decompose PDF binary vectors into tokens, identifying headings and timeline elements.
                </div>
                <div>
                  <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">2. Keyword Weighting</strong>
                  The system measures keyword occurrences against a repository of 50,000+ technical descriptions.
                </div>
                <div>
                  <strong className="text-slate-700 dark:text-slate-300 block mb-0.5">3. Score Formulation</strong>
                  An algorithmic matrix computes structural, semantic, and syntax scores to output compliance ratios.
                </div>
              </div>
            </div>

            {/* Document Preview Mockup */}
            <div className="glass-card p-5 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3 relative overflow-hidden">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ATS Parser Preview Mock</span>
              
              <div className="border border-slate-200 dark:border-slate-800/80 rounded-xl p-3 bg-white dark:bg-slate-900/50 space-y-2">
                <div className="h-3 bg-slate-200 dark:bg-slate-800 rounded w-1/3"></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-2/3"></div>
                <div className="border-t border-slate-100 dark:border-slate-850/80 my-2"></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-full"></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-5/6"></div>
                <div className="h-2 bg-slate-100 dark:bg-slate-850 rounded w-4/5"></div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-slate-50/80 dark:from-slate-950/40 to-transparent flex items-end justify-center pb-3">
                <span className="text-[9px] font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950 border border-indigo-100 dark:border-indigo-900/40 px-2 py-0.5 rounded-full">
                  Structure Audited
                </span>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
