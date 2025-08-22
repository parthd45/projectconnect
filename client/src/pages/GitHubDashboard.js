import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  GitBranch, 
  Star, 
  Eye, 
  GitFork,
  Clock,
  Users,
  MessageCircle,
  Plus,
  Search,
  RefreshCw,
  Book,
  Activity,
  CheckCircle,
  XCircle,
  Bell
} from 'lucide-react';

const GitHubDashboard = () => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    myProjects: 0,
    joinedProjects: 0,
    pendingRequests: 0,
    receivedRequests: 0,
    collaborations: 0
  });
  const [projectRequests, setProjectRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [recentProjects, setRecentProjects] = useState([]);

  useEffect(() => {
    fetchDashboardData();
    
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      const myProjectsRes = await axios.get('/api/projects/my');
      const joinedProjectsRes = await axios.get('/api/projects/joined');
      const myRequestsRes = await axios.get('/api/project-requests/my');
      
      const myProjects = myProjectsRes.data.data?.projects || [];
      const joinedProjects = joinedProjectsRes.data.data?.projects || [];
      const myRequestsList = myRequestsRes.data.data?.requests || [];
      
      setStats({
        myProjects: myProjects.length,
        joinedProjects: joinedProjects.length,
        pendingRequests: myRequestsList.filter(r => r.status === 'pending').length,
        receivedRequests: 0,
        collaborations: 0
      });
      
      setMyRequests(myRequestsList);
      setRecentProjects([...myProjects, ...joinedProjects].slice(0, 6));
      
      let allReceivedRequests = [];
      for (const project of myProjects) {
        try {
          const requestsRes = await axios.get(`/api/project-requests/project/${project.id}`);
          const requests = requestsRes.data.data?.requests || [];
          allReceivedRequests = [...allReceivedRequests, ...requests.map(r => ({ ...r, project_title: project.title }))];
        } catch (error) {
          console.error(`Error fetching requests for project ${project.id}:`, error);
        }
      }
      
      setProjectRequests(allReceivedRequests);
      
      const pendingRequestsCount = allReceivedRequests.filter(r => r.status === 'pending').length;
      const acceptedRequestsCount = allReceivedRequests.filter(r => r.status === 'accepted').length;
      
      setStats(prev => ({
        ...prev,
        receivedRequests: pendingRequestsCount,
        collaborations: acceptedRequestsCount
      }));
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (requestId, status) => {
    try {
      await axios.put(`/api/project-requests/${requestId}/status`, { status });
      toast.success(`Request ${status} successfully!`);
      fetchDashboardData();
    } catch (error) {
      const message = error.response?.data?.message || `Failed to ${status} request`;
      toast.error(message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0d1117] flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mx-auto mb-4"></div>
          <p className="text-gray-400 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0d1117] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* GitHub-style Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-white mb-2">Welcome back, {user?.name}</h1>
            <p className="text-gray-400">Here's what's happening with your projects today.</p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 lg:mt-0">
            <button
              onClick={fetchDashboardData}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-white hover:bg-[#21262d] rounded-md transition-colors"
              title="Refresh"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            <button
              onClick={() => window.location.href = '/projects'}
              className="bg-[#238636] text-white px-4 py-2 rounded-md hover:bg-[#2ea043] transition-colors flex items-center space-x-2"
            >
              <Plus size={16} />
              <span>New project</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar - Stats */}
          <div className="lg:col-span-1">
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6 mb-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Activity size={20} className="mr-2" />
                Your Activity
              </h3>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Book size={16} className="mr-2 text-blue-400" />
                    <span className="text-sm">My Projects</span>
                  </div>
                  <span className="font-semibold">{stats.myProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <GitFork size={16} className="mr-2 text-green-400" />
                    <span className="text-sm">Collaborations</span>
                  </div>
                  <span className="font-semibold">{stats.joinedProjects}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Users size={16} className="mr-2 text-purple-400" />
                    <span className="text-sm">Join Requests</span>
                  </div>
                  <span className="font-semibold">{stats.receivedRequests}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Clock size={16} className="mr-2 text-yellow-400" />
                    <span className="text-sm">Pending</span>
                  </div>
                  <span className="font-semibold">{stats.pendingRequests}</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => window.location.href = '/projects'}
                  className="w-full bg-[#21262d] border border-[#30363d] rounded-md px-4 py-3 text-left hover:bg-[#30363d] transition-colors flex items-center"
                >
                  <Plus size={16} className="mr-3 text-green-400" />
                  <span>Create Project</span>
                </button>
                <button
                  onClick={() => window.location.href = '/projects'}
                  className="w-full bg-[#21262d] border border-[#30363d] rounded-md px-4 py-3 text-left hover:bg-[#30363d] transition-colors flex items-center"
                >
                  <Search size={16} className="mr-3 text-blue-400" />
                  <span>Browse Projects</span>
                </button>
                <button
                  onClick={() => window.location.href = '/messages'}
                  className="w-full bg-[#21262d] border border-[#30363d] rounded-md px-4 py-3 text-left hover:bg-[#30363d] transition-colors flex items-center"
                >
                  <MessageCircle size={16} className="mr-3 text-purple-400" />
                  <span>Messages</span>
                </button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {/* Recent Projects */}
            <div className="bg-[#161b22] border border-[#30363d] rounded-lg mb-6">
              <div className="p-6 border-b border-[#30363d]">
                <h3 className="text-lg font-semibold flex items-center">
                  <GitBranch size={20} className="mr-2" />
                  Recent Projects
                </h3>
              </div>
              
              <div className="p-6">
                {recentProjects.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {recentProjects.map((project) => (
                      <div key={project.id} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4 hover:border-[#58a6ff] transition-colors cursor-pointer"
                           onClick={() => window.location.href = `/projects/${project.id}`}>
                        <div className="flex items-start justify-between mb-3">
                          <h4 className="font-semibold text-[#58a6ff] hover:underline">
                            {project.title}
                          </h4>
                          <span className="text-xs text-gray-500 bg-[#21262d] px-2 py-1 rounded">
                            {project.is_owner ? 'Owner' : 'Collaborator'}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-400 mb-3 line-clamp-2">
                          {project.description}
                        </p>
                        
                        <div className="flex items-center space-x-4 text-xs text-gray-500">
                          <div className="flex items-center">
                            <Star size={12} className="mr-1" />
                            <span>0</span>
                          </div>
                          <div className="flex items-center">
                            <GitFork size={12} className="mr-1" />
                            <span>0</span>
                          </div>
                          <div className="flex items-center">
                            <Eye size={12} className="mr-1" />
                            <span>{project.views || 0}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Book size={48} className="mx-auto mb-4 text-gray-600" />
                    <p className="text-gray-400 mb-4">No recent projects</p>
                    <button
                      onClick={() => window.location.href = '/projects'}
                      className="bg-[#238636] text-white px-4 py-2 rounded-md hover:bg-[#2ea043] transition-colors"
                    >
                      Create your first project
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Notifications */}
            {(projectRequests.length > 0 || myRequests.length > 0) && (
              <div className="bg-[#161b22] border border-[#30363d] rounded-lg">
                <div className="p-6 border-b border-[#30363d]">
                  <h3 className="text-lg font-semibold flex items-center">
                    <Bell size={20} className="mr-2" />
                    Notifications
                  </h3>
                </div>
                
                <div className="p-6">
                  {projectRequests.filter(r => r.status === 'pending').length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-medium mb-3 text-yellow-400">Pending Join Requests</h4>
                      <div className="space-y-3">
                        {projectRequests.filter(r => r.status === 'pending').map((request) => (
                          <div key={request.id} className="bg-[#0d1117] border border-[#30363d] rounded-lg p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <p className="font-medium">{request.user_name}</p>
                                <p className="text-sm text-gray-400 mb-2">wants to join "{request.project_title}"</p>
                                {request.message && (
                                  <p className="text-sm text-gray-500 mb-3 italic">"{request.message}"</p>
                                )}
                              </div>
                              <div className="flex space-x-2 ml-4">
                                <button
                                  onClick={() => handleRequestAction(request.id, 'accepted')}
                                  className="bg-[#238636] text-white px-3 py-1 rounded text-sm hover:bg-[#2ea043] transition-colors flex items-center"
                                >
                                  <CheckCircle size={14} className="mr-1" />
                                  Accept
                                </button>
                                <button
                                  onClick={() => handleRequestAction(request.id, 'rejected')}
                                  className="bg-[#da3633] text-white px-3 py-1 rounded text-sm hover:bg-[#b91c1c] transition-colors flex items-center"
                                >
                                  <XCircle size={14} className="mr-1" />
                                  Decline
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GitHubDashboard;
