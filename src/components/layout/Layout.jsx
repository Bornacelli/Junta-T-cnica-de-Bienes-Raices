import { useState, useEffect, useRef } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './topbar/Topbar';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const topbarRef = useRef(null);
  const mainRef = useRef(null);
  
  // Función para verificar si la pantalla es grande
  const isLargeScreen = () => {
    return window.innerWidth >= 768; 
  };
  
  // Efecto para sincronizar el estado del sidebar
  useEffect(() => {
    const handleResize = () => {
      const largeScreen = isLargeScreen();
      setSidebarOpen(largeScreen);
      
     
      if (topbarRef.current) {
        topbarRef.current.style.marginLeft = largeScreen ? '16rem' : '0';
        topbarRef.current.style.width = largeScreen ? 'calc(100% - 16rem)' : '100%';
      }
      
      if (mainRef.current) {
        mainRef.current.style.marginLeft = largeScreen ? '16rem' : '0';
        mainRef.current.style.width = largeScreen ? 'calc(100% - 16rem)' : '100%';
      }
    };
    
    // Verificar al inicio
    handleResize();
    
    // Verificar en cada cambio de tamaño
    window.addEventListener('resize', handleResize);
    
    // Limpiar el listener
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Función para actualizar el estado del sidebar
  const toggleSidebar = () => {
    const newState = !sidebarOpen;
    setSidebarOpen(newState);
    
    // Actualizar inmediatamente al cambiar el sidebar
    const largeScreen = isLargeScreen();
    if (largeScreen) {
      if (topbarRef.current) {
        topbarRef.current.style.marginLeft = newState ? '16rem' : '0';
        topbarRef.current.style.width = newState ? 'calc(100% - 16rem)' : '100%';
      }
      
      if (mainRef.current) {
        mainRef.current.style.marginLeft = newState ? '16rem' : '0';
        mainRef.current.style.width = newState ? 'calc(100% - 16rem)' : '100%';
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - pasa el estado y la función para controlar su visibilidad */}
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
      
      {/* Contenedor principal */}
      <div className="flex flex-col w-full">
        {/* Topbar */}
        <Topbar 
          ref={topbarRef}
          toggleSidebar={toggleSidebar} 
          isSidebarOpen={sidebarOpen} 
        />
        
        {/* Contenido dinámico */}
        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto p-4 transition-all duration-300 ease-in-out"
          style={{
            marginLeft: sidebarOpen && isLargeScreen() ? '16rem' : '0',
            width: sidebarOpen && isLargeScreen() ? 'calc(100% - 16rem)' : '100%',
            marginTop: isLargeScreen() ? '90px' : '120px' // Responsivo: 90px en desktop, 120px en móvil
          }}
        >
          <Outlet /> {/* Aquí se renderizan las rutas hijas */}
        </main>
      </div>
    </div>
  );
};

export default Layout;