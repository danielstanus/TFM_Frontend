import axios from 'axios';
import { Question, User, LoginCredentials, RegisterCredentials, MessageDB, ChatDB } from '../types';

// const API_URL_LOCALHOST = 'http://localhost:5000/api';
const API_URL = 'https://tfm-backend-topaz.vercel.app/api';



// Creamos una instancia de axios con la configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Función auxiliar para manejar errores
const handleApiError = (error: any) => {
  console.error('API error:', error);
  throw error;
};

// Función para añadir el token a los encabezados de una solicitud
const setAuthToken = (token: string) => {
  if (token) {
    api.defaults.headers.common['x-auth-token'] = token;
  } else {
    delete api.defaults.headers.common['x-auth-token'];
  }
};


// Función para iniciar sesión y obtener un token
export const login = async (credentials: LoginCredentials): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/login', credentials);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const register = async (credentials: RegisterCredentials): Promise<User> => {
  try {
    const response = await api.post<User>('/auth/register', credentials);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const generateQuestions = async (text: string, numQuestions: number, chatId: string): Promise<Question[]> => {
  try {
    const response = await api.post<Question[]>('/questions/generate', { text, numQuestions,chatId  });
    return response.data;

    // const exampleQuestion: Question = {
    //   id: '123456', // Este campo es opcional
    //   text: 'Pregunta sobre la visita de Daniel y sus amigos',
    //   question: '¿Con quién visitó Daniel?',
    //   options: [
    //     'A) Solamente con él',
    //     'B) Con su familia',
    //     'C) Con sus amigos',
    //     'D) Con su jefe'
    //   ],
    //   correctAnswer: 'C) Con sus amigos'
    // };
    

    return [exampleQuestion];
    
  } catch (error) {


    const errorQuestion: Question = {
      id: '0',
      text: 'Pregunta sobre la visita de Daniel y sus amigos',
      question: '¿Con quién visitó Daniel?',
      options: [
        'A) Solamente con él',
        'B) Con su familia',
        'C) Con sus amigos',
        'D) Con su jefe'
      ],
      correctAnswer: 'C) Con sus amigos'
    };

    if (axios.isAxiosError(error)) {
      // Verificar si es un error 401 con el mensaje de token no válido
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.error;
        if (errorMessage === "El token no es válido" || errorMessage === "No se proporcionó un token, autorización denegada") {
          console.error("Sesión cerrada por token inválido."); // Mensaje de cierre de sesión
          return [errorQuestion]; 
        }
      }
    }

    return handleApiError(error);
  }
};



// Función para guardar preguntas en la base de datos
export const saveQuestions = async (questions: Question[], token: string): Promise<void> => {
  setAuthToken(token); // Configura el token en los encabezados
  try {
    await api.post('/questions/save', { questions });
  } catch (error) {
    return handleApiError(error);
  }
};



// Función para obtener preguntas creadas por un usuario específico
export const getQuestionsByUser = async (userId: string, token: string): Promise<Question[]> => {
  setAuthToken(token); // Configura el token en los encabezados
  try {
    const response = await api.get<Question[]>(`/questions/user/${userId}`);
    return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


// Función para crear un nuevo chat
export const createChat = async (userId: string, token: string): Promise<string> => {
  setAuthToken(token); // Configura el token en los encabezados
  try {
    const response = await api.post('/chats/create', { userId });
    return response.data.chatId;
  } catch (error) {

    if (axios.isAxiosError(error)) {
      // Verificar si es un error 401 con el mensaje de token no válido
      if (error.response && error.response.status === 401) {
        const errorMessage = error.response.data.error;
        if (errorMessage === "El token no es válido" || errorMessage === "No se proporcionó un token, autorización denegada") {
          console.error("Sesión cerrada por token inválido."); // Mensaje de cierre de sesión
          return "0"; // Retornar chatId = 0 o manejar el cierre de sesión según sea necesario
        }
      }
    } 
    return handleApiError(error);
  }
};

// Función para obtener preguntas creadas por un usuario específico
export const getChats = async (userId: string, token: string): Promise<ChatDB[]> => {
  setAuthToken(token); // Configura el token en los encabezados
  try {
    const response = await api.get<ChatDB[]>(`/chats/user/${userId}`);
    

    // Transformar los datos
    const transformedData: ChatDB[] = response.data.map((item: any) => ({
      id: item.id,
      userText: item.user_text,
    }));

    return transformedData;


    // return response.data;
  } catch (error) {
    return handleApiError(error);
  }
};


// Función para guardar un mensaje en la base de datos
export const saveMessage = async (message: MessageDB, token: string): Promise<void> => {
  setAuthToken(token); // Configura el token en los encabezados
  try {
    await api.post('/messages/save', {  
      chatId: message.chatId,
      userId: message.userId,
      userText: message.userText,
      assistantText: message.assistantText });
  } catch (error) {
    return handleApiError(error);
  }
};

// Función para obtener preguntas creadas por un usuario específico
export const getMessages = async (userId: string, chatId: string,  token: string): Promise<MessageDB[]> => {
  setAuthToken(token); // Configura el token en los encabezados
  try {
    const response = await api.get<MessageDB[]>(`/messages/user/${userId}/chat/${chatId}`);

    const messages = response.data;

    // Organizar todos los mensajes en un solo array, agrupados por chatId
    const organizedMessages: MessageDB[] = [];
    const chatMessagesMap: Record<string, MessageDB[]> = {};

    // Organizar los mensajes por chatId
    messages.forEach(message => {
      const { chatId } = message;
      if (!chatMessagesMap[chatId]) {
        chatMessagesMap[chatId] = [];
      }
      chatMessagesMap[chatId].push(message);
    });

    // Aplanar el objeto organizado en un solo array
    for (const chatId in chatMessagesMap) {
      if (chatMessagesMap.hasOwnProperty(chatId)) {
        organizedMessages.push(...chatMessagesMap[chatId]);
      }
    }
  
    return organizedMessages;

  } catch (error) {
    return handleApiError(error);
  }
};


// Exportamos todas las funciones como un objeto para mantener la consistencia
export const apiService = {
  login,
  register,
  generateQuestions,
  saveQuestions,
  getQuestionsByUser,
  createChat,
  saveMessage
};