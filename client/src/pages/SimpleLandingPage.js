import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Users, 
  MessageCircle, 
  Zap, 
  Star,
  ArrowRight, 
  Play,
  CheckCircle,
  Shield,
  Globe,
  Sparkles,
  Target,
  Award,
  ChevronDown
} from 'lucide-react';

const SimpleLandingPage = () => {
  const features = [
    {
      icon: Zap,
      title: 'AI-Powered Matching',
      description: 'Connect with perfect collaborators using intelligent algorithms.',
      color: 'from-yellow-400 to-orange-500'
    },
    {
      icon: MessageCircle,
      title: 'Real-time Communication',
      description: 'Chat instantly with your team members and stay updated.',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Enterprise-grade security for all your projects.',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: Target,
      title: 'Project Management',
      description: 'Powerful tools to track progress and meet deadlines.',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Globe,
      title: 'Global Community',
      description: 'Connect with creators from around the world.',
      color: 'from-indigo-400 to-purple-500'
    },
    {
      icon: Award,
      title: 'Recognition System',
      description: 'Earn badges and build your professional reputation.',
      color: 'from-red-400 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center px-4">
        <div className="max-w-7xl mx-auto text-center">
          {/* Logo */}
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="relative">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-3xl flex items-center justify-center shadow-2xl">
                <Sparkles size={32} className="text-white" />
              </div>
              <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">ProjectConnect</h1>
              <p className="text-purple-200/80">Next-Gen Collaboration Platform</p>
            </div>
          </div>

          {/* Hero Text */}
          <div className="mb-12">
            <h2 className="text-5xl md:text-7xl font-bold text-white mb-8 leading-tight">
              Where Great Ideas
              <span className="block bg-gradient-to-r from-pink-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
                Meet Perfect Teams
              </span>
            </h2>
            <p className="text-xl md:text-2xl text-slate-300 mb-8 max-w-4xl mx-auto leading-relaxed">
              Connect with talented creators worldwide, collaborate on exciting projects, and bring your wildest ideas to life with our AI-powered matching platform.
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 flex items-center group"
            >
              <Rocket size={24} className="mr-3 group-hover:animate-bounce" />
              Start Creating Now
              <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105 flex items-center group">
              <Play size={20} className="mr-3" />
              Watch Demo
            </button>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown size={32} className="text-white/60" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Powerful Features for
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Modern Creators
              </span>
            </h3>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto">
              Everything you need to find the perfect team, collaborate effectively, and bring your projects to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div 
                key={index} 
                className="group bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
              >
                <div className={`p-4 bg-gradient-to-r ${feature.color} rounded-2xl w-fit mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon size={32} className="text-white" />
                </div>
                <h4 className="text-xl font-bold text-white mb-4 group-hover:text-purple-300 transition-colors">
                  {feature.title}
                </h4>
                <p className="text-slate-300 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 backdrop-blur-xl border border-white/20 rounded-3xl p-12">
            <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Start Your
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Next Big Project?
              </span>
            </h3>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who are already building amazing projects together. Your perfect collaboration is just one click away.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/signup"
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all duration-300 shadow-2xl hover:shadow-purple-500/50 hover:scale-105 flex items-center group"
              >
                <Users size={24} className="mr-3" />
                Join Now - It's Free
                <ArrowRight size={20} className="ml-3 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/login"
                className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg transition-all duration-300 hover:bg-white/20 hover:scale-105"
              >
                Sign In
              </Link>
            </div>

            <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-slate-300">
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-400 mr-2" />
                No credit card required
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-400 mr-2" />
                Setup in 2 minutes
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="text-green-400 mr-2" />
                Cancel anytime
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-12 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <span className="text-white font-semibold">ProjectConnect</span>
            </div>
            
            <div className="flex items-center space-x-8 text-slate-300">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
              <Link to="/support" className="hover:text-white transition-colors">Support</Link>
              <Link to="/about" className="hover:text-white transition-colors">About</Link>
            </div>
          </div>
          
          <div className="text-center mt-8 pt-8 border-t border-white/10 text-slate-400">
            <p>© 2024 ProjectConnect. All rights reserved. Made with ❤️ for creators worldwide.</p>
          </div>
        </div>
      </footer>

      {/* Floating Elements */}
      <div className="absolute top-20 left-20 opacity-30 animate-pulse">
        <Star size={20} className="text-yellow-400" />
      </div>
      <div className="absolute bottom-20 right-20 opacity-30 animate-bounce">
        <Globe size={24} className="text-blue-400" />
      </div>
      <div className="absolute top-1/3 right-10 opacity-30 animate-pulse">
        <Zap size={18} className="text-purple-400" />
      </div>
    </div>
  );
};

export default SimpleLandingPage;
