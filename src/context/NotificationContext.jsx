import { createContext, useState, useContext } from 'react';

// Datos iniciales de notificaciones realistas basadas en las rutas de la aplicación
const initialNotifications = [
  { 
    id: 1, 
    text: 'Nuevo usuario registrado en el sistema', 
    read: false, 
    time: '11/03/2025',
    route: '/configuracion/usuarios',
    type: 'usuario',
    action: 'Haz clic para revisar el nuevo usuario',
    icon: 'User'
  },
  { 
    id: 2, 
    text: 'Nuevos archivos cargados en el sistema', 
    read: false, 
    time: '01/03/2025',
    route: '/configuracion/archivos',
    type: 'archivo',
    action: 'Haz clic para ver los archivos cargados',
    icon: 'FileText'
  },
  { 
    id: 3, 
    text: 'Resumen del día disponible', 
    read: false, 
    time: 'Hoy',
    route: '/dashboard',
    type: 'dashboard',
    action: 'Haz clic para ver el resumen',
    icon: 'Clock'
  },
  { 
    id: 4, 
    text: 'Nuevo usuario registrado en el sistema', 
    read: false, 
    time: '11/03/2025',
    route: '/configuracion/usuarios',
    type: 'usuario',
    action: 'Haz clic para revisar el nuevo usuario',
    icon: 'User'
  },
  { 
    id: 5, 
    text: 'Nuevos archivos cargados en el sistema', 
    read: false, 
    time: '01/03/2025',
    route: '/configuracion/archivos',
    type: 'archivo',
    action: 'Haz clic para ver los archivos cargados',
    icon: 'FileText'
  },
  { 
    id: 6, 
    text: 'Resumen del día disponible', 
    read: false, 
    time: 'Hoy',
    route: '/dashboard',
    type: 'dashboard',
    action: 'Haz clic para ver el resumen',
    icon: 'Clock'
  }
];

// Crear el contexto
const NotificationContext = createContext();

// Proveedor del contexto
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(initialNotifications);
  
  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notif => ({ ...notif, read: true }));
    setNotifications(updatedNotifications);
  };
  
  // Función para borrar todas las notificaciones
  const deleteAllNotifications = () => {
    setNotifications([]);
  };
  
  // Función para marcar una notificación individual como leída
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(n => 
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updatedNotifications);
  };
  
  // Función para borrar una notificación individual
  const deleteNotification = (id) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };
  
  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;
  
  return (
    <NotificationContext.Provider 
      value={{ 
        notifications, 
        setNotifications, 
        markAllAsRead, 
        deleteAllNotifications, 
        markAsRead, 
        deleteNotification, 
        unreadCount 
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto de notificaciones
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de un NotificationProvider');
  }
  return context;
};

export { initialNotifications };