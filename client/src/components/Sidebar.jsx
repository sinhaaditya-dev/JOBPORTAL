import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Sparkles, 
  Bookmark, 
  AlertTriangle, 
  Bell, 
  FileText,
  LogOut
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const menuItems = [
    { id: 'overview', label: 'Dashboard Home', icon: LayoutDashboard },
    { id: 'matches', label: 'AI Job Recommendations', icon: Sparkles, badge: 'New' },
    { id: 'saved', label: 'Saved Jobs', icon: Bookmark },
    { id: 'ats', label: 'ATS Resume Review', icon: FileText },
    { id: 'feedback', label: 'Application Feedback', icon: AlertTriangle, alert: true },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <aside className="w-full md:w-64 flex-shrink-0">
      <div className="glass-card rounded-2xl p-4 sticky top-20 border border-slate-200 dark:border-slate-800">
        <ul className="space-y-1.5">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center justify-between text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white dark:bg-indigo-500 shadow-md shadow-indigo-500/10'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-indigo-600 dark:hover:text-indigo-400'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'} />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      isActive ? 'bg-white text-indigo-600' : 'bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400'
                    }`}>
                      {item.badge}
                    </span>
                  )}
                  {item.alert && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 text-left px-4 py-3 rounded-xl text-sm font-semibold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30 transition-all cursor-pointer"
          >
            <LogOut size={18} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
