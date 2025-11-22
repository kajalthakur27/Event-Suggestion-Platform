import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function AuthScreen() {
  // States for managing views and inputs
  const [view, setView] = useState('signin'); // 'signin', 'signup', or 'forgot'
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    rememberMe: false
  });

  // Handle Input Change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Simulate Authentication Logic
  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate network delay
    setTimeout(() => {
      setIsLoading(false);
      if (view === 'signin') {
        showNotification(`Welcome back! Logged in as ${formData.email}`);
      } else if (view === 'signup') {
        showNotification('Account created successfully! Please login.');
        setView('signin');
      } else if (view === 'forgot') {
        showNotification(`Password reset link sent to ${formData.email}`);
        setView('signin');
      }
    }, 1500);
  };

  // Helper to show notifications
  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(null), 3000);
  };

  // Colors based on the uploaded image
  const themeColor = "bg-[#1e1b4b]"; // Dark Indigo/Blue
  const btnColor = "bg-[#2e2b5b]";

  return (
    <div className="h-screen w-screen bg-gray-100 flex items-center justify-center p-4 font-sans overflow-hidden">
      {/* Main Mobile Container */}
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden relative flex flex-col h-[850px] max-h-[90vh]">
        
        {/* Notification Toast */}
        {notification && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-4 py-2 rounded-full shadow-lg flex items-center text-sm animate-bounce">
            <CheckCircle size={16} className="mr-2" />
            {notification}
          </div>
        )}

        {/* --- HEADER SECTION --- */}
        <div className={`${themeColor} pt-8 pb-16 px-6 rounded-b-[40px] relative z-10`}>
          
          {/* Toggle Tabs (Only visible if not in Forgot Password mode) */}
          {view !== 'forgot' && (
            <div className="flex justify-between items-end px-8 mt-4 gap-4">
              <button 
                onClick={() => setView('signup')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  view === 'signup' 
                    ? 'bg-white text-[#1e1b4b] shadow-md' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign Up
              </button>
              <button 
                onClick={() => setView('signin')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  view === 'signin' 
                    ? 'bg-white text-[#1e1b4b] shadow-md' 
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                Sign In
              </button>
            </div>
          )}

          {view === 'forgot' && (
             <div className="px-2 mt-4">
               <h2 className="text-2xl text-white font-bold">Reset Password</h2>
               <p className="text-gray-300 text-sm mt-1">Enter your email to recover your account</p>
             </div>
          )}
        </div>

        {/* --- BODY SECTION --- */}
        <div className="flex-1 flex flex-col justify-center px-8 py-4 relative">
          
          {/* Title */}
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
            {view === 'signup' && 'Create An Account'}
            {view === 'signin' && 'Welcome Back !'}
            {view === 'forgot' && 'Forgot Password?'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto w-full">
            
            {/* Full Name (Sign Up Only) */}
            {view === 'signup' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={20} className="text-[#1e1b4b]" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  required={view === 'signup'}
                  className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-[#1e1b4b] focus:ring-2 focus:ring-[#1e1b4b] outline-none shadow-sm text-gray-800 font-semibold placeholder-gray-500 bg-white"
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Email Field */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-[#1e1b4b]" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                required
                className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-gray-300 focus:border-[#1e1b4b] focus:ring-2 focus:ring-[#1e1b4b] outline-none shadow-sm text-gray-800 font-semibold placeholder-gray-500 bg-white"
                onChange={handleChange}
              />
            </div>

            {/* Password Field (Not for Forgot Password) */}
            {view !== 'forgot' && (
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-[#1e1b4b]" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  required
                  className="w-full pl-12 pr-12 py-3.5 rounded-xl border border-gray-300 focus:border-[#1e1b4b] focus:ring-2 focus:ring-[#1e1b4b] outline-none shadow-sm text-gray-800 font-semibold placeholder-gray-500 bg-white"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            )}

            {/* Remember Me & Forgot Password (Sign In Only) */}
            {view === 'signin' && (
              <div className="flex items-center justify-between text-sm mt-2">
                <label className="flex items-center text-gray-700 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="rememberMe"
                    className="mr-2 accent-[#1e1b4b] h-4 w-4"
                    onChange={handleChange}
                  />
                  Remember Password
                </label>
                <button 
                  type="button" 
                  onClick={() => setView('forgot')}
                  className="bg-gray-200 text-gray-800 px-3 py-1 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Forget Password?
                </button>
              </div>
            )}

            {/* Back to Login (Forgot Password Only) */}
            {view === 'forgot' && (
              <div className="text-right">
                <button 
                  type="button" 
                  onClick={() => setView('signin')}
                  className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Back to Sign In
                </button>
              </div>
            )}

            {/* Main Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full ${btnColor} text-white py-4 rounded-2xl font-bold text-lg shadow-lg hover:opacity-90 transform active:scale-[0.98] transition-all mt-6 flex justify-center items-center`}
            >
              {isLoading ? (
                <span className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                view === 'signup' ? 'Sign Up' : (view === 'forgot' ? 'Send Link' : 'Sign In')
              )}
            </button>

          </form>

          {/* Social Login Section (Hide on Forgot Password) */}
          {view !== 'forgot' && (
            <div className="mt-8 max-w-sm mx-auto w-full">
              <div className="flex items-center justify-between mb-6">
                <div className="h-[1px] bg-gray-300 flex-1"></div>
                <span className="text-gray-600 text-sm font-medium px-4">
                  Or continue with Google
                </span>
                <div className="h-[1px] bg-gray-300 flex-1"></div>
              </div>

              <div className="flex justify-center">
                {/* Google Button */}
                <button className="w-full max-w-sm bg-white border border-gray-200 py-3 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-gray-50 transition transform active:scale-95">
                   <svg className="w-6 h-6" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                  </svg>
                  <span className="text-gray-700 font-semibold">Continue with Google</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* --- FOOTER CURVE --- */}
        <div className={`${themeColor} h-16 w-full rounded-t-[50%] mt-auto`}></div>
        
      </div>
    </div>
  );
}

