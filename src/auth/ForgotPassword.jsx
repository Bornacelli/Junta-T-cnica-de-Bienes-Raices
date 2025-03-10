import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Aquí implementarías la llamada a tu API para el reset de contraseña
    // Simulación de envío de correo de recuperación
    if (email) {
      setIsSuccess(true);
      setMessage('Se ha enviado un correo con instrucciones para restablecer tu contraseña');
      
      // En un caso real, aquí harías una petición a tu backend
      // En 3 segundos, volvemos al login
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setIsSuccess(false);
      setMessage('Por favor, ingresa un correo electrónico válido');
    }
  };

  return (
    <section className="bg-blue-300 dark:bg-gray-900 h-screen flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
          <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl dark:text-white">
            Recupera tu contraseña
          </h1>
          <a
            href="#"
            className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-400 dark:text-white"
          >
            Logotipo
          </a>

          {isSuccess ? (
            <div className="text-center">
              <p className="text-green-500 mb-4">{message}</p>
              <p className="text-gray-600 dark:text-gray-300">
                Serás redirigido a la página de inicio de sesión en unos segundos...
              </p>
            </div>
          ) : (
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
              
              {message && !isSuccess && (
                <p className="text-red-500 text-sm">{message}</p>
              )}

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Enviar instrucciones
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

export default ForgotPassword;