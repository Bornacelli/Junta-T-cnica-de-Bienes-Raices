import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/ApiService';

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
      
      console.log('==== LOGIN RESPONSE ====');
      console.log('Respuesta login completa:', response.data);
      console.log('Token recibido:', response.data.token);
      console.log('userData recibido:', response.data.userData);
      
      // Verificar que al menos hay un token
      if (!response.data.token) {
        throw new Error('Token no recibido');
      }
    
      // Guardar el token en localStorage
      localStorage.setItem('token', response.data.token);
      console.log('Token guardado en localStorage:', response.data.token);
      
      // Construir objeto de usuario con lo que tenemos
      const userInfo = { 
        token: response.data.token,
        email 
      };
      
      // Si hay datos adicionales, agregarlos
      // if (response.data.userData) {
      //   Object.assign(userInfo, response.data.userData);
      //   // Guardar ID si existe
      //   if (response.data.userData.usu_id) {
      //     localStorage.setItem('userId', response.data.userData.usu_id);
      //     console.log('ID de usuario guardado en localStorage:', response.data.userData.usu_id);
      //   } else {
      //     console.log('No se encontró usu_id en userData');
      //   }
      // } else {
      //   console.log('No se recibió userData en la respuesta');
      // }
      
      // console.log('Objeto de usuario final enviado al contexto:', userInfo);
      
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
    <section className="bg-blue-300 dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl dark:text-white">
            Inicia Sesión en tu cuenta
          </h1>
          <a
            href="#"
            className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-400 dark:text-white"
          >
            Logotipo
          </a>

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
              <Link
                to="/forgot-password"
                className="text-sm font-light text-blue-600 hover:underline dark:text-primary-500"
              >
                ¿Olvidaste tu contraseña?
              </Link>
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
    </section>
  );
};

export default Login;