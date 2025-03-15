import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

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

  // Manejar cambios en los campos de contraseña
  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords({
      ...passwords,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
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
    
    // Aquí implementarías la llamada a tu API para cambiar la contraseña
    // Simulación de cambio de contraseña exitoso
    if (token) {
      setIsSuccess(true);
      setMessage('Tu contraseña ha sido cambiada exitosamente');
      
      // En un caso real, aquí harías una petición a tu backend con el token y la nueva contraseña
      // Ejemplo: api.resetPassword(token, passwords.password)
      
      // En 3 segundos, redirigimos al login
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } else {
      setIsSuccess(false);
      setMessage('Token inválido o expirado. Por favor solicita un nuevo enlace de recuperación.');
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

          {!token && (
            <div className="text-center">
              <p className="text-red-500 mb-4">Enlace inválido o expirado</p>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                El enlace que has utilizado para cambiar tu contraseña es inválido o ha expirado.
              </p>
              <button
                onClick={() => navigate('/forgot-password')}
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Solicitar nuevo enlace
              </button>
            </div>
          )}

          {token && isSuccess ? (
            <div className="text-center">
              <p className="text-green-500 mb-4">{message}</p>
              <p className="text-gray-600 dark:text-gray-300">
                Serás redirigido a la página de inicio de sesión en unos segundos...
              </p>
            </div>
          ) : token && (
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
                />
              </div>
              
              {message && !isSuccess && (
                <p className="text-red-500 text-sm">{message}</p>
              )}

              <button
                type="submit"
                className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Cambiar Contraseña
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

// import { useState } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';

// const ResetPassword = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
  
//   // Para desarrollo, simularemos que siempre hay un token
//   // En producción, descomenta la línea siguiente y comenta la de DESARROLLO
//   // const token = searchParams.get('token');
//   const token = searchParams.get('token') || 'token-dev'; // DESARROLLO: Token simulado
  
//   const [passwords, setPasswords] = useState({
//     password: '',
//     confirmPassword: ''
//   });
//   const [message, setMessage] = useState('');
//   const [isSuccess, setIsSuccess] = useState(false);

//   // Manejar cambios en los campos de contraseña
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setPasswords({
//       ...passwords,
//       [name]: value
//     });
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     // Validar que las contraseñas coincidan
//     if (passwords.password !== passwords.confirmPassword) {
//       setIsSuccess(false);
//       setMessage('Las contraseñas no coinciden');
//       return;
//     }
    
//     // Validar complejidad de la contraseña
//     if (passwords.password.length < 8) {
//       setIsSuccess(false);
//       setMessage('La contraseña debe tener al menos 8 caracteres');
//       return;
//     }
    
//     // Aquí implementarías la llamada a tu API para cambiar la contraseña
//     // Simulación de cambio de contraseña exitoso
//     setIsSuccess(true);
//     setMessage('Tu contraseña ha sido cambiada exitosamente');
    
//     // En un caso real, aquí harías una petición a tu backend con el token y la nueva contraseña
//     console.log('Enviando nueva contraseña con token:', token);
    
//     // En 3 segundos, redirigimos al login
//     setTimeout(() => {
//       navigate('/login');
//     }, 3000);
//   };

//   // Función para simular un error de token (solo para desarrollo)
//   const simulateTokenError = () => {
//     setIsSuccess(false);
//     setMessage('Token inválido o expirado. Por favor solicita un nuevo enlace de recuperación.');
//   };

//   return (
//     <section className="bg-blue-300 dark:bg-gray-900 h-screen flex items-center justify-center">
//       <div className="w-full max-w-md bg-white rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
//         <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
//           <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-600 md:text-2xl dark:text-white">
//             Cambiar Contraseña
//           </h1>
//           <a
//             href="#"
//             className="flex items-center justify-center mb-6 text-2xl font-semibold text-gray-400 dark:text-white"
//           >
//             Logotipo
//           </a>

//           {isSuccess ? (
//             <div className="text-center">
//               <p className="text-green-500 mb-4">{message}</p>
//               <p className="text-gray-600 dark:text-gray-300">
//                 Serás redirigido a la página de inicio de sesión en unos segundos...
//               </p>
//             </div>
//           ) : (
//             <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit}>
//               <div>
//                 <label
//                   htmlFor="password"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                 >
//                   Nueva Contraseña
//                 </label>
//                 <input
//                   type="password"
//                   name="password"
//                   id="password"
//                   value={passwords.password}
//                   onChange={handleChange}
//                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   placeholder="••••••••"
//                   required
//                   minLength={8}
//                 />
//                 <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
//                   Mínimo 8 caracteres
//                 </p>
//               </div>
              
//               <div>
//                 <label
//                   htmlFor="confirmPassword"
//                   className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
//                 >
//                   Confirmar Contraseña
//                 </label>
//                 <input
//                   type="password"
//                   name="confirmPassword"
//                   id="confirmPassword"
//                   value={passwords.confirmPassword}
//                   onChange={handleChange}
//                   className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
//                   placeholder="••••••••"
//                   required
//                 />
//               </div>
              
//               {message && !isSuccess && (
//                 <p className="text-red-500 text-sm">{message}</p>
//               )}

//               <button
//                 type="submit"
//                 className="w-full text-white bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
//               >
//                 Cambiar Contraseña
//               </button>
              
//               {/* Solo para desarrollo: botones para simular diferentes estados */}
//               <div className="mt-4 flex justify-between">
//                 <button
//                   type="button"
//                   onClick={simulateTokenError}
//                   className="text-sm text-gray-500 hover:text-gray-700"
//                 >
//                   Simular error de token
//                 </button>
//               </div>
              
//               <div className="text-center">
//                 <a
//                   href="#"
//                   onClick={(e) => {
//                     e.preventDefault();
//                     navigate('/login');
//                   }}
//                   className="text-sm font-light text-blue-600 hover:underline dark:text-primary-500"
//                 >
//                   Volver al inicio de sesión
//                 </a>
//               </div>
//             </form>
//           )}
//         </div>
//       </div>
//     </section>
//   );
// };

// export default ResetPassword;