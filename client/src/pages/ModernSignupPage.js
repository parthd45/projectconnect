import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  User, 
  UserPlus, 
  Sparkles, 
  Shield, 
  ArrowRight,
  Star,
  Globe,
  Zap,
  Rocket,
  Users,
  MessageCircle,
  CheckCircle
} from 'lucide-react';

const ModernSignupPage = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    
    if (e.target.name === 'password') {
      calculatePasswordStrength(e.target.value);
    }
    
    if (error) setError('');
  };

  const calculatePasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[a-z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    setPasswordStrength(strength);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 2) return 'bg-red-500';
    if (passwordStrength <= 3) return 'bg-yellow-500';
    if (passwordStrength <= 4) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 2) return 'Weak';
    if (passwordStrength <= 3) return 'Fair';
    if (passwordStrength <= 4) return 'Good';
    return 'Strong';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (passwordStrength < 3) {
      setError('Please choose a stronger password');
      setLoading(false);
      return;
    }

    try {
      const API_URL = process.env.REACT_APP_API_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://project-connect-pscbt9fqv-parthd4567-gmailcoms-projects.vercel.app/api' 
          : 'http://localhost:3001/api');
      
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const token = data.data?.token || data.token;
        const userData = data.data?.user || data.user;
        localStorage.setItem('token', token);
        login(userData, token);
        navigate('/dashboard');
      } else {
        setError(data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider) => {
    try {
      const API_URL = process.env.REACT_APP_API_URL || 
        (process.env.NODE_ENV === 'production' 
          ? 'https://project-connect-pscbt9fqv-parthd4567-gmailcoms-projects.vercel.app/api' 
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
      setError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} sign-in is not available right now. Please use email/password signup.`);
    }
  };

  const benefits = [
    { icon: Rocket, title: 'Launch Faster', description: 'Get your projects off the ground in minutes' },
    { icon: Users, title: 'Find Your Team', description: 'Connect with talented collaborators worldwide' },
    { icon: MessageCircle, title: 'Communicate Better', description: 'Real-time chat and collaboration tools' },
    { icon: Shield, title: 'Stay Secure', description: 'Enterprise-grade security for your projects' }
  ];

  const features = [
    'AI-Powered Matching',
    'Real-time Collaboration',
    'Advanced Analytics',
    'Unlimited Projects',
    'Priority Support'
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
        {/* Left Side - Benefits */}
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
                Start Building
                <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Your Dream Team
                </span>
              </h2>
              <p className="text-xl text-slate-300 leading-relaxed">
                Join thousands of creators who are building amazing projects together. Your next big idea is just one collaboration away.
              </p>
            </div>

            {/* Benefits Grid */}
            <div className="space-y-6 mb-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-4 group">
                  <div className="p-3 bg-white/10 backdrop-blur-lg rounded-xl border border-white/20 group-hover:bg-white/20 transition-all duration-300 group-hover:scale-110">
                    <benefit.icon size={20} className="text-purple-300" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-purple-300 transition-colors">
                      {benefit.title}
                    </h3>
                    <p className="text-slate-300 text-sm">{benefit.description}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Features List */}
            <div className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-4">What's Included:</h3>
              <div className="space-y-3">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle size={16} className="text-green-400" />
                    <span className="text-slate-300 text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Signup Form */}
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

            {/* Signup Card */}
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-2xl">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-2">Create Your Account</h2>
                <p className="text-slate-300">Join the future of collaboration</p>
              </div>

              {error && (
                <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 mb-6">
                  <p className="text-red-300 text-sm text-center">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-4 py-3 text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      placeholder="Enter your full name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                  </div>
                </div>

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
                      required
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
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      placeholder="Create a strong password"
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
                  
                  {/* Password Strength Indicator */}
                  {formData.password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-white/80">Password Strength</span>
                        <span className={`text-xs font-medium ${
                          passwordStrength <= 2 ? 'text-red-400' :
                          passwordStrength <= 3 ? 'text-yellow-400' :
                          passwordStrength <= 4 ? 'text-blue-400' : 'text-green-400'
                        }`}>
                          {getPasswordStrengthText()}
                        </span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                          style={{ width: `${(passwordStrength / 5) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Confirm Password Input */}
                <div>
                  <label className="block text-sm font-medium text-white/90 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-purple-300" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="confirmPassword"
                      required
                      className="w-full bg-white/10 border border-white/20 rounded-xl pl-12 pr-12 py-3 text-white placeholder-white/50 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all duration-300"
                      placeholder="Confirm your password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-purple-300 hover:text-white transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="flex items-start space-x-3">
                  <input 
                    type="checkbox" 
                    required
                    className="mt-1 rounded border-gray-300 text-purple-500 focus:ring-purple-500" 
                  />
                  <span className="text-sm text-white/80">
                    I agree to the{' '}
                    <Link to="/terms" className="text-purple-300 hover:text-purple-200 transition-colors">
                      Terms of Service
                    </Link>
                    {' '}and{' '}
                    <Link to="/privacy" className="text-purple-300 hover:text-purple-200 transition-colors">
                      Privacy Policy
                    </Link>
                  </span>
                </div>

                {/* Signup Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 disabled:from-gray-500 disabled:to-gray-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 flex items-center justify-center group hover:scale-105 shadow-lg hover:shadow-purple-500/50"
                >
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <UserPlus size={18} className="mr-2" />
                      Create Account
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
                    <span className="px-4 bg-white/10 text-white/80 rounded-full">Or sign up with</span>
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

              {/* Login Link */}
              <div className="text-center mt-8">
                <p className="text-white/80">
                  Already have an account?{' '}
                  <Link to="/login" className="text-purple-300 hover:text-purple-200 font-medium transition-colors">
                    Sign in here
                  </Link>
                </p>
              </div>
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

export default ModernSignupPage;
