
export interface Message {
    type: 'user' | 'assistant';
    content: string | Question[];
}

export interface User {
  id: string;
  token: string;
  name: string;
  email: string;
  chatId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}


export interface Question {
  id?: string;
  text: string;
  question: string;
  options: string[];
  correctAnswer: string;
}


export interface MessageDB {
  id?: string; 
  chatId: string;
  userId: string;
  userText: string;
  assistantText: string;
  createdAt: Date;
}


export interface ChatDB {
  id: string; 
  chatId?: string;
  userText: string;
}

