import React, { useContext, useState } from 'react';
import { AuthContext } from '../App';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, LogOut, User, Menu, X, Bell, Search } from 'lucide-react';

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <BookOpen size={24} className="text-white" />
            </div>
            <div>
              <span className="text-xl font-bold text-gray-900">StudentConnect</span>
              <div className="text-xs text-gray-500 -mt-1">Learning Together</div>
            </div>
          </Link>

          {/* Navigation Links - Desktop */}
          {user && (
            <div className="hidden md:flex items-center space-x-8">
              <Link 
                to="/" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Dashboard
              </Link>
              <Link 
                to="/projects" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Projects
              </Link>
              <Link 
                to="/users" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Students
              </Link>
              <Link 
                to="/messages" 
                className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
              >
                Messages
              </Link>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* Search Button */}
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors">
                  <Search size={20} />
                </button>
                
                {/* Notifications */}
                <button className="p-2 text-gray-500 hover:text-gray-700 transition-colors relative">
                  <Bell size={20} />
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    3
                  </span>
                </button>

                {/* User Menu - Desktop */}
                <div className="hidden md:flex items-center space-x-3">
                  <Link 
                    to="/profile" 
                    className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                      <User size={16} className="text-white" />
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </Link>
                  <button 
                    onClick={handleLogout}
                    className="p-2 text-gray-500 hover:text-red-600 transition-colors"
                    title="Logout"
                  >
                    <LogOut size={20} />
                  </button>
                </div>

                {/* Mobile Menu Button */}
                <button 
                  onClick={toggleMenu}
                  className="md:hidden p-2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-medium transition-colors"
                >
                  Sign In
                </Link>
                <Link 
                  to="/signup" 
                  className="btn-primary"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {user && isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col space-y-3">
              <Link 
                to="/" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link 
                to="/projects" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Projects
              </Link>
              <Link 
                to="/users" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Students
              </Link>
              <Link 
                to="/messages" 
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Messages
              </Link>
              
              {/* User Profile - Mobile */}
              <div className="px-4 py-3 border-t border-gray-200 mt-3">
                <Link 
                  to="/profile" 
                  className="flex items-center space-x-3 mb-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                    <User size={20} className="text-white" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-900">{user.name}</div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </div>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full text-left"
                >
                  <LogOut size={16} />
                  <span>Sign Out</span>
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
