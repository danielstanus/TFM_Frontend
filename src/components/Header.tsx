import React, { useState, useEffect } from 'react';
import ToggleSidebarButton from './ToggleSidebarButton';
import ThemeToggle from './ThemeToggle';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface HeaderProps {
  isDarkMode: boolean;
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

const Header: React.FC<HeaderProps> = ({ isDarkMode, isSidebarOpen, toggleSidebar }) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(true);
  const bgColor = isDarkMode ? 'bg-gray-800 text-white' : 'bg-gray-50 text-gray-900';
  const textColor = isDarkMode ? 'text-white' : 'text-black';

  useEffect(() => {
    if (isSidebarOpen) {
      setIsTooltipVisible(false);
    }
  }, [isSidebarOpen]);

  return (
    <header
      className={`${bgColor} ${textColor} py-3 px-3 fixed top-0 left-0 right-0 z-40 flex items-center font-sans transition-transform duration-300 ease-in-out`}
      style={{ marginLeft: isSidebarOpen ? '256px' : '0' }} // Ajusta este valor según el ancho del sidebar
    >
      <div className="flex-none">
        {!isSidebarOpen && (
          <div id="toggle-sidebar-button-show">
            <ToggleSidebarButton
              isOpen={isSidebarOpen}
              toggleSidebar={() => {
                toggleSidebar();
                setIsTooltipVisible(true);
              }}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
        {isTooltipVisible && (
          <Tooltip anchorSelect="#toggle-sidebar-button-show"
            place="right" content="Abrir barra lateral"
          />
        )}
      </div>
      <h1 className="flex-grow text-2xl font-light text-center tracking-wide">
        Quiz AI
      </h1>
      {/* <div className="flex-none">
        <div id="toggle-theme-button">
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={() => { }} />
        </div>
      </div> */}
    </header>
  );
};

export default Header;
