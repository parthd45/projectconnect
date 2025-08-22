import React, { useContext } from 'react';
import { AuthContext } from '../App';
import ProjectList from '../components/ProjectList';
import { ArrowRight, BookOpen, Users, Code, Trophy, Search, UserPlus, Star, Target, MessageSquare, Award, CheckCircle, TrendingUp } from 'lucide-react';

const HomePage = () => {
  const { user } = useContext(AuthContext);

  // If user is logged in, show the dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container-custom py-8">
          {/* Welcome Header */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome back, {user.name}!
                </h1>
                <p className="text-gray-600">
                  Ready to collaborate on amazing projects? Discover new opportunities and connect with talented students.
                </p>
              </div>
              <div className="mt-4 md:mt-0">
                <button className="btn-primary">
                  <UserPlus size={18} className="mr-2" />
                  Create Project
                </button>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="stats-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Projects</p>
                  <p className="text-2xl font-bold text-gray-900">12</p>
                </div>
                <div className="feature-icon">
                  <Code size={20} />
                </div>
              </div>
            </div>
            <div className="stats-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Team Members</p>
                  <p className="text-2xl font-bold text-gray-900">48</p>
                </div>
                <div className="feature-icon">
                  <Users size={20} />
                </div>
              </div>
            </div>
            <div className="stats-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-gray-900">6</p>
                </div>
                <div className="feature-icon">
                  <Trophy size={20} />
                </div>
              </div>
            </div>
            <div className="stats-card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Success Rate</p>
                  <p className="text-2xl font-bold text-gray-900">94%</p>
                </div>
                <div className="feature-icon">
                  <TrendingUp size={20} />
                </div>
              </div>
            </div>
          </div>

          <ProjectList />
        </div>
      </div>
    );
  }

  // If user is not logged in, show the marketing homepage
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="container-custom py-20">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-full mb-8">
              <Star size={16} className="mr-2 text-blue-600" />
              <span className="text-sm font-medium text-blue-700">Join 2,500+ Students Learning Together</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
              Learn. Collaborate. <br />
              <span className="text-gradient">Build Amazing Projects.</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto leading-relaxed">
              StudentConnect is the premier platform for university students to find project teammates, 
              collaborate on assignments, and build their portfolio with real-world experience.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <a href="/signup" className="btn-primary text-lg px-8 py-4">
                Start Learning Today
                <ArrowRight size={20} className="ml-2" />
              </a>
              <a href="#features" className="btn-secondary text-lg px-8 py-4">
                Explore Features
              </a>
            </div>
            
            <div className="mt-12 flex items-center justify-center space-x-8 text-sm text-gray-500">
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-green-600" />
                <span>100% Free for Students</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-green-600" />
                <span>Verified University Students</span>
              </div>
              <div className="flex items-center">
                <CheckCircle size={16} className="mr-2 text-green-600" />
                <span>Skill-Based Matching</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Features Section */}
      <div id="features" className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why Choose StudentConnect?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Built specifically for university students to excel in collaborative learning and project development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="card text-center">
              <div className="feature-icon mx-auto">
                <Search size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Smart Project Matching</h3>
              <p className="text-gray-600 leading-relaxed">
                Our intelligent algorithm matches you with projects and teammates based on your skills, 
                interests, and academic goals for optimal collaboration.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="feature-icon mx-auto">
                <Users size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Verified Student Network</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with verified university students from your institution and others. 
                Build meaningful academic and professional relationships.
              </p>
            </div>
            
            <div className="card text-center">
              <div className="feature-icon mx-auto">
                <Trophy size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Portfolio Building</h3>
              <p className="text-gray-600 leading-relaxed">
                Showcase your completed projects, track your achievements, and build an impressive 
                portfolio that stands out to future employers.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is simple. Follow these three steps to begin your collaborative journey.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create Your Profile</h3>
              <p className="text-gray-600 leading-relaxed">
                Sign up with your university email, add your skills, interests, and the type of projects you want to work on.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Find Your Team</h3>
              <p className="text-gray-600 leading-relaxed">
                Browse active projects or post your own idea. Use our smart filters to find students with complementary skills.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 text-white text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Start Collaborating</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with your teammates, plan your project, and start building something amazing together.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Project Categories */}
      <div className="py-20 bg-gray-50">
        <div className="container-custom">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Popular Project Categories</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore the most active project categories on our platform
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="card hover:shadow-md transition-shadow">
              <Code className="w-8 h-8 text-blue-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Web Development</h3>
              <p className="text-sm text-gray-600">React, Node.js, Full-stack</p>
              <div className="mt-4 text-sm text-blue-600 font-medium">120+ active projects</div>
            </div>
            
            <div className="card hover:shadow-md transition-shadow">
              <Target className="w-8 h-8 text-green-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Mobile Apps</h3>
              <p className="text-sm text-gray-600">Flutter, React Native, iOS</p>
              <div className="mt-4 text-sm text-green-600 font-medium">85+ active projects</div>
            </div>
            
            <div className="card hover:shadow-md transition-shadow">
              <Award className="w-8 h-8 text-purple-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">AI & Machine Learning</h3>
              <p className="text-sm text-gray-600">Python, TensorFlow, Data Science</p>
              <div className="mt-4 text-sm text-purple-600 font-medium">95+ active projects</div>
            </div>
            
            <div className="card hover:shadow-md transition-shadow">
              <BookOpen className="w-8 h-8 text-orange-600 mb-4" />
              <h3 className="font-bold text-gray-900 mb-2">Research Projects</h3>
              <p className="text-sm text-gray-600">Academic research, Publications</p>
              <div className="mt-4 text-sm text-orange-600 font-medium">60+ active projects</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* CTA Section */}
      <div className="py-20 bg-blue-600">
        <div className="container-custom text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Start Your Next Project?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of students who are already building amazing projects and advancing their careers.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/signup" className="btn-primary bg-white text-blue-600 hover:bg-gray-100">
              Join StudentConnect
            </a>
            <a href="/login" className="btn-secondary border-white text-white hover:bg-white hover:text-blue-600">
              Sign In
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
