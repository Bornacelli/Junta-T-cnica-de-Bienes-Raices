import { useState } from 'react';
import { LayoutDashboard, LaptopMinimalCheck, Settings, LogOut, ChevronDown, ChevronUp } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import Logo from "../../assets/logo.png";

const Sidebar = ({ isOpen = true, toggleSidebar }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [configExpanded, setConfigExpanded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  
  // Detectar la ruta activa basada en la ubicación actual
  const getActiveLink = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'principal';
    if (path === '/validador') return 'validador';
    if (path === '/configuracion/archivos') return 'config-item1';
    if (path === '/configuracion/usuarios') return 'config-item2';
    return '';
  };
  
  const activeLink = getActiveLink();
  
  // Función para verificar si la pantalla es grande
  const isLargeScreen = () => {
    return window.innerWidth >= 768; // md breakpoint en Tailwind
  };
  
  const handleLinkClick = (link, route) => {
    // En móviles, cerrar el sidebar después de hacer clic en un enlace
    if (!isLargeScreen()) {
      toggleSidebar();
    }
    navigate(route);
  };
  
  const handleLogoutClick = () => {
    setShowModal(true);
  };
  
  const confirmLogout = () => {
    localStorage.removeItem('authToken');
    sessionStorage.clear();
    navigate('/login');
  };
  
  const cancelLogout = () => {
    setShowModal(false);
  };
  
  const toggleConfig = () => {
    setConfigExpanded(!configExpanded);
  };
  
  return (
    <>
      {/* Sidebar - ancho fijo exacto de 16rem (64 en tailwind) */}
      <aside 
        className={`fixed inset-y-0 left-0 z-30 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 transition-transform duration-300 ease-in-out flex flex-col h-screen bg-blue-600 text-white w-64`}
        style={{ width: '16rem' }} // Ancho fijo de 16rem (equivalente a w-64)
      >
        
        {/* Logo section */}
        <div className="p-6">
          <div className="flex items-center justify-center">
            <img src={Logo} alt="Logo" />
          </div>
        </div>
        
        {/* Navigation links */}
        <div className="flex-1 px-3 flex flex-col items-center overflow-y-auto">
          {/* Pantalla Principal */}
          <button 
            onClick={() => handleLinkClick('principal', '/dashboard')} 
            className={`flex items-center w-full px-4 py-3 mb-4 rounded-lg text-center justify-center ${
              activeLink === 'principal' ? 'bg-white font-medium' : 'text-white hover:bg-blue-700'
            }`}
            style={{ color: activeLink === 'principal' ? 'black' : 'white' }}
          >
            <LayoutDashboard 
              size={20} 
              className="mr-3"
              style={{ color: activeLink === 'principal' ? 'black' : 'white' }}
            />
            <span style={{ color: activeLink === 'principal' ? 'black' : 'white' }}>
              Pantalla Principal
            </span>
          </button>

          {/* Validador */}
          <button 
            onClick={() => handleLinkClick('validador', '/validador')} 
            className={`flex items-center w-full px-4 py-3 mb-4 rounded-lg text-center justify-center ${
              activeLink === 'validador' ? 'bg-white font-medium' : 'text-white hover:bg-blue-700'
            }`}
            style={{ color: activeLink === 'validador' ? 'black' : 'white' }}
          >
            <LaptopMinimalCheck 
              size={20} 
              className="mr-3" 
              style={{ color: activeLink === 'validador' ? 'black' : 'white' }}
            />
            <span>Validador</span>
          </button>

          
          <div style={{ width: "95%", height: "0.5px", backgroundColor: "rgba(255, 255, 255, 0.25)", margin: "0 0 16px 0" }}></div>

         
          {/* Configuración con submenú */}
          <div className="w-full mb-4">
            <button 
              onClick={toggleConfig} 
              className={`flex items-center w-full px-4 py-3 mb-4 rounded-lg text-center justify-center ${
                (activeLink === 'config-item1' || activeLink === 'config-item2') && !configExpanded
                ? ' font-medium' 
                : 'text-white hover:bg-blue-700'
              }`}
              style={{ color: 'white' }} // Siempre blanco, sin condición
            >
              <Settings 
                size={20} 
                className="mr-3"
                style={{ color: 'white' }} // Siempre blanco, sin condición
              />
              <span className="flex-grow mr-3" style={{ color: 'white' }}>Configuración</span>
              {configExpanded ? 
                <ChevronUp size={18} style={{ color: 'white' }} /> : 
                <ChevronDown size={18} style={{ color: 'white' }} />
              }
            </button>

            {/* Subitems - estos sí mantienen el cambio de color cuando están activos */}
            {configExpanded && (
              <div className="flex flex-col items-center mb-4">
                <button 
                  onClick={() => handleLinkClick('config-item1', '/configuracion/archivos')} 
                  className={`w-full text-center py-3 px-4 rounded-md mb-4 ${
                    activeLink === 'config-item1' ? 'bg-white font-medium' : 'text-white hover:bg-blue-700'
                  }`}
                  style={{ color: activeLink === 'config-item1' ? 'black' : 'white' }}
                >
                  Cargar Archivos
                </button>
                <button 
                  onClick={() => handleLinkClick('config-item2', '/configuracion/usuarios')} 
                  className={`w-full text-center py-3 px-4 rounded-md ${
                    activeLink === 'config-item2' ? 'bg-white font-medium' : 'text-white hover:bg-blue-700'
                  }`}
                  style={{ color: activeLink === 'config-item2' ? 'black' : 'white' }}
                >
                  Usuarios
                </button>
              </div>
            )}
          </div>
        </div>


        <div style={{ height: "1px", backgroundColor: "rgba(255, 255, 255, 0.25)", margin: "0 16px" }}></div>



        
        {/* Logout button */}
        <div className="p-3 mb-6 flex justify-center">
          <button 
            onClick={handleLogoutClick}
            className="flex items-center w-full px-4 py-3 rounded-lg justify-center hover:bg-blue-700 hover:text-black"
          >
            <LogOut size={20} className="mr-3" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </aside>
      
      {/* Overlay para cerrar sidebar en móviles */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
      
      {/* Modal Cerrar Sesión */}
      {showModal && (
        <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-96 max-w-md">
            <div className="flex items-center mb-4">
              <div className="bg-red-100 p-2 rounded-full mr-3">
                <LogOut size={24} className="text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Confirmar cierre de sesión</h3>
            </div>
            
            <div className="w-full h-px bg-gray-200 my-4"></div>
            
            <p className="text-gray-600 mb-6">¿Está seguro que desea cerrar la sesión? Todos los datos no guardados se perderán.</p>
            
            <div className="flex justify-end space-x-3">
              <button 
                onClick={cancelLogout}
                className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-100 text-gray-700 font-medium transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmLogout}
                className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-sm"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;