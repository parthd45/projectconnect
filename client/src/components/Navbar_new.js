import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../App';
import { User, LogOut, Home, UserPlus, LogIn, Search, Menu, X, Bell, Settings, Code2 } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="bg-slate-900/80 backdrop-blur-xl border-b border-slate-700/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                  <Code2 size={20} className="text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-green-400 to-blue-500 rounded-full animate-pulse"></div>
              </div>
              <span className="text-xl font-bold text-white tracking-tight">
                Project<span className="text-transparent bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text">Connect</span>
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              <Link
                to="/"
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                  isActive('/') 
                    ? 'text-white bg-white/10 border border-white/20' 
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <Home size={18} />
                <span>{user ? 'Projects' : 'Home'}</span>
              </Link>
              
              {user && (
                <>
                  <Link
                    to="/profile"
                    className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 flex items-center space-x-2 ${
                      isActive('/profile') 
                        ? 'text-white bg-white/10 border border-white/20' 
                        : 'text-slate-300 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <User size={18} />
                    <span>Profile</span>
                  </Link>
                  <div className="relative">
                    <Bell size={20} className="text-slate-300 hover:text-white cursor-pointer transition-colors mx-3" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-bounce"></div>
                  </div>
                </>
              )}
            </div>

            {/* Search Bar */}
            {user && (
              <div className="hidden lg:flex items-center flex-1 max-w-md mx-8">
                <div className="relative w-full">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search projects..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>
            )}

            {/* Right Side Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  {/* User Avatar and Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center space-x-3 bg-white/5 backdrop-blur-md rounded-lg p-2 hover:bg-white/10 transition-all duration-300 group border border-white/10"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="hidden sm:block text-left">
                        <p className="text-white font-medium text-sm">{user.name}</p>
                        <p className="text-slate-400 text-xs">{user.college}</p>
                      </div>
                    </button>
                    
                    {/* Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-slate-800/90 backdrop-blur-xl rounded-xl shadow-2xl border border-slate-700/50 py-2 z-50">
                        <Link
                          to="/profile"
                          className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <User size={16} className="mr-3" />
                          View Profile
                        </Link>
                        <Link
                          to="/settings"
                          className="flex items-center px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
                          onClick={() => setIsProfileOpen(false)}
                        >
                          <Settings size={16} className="mr-3" />
                          Settings
                        </Link>
                        <hr className="border-slate-700/50 my-2" />
                        <button
                          onClick={() => {
                            logout();
                            setIsProfileOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                        >
                          <LogOut size={16} className="mr-3" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-3">
                  <Link
                    to="/login"
                    className="text-slate-300 hover:text-white font-medium px-4 py-2 rounded-lg transition-all duration-300 hover:bg-white/5"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </div>
              )}

              {/* Mobile menu button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden text-slate-300 hover:text-white p-2 rounded-lg hover:bg-white/5 transition-all duration-300"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-slate-800/90 backdrop-blur-xl border-t border-slate-700/50">
            <div className="px-4 py-4 space-y-3">
              {/* Mobile Search */}
              {user && (
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-10 pr-4 py-2 bg-white/5 backdrop-blur-md border border-white/10 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                  />
                </div>
              )}
              
              <Link
                to="/"
                className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                <Home size={18} />
                <span>{user ? 'Projects' : 'Home'}</span>
              </Link>
              
              {user && (
                <Link
                  to="/profile"
                  className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User size={18} />
                  <span>Profile</span>
                </Link>
              )}
              
              {!user && (
                <>
                  <Link
                    to="/login"
                    className="flex items-center space-x-3 text-slate-300 hover:text-white px-4 py-3 rounded-lg hover:bg-white/5 transition-all duration-300 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <LogIn size={18} />
                    <span>Sign In</span>
                  </Link>
                  <Link
                    to="/signup"
                    className="flex items-center space-x-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-lg font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <UserPlus size={18} />
                    <span>Get Started</span>
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      {/* Overlay for profile dropdown */}
      {isProfileOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsProfileOpen(false)}
        ></div>
      )}
    </>
  );
};

export default Navbar;
