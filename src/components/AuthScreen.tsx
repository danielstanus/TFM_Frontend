import React, { useState } from 'react';
import { LoginCredentials, RegisterCredentials, User } from '../types';
import { login, register } from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AuthScreenProps {
  onAuthSuccess: (user: User) => void;
}

const FloatingLabelInput: React.FC<{
  type: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label: string;
}> = ({ type, id, value, onChange, label }) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative mb-8">
      <input
        type={type === 'password' && showPassword ? 'text' : type}
        id={id}
        className="block px-5 pb-4 pt-6 w-full text-xl text-gray-900 bg-transparent rounded-lg border-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
        placeholder=" "
        value={value}
        onChange={onChange}
      />
      <label
        htmlFor={id}
        className="absolute text-xl text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1"
      >
        {label}
      </label>
      {type === 'password' && (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute inset-y-0 right-0 pr-5 flex items-center text-2xl leading-5"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );
};

const AuthScreen: React.FC<AuthScreenProps> = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      let user: User;
      if (isLogin) {
        user = await login({ email, password });
        toast.success('¡Inicio de sesión exitoso!');
      } else {
        if (password !== confirmPassword) {
          toast.error('Las contraseñas no coinciden');
          return;
        }
        user = await register({ name, email, password });
        toast.success('¡Registro exitoso!');
      }

      onAuthSuccess(user);
    } catch (error) {
      console.error('Error de autenticación:', error);
      toast.error(`Error al ${isLogin ? 'iniciar sesión' : 'registrarse'}. Por favor, intenta de nuevo.`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      <h1 className="text-5xl font-bold mb-12 text-black-600">Bienvenido a </h1>
      <h1 className="text-6xl font-bold mb-12 text-blue-600">QuizAI</h1>
      <div className="bg-white p-12 rounded-lg shadow-lg w-full max-w-1/2 md:max-w-2xl">
        <h2 className="text-4xl mb-10 text-center font-bold">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          {!isLogin && (
            <FloatingLabelInput
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              label="Nombre"
            />
          )}
          <FloatingLabelInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
          />
          <FloatingLabelInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            label="Contraseña"
          />
          {!isLogin && (
            <FloatingLabelInput
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              label="Confirmar contraseña"
            />
          )}
          <button type="submit" className="w-full bg-blue-500 text-white p-4 rounded-lg text-xl font-semibold mt-10 hover:bg-blue-600 transition-colors">
            {isLogin ? 'Iniciar sesión' : 'Registrarse'}
          </button>
        </form>
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="w-full mt-8 text-blue-500 hover:underline text-xl"
        >
          {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
        </button>
      </div>
    </div>
  );
};

export default AuthScreen;
