import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import Swal from 'sweetalert2';
import {
  Camera,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  FileText,
  ExternalLink,
  Link2,
  Globe,
  X,
  Plus,
  Save,
  ArrowLeft,
  Loader2,
  CheckCircle,
  AlertCircle,
  Upload,
  LogOut
} from 'lucide-react';

export const EditProfile = () => {
  const navigate = useNavigate();
  const { user, updateProfile, uploadAvatar, uploadResume, deleteAvatar, deleteResume, logout } = useAuth();

  // Form state
  const [form, setForm] = useState({
    name: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    bio: '',
    skills: [],
    github: '',
    linkedin: '',
    portfolio: '',
  });
  const [skillInput, setSkillInput] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [currentResumeName, setCurrentResumeName] = useState('');

  // UI state
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState(null);
  const [errors, setErrors] = useState({});

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Fetch profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/auth/profile');
        const p = res.data.user;
        setForm({
          name: p.name || '',
          title: p.title || '',
          email: p.email || '',
          phone: p.phone || '',
          location: p.location || '',
          bio: p.bio || '',
          skills: p.skills || [],
          github: p.github || '',
          linkedin: p.linkedin || '',
          portfolio: p.portfolio || '',
        });
        setAvatarPreview(p.avatar?.url || p.avatar || '');
        const resumeNameParsed = p.resumeName || (p.resume?.url ? (p.resume.public_id ? p.resume.public_id.split('/').pop() + '.pdf' : 'Uploaded_Resume.pdf') : '');
        setCurrentResumeName(resumeNameParsed);
      } catch {
        showToast('Failed to load profile data.', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Skills
  const addSkill = () => {
    const skill = skillInput.trim();
    if (skill && !form.skills.includes(skill)) {
      setForm(prev => ({ ...prev, skills: [...prev.skills, skill] }));
      setSkillInput('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setForm(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skillToRemove)
    }));
  };

  const handleSkillKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addSkill();
    }
  };

  // Avatar
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      showToast('Image must be under 5MB.', 'error');
      return;
    }
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  // Resume
  const handleResumeChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast('Resume must be under 10MB.', 'error');
      return;
    }
    setResumeFile(file);
  };

  // Delete Avatar
  const handleDeleteAvatar = async () => {
    const result = await Swal.fire({
      title: "Remove Photo?",
      text: "Are you sure you want to delete your profile picture?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Remove",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteAvatar();
      setAvatarPreview('https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80');
      setAvatarFile(null);
      showToast('Profile picture removed successfully.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove profile picture.', 'error');
    }
  };

  // Delete Resume
  const handleDeleteResume = async () => {
    const result = await Swal.fire({
      title: "Remove Resume?",
      text: "Are you sure you want to delete your uploaded resume?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc2626",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, Delete",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await deleteResume();
      setCurrentResumeName('');
      setResumeFile(null);
      showToast('Resume removed successfully.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to remove resume.', 'error');
    }
  };

  // Validation
  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'Name is required.';
    if (!form.email.trim()) errs.email = 'Email is required.';
    if (form.phone && !/^[+\d\s()-]{7,20}$/.test(form.phone)) {
      errs.phone = 'Enter a valid phone number.';
    }
    if (form.github && !/^https?:\/\/.+/.test(form.github)) {
      errs.github = 'Enter a valid URL.';
    }
    if (form.linkedin && !/^https?:\/\/.+/.test(form.linkedin)) {
      errs.linkedin = 'Enter a valid URL.';
    }
    if (form.portfolio && !/^https?:\/\/.+/.test(form.portfolio)) {
      errs.portfolio = 'Enter a valid URL.';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // Save
  const handleSave = async () => {
    if (!validate()) return;

    setSaving(true);
    try {
      // 1. Upload avatar if changed
      if (avatarFile) {
        await uploadAvatar(avatarFile);
      }

      // 2. Upload resume if changed
      if (resumeFile) {
        await uploadResume(resumeFile);
      }

      // 3. Update profile fields
      await updateProfile({
        name: form.name,
        title: form.title,
        phone: form.phone,
        location: form.location,
        bio: form.bio,
        skills: form.skills,
        github: form.github,
        linkedin: form.linkedin,
        portfolio: form.portfolio,
      });

      showToast('Profile updated successfully.');
      setTimeout(() => navigate('/dashboard'), 1200);
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to update profile.';
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-slate-400" />
      </div>
    );
  }

  const inputBase = "w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500 transition-all duration-200";
  const labelBase = "block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5";
  const sectionTitle = "text-base font-bold text-slate-800 dark:text-slate-100 mb-4 flex items-center gap-2";

  return (
    <div className="min-h-screen w-full py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">

        {/* Toast */}
        {toast && (
          <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-xl shadow-2xl border text-sm font-bold transition-all duration-300 animate-slide-in ${
            toast.type === 'error'
              ? 'bg-red-50 dark:bg-red-950/80 border-red-200 dark:border-red-800 text-red-700 dark:text-red-300'
              : 'bg-emerald-50 dark:bg-emerald-950/80 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300'
          }`}>
            {toast.type === 'error'
              ? <AlertCircle size={18} />
              : <CheckCircle size={18} />
            }
            {toast.message}
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/dashboard')}
              className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <ArrowLeft size={20} className="text-slate-500 dark:text-slate-400" />
            </button>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Edit Profile</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">Update your personal information and preferences</p>
            </div>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/30 hover:bg-red-100 dark:hover:bg-red-900/50 border border-red-200 dark:border-red-900/40 transition-colors cursor-pointer"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-slate-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-100 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {/* Form Card */}
        <div className="space-y-8">

          {/* Avatar Section */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className={sectionTitle}>
              <Camera size={18} className="text-indigo-500" />
              Profile Photo
            </h2>
            <div className="flex items-center gap-6">
              <div className="relative group">
                <img
                  src={avatarPreview || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80'}
                  alt="Profile"
                  className="w-24 h-24 rounded-2xl object-cover border-2 border-slate-200 dark:border-slate-700 shadow-md"
                />
                <label className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer">
                  <Camera size={20} className="text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>
              </div>
              <div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Upload a new photo</p>
                <p className="text-xs text-slate-400 mt-1">JPG, PNG or WebP. Max 5MB.</p>
                {avatarFile && (
                  <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1">
                    <CheckCircle size={12} />
                    {avatarFile.name}
                  </p>
                )}
                {avatarPreview && avatarPreview !== 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&h=150&q=80' && (
                  <button
                    onClick={handleDeleteAvatar}
                    type="button"
                    className="text-xs font-bold text-red-500 hover:text-red-650 hover:underline mt-2 flex items-center gap-1 cursor-pointer bg-transparent border-none outline-none"
                  >
                    Remove Photo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Personal Info */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className={sectionTitle}>
              <User size={18} className="text-indigo-500" />
              Personal Information
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Name */}
              <div>
                <label className={labelBase}>Full Name *</label>
                <div className="relative">
                  <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 ${errors.name ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'}`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>

              {/* Title */}
              <div>
                <label className={labelBase}>Headline / Job Title</label>
                <div className="relative">
                  <Briefcase size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 border-slate-200 dark:border-slate-700`}
                    placeholder="Full Stack Developer"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className={labelBase}>Email *</label>
                <div className="relative">
                  <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="email"
                    value={form.email}
                    readOnly
                    className={`${inputBase} pl-10 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-not-allowed opacity-70`}
                  />
                </div>
                <p className="text-[10px] text-slate-400 mt-1">Email cannot be changed</p>
              </div>

              {/* Phone */}
              <div>
                <label className={labelBase}>Phone Number</label>
                <div className="relative">
                  <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 ${errors.phone ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'}`}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>

              {/* Location */}
              <div className="sm:col-span-2">
                <label className={labelBase}>Location</label>
                <div className="relative">
                  <MapPin size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 border-slate-200 dark:border-slate-700`}
                    placeholder="San Francisco, CA"
                  />
                </div>
              </div>

              {/* Bio */}
              <div className="sm:col-span-2">
                <label className={labelBase}>About / Bio</label>
                <textarea
                  name="bio"
                  value={form.bio}
                  onChange={handleChange}
                  rows={4}
                  className={`${inputBase} border-slate-200 dark:border-slate-700 resize-none`}
                  placeholder="Tell us about yourself, your experience, and what you're looking for..."
                />
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className={sectionTitle}>
              <Briefcase size={18} className="text-indigo-500" />
              Skills
            </h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {form.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 text-xs font-bold border border-indigo-100 dark:border-indigo-900/50"
                >
                  {skill}
                  <button
                    onClick={() => removeSkill(skill)}
                    className="hover:text-red-500 transition-colors cursor-pointer"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
              {form.skills.length === 0 && (
                <p className="text-xs text-slate-400">No skills added yet. Type below and press Enter.</p>
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={handleSkillKeyDown}
                className={`${inputBase} border-slate-200 dark:border-slate-700 flex-1`}
                placeholder="e.g. React, Node.js, Python..."
              />
              <button
                onClick={addSkill}
                disabled={!skillInput.trim()}
                className="px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 transition-colors disabled:opacity-40 cursor-pointer"
              >
                <Plus size={18} className="text-slate-600 dark:text-slate-300" />
              </button>
            </div>
          </div>

          {/* Links */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className={sectionTitle}>
              <Globe size={18} className="text-indigo-500" />
              Social Links
            </h2>
            <div className="space-y-5">
              {/* GitHub */}
              <div>
                <label className={labelBase}>GitHub URL</label>
                <div className="relative">
                  <ExternalLink size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="github"
                    value={form.github}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 ${errors.github ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'}`}
                    placeholder="https://github.com/username"
                  />
                </div>
                {errors.github && <p className="text-xs text-red-500 mt-1">{errors.github}</p>}
              </div>

              {/* LinkedIn */}
              <div>
                <label className={labelBase}>LinkedIn URL</label>
                <div className="relative">
                  <Link2 size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="linkedin"
                    value={form.linkedin}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 ${errors.linkedin ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'}`}
                    placeholder="https://linkedin.com/in/username"
                  />
                </div>
                {errors.linkedin && <p className="text-xs text-red-500 mt-1">{errors.linkedin}</p>}
              </div>

              {/* Portfolio */}
              <div>
                <label className={labelBase}>Portfolio Website</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    name="portfolio"
                    value={form.portfolio}
                    onChange={handleChange}
                    className={`${inputBase} pl-10 ${errors.portfolio ? 'border-red-400 dark:border-red-600' : 'border-slate-200 dark:border-slate-700'}`}
                    placeholder="https://yourportfolio.com"
                  />
                </div>
                {errors.portfolio && <p className="text-xs text-red-500 mt-1">{errors.portfolio}</p>}
              </div>
            </div>
          </div>

          {/* Resume Upload */}
          <div className="glass-card p-6 rounded-2xl border border-slate-200 dark:border-slate-800">
            <h2 className={sectionTitle}>
              <FileText size={18} className="text-indigo-500" />
              Resume
            </h2>
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-700 dark:text-slate-200 cursor-pointer transition-colors">
                <Upload size={16} />
                {resumeFile ? 'Change File' : 'Upload Resume'}
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResumeChange}
                  className="hidden"
                />
              </label>
              <div className="text-sm flex-1">
                {resumeFile ? (
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                      <CheckCircle size={14} />
                      {resumeFile.name}
                    </p>
                    <button
                      onClick={() => setResumeFile(null)}
                      type="button"
                      className="text-xs text-red-500 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
                    >
                      Cancel
                    </button>
                  </div>
                ) : currentResumeName ? (
                  <div className="flex items-center justify-between">
                    <p className="text-slate-500 dark:text-slate-400">
                      Current: <span className="font-semibold text-slate-700 dark:text-slate-200">{currentResumeName}</span>
                    </p>
                    <button
                      onClick={handleDeleteResume}
                      type="button"
                      className="text-xs text-red-500 font-bold hover:underline cursor-pointer bg-transparent border-none outline-none"
                    >
                      Delete Resume
                    </button>
                  </div>
                ) : (
                  <p className="text-slate-400">No resume uploaded. PDF or Word, max 10MB.</p>
                )}
              </div>
            </div>
          </div>

          {/* Bottom Actions (mobile-friendly) */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-2 pb-8">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-slate-900 hover:bg-black dark:bg-white dark:text-black dark:hover:bg-zinc-100 transition-all duration-200 shadow-md disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {saving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
