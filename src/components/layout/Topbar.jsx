import { useState, useEffect, forwardRef } from 'react';
import { Menu, Bell, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom'; // Asumiendo que usas React Router

const Topbar = forwardRef(function Topbar({ toggleSidebar, isSidebarOpen }, ref) {
  const navigate = useNavigate(); // Para la navegación
  
  // Estado para almacenar la fecha actual
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Estado para notificaciones con textos completos
  const [notifications, setNotifications] = useState([
    { 
      id: 1, 
      text: 'Nueva solicitud recibida', 
      read: false, 
      time: '10:30 AM',
      route: '/solicitudes/nueva',
      type: 'solicitud',
      action: 'Haz clic para ver la solicitud'
    },
    { 
      id: 2, 
      text: 'Documento aprobado', 
      read: true, 
      time: '02/03/2025',
      route: '/documentos/aprobados',
      type: 'documento',
      action: 'Haz clic para ver el documento'
    },
    { 
      id: 3, 
      text: 'Documento aprobado', 
      read: true, 
      time: '02/03/2025',
      route: '/documentos/aprobados',
      type: 'documento',
      action: 'Haz clic para ver el documento'
    }
  ]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Actualizar la fecha cuando el componente se monta
  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
  }, []);
  
  // Cerrar menú de notificaciones al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showNotifications) {
        if (!event.target.closest('.notification-menu') && !event.target.closest('.notification-bell')) {
          setShowNotifications(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showNotifications]);

  // Función para formatear la fecha como "Jueves, 04/02/2023"
  const formatDate = (date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const day = days[date.getDay()];
    
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    
    return `${day}, ${dd}/${mm}/${yyyy}`;
  };
  
  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
  };
  
  // Función para manejar el clic en una notificación
  const handleNotificationClick = (notification) => {
    // Marcar esta notificación como leída
    setNotifications(prev => 
      prev.map(n => n.id === notification.id ? { ...n, read: true } : n)
    );
    
    // Cerrar el menú de notificaciones
    setShowNotifications(false);
    
    // Navegar a la ruta correspondiente
    navigate(notification.route);
  };

  // Función para verificar si la pantalla es grande
  const isLargeScreen = () => {
    return window.innerWidth >= 768; // md breakpoint en Tailwind
  };
  
  // Contar notificaciones no leídas
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <header
      ref={ref}
      className="w-full px-8 py-6 flex items-center justify-between z-10"
      style={{
        marginLeft: isSidebarOpen && isLargeScreen() ? '16rem' : '0',
        width: isSidebarOpen && isLargeScreen() ? 'calc(100% - 16rem)' : '100%',
        position: 'fixed',
        top: 0,
        transition: 'margin-left 0.1s, width 0.1s' // Transición más rápida
      }}
    >
      {/* Botón de menú para móviles */}
      <button
        className="md:hidden p-2 rounded-lg hover:bg-gray-100"
        onClick={toggleSidebar}
      >
        <Menu size={24} />
      </button>
      
      {/* Título y fecha */}
      <div className="flex flex-col md:ml-0 ml-2">
        <h1 className="text-xl font-semibold text-gray-800">Junta Técnica de Bienes Raíces</h1>
        <p className="text-sm text-gray-500">{formatDate(currentDate)}</p>
      </div>
      
      {/* Acciones / Perfil */}
      <div className="flex items-center space-x-4">
        {/* Campana de notificaciones */}
        <div className="relative">
          <button 
            className="p-2 rounded-lg hover:bg-gray-100 relative notification-bell"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute bottom-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center transform translate-x-1/2 translate-y-1/3">
                {unreadCount}
              </span>
            )}
          </button>
          
          {/* Menú de notificaciones corregido */}
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 sm:w-72 md:w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20 notification-menu">
              <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
                <h3 className="font-medium">Notificaciones</h3>
                {unreadCount > 0 && (
                  <button 
                    className="text-xs text-blue-600 hover:text-blue-800 px-4"
                    onClick={(e) => {
                      e.stopPropagation();
                      markAllAsRead();
                    }}
                  >
                    Marcar como leídas
                  </button>
                )}
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {notifications.length > 0 ? (
                  <div>
                    {notifications.map(notification => (
                      <div 
                        key={notification.id}
                        className={`border-b border-gray-300 last:border-b-0 hover:bg-gray-50 cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                        onClick={() => handleNotificationClick(notification)}
                      >
                        <div className="px-4 py-3">
                          <div className="flex items-start">
                            <div className="mr-3 mt-1">
                              <Clock size={16} className="text-gray-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 break-words">{notification.text}</p>
                              <p className="text-xs text-gray-500 mt-1 break-words">{notification.action}</p>
                            </div>
                            <div className="ml-2 whitespace-nowrap">
                              <p className="text-xs text-gray-500">{notification.time}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-4 text-gray-500">No hay notificaciones</p>
                )}
              </div>
              
              <div className="px-4 py-2">
                <button 
                  className="text-sm text-blue-600 hover:text-blue-800 w-full text-center"
                  onClick={() => {
                    setShowNotifications(false);
                    navigate('/notificaciones');
                  }}
                >
                  Ver todas las notificaciones
                </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Perfil de usuario (simplificado) */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
            <span className="text-sm font-medium">A</span>
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
});

export default Topbar;