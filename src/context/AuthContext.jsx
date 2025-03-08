import { createContext, useState, useContext } from 'react';
import PropTypes from 'prop-types';

// Crear el contexto de autenticación
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Estado para verificar si el usuario está autenticado
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Revisar si existe un token en localStorage al cargar
    return !!localStorage.getItem('token');
  });

  // Estado para guardar los datos del usuario
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    return token ? { email: 'correo@example.com', token } : null; // Usuario simulado
  });

  // Función para iniciar sesión
  const login = (userData) => {
    setIsAuthenticated(true);
    setUser(userData);
    localStorage.setItem('token', userData.token); // Guardar el token simulado
  };

  // Función para cerrar sesión
  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
    localStorage.removeItem('token'); // Eliminar el token del almacenamiento
  };

  // Proveer los valores a los componentes hijos
  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
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
