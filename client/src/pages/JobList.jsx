import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { JobCard } from '../components/JobCard';
import { Search, MapPin, Briefcase, RefreshCcw } from 'lucide-react';

export const JobList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { jobs } = useAuth();
  
  const query = searchParams.get('query') || '';
  const location = searchParams.get('location') || '';
  const category = searchParams.get('category') || 'All';
  const [jobType, setJobType] = useState('All');

  const setQuery = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('query', val);
    else params.delete('query');
    setSearchParams(params);
  };

  const setLocation = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val) params.set('location', val);
    else params.delete('location');
    setSearchParams(params);
  };

  const setCategory = (val) => {
    const params = new URLSearchParams(searchParams);
    if (val && val !== 'All') params.set('category', val);
    else params.delete('category');
    setSearchParams(params);
  };

  // Categories list starting with 'All'
  const categoriesList = [
    'All',
    'Software Development',
    'Artificial Intelligence & ML',
    'Data Science & Analytics',
    'Product Management',
    'Design & UX/UI',
    'Marketing & Growth'
  ];
  const jobTypesList = ['All', 'Full-time', 'Part-time', 'Remote', 'Contract'];

  // Handle live searches
  const filteredJobs = jobs.filter((job) => {
    const matchQuery = 
      job.title.toLowerCase().includes(query.toLowerCase()) || 
      job.company.toLowerCase().includes(query.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(query.toLowerCase()));
      
    const matchLocation = 
      job.location.toLowerCase().includes(location.toLowerCase());

    const matchCategory = 
      category === 'All' || 
      (job.category && job.category.toLowerCase() === category.toLowerCase()) ||
      (
        category === 'Software Development' && 
        (job.title.toLowerCase().match(/software|developer|engineer|react|node|js|java|python|backend|frontend|fullstack|web/) || 
         job.skills.some(s => s.toLowerCase().match(/javascript|react|python|java|html|css|c\+\+|c#/)))
      ) ||
      (
        category === 'Artificial Intelligence & ML' && 
        (job.title.toLowerCase().match(/ai|ml|machine|learning|intelligence|deep|neural|nlp/) || 
         job.skills.some(s => s.toLowerCase().match(/pytorch|tensorflow|keras|scikit|openai|llm|nlp/)))
      ) ||
      (
        category === 'Data Science & Analytics' && 
        (job.title.toLowerCase().match(/data|analyst|analytics|science|sql|bi/) || 
         job.skills.some(s => s.toLowerCase().match(/sql|pandas|numpy|tableau|powerbi|excel/)))
      ) ||
      (
        category === 'Product Management' && 
        (job.title.toLowerCase().match(/product|manager|pm|scrum|agile/) || 
         job.skills.some(s => s.toLowerCase().match(/agile|scrum|product|roadmap/)))
      ) ||
      (
        category === 'Design & UX/UI' && 
        (job.title.toLowerCase().match(/design|ux|ui|graphics|illustrator|figma/) || 
         job.skills.some(s => s.toLowerCase().match(/figma|adobe|photoshop|illustrator|sketch/)))
      ) ||
      (
        category === 'Marketing & Growth' && 
        (job.title.toLowerCase().match(/marketing|growth|seo|sales|ads|social/) || 
         job.skills.some(s => s.toLowerCase().match(/seo|ads|google analytics|marketing|sales/)))
      );

    const matchType = 
      jobType === 'All' || job.type === jobType;

    return matchQuery && matchLocation && matchCategory && matchType;
  });

  const handleResetFilters = () => {
    setJobType('All');
    setSearchParams({});
  };

  return (
    <div className="relative min-h-screen w-full">
      {/* Background Mesh Glows */}
      <div className="bg-glow bg-glow-right"></div>
      <div className="bg-glow bg-glow-left"></div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 z-10 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-800 dark:text-white leading-tight">
              Search Openings
            </h1>
            <p className="text-xs text-slate-400">Discover and apply to matching roles filtered by AI profiles.</p>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 dark:bg-slate-800/60 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-850">
            {filteredJobs.length} active opportunities found
          </span>
        </div>

        {/* Desktop Filters Panel */}
        <form onSubmit={(e) => e.preventDefault()} className="glass-card p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md grid grid-cols-1 sm:grid-cols-4 gap-4 items-center">
          <div className="relative flex items-center">
            <Search className="absolute left-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Keywords or skills..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
            />
          </div>

          <div className="relative flex items-center">
            <MapPin className="absolute left-3 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Location..."
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white"
            />
          </div>

          <div className="relative flex items-center">
            <Briefcase className="absolute left-3 text-slate-400" size={16} />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white appearance-none cursor-pointer"
            >
              {categoriesList.map(cat => (
                <option key={cat} value={cat}>{cat} Category</option>
              ))}
            </select>
          </div>

          <div className="flex gap-2">
            <select
              value={jobType}
              onChange={(e) => setJobType(e.target.value)}
              className="flex-1 text-xs px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white appearance-none cursor-pointer"
            >
              {jobTypesList.map(type => (
                <option key={type} value={type}>{type} Roles</option>
              ))}
            </select>
            
            <button
              onClick={handleResetFilters}
              type="button"
              className="p-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 dark:text-slate-400 rounded-xl cursor-pointer border border-slate-200 dark:border-slate-700"
              title="Reset Filters"
            >
              <RefreshCcw size={16} />
            </button>
          </div>
        </form>

        {/* Job Listings Grid */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map((job) => (
              <JobCard key={job.id} job={job} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 glass-card rounded-3xl border border-slate-200 dark:border-slate-800 max-w-xl mx-auto space-y-3">
            <Briefcase size={40} className="mx-auto text-slate-300 dark:text-slate-600" />
            <h3 className="font-extrabold text-slate-700 dark:text-white text-base">No Openings Match Your Selection</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">Try modifying your search keywords, clear active filters, or check back later for updated listings.</p>
            <button
              onClick={handleResetFilters}
              className="inline-flex py-2 px-5 bg-indigo-650 hover:bg-indigo-750 text-white rounded-xl text-xs font-bold shadow-sm transition-colors cursor-pointer"
            >
              Clear Filters
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
