import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Dashboard } from './pages/Dashboard';
import { ResumeUpload } from './pages/ResumeUpload';
import { JobList } from './pages/JobList';
import { JobDetails } from './pages/JobDetails';
import { EditProfile } from './pages/EditProfile';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="flex flex-col min-h-screen w-full bg-mesh-gradient text-slate-700 dark:text-slate-300 transition-colors duration-300">
            <Navbar />
            <main className="flex-grow w-full">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/dashboard/profile/edit" element={<EditProfile />} />
                <Route path="/resume" element={<ResumeUpload />} />
                <Route path="/jobs" element={<JobList />} />
                <Route path="/jobs/:id" element={<JobDetails />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
