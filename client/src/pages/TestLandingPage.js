import React from 'react';
import { Link } from 'react-router-dom';
import { Rocket, ArrowRight } from 'lucide-react';

const TestLandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-8">
            Welcome to
            <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ProjectConnect
            </span>
          </h1>
          <p className="text-xl text-slate-300 mb-8 max-w-2xl">
            Connect with talented creators worldwide and build amazing projects together.
          </p>
          <div className="flex space-x-4 justify-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-4 px-8 rounded-2xl text-lg hover:scale-105 transition-all duration-300 flex items-center"
            >
              <Rocket size={24} className="mr-3" />
              Get Started
              <ArrowRight size={20} className="ml-3" />
            </Link>
            <Link
              to="/login"
              className="bg-white/10 backdrop-blur-lg border border-white/20 text-white font-semibold py-4 px-8 rounded-2xl text-lg hover:bg-white/20 transition-all duration-300"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestLandingPage;
