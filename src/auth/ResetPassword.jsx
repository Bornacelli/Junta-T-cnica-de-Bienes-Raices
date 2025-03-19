import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/ApiService'; 

const ResetPassword = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  
  const [passwords, setPasswords] = useState({
    password: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(true);

  // Validar el token al cargar el componente
  useEffect(() => {
    if (token) {
      verifyToken();
    } else {
      setTokenValid(false);
    }
  }, [token]);

  // Verificar si el token es válido haciendo una petición a la API
  const verifyToken = async () => {
    try {
      await api.get(`/api/auth/verify-reset-token?token=${token}`);
      setTokenValid(true);
    } catch (error) {
      setTokenValid(false);
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('El enlace para restablecer la contraseña es inválido o ha expirado.');
      }
    }
  };

  // Manejar cambios en los campos de contraseña
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que las contraseñas coincidan
    if (passwords.password !== passwords.confirmPassword) {
      setIsSuccess(false);
      setMessage('Las contraseñas no coinciden');
      return;
    }
    
    // Validar complejidad de la contraseña
    if (passwords.password.length < 8) {
      setIsSuccess(false);
      setMessage('La contraseña debe tener al menos 8 caracteres');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Llamada a la API para cambiar la contraseña
      await api.post('/api/auth/reset-password', {
        token,
        password: passwords.password
      });
      
      setIsSuccess(true);
      setMessage('Tu contraseña ha sido cambiada exitosamente');
      
      // Redireccionar al login después de 3 segundos
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error) {
      setIsSuccess(false);
      
      if (error.response && error.response.data && error.response.data.message) {
        setMessage(error.response.data.message);
      } else {
        setMessage('Ocurrió un error al cambiar tu contraseña. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="bg-blue-300 dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl dark:text-white">
            Cambiar Contraseña
          </h1>
          <a
            href="#"
            className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-400 dark:text-white"
          >
            Logotipo
          </a>

          {!tokenValid && (
            <div className="text-center">
              <p className="text-red-500 mb-4">Enlace inválido o expirado</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {message || 'El enlace que has utilizado para cambiar tu contraseña es inválido o ha expirado.'}
              </p>
              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Solicitar nuevo enlace
              </button>
            </div>
          )}

          {tokenValid && isSuccess ? (
            <div className="text-center">
              <p className="text-green-500 mb-4">{message}</p>
              <p className="text-gray-600 dark:text-gray-300">
                Serás redirigido a la página de inicio de sesión en unos segundos...
              </p>
            </div>
          ) : tokenValid && (
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Nueva Contraseña
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={passwords.password}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  minLength={8}
                  disabled={isLoading}
                />
                <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                  Mínimo 8 caracteres
                </p>
              </div>
              
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Confirmar Contraseña
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  id="confirmPassword"
                  value={passwords.confirmPassword}
                  onChange={handleChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
              </div>
              
              {message && !isSuccess && (
                <p className="text-red-500 text-sm">{message}</p>
              )}

              <button
                type="submit"
                className={`w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Procesando...' : 'Cambiar Contraseña'}
              </button>
              
              <div className="text-center">
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/login');
                  }}
                  className="text-sm font-light text-blue-600 hover:underline dark:text-primary-500"
                >
                  Volver al inicio de sesión
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;