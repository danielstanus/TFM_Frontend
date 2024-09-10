import React, { useState, useRef, useEffect } from 'react';
import MessageList from './MessageList';
import InputArea from './InputArea';
import Sidebar from './Sidebar';
import Header from './Header';
import ThemeToggle from './ThemeToggle';
import LoadingSpinner from './LoadingSpinner';
import { Message, User, MessageDB, ChatDB,Question } from '../types';
import { generateQuestions, saveMessage, getMessages, createChat, getChats } from '../services/api';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Tooltip } from 'react-tooltip';
import 'react-tooltip/dist/react-tooltip.css';

interface ChatInterfaceProps {
  user: User;
  onLogout: () => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ user, onLogout }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chats, setChats] = useState<ChatDB[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchMessages = async (chatId: string) => {
    try {
      const chatMessages = await getMessages(user.id, chatId, user.token);
      
      if (chatMessages.length > 0 && chatMessages[0].userId === "0") {
        onLogout();
        return;
      }
      
      if (chatMessages.length > 0) {

      setMessages(chatMessages.flatMap(msg => {
        const messages: Message[] = [];
        if (msg.userText) {
          messages.push({ type: 'user', content: msg.userText });
        }
        if (msg.assistantText) {
          try {
            const parsedAssistantText = JSON.parse(msg.assistantText) as Question[];
            messages.push({ 
              type: 'assistant', 
              content: parsedAssistantText
            });
          } catch (error) {
            console.error('Error parsing assistantText:', error);
            messages.push({ type: 'assistant', content: msg.assistantText });
          }
        }
        return messages;
      }));

      }

    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Error al obtener los mensajes. Por favor, intenta de nuevo.');
    }
  };

  const fetchChats = async () => {  
    try {
      const userChats = await getChats(user.id, user.token);
      
      console.log('userChats', userChats);
      console.log('userChats', userChats[0]);

      if (userChats.length > 0 && userChats[0].id === "0") {
        onLogout();
        return;
      }   
      
      if (userChats.length > 0) {
        setChats(userChats);
      }
     
    } catch (error) {
      console.error('Error fetching chats:', error);
      toast.error('Error al obtener los chats. Por favor, intenta de nuevo.');
    }
  };

  useEffect(scrollToBottom, [messages]);

  useEffect(() => {
    fetchChats();
  }, [user.id]);

  const handleSendMessage = async (content: string, responseCount: number, chatId: string) => {
    const userMessage: Message = { type: 'user', content };
    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setChatId(chatId);

    try {
      if (!chatId) {
        console.error('No se ha establecido el chatId');
        throw new Error('Chat ID no está disponible');
      }

      const generatedQuestions = await generateQuestions(content, responseCount, chatId);
      const assistantMessage: Message = { type: 'assistant', content: generatedQuestions };
      setMessages(prev => [...prev, assistantMessage]);

      const questionsString = JSON.stringify(generatedQuestions);
      const messageDb: MessageDB = {chatId: chatId, userId: user.id, userText: content, assistantText: questionsString, createdAt: new Date() };
      
      console.log('messageDb', messageDb);

      await saveMessage(messageDb, user.token);
      
      await fetchChats();

    } catch (error) {
      console.error('Error:', error);
      toast.error('Lo siento, hubo un error al generar o guardar las preguntas. Por favor, intenta de nuevo.');
      const errorMessage: Message = { type: 'assistant', content: 'Lo siento, hubo un error al generar o guardar las preguntas.' };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateChat = async () => {
    try {
      const newChatId = await createChat(user.id, user.token);
      
      if (newChatId === "0") {
        onLogout();
        return null;
      }
      
      setChatId(newChatId);
      setMessages([]); // Clear the messages when a new chat is created
      await fetchChats(); // Fetch updated chats list
      // console.log('Nuevo chat creado con ID:', newChatId);

      return newChatId;
    } catch (error) {
      console.error('Error al crear el chat:', error);
      toast.error('Error al crear un nuevo chat. Por favor, intenta de nuevo.');
      return null;
    }
  };

  const handleSelectChat = async (selectedChatId: string) => {
    setChatId(selectedChatId);
    await fetchMessages(selectedChatId);
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };


  return (
    <div className={`flex h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      
      {/* Sidebar */}
      <Sidebar
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
        isDarkMode={isDarkMode}
        onLogout={onLogout}
        username={user.name}
        userId={user.id}
        chats={chats}
        token={user.token}
        onCreateChat={handleCreateChat}
        onSelectChat={handleSelectChat}
      />

      {/* Main content area */}
      <div className={`flex flex-col flex-grow transition-all duration-300 ease-in-out ${isSidebarOpen ? 'ml-0' : 'ml-0'}`}>
        {/* Header */}
        <Header 
          isDarkMode={isDarkMode} 
          toggleSidebar={toggleSidebar}
          isSidebarOpen={isSidebarOpen}
        />

        {/* Messages area */}
        <div className={`flex-grow overflow-y-auto p-6 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
          <div className="max-w-4xl mx-auto p-8">
            <MessageList messages={messages} isDarkMode={isDarkMode} />
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input area */}
        <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'} ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <div className="max-w-4xl mx-auto pb-1">
            {isLoading && (
              <div className="mb-2">
                <LoadingSpinner size="small" />
              </div>
            )}
            <InputArea
              onSendMessage={handleSendMessage}
              isDarkMode={isDarkMode}
              isLoading={isLoading}
              chatId={chatId}
              createChat={handleCreateChat}
            />
            <p className={`text-xs px-4 py-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
              Quiz AI puede generar preguntas incorrectas. Por favor, verifique la precisión de las preguntas generadas.
            </p>
          </div>
        </div>
      </div>

      {/* Fixed position theme toggle */}
      <div className="fixed top-3 right-3 z-50" id="toggle-theme-button">
        <ThemeToggle isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} />
      </div>

     
      <Tooltip 
        anchorSelect="#toggle-theme-button" 
        place="bottom" 
        content={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
        offset={50}
        />
      
    </div>
  );
};

export default ChatInterface;

