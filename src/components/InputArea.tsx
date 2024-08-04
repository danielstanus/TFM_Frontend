import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';


interface Props {
  onSendMessage: (message: string, responseCount: number, chatId: string) => void;
  isDarkMode: boolean;
  isLoading: boolean;
  chatId: string | null;
  createChat: () => Promise<string | null>;
}

const InputArea: React.FC<Props> = ({ onSendMessage, isDarkMode, isLoading, chatId, createChat }) => {
  const [input, setInput] = useState('');
  const [responseCount, setResponseCount] = useState(3);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [input]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      let currentChatId = chatId;
      
      if (!currentChatId) {
        currentChatId = await createChat();
      }
      
      if (currentChatId) {
        onSendMessage(input, responseCount, currentChatId);
        setInput('');
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const formStyle = {
    borderRadius: '2.25rem',
    overflow: 'hidden'
  };

  const textareaStyle = {
    borderRadius: '2.25rem',
    minHeight: '44px',
    maxHeight: '200px'
  };

  const buttonClasses = isDarkMode
    ? "bg-gray-600 text-white hover:bg-gray-700"
    : "bg-gray-200 text-gray-900 hover:bg-gray-300";

  return (
    <form onSubmit={handleSubmit} className={`${isDarkMode ? 'bg-gray-600' : 'bg-gray-200'}`} style={formStyle}>
      <div className="flex items-end">
        <select
          value={responseCount}
          onChange={(e) => setResponseCount(Number(e.target.value))}
          className={`px-2 p-3 rounded-lg focus:outline-none ml-2 ${
            isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-gray-900'
          }`}
        >
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <option key={num} value={num}>
              {num} {num === 1 ? 'pregunta' : 'preguntas'}
            </option>
          ))}
        </select>
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className={`flex-1 p-3 focus:outline-none resize-none ${
            isDarkMode ? 'bg-gray-600 text-white' : 'bg-gray-200 text-black'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          placeholder="Ingrese el texto para generar preguntas..."
          rows={1}
          style={textareaStyle}
          disabled={isLoading}
        />
        <button
          type="submit"
          id="send-button"
          className={`${buttonClasses} p-3 rounded-full mx-1 focus:outline-none transition-colors duration-200 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : '' 
          } `}
          disabled={isLoading}
          aria-label="Enviar mensaje"
        >
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>

      <Tooltip anchorSelect="#send-button" 
      content="Enviar mensaje" 
      data-tooltip-place="right" />

    </form>
  );
};

export default InputArea;