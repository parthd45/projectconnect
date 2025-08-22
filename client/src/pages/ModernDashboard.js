import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import { Link } from 'react-router-dom';
import { 
  Rocket, 
  Users, 
  MessageCircle, 
  TrendingUp, 
  Zap, 
  Star, 
  Plus, 
  Activity, 
  Award,
  BarChart3,
  Target,
  ArrowRight,
  Heart,
  Briefcase,
  Shield,
  Moon,
  Sun
} from 'lucide-react';

const ModernDashboard = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState({
    totalProjects: 0,
    activeCollaborations: 0,
    totalMessages: 0,
    recentActivity: 0
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  // Icon mapping for activity items
  const iconMap = {
    Plus: Plus,
    Users: Users, 
    MessageCircle: MessageCircle,
    Award: Award,
    Rocket: Rocket,
    Target: Target
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRequestAction = async (requestId, action) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/project-requests/${requestId}/status`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: action })
      });

      if (response.ok) {
        // Remove the request from the list after action
        setIncomingRequests(prev => prev.filter(req => req.id !== requestId));
        
        // Show success message based on action
        const message = action === 'accepted' ? 'Request accepted successfully!' : 'Request rejected successfully!';
        console.log(message);
      } else {
        console.error('Failed to update request status');
      }
    } catch (error) {
      console.error('Error handling request action:', error);
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      console.log('Fetching dashboard data with token:', token ? 'Present' : 'Missing');

      const [projectsRes, statsRes, activityRes, requestsRes] = await Promise.all([
        fetch('/api/projects', { headers }),
        fetch('/api/dashboard/stats', { headers }),
        fetch('/api/dashboard/recent-activity', { headers }),
        fetch('/api/project-requests/incoming', { headers })
      ]);

      console.log('API Response Status:', {
        projects: projectsRes.status,
        stats: statsRes.status,
        activity: activityRes.status,
        requests: requestsRes.status
      });

      // Handle each API call individually
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData.data.projects.slice(0, 6));
      } else {
        console.error('Projects API failed:', projectsRes.status);
        setProjects([]);
      }

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.data);
      } else {
        console.error('Stats API failed:', statsRes.status);
        setStats({
          totalProjects: 0,
          activeCollaborations: 0,
          totalMessages: 0,
          recentActivity: 0
        });
      }

      if (activityRes.ok) {
        const activityData = await activityRes.json();
        setRecentActivity(activityData.data);
      } else {
        console.error('Activity API failed:', activityRes.status);
        setRecentActivity([]);
      }

      if (requestsRes.ok) {
        const requestsData = await requestsRes.json();
        console.log('Incoming requests data:', requestsData);
        console.log('Setting incoming requests:', requestsData.data.requests);
        setIncomingRequests(requestsData.data.requests);
        
        // Add alert to see if data is received
        if (requestsData.data.requests.length > 0) {
          console.log('📨 FOUND REQUESTS:', requestsData.data.requests.length);
        } else {
          console.log('📭 NO REQUESTS FOUND');
        }
      } else {
        console.error('Requests API failed:', requestsRes.status);
        setIncomingRequests([]);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Fallback to empty data on error
      setProjects([]);
      setStats({
        totalProjects: 0,
        activeCollaborations: 0,
        totalMessages: 0,
        recentActivity: 0
      });
      setRecentActivity([]);
      setIncomingRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    { title: 'New Project', icon: Plus, color: 'from-purple-500 to-pink-500', path: '/projects/new' },
    { title: 'Find Collaborators', icon: Users, color: 'from-blue-500 to-cyan-500', path: '/collaborators' },
    { title: 'Messages', icon: MessageCircle, color: 'from-green-500 to-emerald-500', path: '/messages' },
    { title: 'Analytics', icon: BarChart3, color: 'from-orange-500 to-red-500', path: '/analytics' }
  ];

  const features = [
    { title: 'Smart Matching', description: 'AI-powered collaborator recommendations', icon: Zap },
    { title: 'Real-time Chat', description: 'Instant messaging with your team', icon: MessageCircle },
    { title: 'Progress Tracking', description: 'Visual project progress monitoring', icon: Target },
    { title: 'Secure & Private', description: 'Enterprise-grade security', icon: Shield }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-white/80 text-lg">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? 'bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900' : 'bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50'}`}>
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-pink-600/20 to-blue-600/20 animate-pulse"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
          {/* Header */}
          <div className="flex justify-between items-center mb-12">
            <div>
              <h1 className={`text-4xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Welcome back, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{user?.name || 'Creator'}</span>
              </h1>
              <p className={`text-xl ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                Ready to build something amazing today? ✨
              </p>
            </div>
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-3 rounded-xl ${darkMode ? 'bg-white/10 text-white hover:bg-white/20' : 'bg-slate-900/10 text-slate-900 hover:bg-slate-900/20'} transition-all duration-300 hover:scale-110`}
            >
              {darkMode ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Total Projects</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mt-1`}>{stats.totalProjects}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl">
                  <Briefcase size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <TrendingUp size={16} className="text-green-500 mr-1" />
                <span className="text-green-500 text-sm font-medium">+12% from last month</span>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Active Collaborations</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mt-1`}>{stats.activeCollaborations}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl">
                  <Users size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Heart size={16} className="text-red-500 mr-1" />
                <span className="text-red-500 text-sm font-medium">+5 new this week</span>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Messages</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mt-1`}>{stats.totalMessages}</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl">
                  <MessageCircle size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Activity size={16} className="text-blue-500 mr-1" />
                <span className="text-blue-500 text-sm font-medium">Very active today</span>
              </div>
            </div>

            <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-xl`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className={`text-sm font-medium ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Achievement Score</p>
                  <p className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mt-1`}>98</p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl">
                  <Award size={24} className="text-white" />
                </div>
              </div>
              <div className="mt-4 flex items-center">
                <Star size={16} className="text-yellow-500 mr-1" />
                <span className="text-yellow-500 text-sm font-medium">Top 5% performer</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-12">
            <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-6`}>Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickActions.map((action, index) => (
                <Link
                  key={index}
                  to={action.path}
                  className={`group relative overflow-hidden ${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-xl`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-r ${action.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative">
                    <div className={`p-3 bg-gradient-to-r ${action.color} rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300`}>
                      <action.icon size={24} className="text-white" />
                    </div>
                    <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:${action.color} group-hover:bg-clip-text transition-all duration-300`}>
                      {action.title}
                    </h3>
                    <ArrowRight size={16} className={`${darkMode ? 'text-slate-400' : 'text-slate-600'} group-hover:text-purple-500 mt-2 transform group-hover:translate-x-1 transition-all duration-300`} />
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Projects */}
            <div className="lg:col-span-2">
              <div className="flex items-center justify-between mb-6">
                <h2 className={`text-2xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'}`}>Recent Projects</h2>
                <Link 
                  to="/projects" 
                  className={`text-purple-400 hover:text-purple-300 font-medium transition-colors flex items-center group`}
                >
                  View all
                  <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {projects.length > 0 ? projects.map((project) => (
                  <div key={project.id} className={`group ${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl`}>
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className={`font-semibold ${darkMode ? 'text-white' : 'text-slate-900'} mb-2 group-hover:text-purple-400 transition-colors`}>
                          {project.title}
                        </h3>
                        <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'} line-clamp-2`}>
                          {project.description}
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg group-hover:scale-110 transition-transform duration-300">
                          <Rocket size={16} className="text-white" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <div className="flex -space-x-2">
                          {[1, 2, Math.min(3, project.member_count || 1)].map((i) => (
                            <div key={i} className="w-6 h-6 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full border-2 border-white"></div>
                          ))}
                        </div>
                        <span className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                          {project.member_count || 1} collaborator{(project.member_count || 1) !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <span className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {new Date(project.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                )) : (
                  <div className={`col-span-2 ${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-12 border text-center`}>
                    <Rocket size={48} className={`${darkMode ? 'text-slate-400' : 'text-slate-500'} mx-auto mb-4`} />
                    <h3 className={`text-lg font-medium ${darkMode ? 'text-white' : 'text-slate-900'} mb-2`}>No projects yet</h3>
                    <p className={`${darkMode ? 'text-slate-300' : 'text-slate-600'} mb-6`}>Start your first project and begin collaborating!</p>
                    <Link
                      to="/projects/new"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-medium hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <Plus size={16} className="mr-2" />
                      Create Project
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Recent Activity */}
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Recent Activity</h2>
                <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border`}>
                  <div className="space-y-4">
                    {recentActivity.length > 0 ? recentActivity.map((activity) => {
                      const IconComponent = iconMap[activity.icon] || MessageCircle;
                      return (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${
                            activity.type === 'project' ? 'bg-purple-500/20 text-purple-400' :
                            activity.type === 'collaboration' ? 'bg-blue-500/20 text-blue-400' :
                            activity.type === 'message' ? 'bg-green-500/20 text-green-400' :
                            'bg-yellow-500/20 text-yellow-400'
                          }`}>
                            <IconComponent size={16} />
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                              {activity.message}
                            </p>
                            <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'} mt-1`}>
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      );
                    }) : (
                      <div className="text-center py-8">
                        <Activity size={48} className={`${darkMode ? 'text-slate-400' : 'text-slate-300'} mx-auto mb-4`} />
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>No recent activity</p>
                        <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-1`}>
                          Create your first project to get started!
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Incoming Requests */}
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Join Requests</h2>
                <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border`}>
                  <div className="space-y-4">
                    {console.log('🔍 RENDERING REQUESTS - Current state:', incomingRequests, 'Length:', incomingRequests.length)}
                    {incomingRequests.length > 0 ? incomingRequests.map((request) => (
                      <div key={request.id} className={`p-4 rounded-lg border ${darkMode ? 'border-white/10 bg-white/5' : 'border-slate-200 bg-slate-50'}`}>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <Users size={16} className="text-blue-400" />
                              <span className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                                {request.user_name}
                              </span>
                              <span className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                wants to join
                              </span>
                              <span className="text-purple-400 font-medium">
                                {request.project_title}
                              </span>
                            </div>
                            {request.message && (
                              <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'} mb-3`}>
                                "{request.message}"
                              </p>
                            )}
                            <div className="flex items-center space-x-4 text-sm">
                              {request.user_skills && (
                                <div className="flex items-center space-x-1">
                                  <Zap size={14} className="text-yellow-400" />
                                  <span className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                    Skills: {Array.isArray(request.user_skills) ? request.user_skills.join(', ') : request.user_skills}
                                  </span>
                                </div>
                              )}
                              <span className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                                {new Date(request.created_at).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                          <div className="flex space-x-2 ml-4">
                            <button
                              onClick={() => handleRequestAction(request.id, 'accepted')}
                              className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white text-sm rounded-lg transition-colors"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() => handleRequestAction(request.id, 'rejected')}
                              className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white text-sm rounded-lg transition-colors"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8">
                        <Users size={48} className={`${darkMode ? 'text-slate-400' : 'text-slate-300'} mx-auto mb-4`} />
                        <p className={`${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                          🔍 DEBUG: Join Requests State - Length: {incomingRequests.length} | Loading: {loading ? 'Yes' : 'No'}
                        </p>
                        <p className={`text-sm ${darkMode ? 'text-slate-500' : 'text-slate-400'} mt-1`}>
                          Array content: {JSON.stringify(incomingRequests)}
                        </p>
                        <div className="mt-2 text-xs">
                          <p>Expected: 2 requests from API</p>
                          <p>Actually seeing: {incomingRequests.length} requests</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Features Showcase */}
              <div>
                <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-slate-900'} mb-4`}>Platform Features</h2>
                <div className={`${darkMode ? 'bg-white/10 border-white/20' : 'bg-white border-slate-200'} backdrop-blur-lg rounded-2xl p-6 border`}>
                  <div className="space-y-4">
                    {features.map((feature, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                          <feature.icon size={16} className="text-white" />
                        </div>
                        <div>
                          <h4 className={`font-medium ${darkMode ? 'text-white' : 'text-slate-900'}`}>{feature.title}</h4>
                          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-slate-600'} mt-1`}>{feature.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModernDashboard;
