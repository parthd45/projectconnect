import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../App';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  LogIn, 
  Sparkles, 
  Shield, 
  Zap,
  ArrowRight,
  Star,
  Globe,
  Users,
  MessageCircle,
  Rocket
} from 'lucide-react';

const ModernLoginPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalProjects: 0,
    uptime: 99.5
  });
  const [statsLoading, setStatsLoading] = useState(true);

  // Check for success messages from URL parameters
  useEffect(() => {
    const message = searchParams.get('message');
    if (message === 'password-reset-success') {
      setSuccessMessage('Password reset successfully! You can now sign in with your new password.');
    }
  }, [searchParams]);

  // Fetch public statistics
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setStatsLoading(true);
        const response = await fetch('/api/dashboard/public-stats');
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
        // Keep default values if fetch fails
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    console.log(`Input changed - ${name}:`, value); // Debug log
    setFormData({
      ...formData,
      [name]: value
    });
    if (error) setError('');
    if (successMessage) setSuccessMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Debug: Log current form state
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('Raw formData:', formData);
    
    // Get values directly from state
    const emailValue = formData.email;
    const passwordValue = formData.password;
    
    console.log('Raw email value:', emailValue, 'Type:', typeof emailValue);
    console.log('Raw password value:', passwordValue, 'Type:', typeof passwordValue);
    
    // Convert to strings and trim
    const email = emailValue ? String(emailValue).trim() : '';
    const password = passwordValue ? String(passwordValue).trim() : '';

    console.log('After trim - Email:', `"${email}"`, 'Length:', email.length);
    console.log('After trim - Password:', `"${password}"`, 'Length:', password.length);

    // Very explicit validation
    const isEmailEmpty = (email.length === 0);
    const isPasswordEmpty = (password.length === 0);
    
    console.log('Validation checks:');
    console.log('- Email empty?', isEmailEmpty);
    console.log('- Password empty?', isPasswordEmpty);
    console.log('- Email has @?', email.includes('@'));

    if (isEmailEmpty || isPasswordEmpty) {
      console.log('❌ VALIDATION FAILED: Empty fields');
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (!email.includes('@')) {
      console.log('❌ VALIDATION FAILED: Invalid email');
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    console.log('✅ VALIDATION PASSED - Proceeding with login');

    try {
      // Use the login function from AuthContext instead of direct fetch
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/dashboard');
      } else {
        setError(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://project-connect-amfi3c0j5-parthd4567-gmailcoms-projects.vercel.app/api' 
          : 'http://localhost:3001/api');
      
      const response = await fetch(`${API_URL}/auth/${provider}`);
      const data = await response.json();
      
      if (data.message) {
        setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth: ${data.instructions}`);
      } else {
        // In production with proper OAuth setup, redirect would happen here
        window.location.href = data.authUrl;
      }
    } catch (error) {
      setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not available right now. Please use email/password login.`);
    }
  };

  const features = [
    { icon: Rocket, title: 'Instant Project Setup', description: 'Get started in seconds' },
    { icon: Users, title: 'Smart Collaboration', description: 'AI-powered team matching' },
    { icon: MessageCircle, title: 'Real-time Communication', description: 'Chat with your team instantly' },
    { icon: Shield, title: 'Enterprise Security', description: 'Your data is always protected' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Main Content */}
      <div className="relative min-h-screen flex">
        {/* Left Side - Features */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-center px-12 relative">
          <div className="max-w-lg">
            {/* Logo */}
            <div className="flex items-center space-x-3 mb-12">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-2xl flex items-center justify-center shadow-2xl">
                  <Sparkles size={24} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">ProjectConnect</h1>
                <p className="text-purple-200/80 text-sm">Next-Gen Collaboration Platform</p>
              </div>
            </div>

            {/* Hero Text */}
            <div className="mb-12">
              <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
                Build Amazing 
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Projects Together
                </span>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Connect with talented creators, collaborate on exciting projects, and bring your ideas to life with our AI-powered platform.
              </p>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 gap-6">
              {features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    <feature.icon size={20} className="text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {feature.title}
                    </h3>
                    <p className="text-slate-300 text-sm">{feature.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="flex items-center space-x-8 mt-12">
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {statsLoading ? '...' : stats.activeUsers > 0 ? `${stats.activeUsers}+` : '0'}
                </div>
                <div className="text-sm text-slate-300">Active Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {statsLoading ? '...' : stats.totalProjects > 0 ? `${stats.totalProjects}+` : '0'}
                </div>
                <div className="text-sm text-slate-300">Projects Created</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-white mb-1">
                  {statsLoading ? '...' : `${stats.uptime}%`}
                </div>
                <div className="text-sm text-slate-300">Uptime</div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="flex lg:hidden items-center justify-center space-x-3 mb-8">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-2xl">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">ProjectConnect</h1>
                <p className="text-purple-200/80 text-xs">Next-Gen Collaboration</p>
              </div>
            </div>

            {/* Login Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
                <p className="text-slate-300">Sign in to continue your journey</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              {successMessage && (
                <div className="bg-green-500/20 border border-green-500/50 rounded-xl p-4 mb-6">
                  <p className="text-green-300 text-sm text-center">{successMessage}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6" noValidate>
                {/* Email Input */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                {/* Password Input */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Remember & Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-gray-300 text-purple-500 focus:ring-purple-500" />
                    <span className="ml-2 text-sm text-white/80">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-purple-300 hover:text-purple-200 transition-colors">
                    Forgot password?
                  </Link>
                </div>

                {/* Login Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <LogIn size={18} className="mr-2" />
                      Sign In
                      <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-8">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-white/20"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white/10 text-white/80 rounded-full">Or continue with</span>
                  </div>
                </div>
              </div>

              {/* OAuth Buttons */}
              <div className="space-y-3">
                <button
                  onClick={() => handleOAuthLogin('google')}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>

                <button
                  onClick={() => handleOAuthLogin('github')}
                  className="w-full bg-white/10 hover:bg-white/20 border border-white/20 text-white font-medium py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center hover:scale-105"
                >
                  <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  Continue with GitHub
                </button>
              </div>

              {/* Sign Up Link */}
              <div className="text-center mt-8">
                <p className="text-white/80">
                  Don't have an account?{' '}
                  <Link to="/signup" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
                    Create one now
                  </Link>
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center mt-8">
              <p className="text-white/60 text-sm">
                By signing in, you agree to our{' '}
                <Link to="/terms" className="text-purple-300 hover:text-purple-200 transition-colors">Terms</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-purple-300 hover:text-purple-200 transition-colors">Privacy Policy</Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 opacity-30">
        <Star size={20} className="text-yellow-400 animate-pulse" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-30">
        <Globe size={24} className="text-blue-400 animate-bounce" />
      </div>
      <div className="absolute top-1/3 right-10 opacity-30">
        <Zap size={18} className="text-purple-400 animate-pulse" />
      </div>
    </div>
  );
};

export default ModernLoginPage;
