import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../App';
import ProjectCard from './ProjectCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Filter, Plus, Sparkles, TrendingUp, Code, Palette } from 'lucide-react';

const ProjectList = () => {
  const { user } = useContext(AuthContext);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [skillsFilter, setSkillsFilter] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // Create project form state
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    skills_needed: ''
  });

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, skillsFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (skillsFilter) params.append('skills', skillsFilter);

      const response = await axios.get(`/projects?${params.toString()}`);
      // Fix: Access the correct nested structure
      const projectsData = response.data.data?.projects || [];
      setProjects(projectsData);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
      // Ensure projects is always an array
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInterested = async (projectId) => {
    if (!user) {
      toast.error('Please login to send join requests');
      return;
    }

    try {
      await axios.post('/api/project-requests', { 
        project_id: projectId,
        message: 'I would like to join this project and contribute my skills.'
      });
      toast.success('Join request sent successfully! The project owner will review your request.');
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send join request';
      toast.error(message);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('Please login to create projects');
      return;
    }

    try {
      const projectData = {
        ...newProject,
        skills_needed: newProject.skills_needed.split(',').map(skill => skill.trim())
      };

      await axios.post('/api/projects', projectData);
      toast.success('Project created successfully!');
      
      // Reset form and close modal
      setNewProject({ title: '', description: '', skills_needed: '' });
      setShowCreateForm(false);
      
      // Refresh projects list
      fetchProjects();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create project';
      toast.error(message);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProjects();
  };

  const filterCategories = [
    { id: 'all', name: 'All Projects', icon: Sparkles },
    { id: 'web', name: 'Web Development', icon: Code },
    { id: 'mobile', name: 'Mobile Apps', icon: TrendingUp },
    { id: 'design', name: 'UI/UX Design', icon: Palette },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Discover Amazing Projects
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Find your next collaboration opportunity and build something incredible with talented peers
        </p>
      </div>

      {/* Action Bar */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch lg:items-center justify-between">
        {/* Search Bar */}
        <div className="flex-1 max-w-2xl">
          <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search projects, technologies, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200 text-gray-700"
              />
            </div>
            <div className="relative flex-shrink-0">
              <Filter size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Skills filter"
                value={skillsFilter}
                onChange={(e) => setSkillsFilter(e.target.value)}
                className="w-full sm:w-48 pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-200"
              />
            </div>
            <button type="submit" className="btn-primary px-8 whitespace-nowrap">
              Search
            </button>
          </form>
        </div>

        {/* Create Project Button */}
        {user && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="btn-primary flex items-center justify-center space-x-2 px-6 w-full lg:w-auto"
          >
            <Plus size={18} />
            <span>Create Project</span>
          </button>
        )}
      </div>

      {/* Filter Categories */}
      <div className="flex flex-wrap gap-3 justify-center">
        {filterCategories.map((category) => {
          const IconComponent = category.icon;
          return (
            <button
              key={category.id}
              onClick={() => setActiveFilter(category.id)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                activeFilter === category.id
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                  : 'bg-white border-2 border-gray-200 text-gray-700 hover:border-purple-300 hover:text-purple-600'
              }`}
            >
              <IconComponent size={18} />
              <span>{category.name}</span>
            </button>
          );
        })}
      </div>

      {/* Projects Grid */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-purple-600 border-t-transparent"></div>
            <p className="text-gray-600">Loading amazing projects...</p>
          </div>
        </div>
      ) : (projects && projects.length === 0) ? (
        <div className="text-center py-16">
          <div className="w-24 h-24 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Search size={32} className="text-purple-600" />
          </div>
          <h3 className="text-2xl font-semibold text-gray-900 mb-4">No projects found</h3>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            {searchTerm || skillsFilter 
              ? 'Try adjusting your search criteria or explore different skills' 
              : 'Be the first to create an amazing project and inspire others!'}
          </p>
          {user && !searchTerm && !skillsFilter && (
            <button
              onClick={() => setShowCreateForm(true)}
              className="btn-primary"
            >
              <Plus size={18} className="mr-2" />
              Create Your First Project
            </button>
          )}
        </div>
      ) : (
        <>
          {/* Results Header */}
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{projects?.length || 0}</span> projects found
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <span>Sort by:</span>
              <select className="border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:border-purple-400">
                <option>Most Recent</option>
                <option>Most Popular</option>
                <option>Skill Match</option>
              </select>
            </div>
          </div>

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {(projects || []).map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onInterested={handleInterested}
              />
            ))}
          </div>
        </>
      )}

      {/* Create Project Modal */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-8 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">Create New Project</h2>
            <form onSubmit={handleCreateProject} className="space-y-6">
              <div>
                <label className="form-label">
                  Project Title *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="input-field"
                  placeholder="Enter an exciting project title"
                />
              </div>
              
              <div>
                <label className="form-label">
                  Project Description *
                </label>
                <textarea
                  required
                  rows={5}
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="input-field resize-none"
                  placeholder="Describe your project vision, goals, and what makes it exciting..."
                />
              </div>
              
              <div>
                <label className="form-label">
                  Skills Needed *
                </label>
                <input
                  type="text"
                  required
                  value={newProject.skills_needed}
                  onChange={(e) => setNewProject({...newProject, skills_needed: e.target.value})}
                  className="input-field"
                  placeholder="React, Node.js, Python, UI/UX Design (comma separated)"
                />
                <p className="text-sm text-gray-500 mt-2">
                  List the skills you're looking for in your teammates
                </p>
              </div>
              
              <div className="flex justify-end space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
