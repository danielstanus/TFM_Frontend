import React from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/solid';

interface ToggleSidebarButtonProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
}

const ToggleSidebarButton: React.FC<ToggleSidebarButtonProps> = ({ isOpen, toggleSidebar, isDarkMode }) => {
  const buttonClasses = 
  isDarkMode ?  
      isOpen ? "bg-gray-900 text-white hover:bg-gray-700" : "bg-gray-800 text-white hover:bg-gray-600"
    : isOpen ? "bg-gray-300 text-gray-800 hover:bg-gray-200" : "bg-gray-50 text-gray-800 hover:bg-gray-300";

  return (
    <button
      onClick={toggleSidebar}
      className={`${buttonClasses} p-3 rounded-full focus:outline-none transition-colors duration-200 z-50`}
    >
      {isOpen ? (
        // <XMarkIcon className="h-6 w-6" />
         <Bars3Icon className="h-6 w-6" />
      ) : (
        <Bars3Icon className="h-6 w-6" />
      )}
    </button>
  );
};

export default ToggleSidebarButton;