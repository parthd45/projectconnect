import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../App';
import ProfileCard from '../components/ProfileCard';
import axios from 'axios';
import toast from 'react-hot-toast';

const ProjectDetailPage = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [project, setProject] = useState(null);
  const [connections, setConnections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRequestors, setShowRequestors] = useState(false);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/projects/${id}`);
      setProject(response.data.project);
      setConnections(response.data.connections);
    } catch (error) {
      toast.error('Failed to load project details');
    } finally {
      setLoading(false);
    }
  };

  const handleInterested = async () => {
    if (!user) {
      toast.error('Please login to show interest');
      return;
    }
    try {
      await axios.post(`/projects/${id}/connect`);
      toast.success('Interest sent successfully!');
      fetchProject();
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send interest';
      toast.error(message);
    }
  };

  const handleConnectionStatus = async (connectionId, status) => {
    try {
      await axios.put(`/projects/connections/${connectionId}`, { status });
      toast.success(`Connection ${status}`);
      fetchProject();
    } catch (error) {
      toast.error('Failed to update connection status');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Project not found</h3>
        <p className="text-gray-600">The project you are looking for does not exist.</p>
      </div>
    );
  }

  const isOwner = user && user.id === project.creator_id;

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="card p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
        <p className="text-gray-700 mb-4">{project.description}</p>
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-600 mb-2">Skills Needed:</h4>
          <div className="flex flex-wrap gap-2">
            {project.skills_needed && project.skills_needed.map((skill, index) => (
              <span key={index} className="skill-tag">
                {skill}
              </span>
            ))}
          </div>
        </div>
        <div className="border-t pt-4">
          <ProfileCard user={{
            name: project.creator_name,
            college: project.creator_college,
            email: project.creator_email,
            skills: project.creator_skills,
            github_link: project.creator_github,
            created_at: project.created_at
          }} />
        </div>
        {!isOwner && user && (
          <div className="mt-6">
            <button
              className="btn-primary"
              onClick={handleInterested}
            >
              I'm Interested
            </button>
          </div>
        )}
        {!user && (
          <div className="mt-6">
            <p className="text-sm text-gray-500">Login to request to connect with the project owner.</p>
          </div>
        )}
      </div>

      {/* Connection Requests (for owner) */}
      {isOwner && (
        <div className="card p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Connection Requests</h2>
            <button
              className="btn-secondary"
              onClick={() => setShowRequestors(!showRequestors)}
            >
              {showRequestors ? 'Hide' : 'Show'} Requests
            </button>
          </div>
          {showRequestors && (
            <div className="space-y-4">
              {connections.length === 0 ? (
                <p className="text-gray-500">No connection requests yet.</p>
              ) : (
                connections.map((conn) => (
                  <div key={conn.id} className="border rounded-lg p-4 flex items-center justify-between">
                    <ProfileCard user={{
                      name: conn.requester_name,
                      college: conn.requester_college,
                      email: conn.requester_email,
                      skills: conn.requester_skills,
                      github_link: conn.requester_github,
                      created_at: conn.created_at
                    }} />
                    <div className="flex flex-col space-y-2 ml-4">
                      {conn.status === 'pending' ? (
                        <>
                          <button
                            className="btn-success"
                            onClick={() => handleConnectionStatus(conn.id, 'approved')}
                          >
                            Approve
                          </button>
                          <button
                            className="btn-danger"
                            onClick={() => handleConnectionStatus(conn.id, 'denied')}
                          >
                            Deny
                          </button>
                        </>
                      ) : (
                        <span className={`text-sm font-medium ${conn.status === 'approved' ? 'text-green-600' : 'text-red-600'}`}>
                          {conn.status.charAt(0).toUpperCase() + conn.status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProjectDetailPage;
