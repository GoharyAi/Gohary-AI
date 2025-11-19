import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-50 dark:bg-black border-t border-gray-200 dark:border-white/10 py-6 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 dark:text-gray-500">
        <div className="flex items-center space-x-2 mb-4 md:mb-0">
           <span className="uppercase tracking-widest font-bold text-black dark:text-white">Gohary AI Studio</span>
        </div>
        <div className="flex flex-col items-center md:items-end">
          <p className="mb-1">
            &copy; {new Date().getFullYear()} All Rights Reserved.
          </p>
          <p className="font-bold text-gray-600 dark:text-gray-400 tracking-wide">
            Concept & Design by <span className="text-black dark:text-white">Ahmed Gohary</span>
          </p>
        </div>
      </div>
    </footer>
  );
};