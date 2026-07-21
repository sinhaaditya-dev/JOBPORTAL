import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Check, AlertCircle, Briefcase } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [role, setRole] = useState('Job Seeker');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      setError('');
      setIsSubmitting(true);
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid Credentials');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] w-full flex items-center justify-center px-4 py-12">
      {/* Background Mesh Glows */}
      <div className="bg-glow bg-glow-right"></div>
      <div className="bg-glow bg-glow-left"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-md glass-card p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl relative z-10"
      >
        <div className="text-center space-y-2 mb-8">
          <div className="inline-flex p-3 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 rounded-2xl shadow-sm mb-2">
            <Briefcase size={24} />
          </div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-white">Welcome Back</h2>
          <p className="text-xs text-slate-400">Enter your credentials to access your dashboard</p>
        </div>

        {/* Role Selector Segmented Control */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-900 rounded-xl mb-6">
          <button
            type="button"
            onClick={() => setRole('Job Seeker')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === 'Job Seeker'
                ? 'bg-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Job Seeker
          </button>
          <button
            type="button"
            onClick={() => setRole('Employer')}
            className={`py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
              role === 'Employer'
                ? 'bg-white text-indigo-600 dark:bg-slate-800 dark:text-indigo-400 shadow-sm'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            Employer
          </button>
        </div>

        {error && (
          <div className="flex items-center space-x-2 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 p-3 rounded-xl border border-red-100 dark:border-red-900/30 mb-5 text-xs font-semibold">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email input */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
              Email Address
            </label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3 text-slate-400" size={18} />
              <input
                type="email"
                placeholder="alex.mercer@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
                className="w-full text-sm pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white transition-colors"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block">
                Password
              </label>
              <a href="#" onClick={(e) => e.preventDefault()} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                Forgot password?
              </a>
            </div>
            <div className="relative flex items-center">
              <Lock className="absolute left-3 text-slate-400" size={18} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                className="w-full text-sm pl-10 pr-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:outline-none focus:border-indigo-500 text-slate-800 dark:text-white transition-colors"
                required
              />
            </div>
          </div>

          {/* Remember Me */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={() => setRememberMe(!rememberMe)}
              className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors cursor-pointer mr-2.5 ${
                rememberMe
                  ? 'bg-indigo-600 border-indigo-600 text-white dark:bg-indigo-500 dark:border-indigo-500'
                  : 'border-slate-350 dark:border-slate-700 bg-transparent'
              }`}
            >
              {rememberMe && <Check size={12} />}
            </button>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold select-none cursor-pointer" onClick={() => setRememberMe(!rememberMe)}>
              Remember this device
            </span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:shadow-indigo-500/20 transition-all flex items-center justify-center space-x-2 cursor-pointer mt-6 disabled:opacity-60"
          >
            <span>{isSubmitting ? 'Signing In...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="text-center mt-6 text-xs text-slate-400 font-semibold">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold">
            Create an account
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
