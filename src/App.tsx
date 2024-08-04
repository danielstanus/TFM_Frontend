import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';
import ChatInterface from './components/ChatInterface';
import AuthScreen from './components/AuthScreen';
import { User } from './types';

const App: React.FC = () => {

  const [user, setUser] = useState<User | null>(null);

  const handleAuthSuccess = (authenticatedUser: User) => {
    setUser(authenticatedUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  return (
    <div className="App">
    {user ? (
      <ChatInterface user={user} onLogout={handleLogout} />
    ) : (
      <AuthScreen onAuthSuccess={handleAuthSuccess} />
    )}
    </div>
  );
};

export default App;
