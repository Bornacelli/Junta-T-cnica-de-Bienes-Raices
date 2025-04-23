import { useState, useEffect, forwardRef } from 'react';
import { Menu, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import NotificationsMenu from './NotificationsMenu';
import { useNotifications } from '../../../context/NotificationContext';
import api from '../../../services/ApiService';

// Importa tu logo (asegúrate de tener la ruta correcta)
import logoAproba from '../../../assets/logotipo A.png'; // Ajusta esta ruta según tu estructura de carpetas

const Topbar = forwardRef(function Topbar({ toggleSidebar, isSidebarOpen }, ref) {
  const navigate = useNavigate();
  const { unreadCount } = useNotifications();

  const [userDisplayName, setUserDisplayName] = useState('Usuario');
  const [loading, setLoading] = useState(true);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
  
      if (!token) {
        console.warn('No se encontró el token en localStorage');
        setLoading(false);
        return;
      }
  
      if (!userId) {
        console.warn('No se encontró el ID de usuario en localStorage');
        setUserDisplayName('Usuario');
        setLoading(false);
        return;
      }
  
      try {
        const response = await api.get(`/usuario_traer.php?id=${userId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
  
        if (response.data && response.data.usu_nombre) {
          setUserDisplayName(response.data.usu_nombre);
        } else {
          console.warn('No se recibió un objeto válido de usuario.');
          setUserDisplayName('Usuario');
        }
      } catch (error) {
        console.error('Error obteniendo datos del usuario:', error);
        setUserDisplayName('Usuario');
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, []);

  // Función para obtener iniciales del usuario
  const getUserInitials = () => {
    if (!userDisplayName || userDisplayName === 'Usuario') return 'U';
    return userDisplayName
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  };

  // Función para formatear la fecha
  const formatDate = (date) => {
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    const day = days[date.getDay()];
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${day}, ${dd}/${mm}/${yyyy}`;
  };

  // Función para verificar si la pantalla es grande
  const isLargeScreen = () => {
    return window.innerWidth >= 768; // md breakpoint en Tailwind
  };

  return (
    <header ref={ref} className="w-full px-8 py-6 flex items-center justify-between z-10"
    style={{
      marginLeft: isSidebarOpen && isLargeScreen() ? '16rem' : '0',
      width: isSidebarOpen && isLargeScreen() ? 'calc(100% - 16rem)' : '100%',
      position: 'fixed',
      top: 0,
      transition: 'margin-left 0.1s, width 0.1s' // Transición más rápida
    }}>
      <button className="md:hidden p-2 rounded-lg hover:bg-gray-100" onClick={toggleSidebar}>
        <Menu size={24} />
      </button>

      <div className="flex items-center">
        {/* Logo pequeño */}
        <img 
          src={logoAproba} 
          alt="Logo Aproba" 
          className="h-8 mr-3" 
          style={{ filter: 'brightness(1) contrast(1)' }} // Ajusta si necesitas cambiar colores
        />
        <div className="flex flex-col">
          <h1 className="text-xl font-semibold text-gray-800">Panel Administrativo</h1>
          <p className="text-sm text-gray-500">{formatDate(currentDate)}</p>
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <div className="relative">
          <button className="p-2 rounded-lg hover:bg-gray-100" onClick={() => setShowNotifications(!showNotifications)}>
            <Bell size={20} className="text-gray-600" />
            {unreadCount > 0 && (
              <span className="absolute bottom-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>
          <NotificationsMenu showNotifications={showNotifications} setShowNotifications={setShowNotifications} />
        </div>

        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
            <span className="text-sm font-medium">{loading ? "..." : getUserInitials()}</span>
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">
            {loading ? "Cargando..." : userDisplayName}
          </span>
        </div>
      </div>
    </header>
  );
});

export default Topbar;