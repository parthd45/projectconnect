import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';
import { MapPin, Github, Heart, Clock, Users, MessageCircle } from 'lucide-react';

const ProjectCard = ({ project, onInterested }) => {
  const { user } = useContext(AuthContext);

  const handleInterested = () => {
    if (onInterested) {
      onInterested(project.id);
    }
  };

  const handleDirectMessage = () => {
    window.location.href = `/messages?user=${project.creator_id}&name=${encodeURIComponent(project.creator_name)}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isOwner = user && user.id === project.creator_id;

  return (
    <div className="project-card hover-lift group">
      {/* Project Header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <span className="badge-new">New</span>
            <div className="flex items-center text-xs text-gray-500">
              <Clock size={12} className="mr-1" />
              <span>{formatDate(project.created_at)}</span>
            </div>
          </div>
          <Link 
            to={`/projects/${project.id}`}
            className="text-xl font-bold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2 group-hover:text-purple-600"
          >
            {project.title}
          </Link>
        </div>
        
        {/* Interest Button */}
        {user && !isOwner && (
          <button
            onClick={handleInterested}
            className="text-purple-600 hover:text-purple-700 transition-colors"
          >
            <Heart size={20} className="group-hover:scale-110 transition-transform" />
          </button>
        )}
      </div>

      {/* Project Description */}
      <div className="mb-4">
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">
          {project.description}
        </p>

        {/* Skills Section */}
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
            <Github size={14} className="mr-2" />
            Required Skills
          </h4>
          <div className="flex flex-wrap gap-2">
            {project.skills_required && project.skills_required.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="skill-tag"
              >
                {skill}
              </span>
            ))}
            {project.skills_required && project.skills_required.length > 4 && (
              <span className="skill-tag bg-gray-100 text-gray-600">
                +{project.skills_required.length - 4} more
              </span>
            )}
          </div>
        </div>

        {/* Creator Info */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">
                {project.creator_name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <p className="font-semibold text-gray-900 text-sm">{project.creator_name}</p>
              <div className="flex items-center text-xs text-gray-500">
                <MapPin size={12} className="mr-1" />
                <span>{project.creator_college}</span>
              </div>
            </div>
          </div>
          
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Link
          to={`/projects/${project.id}`}
          className="flex-1 btn-primary text-sm py-2 px-4 text-center"
        >
          View Project
        </Link>
        
        {user && !isOwner && (
          <>
            <button
              onClick={handleInterested}
              className="btn-success text-sm py-2 px-4 flex items-center space-x-2"
            >
              <Users size={14} />
              <span>Join</span>
            </button>
            <button
              onClick={handleDirectMessage}
              className="btn-secondary text-sm py-2 px-3 flex items-center space-x-2"
              title="Message Owner"
            >
              <MessageCircle size={14} />
            </button>
          </>
        )}
        
        {isOwner && (
          <div className="flex-1 text-center py-2 px-4 text-sm text-green-600 bg-green-50 rounded-lg font-medium">
            Your Project
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
