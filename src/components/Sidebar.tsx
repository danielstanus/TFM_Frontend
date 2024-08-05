import React, { useEffect, useState } from 'react';
import { FaSignOutAlt } from 'react-icons/fa';
import { PlusIcon } from '@heroicons/react/24/solid';
import { ChatDB } from '../types';
import ToggleSidebarButton from './ToggleSidebarButton';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isDarkMode: boolean;
  onLogout: () => void;
  username: string;
  userId: string;
  chats: ChatDB[];
  token: string;
  onCreateChat: () => Promise<string | null>;
  onSelectChat: (chatId: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  toggleSidebar,
  isDarkMode,
  onLogout,
  username,
  userId,
  chats,
  token,
  onCreateChat,
  onSelectChat
}) => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768); // Considera como móvil si el ancho es menor a 768px
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  const handleChatSelect = (chatId: string) => {
    onSelectChat(chatId);
    if (isMobile) {
      toggleSidebar();
    }
  };

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text;
    let truncated = text.substr(0, maxLength);
    let lastSpaceIndex = truncated.lastIndexOf(' ');
    if (lastSpaceIndex > 0) {
      truncated = truncated.substr(0, lastSpaceIndex);
    }
    return truncated + '...';
  };

  const buttonClasses = isDarkMode
    ? "bg-gray-900 text-white hover:bg-gray-700"
    : "bg-gray-300 text-gray-800 hover:bg-gray-200";

  return (
    <div
      className={`${
        isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-800'
      } h-full transition-all duration-300 ease-in-out ${
        isOpen ? 'w-64' : 'w-0'
      } flex-shrink-0 overflow-hidden flex flex-col`}
    >
      <div className={`flex items-center justify-between p-3 border-b ${ isDarkMode ? 'border-gray-700' : ' border-gray-400'}`} >
        {isOpen && (
          <div id="toggle-sidebar-button">
            <ToggleSidebarButton
              isOpen={isOpen}
              toggleSidebar={toggleSidebar}
              isDarkMode={isDarkMode}
            />
          </div>
        )}
        <Tooltip anchorSelect="#toggle-sidebar-button" place="bottom-start" content={isOpen ? "Cerrar barra lateral" : "Abrir barra lateral"} />
        <p className="text-lg font-semibold truncate">{username}</p>
        <button
          id="add-chat-button"
          onClick={onCreateChat}
          className={`${buttonClasses} p-2 rounded-full focus:outline-none transition-colors duration-200 z-50`}
        >
          <PlusIcon className="h-6 w-6" />
        </button>
      
        <Tooltip anchorSelect="#add-chat-button" content="Nuevo chat" />
      </div>
      
      <div className="flex-grow overflow-y-auto">
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">Chats anteriores:</h3>
          <ul className="space-y-2">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <li 
                  key={chat.id} 
                  onClick={() => handleChatSelect(chat.id)}
                  className={`py-2 px-3 rounded cursor-pointer text-left ${
                    isDarkMode 
                      ? 'hover:bg-gray-800 focus:bg-gray-800' 
                      : 'hover:bg-gray-200 focus:bg-gray-200'
                  } transition-colors duration-200`}
                >
                  {truncateText(chat.userText, 50)}
                </li>
              ))
            ) : (
              <li className="py-2 px-3 text-left">No hay chats anteriores</li>
            )}
          </ul>
        </div>
      </div>
      
      <div className={`p-4 border-t ${ isDarkMode ? 'border-gray-700' : ' border-gray-400'}`} >
        <button
          id="logout-button"
          onClick={onLogout}
          className={`${buttonClasses} flex items-center justify-center w-full py-2 px-4 rounded focus:outline-none transition-colors duration-200`}
        >
          <FaSignOutAlt className="mr-2 h-5 w-5" />
          Cerrar sesión
        </button>
        <Tooltip anchorSelect="#logout-button" content="Cerrar sesión" data-tooltip-place="top" />
      </div>
    </div>
  );
};

export default Sidebar;