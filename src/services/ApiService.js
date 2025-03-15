import axios from 'axios';

// Esta será una referencia al método logout del contexto
// Se asignará después de importar este servicio
let logoutCallback = null;

// Función para establecer la referencia al logout del contexto
export const setLogoutFunction = (logoutFn) => {
  logoutCallback = logoutFn;
};

// Crear una instancia de axios con la URL base
const api = axios.create({
  baseURL: 'https://tu-api.com/api', // Cambia esta URL por la de tu API
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Si el error es 401 (no autorizado), cerrar la sesión
    if (error.response && error.response.status === 401) {
      // Si tenemos una referencia a la función logout del contexto, la usamos
      if (logoutCallback) {
        logoutCallback();
      } else {
        // Fallback si no tenemos la referencia
        localStorage.removeItem('token');
        localStorage.removeItem('tokenExpiration');
        localStorage.removeItem('userEmail');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;