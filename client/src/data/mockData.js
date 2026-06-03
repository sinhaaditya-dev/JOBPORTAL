export const mockCategories = [
  { id: 'cat1', name: 'Software Development', icon: 'Code', count: 1420 },
  { id: 'cat2', name: 'Artificial Intelligence & ML', icon: 'Cpu', count: 850 },
  { id: 'cat3', name: 'Data Science & Analytics', icon: 'BarChart3', count: 640 },
  { id: 'cat4', name: 'Product Management', icon: 'Briefcase', count: 320 },
  { id: 'cat5', name: 'Design & UX/UI', icon: 'Palette', count: 510 },
  { id: 'cat6', name: 'Marketing & Growth', icon: 'Megaphone', count: 280 },
];

export const mockCompanies = [
  { id: 'co1', name: 'Google', logo: 'Google', rating: 4.8, jobsCount: 120, location: 'Mountain View, CA', industry: 'Technology' },
  { id: 'co2', name: 'Microsoft', logo: 'Microsoft', rating: 4.6, jobsCount: 95, location: 'Redmond, WA', industry: 'Technology' },
  { id: 'co3', name: 'Meta', logo: 'Meta', rating: 4.5, jobsCount: 75, location: 'Menlo Park, CA', industry: 'Social Media' },
  { id: 'co4', name: 'Netflix', logo: 'Netflix', rating: 4.7, jobsCount: 40, location: 'Los Gatos, CA', industry: 'Entertainment' },
  { id: 'co5', name: 'Amazon', logo: 'Amazon', rating: 4.4, jobsCount: 150, location: 'Seattle, WA', industry: 'E-commerce' },
  { id: 'co6', name: 'Stripe', logo: 'Stripe', rating: 4.9, jobsCount: 30, location: 'San Francisco, CA', industry: 'Fintech' },
];

export const mockJobs = [
  {
    id: 'job1',
    title: 'Senior React Developer',
    company: 'Stripe',
    companyId: 'co6',
    location: 'Remote (US/Canada)',
    type: 'Full-time',
    salary: '$140,000 - $175,000',
    postedTime: '2 hours ago',
    category: 'Software Development',
    description: 'We are looking for a Senior React Developer to join our dashboard engineering team. You will lead the frontend design and implementation of next-generation merchant reporting interfaces.',
    skills: ['React.js', 'TypeScript', 'Tailwind CSS', 'Redux', 'REST APIs'],
    aiMatch: 95,
  },
  {
    id: 'job2',
    title: 'AI / Machine Learning Engineer',
    company: 'Google',
    companyId: 'co1',
    location: 'Mountain View, CA',
    type: 'Full-time',
    salary: '$180,000 - $220,000',
    postedTime: '1 day ago',
    category: 'Artificial Intelligence & ML',
    description: 'Join the Google DeepMind team and work on deploying state-of-the-art transformer and reinforcement learning architectures into consumer-facing products.',
    skills: ['Python', 'PyTorch', 'TensorFlow', 'Java', 'Machine Learning', 'NLP'],
    aiMatch: 82,
  },
  {
    id: 'job3',
    title: 'Full Stack Engineer (MERN)',
    company: 'Meta',
    companyId: 'co3',
    location: 'Menlo Park, CA (Hybrid)',
    type: 'Full-time',
    salary: '$160,000 - $190,000',
    postedTime: '3 days ago',
    category: 'Software Development',
    description: 'Develop and scale user interfaces and backend APIs for Meta Horizon. Strong expertise in React, Node.js, Express, and MongoDB is required.',
    skills: ['Java', 'Spring Boot', 'MongoDB', 'React.js', 'Node.js', 'Express.js'],
    aiMatch: 88,
  },
  {
    id: 'job4',
    title: 'Product Designer (UX/UI)',
    company: 'Netflix',
    companyId: 'co4',
    location: 'Los Gatos, CA',
    type: 'Full-time',
    salary: '$130,000 - $160,000',
    postedTime: '5 days ago',
    category: 'Design & UX/UI',
    description: 'Help design the future of home entertainment. You will lead user research, wireframing, and interactive prototyping for millions of global subscribers.',
    skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping', 'User Research'],
    aiMatch: 45,
  },
  {
    id: 'job5',
    title: 'Java Backend Architect',
    company: 'Amazon',
    companyId: 'co5',
    location: 'Seattle, WA',
    type: 'Full-time',
    salary: '$190,000 - $230,000',
    postedTime: '1 week ago',
    category: 'Software Development',
    description: 'Lead the architectural design of high-throughput backend services powering AWS Commerce Core. Requirements include deep knowledge of Java enterprise ecosystems, Spring Boot, and NoSQL databases.',
    skills: ['Java', 'Spring Boot', 'MongoDB', 'Microservices', 'AWS', 'Docker'],
    aiMatch: 92,
  },
  {
    id: 'job6',
    title: 'Data Analyst',
    company: 'Microsoft',
    companyId: 'co2',
    location: 'Redmond, WA (Hybrid)',
    type: 'Full-time',
    salary: '$95,000 - $125,000',
    postedTime: '1 week ago',
    category: 'Data Science & Analytics',
    description: 'Extract actionable insights from billions of telemetry points in Azure Systems. Build pipelines, design PowerBI dashboards, and model system behavior.',
    skills: ['SQL', 'Python', 'PowerBI', 'Data Modeling', 'Excel'],
    aiMatch: 60,
  }
];

export const mockNotifications = [
  {
    id: 'n1',
    title: 'Recruiter Viewed Profile',
    message: 'A recruiter from Google viewed your full-stack engineering profile.',
    time: '2 hours ago',
    read: false,
    type: 'view'
  },
  {
    id: 'n2',
    title: 'New AI Job Match',
    message: 'We found a 95% match for Senior React Developer at Stripe.',
    time: '4 hours ago',
    read: false,
    type: 'match'
  },
  {
    id: 'n3',
    title: 'ATS Score Improved',
    message: 'Your ATS score rose to 78% after indexing Java and Spring Boot.',
    time: '1 day ago',
    read: true,
    type: 'ats'
  },
  {
    id: 'n4',
    title: 'Interview Scheduled',
    message: 'Your interview for Full Stack Engineer at Meta is scheduled for Monday.',
    time: '2 days ago',
    read: false,
    type: 'interview'
  },
  {
    id: 'n5',
    title: 'Application Shortlisted',
    message: 'Meta updated your status to Shortlisted. Click to review details.',
    time: '3 days ago',
    read: true,
    type: 'accepted'
  }
];

export const mockUserData = {
  name: 'Alex Mercer',
  email: 'alex.mercer@gmail.com',
  phone: '+1 (555) 234-5678',
  location: 'San Jose, CA',
  role: 'Job Seeker',
  title: 'Full Stack Software Engineer',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80',
  skills: ['Java', 'Spring Boot', 'MongoDB', 'JavaScript', 'HTML', 'CSS', 'React.js'],
  resumeName: 'Alex_Mercer_CV.pdf',
  resumeSize: '2.4 MB',
  resumeUploadDate: 'May 20, 2026',
  atsScore: 78,
  profileCompletion: 85,
  applications: [
    {
      id: 'app1',
      jobId: 'job2',
      jobTitle: 'AI / Machine Learning Engineer',
      company: 'Google',
      dateApplied: 'May 24, 2026',
      status: 'Reviewing',
      feedback: null
    },
    {
      id: 'app2',
      jobId: 'job3',
      jobTitle: 'Full Stack Engineer (MERN)',
      company: 'Meta',
      dateApplied: 'May 22, 2026',
      status: 'Shortlisted',
      feedback: 'Great fit! The technical interview is scheduled for next Monday.'
    },
    {
      id: 'app3',
      jobId: 'job4',
      jobTitle: 'Product Designer (UX/UI)',
      company: 'Netflix',
      dateApplied: 'May 18, 2026',
      status: 'Rejected',
      feedback: {
        status: 'Rejected',
        reason: 'Required MERN stack experience missing\nResume formatting needs improvement\nProjects section is weak'
      }
    }
  ]
};
