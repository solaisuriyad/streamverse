
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 mt-12">
      <div className="container mx-auto px-4 py-6 text-center text-gray-400">
        <p>&copy; {new Date().getFullYear()} StreamVerse. All Rights Reserved.</p>
        <p className="text-sm mt-2">This is a fictional service for demonstration purposes.</p>
      </div>
    </footer>
  );
};

export default Footer;
