import React, { useState, useContext } from 'react';
import { AuthContext } from '../App';
import ProfileCard from '../components/ProfileCard';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Edit3, Save, X, User, Star, Award, TrendingUp } from 'lucide-react';

const ProfilePage = () => {
  const { user, updateUser } = useContext(AuthContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    college: user?.college || '',
    skills: user?.skills?.join(', ') || '',
    github_link: user?.github_link || ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = {
        ...form,
        skills: form.skills.split(',').map(skill => skill.trim())
      };
      const response = await axios.put('/api/users/profile', updated);
      updateUser(response.data.user);
      toast.success('Profile updated successfully!');
      setEditMode(false);
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update profile';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setForm({
      name: user?.name || '',
      college: user?.college || '',
      skills: user?.skills?.join(', ') || '',
      github_link: user?.github_link || ''
    });
    setEditMode(false);
  };

  return (
    <div className="container-custom py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Profile</h1>
              <p className="text-gray-600">Manage your account and showcase your skills</p>
            </div>
            {!editMode && (
              <button
                onClick={() => setEditMode(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Edit3 size={18} />
                <span>Edit Profile</span>
              </button>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Section */}
          <div className="lg:col-span-2">
            {!editMode ? (
              <div className="card-elevated p-8">
                <ProfileCard user={user} />
              </div>
            ) : (
              <div className="card-elevated p-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">Edit Profile</h2>
                  <button
                    onClick={handleCancel}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="form-label">Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>

                    <div>
                      <label className="form-label">College/University</label>
                      <input
                        type="text"
                        name="college"
                        value={form.college}
                        onChange={handleChange}
                        className="input-field"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="form-label">Skills & Technologies</label>
                    <input
                      type="text"
                      name="skills"
                      value={form.skills}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="React, Python, UI/UX, Machine Learning (comma separated)"
                      required
                    />
                    <p className="text-sm text-gray-500 mt-2">
                      Separate multiple skills with commas
                    </p>
                  </div>

                  <div>
                    <label className="form-label">GitHub Profile</label>
                    <input
                      type="text"
                      name="github_link"
                      value={form.github_link}
                      onChange={handleChange}
                      className="input-field"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>

                  <div className="flex justify-end space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="btn-secondary"
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary flex items-center space-x-2"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Save size={18} />
                          <span>Save Changes</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Stats Sidebar */}
          <div className="space-y-6">
            {/* Profile Stats */}
            <div className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <TrendingUp size={20} className="mr-2 text-purple-600" />
                Profile Stats
              </h3>
              <div className="space-y-4">
                <div className="text-center text-gray-500 py-4">
                  <p className="text-sm">Profile statistics will be available as you engage with the platform</p>
                </div>
              </div>
            </div>

            {/* Profile Completion */}
            <div className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <User size={20} className="mr-2 text-orange-600" />
                Profile Completion
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-600">Overall Progress</span>
                  <span className="font-semibold text-orange-600">85%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: '85%' }}></div>
                </div>
                <div className="text-xs text-gray-500">
                  Add more projects and skills to reach 100%
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="card-elevated p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <Award size={20} className="mr-2 text-yellow-600" />
                Achievements
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center">
                    <Star size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Early Adopter</p>
                    <p className="text-xs text-gray-500">Joined in the first month</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center">
                    <User size={14} className="text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Profile Complete</p>
                    <p className="text-xs text-gray-500">Filled all profile sections</p>
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

export default ProfilePage;
