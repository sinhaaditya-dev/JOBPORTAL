import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/JobCard';
import * as Icons from 'lucide-react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { CompanyLogos } from '../components/CompanyLogos';
import {
  containerStagger,
  itemFadeUp,
  itemScaleUp,
  viewportOnce,
  springPreset,
} from '../utils/animations';

const mockCategories = [
  { id: 'cat1', name: 'Software Development', icon: 'Code', count: 1420 },
  { id: 'cat2', name: 'Artificial Intelligence & ML', icon: 'Cpu', count: 850 },
  { id: 'cat3', name: 'Data Science & Analytics', icon: 'BarChart3', count: 640 },
  { id: 'cat4', name: 'Product Management', icon: 'Briefcase', count: 320 },
  { id: 'cat5', name: 'Design & UX/UI', icon: 'Palette', count: 510 },
  { id: 'cat6', name: 'Marketing & Growth', icon: 'Megaphone', count: 280 },
];

export const Home = () => {
  const { jobs } = useAuth();
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [category, setCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/jobs?query=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}`);
  };

  // Get Lucide Icon dynamically
  const renderCategoryIcon = (iconName) => {
    const IconComponent = Icons[iconName];
    return IconComponent ? (
      <IconComponent size={24} className="text-slate-800 dark:text-zinc-200 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3" />
    ) : (
      <Icons.HelpCircle size={24} className="text-slate-800 dark:text-zinc-200 transition-transform duration-300 group-hover:scale-110" />
    );
  };

  return (
    <div className="relative min-h-screen w-full bg-mesh-gradient text-slate-800 dark:text-zinc-200 overflow-x-hidden">
      
      {/* 1. Full-Screen Premium Hero Section */}
      <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden py-24 md:py-32 mt-[-4rem] bg-transparent border-b border-slate-100/50 dark:border-zinc-900/50">
        
        {/* Subtle Background Glow Spheres */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" />

        {/* Hero Content Container */}
        <motion.div
          variants={containerStagger}
          initial="hidden"
          animate="show"
          className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center space-y-8"
        >
          {/* Badge */}
          <motion.div variants={itemFadeUp} className="inline-block">
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 px-4 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 text-xs font-bold shadow-sm"
            >
              <Icons.Sparkles size={12} className="text-indigo-500 dark:text-indigo-400 animate-spin-slow" />
              <span>Advanced AI Resume Parsing & Recommendation Engine</span>
            </motion.div>
          </motion.div>
          
          {/* Title & Subtitle */}
          <div className="space-y-4">
            <motion.h1
              variants={itemFadeUp}
              className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-[-2px] text-slate-900 dark:text-white leading-tight"
            >
              Find Your Dream Job <br />
              <span className="text-gradient">
                With AI Precision
              </span>
            </motion.h1>

            <motion.p
              variants={itemFadeUp}
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Discover thousands of opportunities and get AI-powered career recommendations.
            </motion.p>
          </div>

          {/* Clean Search Form */}
          <motion.form
            variants={itemFadeUp}
            onSubmit={handleSearch}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 p-4 rounded-3xl shadow-lg flex flex-col md:flex-row gap-4 max-w-4xl mx-auto text-left transition-all duration-300 hover:shadow-xl dark:hover:border-zinc-700"
          >
            {/* Job Title Input */}
            <div className="flex-1 flex items-center px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus-within:border-slate-400 dark:focus-within:border-zinc-600 transition-colors space-x-3">
              <Icons.Search className="text-slate-400 dark:text-zinc-500 flex-shrink-0" size={18} />
              <input
                type="text"
                placeholder="Job title, keywords, or skills..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Category Select */}
            <div className="flex-1 flex items-center px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus-within:border-slate-400 dark:focus-within:border-zinc-600 transition-colors space-x-3">
              <Icons.Briefcase className="text-slate-400 dark:text-zinc-500 flex-shrink-0" size={18} />
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-700 dark:text-zinc-300 placeholder-slate-400 cursor-pointer [&>option]:bg-white [&>option]:text-slate-900 dark:[&>option]:bg-zinc-900 dark:[&>option]:text-white"
              >
                <option value="">All Categories</option>
                {mockCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            {/* Location Input */}
            <div className="flex-1 flex items-center px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus-within:border-slate-400 dark:focus-within:border-zinc-600 transition-colors space-x-3">
              <Icons.MapPin className="text-slate-400 dark:text-zinc-500 flex-shrink-0" size={18} />
              <input
                type="text"
                placeholder="Location (e.g. Remote)..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full text-sm bg-transparent border-none outline-none focus:ring-0 text-slate-900 dark:text-white placeholder-slate-400"
              />
            </div>

            {/* Search Button */}
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.96 }}
              transition={springPreset}
              className="w-full md:w-auto px-8 py-3 bg-slate-950 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-2xl font-bold text-sm shadow-md transition-colors flex items-center justify-center space-x-2 cursor-pointer"
            >
              <Icons.Search size={16} />
              <span>Search</span>
            </motion.button>
          </motion.form>

          {/* Quick Info Tags */}
          <motion.div 
            variants={itemFadeUp}
            className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 dark:text-zinc-400 font-semibold"
          >
            <span className="self-center">Popular Searches:</span>
            {['React Developer', 'AI Engineer', 'Remote Product Manager'].map((tag) => (
              <motion.button
                key={tag}
                type="button"
                whileHover={{ scale: 1.05, y: -1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setQuery(tag);
                  navigate(`/jobs?query=${encodeURIComponent(tag)}`);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 transition-colors cursor-pointer shadow-xs"
              >
                {tag}
              </motion.button>
            ))}
          </motion.div>
        </motion.div>
      </div>

      {/* Rest of the Home Page Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 space-y-20">

        {/* 2. Top Companies Logos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
        >
          <CompanyLogos />
        </motion.div>

        {/* 3. AI Promo Banner */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={viewportOnce}
          transition={{ duration: 0.6 }}
          className="p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 relative overflow-hidden bg-slate-50 dark:bg-zinc-900/90 shadow-sm hover:shadow-md transition-shadow group"
        >
          {/* Subtle Ambient Background Gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <motion.span
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center bg-indigo-100 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider border border-indigo-200 dark:border-indigo-800/50"
              >
                ATS Optimizer
              </motion.span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Not getting interviews? Let AI audit your CV.
              </h2>
              <p className="text-sm text-slate-600 dark:text-zinc-400 max-w-xl font-medium">
                Get parsed skills reports, missing requirements checklists, and score comparisons instantly.
              </p>
            </div>
            
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={springPreset}
            >
              <Link
                to="/resume"
                className="px-6 py-3.5 bg-slate-950 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-zinc-100 rounded-xl font-bold text-sm shadow-md transition-colors flex items-center space-x-2 flex-shrink-0 cursor-pointer"
              >
                <Sparkles size={16} className="text-indigo-400 dark:text-indigo-600 animate-pulse" />
                <span>Verify Resume Free</span>
              </Link>
            </motion.div>
          </div>
        </motion.div>

        {/* 4. Browse Categories */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
            className="text-center max-w-2xl mx-auto space-y-2"
          >
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white tracking-tight">
              Explore Opportunities by Domain
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 font-medium">
              Browse top categories and connect with high-growth specialized employers.
            </p>
          </motion.div>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {mockCategories.map((cat) => (
              <motion.div key={cat.id} variants={itemScaleUp}>
                <Link
                  to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                  className="group block bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800/80 flex items-start space-x-4 hover:border-slate-400 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-sm hover:shadow-md transform hover:-translate-y-1"
                >
                  <div className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-xl flex-shrink-0 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-950/40 transition-colors">
                    {renderCategoryIcon(cat.icon)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cat.name}
                    </h3>
                    <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 block">
                      {cat.count} open roles
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* 5. Featured Jobs */}
        <div className="space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
            className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-slate-200/60 dark:border-zinc-800/60 pb-4"
          >
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start tracking-tight">
                Featured Jobs
                <span className="ml-2 bg-indigo-100 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center border border-indigo-200 dark:border-indigo-800/50">
                  <TrendingUp size={10} className="mr-1" />
                  Hot
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 text-center sm:text-left mt-1 font-medium">
                Hand-picked roles from top-rated companies matching user trends.
              </p>
            </div>
            
            <motion.div whileHover={{ x: 3 }}>
              <Link
                to="/jobs"
                className="text-xs sm:text-sm font-bold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 transition-colors flex items-center cursor-pointer group"
              >
                <span>Browse All Jobs</span>
                <Icons.ChevronRight size={16} className="ml-0.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          </motion.div>

          <motion.div
            variants={containerStagger}
            initial="hidden"
            whileInView="show"
            viewport={viewportOnce}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {jobs.slice(0, 3).map((job) => (
              <motion.div key={job.id} variants={itemFadeUp}>
                <JobCard job={job} />
              </motion.div>
            ))}
          </motion.div>
        </div>

      </div>
    </div>
  );
};
