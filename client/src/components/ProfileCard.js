import React from 'react';
import { User, MapPin, Github, Calendar } from 'lucide-react';

const ProfileCard = ({ user, showActions = false, onMessage, onViewProfile }) => {
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="card p-6">
      {/* Profile Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            <User size={24} className="text-blue-600" />
          </div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900">{user.name}</h3>
            {user.college && (
              <div className="flex items-center text-gray-600 mt-1">
                <MapPin size={14} className="mr-1" />
                <span className="text-sm">{user.college}</span>
              </div>
            )}
            <div className="flex items-center text-gray-500 mt-1">
              <Calendar size={14} className="mr-1" />
              <span className="text-xs">Joined {formatDate(user.created_at)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && (
          <div className="flex space-x-2">
            {onMessage && (
              <button
                onClick={() => onMessage(user.id)}
                className="btn-primary text-sm"
              >
                Message
              </button>
            )}
            {onViewProfile && (
              <button
                onClick={() => onViewProfile(user.id)}
                className="btn-secondary text-sm"
              >
                View Profile
              </button>
            )}
          </div>
        )}
      </div>

      {/* Email */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          <span className="font-medium">Email:</span> {user.email}
        </p>
      </div>

      {/* Skills */}
      {user.skills && user.skills.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Skills:</h4>
          <div className="flex flex-wrap gap-2">
            {user.skills.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* GitHub Link */}
      {user.github_link && (
        <div className="border-t pt-4">
          <a
            href={user.github_link.startsWith('http') ? user.github_link : `https://${user.github_link}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Github size={16} />
            <span className="text-sm">View GitHub Profile</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileCard;
