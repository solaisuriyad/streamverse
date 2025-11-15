import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext'; // Import our new auth hook
import { supabase } from '../supabaseClient'; // Import supabase to handle logout

// Logo component remains the same
const Logo: React.FC = () => (
    // ... (no changes needed inside the Logo component)
);

const Header: React.FC = () => {
  // REMOVED: const [isLoggedIn] = useState(true);
  const { user } = useAuth(); // Get the REAL user from our AuthContext
  const isLoggedIn = !!user; // isLoggedIn is now true only if there is a real user

  const [isProfileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef<HTMLDivElement>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfileMenuOpen(false);
  };

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
                    onClick={handleLogout} // Use the real logout function
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