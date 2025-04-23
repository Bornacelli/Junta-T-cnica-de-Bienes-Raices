import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import {CornerDownLeft} from 'lucide-react';
import api from '../services/ApiService';

import logo from '../assets/logo.png'
import logoAcobir from '../assets/logo-acobir.png';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Hacer petición a la API usando el servicio centralizado
      const response = await api.post('/login.php', {
        usercorreo: email,
        password
      });
      
      // Verificar que al menos hay un token
      if (!response.data.token) {
        throw new Error('Token no recibido');
      }
    
      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);
      console.log('Token guardado en localStorage:', response.data.token);
      
      // Guardar el ID del usuario en localStorage
      if (response.data.id !== undefined) {
        localStorage.setItem('userId', response.data.id);
        console.log('ID de usuario guardado:', response.data.id);
      } else {
        console.warn('No se recibió ID de usuario en la respuesta');
      }
      
      // Construir objeto de usuario con lo que tenemos
      const userInfo = { 
        token: response.data.token,
        email,
        id: response.data.id
      };
      
      // Login con los datos disponibles
      login(userInfo);
      navigate('/dashboard');
    } catch (error) {
    
      // Manejamos los errores de la API
      if (error.response) {
        // La solicitud se realizó y el servidor respondió con un código de estado fuera del rango 2xx
        setError(error.response.data.message || 'Correo o contraseña incorrectos');
      } else if (error.request) {
        // La solicitud se realizó pero no se recibió respuesta
        setError('No se pudo conectar con el servidor. Intente más tarde.');
      } else {
        // Algo ocurrió al configurar la solicitud que desencadenó un error
        setError('Error al iniciar sesión: ' + error.message);
      }
      console.error('Error login:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-blue-300 dark:bg-gray-900 h-screen flex flex-col justify-between">
      {/* Botón para ir al validador en la parte superior */}
      <div className="w-full p-4 flex justify-start absolute top-0 right-0">
      <button 
          className="bg-white text-black-600 font-medium py-2 px-6 rounded-lg flex items-center shadow-md hover:bg-gray-100 transition-colors"
          onClick={() => navigate('/')}
        >
          <CornerDownLeft size={18} className='mr-2'/>
          Ir al Validador
        </button>
      </div>
      
      {/* Contenedor centrado del formulario de login */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 m-4">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            
          <div className="flex items-center justify-center mb-6 space-x-0 sm:space-x-4">
            <img 
              src={logo} 
              alt="Logo de la empresa" 
              className="h-16"
            />
            <img 
              src={logoAcobir} 
              alt="Logo ACOBIR" 
              style={{
                height: '55px',
                width: 'auto'
              }}
            />
          </div>

            <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl dark:text-white mb-6">
              Inicia Sesión en tu cuenta
            </h1>

            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="correoempresarial@empresa.com"
                  required
                  disabled={loading}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  required
                  disabled={loading}
                />
              </div>
              {error && (
                <p className="text-red-500 text-sm">{error}</p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-start">
                  
                </div>
                {/* <Link
                  to="/forgot-password"
                  className="text-sm font-light text-blue-600 hover:underline dark:text-primary-500"
                >
                  ¿Olvidaste tu contraseña?
                </Link> */}
              </div>

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Iniciar Sesión'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;