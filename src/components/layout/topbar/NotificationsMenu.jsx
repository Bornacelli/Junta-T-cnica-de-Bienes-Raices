import { useState, useEffect } from 'react';
import { Clock, FileText, User, CheckCircle, AlertTriangle, Trash2, Check } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';

const NotificationsMenu = ({ showNotifications, setShowNotifications }) => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAllAsRead, 
    deleteAllNotifications, 
    markAsRead, 
    unreadCount 
  } = useNotifications();
  
  // Objeto de mapeo para iconos
  const iconMap = {
    User: User,
    FileText: FileText,
    Clock: Clock,
    CheckCircle: CheckCircle,
    AlertTriangle: AlertTriangle
  };
  
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
  }, [showNotifications, setShowNotifications]);
  
  // Función para manejar el clic en una notificación
  const handleNotificationClick = (notification) => {
    // Marcar esta notificación como leída
    markAsRead(notification.id);
    
    // Cerrar el menú de notificaciones
    setShowNotifications(false);
    
    // Navegar a la ruta correspondiente
    navigate(notification.route);
  };
  
  // Limitar a mostrar solo las primeras 3 notificaciones
  const displayedNotifications = notifications.slice(0, 3);
  const hasMoreNotifications = notifications.length > 3;
  
  if (!showNotifications) return null;
  
  return (
    <div className="absolute right-0 mt-2 w-64 sm:w-72 md:w-80 bg-white rounded-lg shadow-lg overflow-hidden z-20 notification-menu">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-300">
        <h3 className="font-medium">Notificaciones</h3>
        <div className="flex space-x-2">
          {unreadCount > 0 && (
            <button 
              className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-gray-100 transition-colors group relative"
              onClick={(e) => {
                e.stopPropagation();
                markAllAsRead();
              }}
              title="Marcar todas como leídas"
            >
              <Check size={16} />
              <span className="invisible absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap group-hover:visible mt-1 z-30">
                Marcar leídas
              </span>
            </button>
          )}
          {notifications.length > 0 && (
            <button 
              className="text-red-600 hover:text-red-800 p-1 rounded hover:bg-gray-100 transition-colors group relative"
              onClick={(e) => {
                e.stopPropagation();
                deleteAllNotifications();
              }}
              title="Borrar todas las notificaciones"
            >
              <Trash2 size={16} />
              <span className="invisible absolute top-full left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2 whitespace-nowrap group-hover:visible mt-1 z-30">
                Borrar todas
              </span>
            </button>
          )}
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length > 0 ? (
          <div>
            {displayedNotifications.map(notification => {
              const IconComponent = iconMap[notification.icon] || Clock;
              
              return (
                <div 
                  key={notification.id}
                  className={`border-b border-gray-300 last:border-b-0 hover:bg-gray-50 cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="px-4 py-3">
                    <div className="flex items-start">
                      <div className="mr-3 mt-1 flex-shrink-0">
                        <IconComponent size={16} className={`${notification.read ? 'text-gray-500' : 'text-blue-500'}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-blue-700'} break-words`}>{notification.text}</p>
                        <p className="text-xs text-gray-500 mt-1 break-words">{notification.action}</p>
                      </div>
                      <div className="ml-2 flex-shrink-0 text-right">
                        <p className="text-xs text-gray-500">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-center py-8 text-gray-500">No hay notificaciones</p>
        )}
      </div>
      
      <div className="px-4 py-2 border-t border-gray-300">
        <button 
          className="text-sm text-blue-600 hover:text-blue-800 w-full text-center py-1"
          onClick={() => {
            setShowNotifications(false);
            navigate('/notificaciones');
          }}
        >
          {hasMoreNotifications 
            ? `Ver todas las notificaciones (${notifications.length})` 
            : "Ver todas las notificaciones"}
        </button>
      </div>
    </div>
  );
};

export default NotificationsMenu;