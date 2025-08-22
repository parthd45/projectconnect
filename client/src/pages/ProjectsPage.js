import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  Search, 
  Filter, 
  Plus, 
  Users, 
  Calendar, 
  Code, 
  Star,
  Eye,
  UserPlus,
  BookOpen,
  TrendingUp,
  Zap
} from 'lucide-react';

const ProjectsPage = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    required_skills: '',
    category: '',
    timeline: '',
    max_members: 5
  });

  const categories = [
    { value: 'all', label: 'All Projects', icon: BookOpen },
    { value: 'web-development', label: 'Web Development', icon: Code },
    { value: 'mobile-development', label: 'Mobile Development', icon: Users },
    { value: 'data-science', label: 'Data Science', icon: TrendingUp },
    { value: 'ai-ml', label: 'AI/ML', icon: Zap },
    { value: 'blockchain', label: 'Blockchain', icon: Star },
    { value: 'game-development', label: 'Game Development', icon: Users },
    { value: 'other', label: 'Other', icon: Plus }
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/projects');
      setProjects(response.data.data?.projects || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please log in to create a project');
      return;
    }

    try {
      const projectData = {
        ...newProject,
        required_skills: newProject.required_skills.split(',').map(skill => skill.trim()).filter(skill => skill)
      };

      await axios.post('/api/projects', projectData);
      toast.success('Project created successfully!');
      setShowCreateModal(false);
      setNewProject({
        title: '',
        description: '',
        required_skills: '',
        category: '',
        timeline: '',
        max_members: 5
      });
      fetchProjects();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
    }
  };

  const handleJoinRequest = async (projectId, projectTitle) => {
    if (!user) {
      toast.error('Please log in to join projects');
      return;
    }

    try {
      await axios.post('/api/project-requests', {
        project_id: projectId,
        message: `Hi! I'm interested in joining "${projectTitle}". I believe I can contribute valuable skills to this project.`
      });
      toast.success('Join request sent successfully!');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send join request';
      toast.error(message);
    }
  };

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.creator_name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || project.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const getProjectIcon = (category) => {
    const categoryData = categories.find(cat => cat.value === category);
    return categoryData ? categoryData.icon : BookOpen;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Professional Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">Discover Projects</h1>
              <p className="text-slate-600 text-lg">Find amazing projects to collaborate on and build your portfolio</p>
            </div>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 md:mt-0 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Plus size={20} />
                <span>Create Project</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and Filter Section */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-6">
            {/* Search */}
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search projects, skills, or creators..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center space-x-2">
              <Filter size={20} className="text-slate-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                {categories.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-slate-600 font-medium">Loading amazing projects...</p>
            </div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="text-center py-16">
            <BookOpen size={64} className="mx-auto mb-4 text-slate-300" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects found</h3>
            <p className="text-slate-600 mb-6">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria' 
                : 'Be the first to create a project!'}
            </p>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => {
              const ProjectIcon = getProjectIcon(project.category);
              return (
                <div key={project.id} className="bg-white rounded-xl shadow-sm border border-slate-200 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <div className="p-6">
                    {/* Project Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <ProjectIcon size={24} className="text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-900 text-lg">{project.title}</h3>
                          <p className="text-slate-600 text-sm">by {project.creator_name}</p>
                        </div>
                      </div>
                      <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
                        {project.category || 'General'}
                      </span>
                    </div>

                    {/* Description */}
                    <p className="text-slate-700 mb-4 line-clamp-3">
                      {project.description}
                    </p>

                    {/* Skills */}
                    {project.required_skills && project.required_skills.length > 0 && (
                      <div className="mb-4">
                        <div className="flex flex-wrap gap-2">
                          {project.required_skills.slice(0, 3).map((skill, index) => (
                            <span
                              key={index}
                              className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium"
                            >
                              {skill}
                            </span>
                          ))}
                          {project.required_skills.length > 3 && (
                            <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-xs font-medium">
                              +{project.required_skills.length - 3} more
                            </span>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Project Stats */}
                    <div className="flex items-center justify-between text-sm text-slate-600 mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <Users size={14} />
                          <span>{project.current_members || 1}/{project.max_members || 5}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Calendar size={14} />
                          <span>{new Date(project.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => window.location.href = `/project/${project.id}`}
                        className="flex-1 bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition-colors flex items-center justify-center space-x-2"
                      >
                        <Eye size={16} />
                        <span>View Details</span>
                      </button>
                      
                      {user && user.id !== project.creator_id && (
                        <button
                          onClick={() => handleJoinRequest(project.id, project.title)}
                          className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                        >
                          <UserPlus size={16} />
                          <span>Join</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-slate-900">Create New Project</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="text-slate-400 hover:text-slate-600"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Project Title
                  </label>
                  <input
                    type="text"
                    required
                    value={newProject.title}
                    onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter your project title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Description
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={newProject.description}
                    onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Describe your project, goals, and what you're looking to achieve"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Category
                    </label>
                    <select
                      required
                      value={newProject.category}
                      onChange={(e) => setNewProject({...newProject, category: e.target.value})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">Select a category</option>
                      {categories.slice(1).map((category) => (
                        <option key={category.value} value={category.value}>
                          {category.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Max Members
                    </label>
                    <input
                      type="number"
                      min="2"
                      max="20"
                      value={newProject.max_members}
                      onChange={(e) => setNewProject({...newProject, max_members: parseInt(e.target.value)})}
                      className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Required Skills (comma-separated)
                  </label>
                  <input
                    type="text"
                    value={newProject.required_skills}
                    onChange={(e) => setNewProject({...newProject, required_skills: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., React, Node.js, Python, UI Design"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Timeline/Duration
                  </label>
                  <input
                    type="text"
                    value={newProject.timeline}
                    onChange={(e) => setNewProject({...newProject, timeline: e.target.value})}
                    className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., 2-3 months, 6 weeks, Ongoing"
                  />
                </div>

                <div className="flex items-center space-x-4 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                  >
                    Create Project
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="flex-1 bg-slate-100 text-slate-700 px-6 py-3 rounded-lg hover:bg-slate-200 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
