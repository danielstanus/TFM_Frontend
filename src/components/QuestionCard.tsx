import React from 'react';
import { Question } from '../types';

interface Props {
  question: Question;
  isDarkMode: boolean;
}

const QuestionCard: React.FC<Props> = ({ question, isDarkMode }) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-300 text-gray-900'} rounded-lg p-4 mb-4`}>
      <h3 className="font-bold mb-2 text-left">{question.question}</h3> {/* Alineación a la izquierda */}
      <ul className="list-none pl-0 text-left"> {/* Alineación a la izquierda */}
        {question.options.map((option, index) => (
          <li 
            key={index} 
            className={`${option === question.correctAnswer ? (isDarkMode ? 'text-green-600 font-bold ' : 'text-green-500 font-bold ') : ''}`}
          >
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionCard;
