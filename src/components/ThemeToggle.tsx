import React from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/24/solid';

interface ThemeToggleProps {
  isDarkMode: boolean;
  toggleTheme: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, toggleTheme }) => {
  const buttonClasses = isDarkMode
    ? "bg-gray-800 text-white hover:bg-gray-600"
    : "bg-gray-50 text-gray-800 hover:bg-gray-300";

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-full transition-colors duration-200 ${buttonClasses}`}
    >
      {isDarkMode ? (
        <SunIcon className="h-5 w-5" aria-hidden="true" />
      ) : (
        <MoonIcon className="h-5 w-5" aria-hidden="true" />
      )}
    </button>
  );
};

export default ThemeToggle;