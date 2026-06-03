import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import { motion } from 'framer-motion';

const decodeJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Error decoding JWT', error);
    return null;
  }
};

export const SocialLogin = ({ role = "Job Seeker" }) => {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = (credentialResponse) => {
    const decoded = decodeJwt(credentialResponse.credential);
    if (decoded) {
      const googleUser = {
        name: decoded.name,
        email: decoded.email,
        role: role,
        phone: '',
        location: 'San Francisco, CA',
        title: role === 'Employer' ? 'HR Manager' : 'Software Engineer',
        avatar: decoded.picture,
        skills: [], // New user starts with no skills as expected
        resumeName: '',
        resumeSize: '',
        resumeUploadDate: '',
        atsScore: 0,
        profileCompletion: 40,
        applications: []
      };
      loginWithGoogle(googleUser);
      navigate('/dashboard');
    }
  };

  const providers = [
    {
      name: 'Facebook',
      bgColor: 'hover:bg-blue-50 dark:hover:bg-blue-950/20',
      borderColor: 'hover:border-blue-300 dark:hover:border-blue-900/50',
      textColor: 'hover:text-blue-600 dark:hover:text-blue-400',
      icon: (
        <svg className="w-5 h-5 fill-current text-[#1877F2]" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      )
    },
    {
      name: 'GitHub',
      bgColor: 'hover:bg-slate-50 dark:hover:bg-slate-800/40',
      borderColor: 'hover:border-slate-400 dark:hover:border-slate-600',
      textColor: 'hover:text-slate-900 dark:hover:text-white',
      icon: (
        <svg className="w-5 h-5 fill-current text-slate-800 dark:text-slate-200" viewBox="0 0 24 24">
          <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.137 20.162 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
        </svg>
      )
    }
  ];

  return (
    <div className="space-y-4">
      <div className="relative flex py-2 items-center">
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        <span className="flex-shrink mx-4 text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
          Or continue with
        </span>
        <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
      </div>

      <div className="flex flex-col items-center space-y-3.5 w-full">
        {/* Google Login Component wrapper */}
        <div className="w-full flex justify-center GoogleLoginWrapper">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              console.error('Google Sign-In failed');
            }}
            useOneTap
            theme="filled_blue"
            shape="pill"
            width="320px"
          />
        </div>

        {/* Other Social mock buttons */}
        <div className="grid grid-cols-2 gap-3 w-full max-w-[320px]">
          {providers.map((provider) => (
            <motion.button
              key={provider.name}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              className={`flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-800 glass-card bg-opacity-30 dark:bg-opacity-10 cursor-pointer font-medium text-xs transition-all duration-200 ${provider.bgColor} ${provider.borderColor} ${provider.textColor}`}
            >
              {provider.icon}
              <span className="font-semibold">{provider.name}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};
