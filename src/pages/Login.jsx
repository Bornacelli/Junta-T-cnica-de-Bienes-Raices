import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth(); // Función login desde el contexto
  const navigate = useNavigate(); // Navegación programática
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simulación de autenticación
    if (email === 'test@test.com' && password === 'test') {
      login({ email, token: 'fake-jwt-token' }); // Llama a la función de login del contexto
      navigate('/dashboard'); // Redirige al dashboard después del login
    } else {
      setError('Correo o contraseña incorrectos');
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
              />
            </div>
            {error && (
              <p className="text-red-500 text-sm">{error}</p> // Muestra errores
            )}
            <div className="flex items-center justify-between">
              <div className="flex items-start">
                
              </div>
              <a
                href="#"
                className="text-sm font-light text-blue-600 hover:underline dark:text-primary-500"
              >
               ¿Olvidaste tu contraseña?
              </a>
            </div>

            <button
              type="submit"
              className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Login;
