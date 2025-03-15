import React, { useState, useEffect, useRef } from 'react';
import { Clock, FileText, User, Check, Trash2, Filter, ChevronDown, CheckCircle, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../../context/NotificationContext';

const NotificationsPage = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    markAllAsRead, 
    deleteAllNotifications, 
    markAsRead, 
    deleteNotification 
  } = useNotifications();
  
  const [filter, setFilter] = useState('all'); // 'all', 'unread', 'read'
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const filterMenuRef = useRef(null);
  const filterButtonRef = useRef(null);
  
  // Objeto de mapeo para iconos
  const iconMap = {
    User: User,
    FileText: FileText,
    Clock: Clock,
    CheckCircle: CheckCircle,
    AlertTriangle: AlertTriangle
  };
  
  // Cerrar menú de filtro al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showFilterMenu && 
          filterMenuRef.current && 
          !filterMenuRef.current.contains(event.target) &&
          !filterButtonRef.current.contains(event.target)) {
        setShowFilterMenu(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showFilterMenu]);
  
  // Manejar clic en una notificación
  const handleNotificationClick = (notification) => {
    // Marcar como leída
    markAsRead(notification.id);
    // Navegar a la ruta correspondiente
    navigate(notification.route);
  };
  
  // Filtrar notificaciones según el filtro activo
  const filteredNotifications = notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    if (filter === 'read') return n.read;
    return true;
  });
  
  // Agrupar notificaciones por fecha
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = notification.time;
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(notification);
    return groups;
  }, {});
  
  // Función para aplicar filtro y cerrar menú
  const applyFilter = (newFilter) => {
    setFilter(newFilter);
    setShowFilterMenu(false);
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
        <h1 className="text-2xl font-bold">Todas las notificaciones</h1>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <button 
              ref={filterButtonRef}
              className="bg-white border border-gray-300 rounded-md px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 flex items-center"
              onClick={() => setShowFilterMenu(!showFilterMenu)}
            > Filtrar por
              <Filter className='ml-2 h-4 w-4 text-gray-500' /> 
              <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            {showFilterMenu && (
              <div 
                ref={filterMenuRef}
                className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg overflow-hidden z-10 border border-gray-200"
              >
                <div className="py-1">
                  <button 
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'all' ? 'bg-gray-100' : ''}`}
                    onClick={() => applyFilter('all')}
                  >
                    Todas
                  </button>
                  <button 
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'unread' ? 'bg-gray-100' : ''}`}
                    onClick={() => applyFilter('unread')}
                  >
                    No leídas
                  </button>
                  <button 
                    className={`block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left ${filter === 'read' ? 'bg-gray-100' : ''}`}
                    onClick={() => applyFilter('read')}
                  >
                    Leídas
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {notifications.length > 0 && (
            <>
              <button 
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md px-4 py-2 text-sm font-medium flex items-center"
                onClick={markAllAsRead}
              >
                <Check size={16} className="mr-2" />
                Marcar leídas
              </button>
              <button 
                className="bg-red-50 text-red-600 hover:bg-red-100 rounded-md px-4 py-2 text-sm font-medium flex items-center"
                onClick={deleteAllNotifications}
              >
                <Trash2 size={16} className="mr-2" />
                Borrar todas
              </button>
            </>
          )}
        </div>
      </div>
      
      {filteredNotifications.length > 0 ? (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {Object.entries(groupedNotifications).map(([date, dateNotifications]) => (
            <div key={date} className="border-b border-gray-200 last:border-b-0">
              <div className="bg-gray-50 px-6 py-3">
                <h3 className="text-sm font-medium text-gray-500">{date}</h3>
              </div>
              <div>
                {dateNotifications.map(notification => {
                  const IconComponent = iconMap[notification.icon] || Clock;
                  
                  return (
                    <div 
                      key={notification.id}
                      className={`border-b border-gray-200 last:border-b-0 hover:bg-gray-50 cursor-pointer ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="px-6 py-4">
                        <div className="flex items-start">
                          <div className="mr-2 mt-1 flex-shrink-0">
                            <IconComponent size={20} className={`${notification.read ? 'text-gray-500' : 'text-blue-500'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-medium ${notification.read ? 'text-gray-900' : 'text-blue-700'}`}>{notification.text}</p>
                            <p className="text-sm text-gray-500 mt-1">{notification.action}</p>
                            <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                          </div>
                          <div className="ml-4 flex-shrink-0 flex items-center space-x-2">
                            {!notification.read && (
                              <button 
                                className="text-blue-600 hover:text-blue-800 p-1.5 rounded hover:bg-blue-100 transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  markAsRead(notification.id);
                                }}
                                title="Marcar como leída"
                                aria-label="Marcar como leída"
                              >
                                <Check size={18} />
                              </button>
                            )}
                            <button 
                              className="text-red-600 hover:text-red-800 p-1.5 rounded hover:bg-red-100 transition-colors"
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteNotification(notification.id);
                              }}
                              title="Borrar notificación"
                              aria-label="Borrar notificación"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500">No hay notificaciones {filter !== 'all' ? (filter === 'unread' ? 'no leídas' : 'leídas') : ''}</p>
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;