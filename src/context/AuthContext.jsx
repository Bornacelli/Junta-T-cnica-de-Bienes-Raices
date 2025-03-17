import { createContext, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Tiempo de expiración en milisegundos (por ejemplo, 1 hora)
const SESSION_EXPIRATION_TIME = 60 * 60 * 1000; 

export const AuthProvider = ({ children }) => {
  // Estado para verificar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar la carga inicial
  
  // Estado para guardar los datos del usuario
  const [user, setUser] = useState(null);

  // Verificar la autenticación al cargar
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const expiration = localStorage.getItem('tokenExpiration');
      
      if (token && expiration) {
        // Verificar si el token ha expirado
        if (Date.now() < parseInt(expiration)) {
          setIsAuthenticated(true);
          
          // Intentar recuperar todos los datos del usuario del localStorage
          try {
            const userData = JSON.parse(localStorage.getItem('userData'));
            if (userData) {
              setUser({...userData, token});
            } else {
              // Si no hay datos completos, usar al menos el email
              setUser({ email: localStorage.getItem('userEmail') || 'correo@example.com', token });
            }
          } catch (error) {
            console.error('Error al parsear datos del usuario:', error);
            setUser({ email: localStorage.getItem('userEmail') || 'correo@example.com', token });
          }
        } else {
          // Si el token ha expirado, limpiamos el almacenamiento
          localStorage.removeItem('token');
          localStorage.removeItem('tokenExpiration');
          localStorage.removeItem('userEmail');
          localStorage.removeItem('userData');
          setIsAuthenticated(false);
          setUser(null);
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  // Función para iniciar sesión
  const login = (userData) => {
    const expiration = Date.now() + SESSION_EXPIRATION_TIME;
    
    // Guardar el token y la expiración
    localStorage.setItem('token', userData.token); 
    localStorage.setItem('tokenExpiration', expiration.toString());
    
    // Guardar el email por compatibilidad
    if (userData.email || userData.usu_correo) {
      localStorage.setItem('userEmail', userData.email || userData.usu_correo);
    }
    
    // Guardar todos los datos del usuario
    const userToStore = {...userData};
    delete userToStore.token; // No guardamos el token duplicado
    localStorage.setItem('userData', JSON.stringify(userToStore));
    
    // Actualizar estado
    setIsAuthenticated(true);
    setUser({...userData});
    
    // Configurar temporizador para cerrar sesión automáticamente cuando expire
    setTimeout(() => {
      logout();
    }, SESSION_EXPIRATION_TIME);
  };

  // Función para cerrar sesión
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userData');
    
    setIsAuthenticated(false);
    setUser(null);
  };

  // Proveer los valores a los componentes hijos
  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Validar las propiedades del componente
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => useContext(AuthContext);

export default AuthContext;