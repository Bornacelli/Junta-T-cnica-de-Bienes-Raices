import { useState, useEffect, forwardRef } from 'react';
import { Menu, Bell } from 'lucide-react';

const Topbar = forwardRef(function Topbar({ toggleSidebar, isSidebarOpen }, ref) {
  // Estado para almacenar la fecha actual
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // Actualizar la fecha cuando el componente se monta
  useEffect(() => {
    const now = new Date();
    setCurrentDate(now);
  }, []);
  
  // Función para formatear la fecha como "Jueves, 04/02/2023"
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
        <button className="p-2 rounded-lg hover:bg-gray-100 relative">
          <Bell size={20} className="text-gray-600" />
        </button>
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
            {/* Aquí iría la foto de perfil del usuario o sus iniciales */}
          </div>
          <span className="hidden md:inline text-sm font-medium text-gray-700">Admin</span>
        </div>
      </div>
    </header>
  );
});

export default Topbar;