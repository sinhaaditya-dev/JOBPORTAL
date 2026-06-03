import { useState } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ThemeToggle } from './ThemeToggle';
import { 
  Menu, 
  X, 
  Briefcase, 
  Bell, 
  LogOut, 
  LayoutDashboard, 
  FileText, 
  Eye, 
  TrendingUp, 
  Target, 
  CalendarCheck, 
  BadgeCheck, 
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { mockNotifications } from '../data/mockData';

export const Navbar = () => {
  const { user, logout, isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState(mockNotifications);
  const navigate = useNavigate();
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const toggleRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: !n.read } : n));
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'view':
        return (
          <div className="p-2 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-450 flex-shrink-0">
            <Eye size={16} />
          </div>
        );
      case 'ats':
        return (
          <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-450 flex-shrink-0">
            <TrendingUp size={16} />
          </div>
        );
      case 'match':
        return (
          <div className="p-2 rounded-xl bg-purple-50 dark:bg-purple-950/30 text-purple-600 dark:text-purple-450 flex-shrink-0">
            <Target size={16} />
          </div>
        );
      case 'interview':
        return (
          <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 text-emerald-600 dark:text-emerald-450 flex-shrink-0">
            <CalendarCheck size={16} />
          </div>
        );
      case 'accepted':
        return (
          <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-indigo-600 dark:text-indigo-400 flex-shrink-0">
            <BadgeCheck size={16} />
          </div>
        );
      default:
        return (
          <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-400 flex-shrink-0">
            <Bell size={16} />
          </div>
        );
    }
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/jobs', label: 'Find Jobs' },
    { path: '/resume', label: 'AI Resume & ATS' },
    ...(isLoggedIn ? [{ path: '/dashboard', label: 'Dashboard' }] : []),
  ];

  return (
    <nav className="sticky top-0 z-50 w-full transition-all duration-300 glass-card border-b border-opacity-20 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center space-x-2 font-bold text-xl tracking-tight">
              <div className="p-2 bg-slate-900 dark:bg-zinc-800 text-white rounded-lg shadow-lg">
                <Briefcase size={20} />
              </div>
              <span className="font-extrabold bg-gradient-to-r from-slate-950 to-slate-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                ApexJob AI
              </span>
            </Link>
          </div>

          {/* Navigation Links - Desktop */}
          <div className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `text-sm font-medium transition-all duration-200 border-b-2 py-1 ${
                    isActive
                      ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white font-bold'
                      : 'border-transparent text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Secondary Actions (Theme, Auth) - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <ThemeToggle />

            {isLoggedIn && (
              <div className="relative">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => {
                    setShowNotifications(!showNotifications);
                    setShowDropdown(false);
                  }}
                  className="relative p-2 rounded-full glass-card hover:bg-opacity-80 transition-colors focus:outline-none cursor-pointer text-indigo-600 dark:text-indigo-400"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border border-white dark:border-slate-900 animate-pulse"></span>
                  )}
                </motion.button>

                <AnimatePresence>
                  {showNotifications && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowNotifications(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 15, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.98 }}
                        transition={{ duration: 0.18, ease: 'easeOut' }}
                        className="absolute right-0 mt-3 w-80 sm:w-96 rounded-2xl shadow-2xl bg-white dark:bg-slate-900 py-2 z-20 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-left"
                      >
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-200 dark:border-slate-800">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-sm text-slate-800 dark:text-white">Notifications</span>
                            {unreadCount > 0 && (
                              <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 px-1.5 py-0.5 rounded">
                                {unreadCount} new
                              </span>
                            )}
                          </div>
                          {unreadCount > 0 && (
                            <button
                              onClick={markAllAsRead}
                              className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 hover:underline flex items-center space-x-1 cursor-pointer"
                            >
                              <Check size={10} />
                              <span>Mark all read</span>
                            </button>
                          )}
                        </div>

                        <div className="max-h-[300px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-850 no-scrollbar">
                          {notifications.length > 0 ? (
                            notifications.map((notif) => (
                              <div
                                key={notif.id}
                                onClick={() => toggleRead(notif.id)}
                                className={`p-3.5 flex items-start space-x-3 hover:bg-slate-100/50 dark:hover:bg-slate-800/20 cursor-pointer transition-colors ${
                                  !notif.read ? 'bg-indigo-50/10 dark:bg-indigo-950/10' : ''
                                }`}
                              >
                                {getNotificationIcon(notif.type)}
                                <div className="flex-1 min-w-0 space-y-1">
                                  <div className="flex justify-between items-center">
                                    <h4 className={`text-xs font-bold truncate leading-tight ${!notif.read ? 'text-slate-800 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                                      {notif.title}
                                    </h4>
                                    <span className="text-[9px] text-slate-400 font-semibold">{notif.time}</span>
                                  </div>
                                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal line-clamp-2">
                                    {notif.message}
                                  </p>
                                </div>
                                {!notif.read && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-650 dark:bg-indigo-400 mt-1.5 flex-shrink-0 animate-pulse"></span>
                                )}
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-8 text-slate-400 text-xs">
                              <Bell size={24} className="mx-auto mb-2 text-slate-355 dark:text-slate-700" />
                              No notifications yet.
                            </div>
                          )}
                        </div>

                        <div className="border-t border-slate-200 dark:border-slate-800 pt-2 px-4 pb-1 text-center">
                          <Link
                            to="/dashboard"
                            onClick={() => setShowNotifications(false)}
                            className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-750 dark:hover:text-indigo-300 transition-colors inline-block"
                          >
                            View all notifications
                          </Link>
                        </div>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            )}

            {isLoggedIn ? (
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center space-x-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none"
                >
                  <img
                    className="h-8 w-8 rounded-full object-cover border border-indigo-500"
                    src={user.avatar}
                    alt={user.name}
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300 hidden lg:inline-block">
                    {user.name.split(' ')[0]}
                  </span>
                </button>

                {/* Dropdown Menu */}
                <AnimatePresence>
                  {showDropdown && (
                    <>
                      <div className="fixed inset-0 z-10" onClick={() => setShowDropdown(false)}></div>
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-white dark:bg-slate-900 py-1.5 z-20 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-left"
                      >
                        <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800">
                          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Signed in as</p>
                          <p className="text-sm font-bold truncate">{user.name}</p>
                          <p className="text-xs text-indigo-500 font-medium">{user.role}</p>
                        </div>
                        <Link
                          to="/dashboard"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <LayoutDashboard size={16} className="mr-2" />
                          Dashboard
                        </Link>
                        <Link
                          to="/resume"
                          onClick={() => setShowDropdown(false)}
                          className="flex items-center px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
                        >
                          <FileText size={16} className="mr-2" />
                          ATS Resume
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors text-left"
                        >
                          <LogOut size={16} className="mr-2" />
                          Sign Out
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-white transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-medium text-white bg-slate-950 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-100 rounded-xl transition-all shadow-md duration-200"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger Menu - Mobile */}
          <div className="flex md:hidden items-center space-x-2">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-xl transition-colors focus:outline-none ${
                isHomePage 
                  ? 'text-white/80 hover:text-white hover:bg-white/10' 
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-slate-200 dark:border-slate-800 glass-card"
          >
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={({ isActive }) =>
                    `block px-3 py-2 rounded-xl text-base font-medium transition-colors ${
                      isActive
                        ? 'bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400'
                        : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}

              {isLoggedIn ? (
                <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800">
                  <div className="flex items-center px-3 mb-3">
                    <img className="h-10 w-10 rounded-full object-cover border border-indigo-500" src={user.avatar} alt={user.name} />
                    <div className="ml-3">
                      <div className="text-base font-bold text-slate-800 dark:text-slate-100">{user.name}</div>
                      <div className="text-sm font-medium text-slate-400">{user.email}</div>
                    </div>
                  </div>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    Dashboard
                  </Link>
                  <Link
                    to="/resume"
                    onClick={() => setIsOpen(false)}
                    className="block px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    ATS Resume
                  </Link>
                  
                  {/* Mobile Notifications */}
                  <div className="border-t border-slate-100 dark:border-slate-800/80 my-2 pt-2">
                    <button
                      onClick={() => setShowNotifications(!showNotifications)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-base font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center space-x-3">
                        <Bell size={18} />
                        <span>Notifications</span>
                      </div>
                      {unreadCount > 0 && (
                        <span className="text-xs font-bold bg-indigo-50 text-indigo-600 dark:bg-indigo-950/40 dark:text-indigo-400 px-2.5 py-0.5 rounded-full">
                          {unreadCount}
                        </span>
                      )}
                    </button>

                    {showNotifications && (
                      <div className="mt-2 space-y-2 px-3 max-h-60 overflow-y-auto no-scrollbar">
                        {notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => toggleRead(notif.id)}
                            className={`p-3 rounded-xl border border-slate-200 dark:border-slate-800/60 flex items-start space-x-3 cursor-pointer ${
                              !notif.read ? 'bg-indigo-50/10 dark:bg-indigo-950/10' : 'bg-transparent'
                            }`}
                          >
                            {getNotificationIcon(notif.type)}
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-800 dark:text-white truncate">{notif.title}</span>
                                <span className="text-[9px] text-slate-405">{notif.time}</span>
                              </div>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal line-clamp-2 mt-0.5">{notif.message}</p>
                            </div>
                            {!notif.read && (
                              <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 dark:bg-indigo-400 mt-1 flex-shrink-0 animate-pulse"></span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    onClick={handleLogout}
                    className="w-full text-left block px-3 py-2 rounded-xl text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20"
                  >
                    Sign Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 pb-2 border-t border-slate-200 dark:border-slate-800 px-3 flex flex-col space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 rounded-xl shadow-md transition-colors"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
