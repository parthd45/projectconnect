import React, { useContext, useState } from 'react';
import { AuthContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { LogOut, User, Menu, X, Search, Bell, Plus, Sparkles } from 'lucide-react';
import MessageNotificationDropdown from './MessageNotificationDropdown';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 backdrop-blur-lg border-b border-purple-500/20 sticky top-0 z-50 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-pink-500 via-purple-500 to-blue-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                  <Sparkles size={20} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
              </div>
              <div>
                <span className="text-xl font-bold bg-gradient-to-r from-white via-purple-100 to-blue-100 bg-clip-text text-transparent">
                  ProjectConnect
                </span>
                <div className="text-xs text-purple-200/80 -mt-1">Next-Gen Collaboration</div>
              </div>
            </Link>

            {/* Search Bar */}
            {user && (
              <div className="hidden md:flex relative ml-8">
                <div className="relative">
                  <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-purple-300" />
                  <input
                    type="text"
                    placeholder="Search anything..."
                    className="bg-white/10 border border-purple-300/30 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-purple-200/70 focus:bg-white/20 focus:border-purple-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 w-80 backdrop-blur-sm transition-all duration-300"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Navigation Links - Desktop */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/dashboard" 
                className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                Dashboard
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link 
                to="/projects" 
                className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                Projects
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
              <Link 
                to="/messages" 
                className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105 relative group"
              >
                Messages
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></div>
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Create New Button */}
                <div className="hidden md:flex relative">
                  <button className="flex items-center space-x-2 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-xl px-4 py-2 text-sm font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105">
                    <Plus size={16} />
                    <span>Create</span>
                  </button>
                </div>
                
                {/* Message Notifications */}
                <MessageNotificationDropdown />

                {/* Notifications */}
                <button className="text-white/90 hover:text-white transition-all duration-300 hover:scale-110 relative">
                  <Bell size={20} />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-red-400 to-pink-500 rounded-full animate-ping"></div>
                </button>

                {/* User Menu - Desktop */}
                <div className="hidden md:flex items-center space-x-3">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 group"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-purple-500/50 transition-all duration-300 group-hover:scale-110">
                      <User size={16} className="text-white" />
                    </div>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="text-white/90 hover:text-red-400 transition-all duration-300 hover:scale-110"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={toggleMenu}
                  className="md:hidden text-white/90 hover:text-white transition-all duration-300 hover:scale-110"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-white/90 hover:text-white font-medium transition-all duration-300 hover:scale-105"
                >
                  Sign in
                </Link>
                <Link 
                  to="/signup" 
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-2 rounded-xl font-medium transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:scale-105"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-purple-300/20">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/dashboard" 
                className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/projects" 
                className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/messages" 
                className="px-4 py-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
                onClick={() => setIsMenuOpen(false)}
              >
                Messages
              </Link>
              
              {/* User Profile - Mobile */}
              <div className="px-4 py-3 border-t border-purple-300/20 mt-3">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-pink-400 via-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-white">{user.name}</div>
                    <div className="text-sm text-purple-200/80">{user.email}</div>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-all duration-300 w-full text-left"
                >
                  <LogOut size={16} />
                  <span>Sign out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
