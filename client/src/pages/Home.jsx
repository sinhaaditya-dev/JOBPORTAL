import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { mockCategories, mockJobs } from '../data/mockData';
import { JobCard } from '../components/JobCard';
import * as Icons from 'lucide-react';
import { Sparkles, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { CompanyLogos } from '../components/CompanyLogos';

export const Home = () => {
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
    return IconComponent ? <IconComponent size={24} className="text-slate-800 dark:text-zinc-200" /> : <Icons.HelpCircle size={24} className="text-slate-800 dark:text-zinc-200" />;
  };

  return (
    <div className="relative min-h-screen bg-mesh-gradient text-slate-800 dark:text-zinc-200">
      
      {/* 1. Full-Screen Premium Hero Section (crisp HD style sitting under navbar) */}
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden py-24 md:py-32 mt-[-4rem] bg-transparent border-b border-slate-100/50 dark:border-zinc-900/50">
        {/* Clean white/dark backdrop (no photo, no colorful gradients) */}

        {/* Hero Content */}
        <div className="relative z-10 w-full max-w-5xl mx-auto px-4 text-center space-y-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-slate-100 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 px-4 py-1.5 rounded-full border border-slate-200 dark:border-zinc-700 text-xs font-bold shadow-sm"
          >
            <Icons.Sparkles size={12} className="text-slate-600 dark:text-zinc-405" />
            <span>Advanced AI Resume Parsing & Recommendation Engine</span>
          </motion.div>
          
          <div className="space-y-4">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight text-slate-900 dark:text-white leading-tight"
            >
              Find Your Dream Job <br />
              <span className="bg-gradient-to-r from-slate-950 via-slate-700 to-slate-950 dark:from-white dark:via-zinc-300 dark:to-white bg-clip-text text-transparent">
                With AI Precision
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-zinc-400 max-w-2xl mx-auto font-medium leading-relaxed"
            >
              Discover thousands of opportunities and get AI-powered career recommendations.
            </motion.p>
          </div>

          {/* Clean Monochrome Search Box */}
          <motion.form
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSearch}
            className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800/80 p-4 rounded-3xl shadow-lg flex flex-col md:flex-row gap-4 max-w-4xl mx-auto text-left"
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
            <button
              type="submit"
              className="w-full md:w-auto px-8 py-3 bg-slate-950 hover:bg-black dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-black rounded-2xl font-bold text-sm shadow-md transition-all flex items-center justify-center space-x-2 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
            >
              <Icons.Search size={16} />
              <span>Search</span>
            </button>
          </motion.form>

          {/* Quick Info Tags */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap justify-center gap-3 text-xs text-slate-500 dark:text-zinc-400 font-semibold"
          >
            <span>Popular Searches:</span>
            {['React Developer', 'AI Engineer', 'Remote Product Manager'].map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => {
                  setQuery(tag);
                  navigate(`/jobs?query=${encodeURIComponent(tag)}`);
                }}
                className="bg-slate-100 hover:bg-slate-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 px-3 py-1 rounded-full border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-350 transition-colors cursor-pointer"
              >
                {tag}
              </button>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Rest of the Home Page Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 z-10 space-y-20">

        {/* 2. Top Companies Logos */}
        <CompanyLogos />

        {/* 3. AI Promo Banner */}
        <div className="p-8 rounded-3xl border border-slate-200 dark:border-zinc-800 relative overflow-hidden bg-slate-50 dark:bg-zinc-900 shadow-sm">
          <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-flex items-center bg-slate-200 dark:bg-zinc-800 text-slate-800 dark:text-zinc-200 text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                ATS Optimizer
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight">
                Not getting interviews? Let AI audit your CV.
              </h2>
              <p className="text-sm text-slate-605 dark:text-zinc-400 max-w-xl font-medium">
                Get parsed skills reports, missing requirements checklists, and score comparisons instantly.
              </p>
            </div>
            <Link
              to="/resume"
              className="px-6 py-3 bg-slate-950 hover:bg-black text-white dark:bg-white dark:text-black dark:hover:bg-zinc-100 rounded-xl font-bold text-sm shadow-md transition-all flex items-center space-x-2 flex-shrink-0 cursor-pointer"
            >
              <Sparkles size={16} className="text-white dark:text-black" />
              <span>Verify Resume Free</span>
            </Link>
          </div>
        </div>

        {/* 4. Browse Categories */}
        <div className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white">
              Explore Opportunities by Domain
            </h2>
            <p className="text-xs sm:text-sm text-slate-400">
              Browse top categories and connect with high-growth specialized employers.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {mockCategories.map((cat) => (
              <Link
                key={cat.id}
                to={`/jobs?category=${encodeURIComponent(cat.name)}`}
                className="bg-white dark:bg-zinc-900 p-5 rounded-2xl border border-slate-200 dark:border-zinc-800 flex items-start space-x-4 hover:border-slate-400 dark:hover:border-zinc-600 transition-all cursor-pointer shadow-sm"
              >
                <div className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-xl flex-shrink-0">
                  {renderCategoryIcon(cat.icon)}
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-zinc-100 hover:text-black dark:hover:text-white transition-colors">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] font-semibold text-slate-500 dark:text-zinc-400 mt-1 block">
                    {cat.count} open roles
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* 5. Featured Jobs */}
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white flex items-center justify-center sm:justify-start">
                Featured Jobs
                <span className="ml-2 bg-slate-100 text-slate-800 dark:bg-zinc-800 dark:text-zinc-200 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold flex items-center">
                  <TrendingUp size={10} className="mr-1" />
                  Hot
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-slate-450 text-center sm:text-left mt-1">
                Hand-picked roles from top-rated companies matching user trends.
              </p>
            </div>
            <Link
              to="/jobs"
              className="text-xs sm:text-sm font-bold text-slate-800 hover:text-black dark:text-zinc-300 dark:hover:text-white transition-colors flex items-center cursor-pointer underline"
            >
              Browse All Jobs
              <Icons.ChevronRight size={16} className="ml-0.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockJobs.slice(0, 3).map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
