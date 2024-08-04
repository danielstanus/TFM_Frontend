import React from 'react';
import { Message } from '../types';
import QuestionCard from './QuestionCard';

interface Props {
  messages: Message[];
  isDarkMode: boolean;
}

const MessageList: React.FC<Props> = ({ messages, isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} py-4`}>
      {messages.map((message, index) => (
        <div
          key={index}
          className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'} mb-4`}
        >
          <div
            className={`max-w-[70%] p-3 rounded-lg ${
              message.type === 'user'
                ? isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'
                : isDarkMode ? 'bg-gray-900 text-white'  : 'bg-gray-300 text-white'
            }`}
          >
            {typeof message.content === 'string' ? (
              <p>{message.content}</p>
            ) : (
              message.content.map((question, qIndex) => (
                <QuestionCard key={qIndex} question={question} isDarkMode={isDarkMode} />
              ))
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
