import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Logo: React.FC = () => (
  <div className="flex items-center space-x-3" aria-label="StreamVerse Home">
    <div className="w-10 h-10">
       <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="logo-gradient" x1="0.5" y1="0" x2="0.5" y2="1">
            <stop stopColor="#3B82F6" />
            <stop offset="1" stopColor="#818CF8" />
          </linearGradient>
        </defs>
        <path d="M49.4313 18.5395C45.1924 14.2827 38.9026 12 32 12C21.5066 12 13.0132 20.4934 13.0132 31V33C13.0132 36.3137 15.6995 39 19.0132 39H25L32 47L39 39H44.9868C48.3005 39 50.9868 36.3137 50.9868 33V31C50.9868 26.177 49.4313 22.0645 46.9605 18.5395" fill="white"/>
        <path d="M14.5687 45.4605C18.8076 49.7173 25.0974 52 32 52C42.4934 52 50.9868 43.5066 50.9868 33V31C50.9868 27.6863 48.3005 25 44.9868 25H39L32 17L25 25H19.0132C15.6995 25 13.0132 27.6863 13.0132 31V33C13.0132 37.823 14.5687 41.9355 17.0395 45.4605" fill="url(#logo-gradient)"/>
      </svg>
    </div>
    <span className="text-2xl font-bold text-white">Stream<span className="text-blue-400">Verse</span></span>
  </div>
);

const Header: React.FC = () => {
  const [isLoggedIn] = useState(true); // Mocked to true to show profile
  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setProfileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);


  return (
    <header className="bg-gray-800 bg-opacity-80 backdrop-blur-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/">
          <Logo />
        </Link>
        <div className="hidden md:flex items-center space-x-6 text-gray-300">
          <Link to="/" className="hover:text-blue-400 transition-colors duration-300">Home</Link>
          <Link to="/movies" className="hover:text-blue-400 transition-colors duration-300">Movies</Link>
          <Link to="/tv-shows" className="hover:text-blue-400 transition-colors duration-300">TV Shows</Link>
        </div>
        <div className="flex items-center space-x-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="bg-gray-700 text-white rounded-full py-2 px-4 w-40 md:w-64 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300"
            />
          </div>
          {isLoggedIn ? (
            <div className="relative" ref={profileMenuRef}>
              <button
                onClick={() => setProfileMenuOpen(!isProfileMenuOpen)}
                className="w-10 h-10 bg-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-400 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 text-white">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z" clipRule="evenodd" />
                </svg>
              </button>
              {isProfileMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-700 rounded-md shadow-lg py-1 z-50 animate-fade-in-down">
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                   <a
                    href="#"
                    className="block px-4 py-2 text-sm text-gray-200 hover:bg-gray-600"
                    onClick={() => setProfileMenuOpen(false)}
                  >
                    Settings
                  </a>
                  <div className="border-t border-gray-600 my-1"></div>
                  <a
                    href="#"
                    className="block px-4 py-2 text-sm text-red-400 hover:bg-gray-600"
                    onClick={() => {
                        // Handle logout logic
                        setProfileMenuOpen(false);
                    }}
                  >
                    Logout
                  </a>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/login" className="text-gray-300 hover:text-white transition-colors duration-300">Login</Link>
              <Link to="/signup" className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-600 transition-colors duration-300">
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;