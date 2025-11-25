import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Eye, EyeOff, CheckCircle } from 'lucide-react';

export default function AuthScreen() {
  const navigate = useNavigate();
  
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
        setTimeout(() => navigate('/dashboard'), 1500);
      } else if (view === 'signup') {
        showNotification('Account created successfully! Redirecting...');
        setTimeout(() => navigate('/dashboard'), 2000);
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
    <div className="min-h-screen w-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4 font-sans overflow-hidden relative">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-40 right-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Container */}
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl overflow-hidden relative flex flex-col min-h-[700px] border border-white/20">
        
        {/* Enhanced Notification Toast */}
        {notification && (
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-50 bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-2xl shadow-2xl flex items-center text-sm animate-slideDown border border-green-400">
            <CheckCircle size={18} className="mr-3" />
            <span className="font-medium">{notification}</span>
          </div>
        )}

        {/* Enhanced Header Section */}
        <div className="bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 pt-8 pb-16 px-6 rounded-b-[40px] relative z-10 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl animate-pulse"></div>
            <div className="absolute -bottom-5 -left-5 w-24 h-24 bg-pink-400/20 rounded-full blur-xl animate-bounce"></div>
          </div>
          
          <div className="relative z-10">
            {/* Logo and branding */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/30">
                <User size={32} className="text-white" />
              </div>
              <h1 className="text-3xl font-bold text-white mb-1">EventAI</h1>
              <p className="text-purple-200 text-sm">Discover amazing events with AI</p>
            </div>

            {/* Toggle Tabs (Only visible if not in Forgot Password mode) */}
            {view !== 'forgot' && (
              <div className="flex bg-white/20 backdrop-blur-sm rounded-2xl p-1 gap-1 border border-white/30">
                <button 
                  onClick={() => setView('signup')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    view === 'signup' 
                      ? 'bg-white text-purple-700 shadow-lg transform scale-[0.98]' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => setView('signin')}
                  className={`flex-1 px-4 py-3 rounded-xl font-semibold transition-all duration-200 ${
                    view === 'signin' 
                      ? 'bg-white text-purple-700 shadow-lg transform scale-[0.98]' 
                      : 'text-white hover:bg-white/10'
                  }`}
                >
                  Sign In
                </button>
              </div>
            )}

            {view === 'forgot' && (
               <div className="text-center">
                 <h2 className="text-3xl text-white font-bold mb-2">Reset Password</h2>
                 <p className="text-purple-200 text-sm">Enter your email to recover your account</p>
               </div>
            )}
          </div>
        </div>

        {/* Enhanced Body Section */}
        <div className="flex-1 flex flex-col justify-center px-8 py-6 relative">
          
          {/* Enhanced Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 text-transparent bg-clip-text mb-2">
              {view === 'signup' && 'Create An Account'}
              {view === 'signin' && 'Welcome Back!'}
              {view === 'forgot' && 'Forgot Password?'}
            </h2>
            <p className="text-gray-500">
              {view === 'signup' && 'Join thousands discovering amazing events'}
              {view === 'signin' && 'Sign in to continue your journey'}
              {view === 'forgot' && 'No worries, we\'ll help you reset it'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 max-w-sm mx-auto w-full">
            
            {/* Enhanced Full Name Field (Sign Up Only) */}
            {view === 'signup' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User size={20} className="text-purple-600 group-focus-within:text-purple-700 transition-colors" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  required={view === 'signup'}
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none shadow-sm text-gray-800 font-medium placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                  onChange={handleChange}
                />
              </div>
            )}

            {/* Enhanced Email Field */}
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={20} className="text-purple-600 group-focus-within:text-purple-700 transition-colors" />
              </div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                required
                className="w-full pl-12 pr-4 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none shadow-sm text-gray-800 font-medium placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                onChange={handleChange}
              />
            </div>

            {/* Enhanced Password Field (Not for Forgot Password) */}
            {view !== 'forgot' && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock size={20} className="text-purple-600 group-focus-within:text-purple-700 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  required
                  className="w-full pl-12 pr-12 py-4 rounded-2xl border-2 border-gray-200 focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none shadow-sm text-gray-800 font-medium placeholder-gray-400 bg-white/50 backdrop-blur-sm transition-all duration-200"
                  onChange={handleChange}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-purple-600 transition-colors duration-200"
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

            {/* Enhanced Main Action Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="group w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-6 flex justify-center items-center disabled:opacity-50 disabled:cursor-not-allowed border border-purple-500"
            >
              {isLoading ? (
                <>
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                  Processing...
                </>
              ) : (
                <>
                  {view === 'signup' && <User className="mr-2 group-hover:scale-110 transition-transform" size={20} />}
                  {view === 'signin' && <CheckCircle className="mr-2 group-hover:scale-110 transition-transform" size={20} />}
                  {view === 'forgot' && <Mail className="mr-2 group-hover:scale-110 transition-transform" size={20} />}
                  {view === 'signup' ? 'Create Account' : (view === 'forgot' ? 'Send Reset Link' : 'Sign In')}
                </>
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

        {/* Enhanced Footer Curve */}
        <div className="bg-gradient-to-r from-purple-600 to-pink-600 h-16 w-full rounded-t-[50%] mt-auto relative overflow-hidden">
          <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
        </div>
        
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

