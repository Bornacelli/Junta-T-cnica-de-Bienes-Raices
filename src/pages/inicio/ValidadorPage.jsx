import { useState } from 'react';
import { SearchCheck, CircleCheck, AlertTriangle, XCircle, CalendarArrowDown, CalendarArrowUp, Scale, User } from 'lucide-react';
import api from '../../services/ApiService';
import logo from '../../assets/logo.png';
import logoAcobir from '../../assets/logo-acobir.png'; // Importa el logo de ACOBIR

const ValidadorPage = () => {
  const [licencia, setLicencia] = useState('');
  const [estado, setEstado] = useState(null);
  const [mostrarResultado, setMostrarResultado] = useState(false);
  const [datosFicticios, setDatosFicticios] = useState({
    personaJuridica: '',
    representanteLegal: '',
    fechaEmision: '',
    fechaVencimiento: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [campoVacio, setCampoVacio] = useState(false);

  const handleChange = (e) => {
    const valor = e.target.value;
    setLicencia(valor);
    // Limpiar el estado de error de campo vacío cuando el usuario comienza a escribir
    if (valor.trim() !== '') {
      setCampoVacio(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar que el campo no esté vacío
    if (licencia.trim() === '') {
      setCampoVacio(true);
      return; // Detener la ejecución si el campo está vacío
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.get(`/corredores_traer.php?no_lic=${licencia}`);
      const data = response.data;
      
      console.log("Respuesta de API:", data);
      
      if (data && data.id) {
        const estatusLicencia = data.estatus_licencia ? data.estatus_licencia.toUpperCase() : 'ACTIVA';
        
        let estadoMapeado;
        switch (estatusLicencia) {
          case 'SUSPENDIDA':
            estadoMapeado = 'suspendida';
            break;
          case 'CANCELADA':
            estadoMapeado = 'cancelada';
            break;
          case 'ACTIVA':
          default:
            estadoMapeado = 'validada';
            break;
        }
        
        setEstado(estadoMapeado);
        
        const formatearFecha = (fechaStr) => {
          if (!fechaStr || fechaStr === '0000-00-00') return 'No disponible';
          
          try {
            const [year, month, day] = fechaStr.split('-');
            if (year === '0000') return 'No disponible';
            return `${day}/${month}/${year}`;
          } catch (e) {
            return fechaStr;
          }
        };
        
        setDatosFicticios({
          personaJuridica: data.listado_persona_juridica || 'No disponible',
          representanteLegal: data.representante_legal || 'No disponible',
          fechaEmision: formatearFecha(data.emision),
          fechaVencimiento: formatearFecha(data.vencimiento)
        });
      } else {
        setEstado('noEncontrada');
        setDatosFicticios({});
      }
    } catch (err) {
      console.error('Error al validar la licencia:', err);
      
      if (err.response) {
        if (err.response.status === 404) {
          setError('');
        } else {
          setError(`Error del servidor: ${err.response.status}. Por favor, intente nuevamente.`);
        }
      } else if (err.request) {
        setError('No se pudo conectar con el servidor. Verifique su conexión a internet.');
      } else {
        setError('Ocurrió un error al validar la licencia. Por favor, intente nuevamente.');
      }
      
      setEstado('noEncontrada');
      setDatosFicticios({});
    } finally {
      setLoading(false);
      setMostrarResultado(true);
    }
  };

  const estadoConfig = {
    validada: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: <CircleCheck className="text-green-600 " size={20} />,
      texto: 'Licencia Validada - Activa',
      textColor: 'text-green-800'
    },
    suspendida: {
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200',
      icon: <AlertTriangle className="text-yellow-600" size={20} />,
      texto: 'Licencia Validada - Suspendida',
      textColor: 'text-yellow-800'
    },
    cancelada: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: <XCircle className="text-red-600" size={20} />,
      texto: 'Licencia Validada - Cancelada',
      textColor: 'text-red-800'
    },
    noEncontrada: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      icon: <XCircle className="text-red-600" size={20} />,
      texto: 'Licencia no encontrada',
      textColor: 'text-red-800'
    }
  };

  return (
    <div className="min-h-screen flex flex-col" style={{background: 'none'}}>
      {/* Fondo dividido como elemento HTML separado, asegurándose que ocupe toda la pantalla */}
      <div 
        className="fixed top-0 left-0 w-full h-full" 
        style={{
          background: 'linear-gradient(to bottom, #2563EB 50%,rgb(243, 245, 247) 50%)',
          zIndex: -1
        }}
      />
      
      {/* Contenido principal (sobre el fondo) */}
      <div className="w-full flex-grow flex flex-col">
        {/* Encabezado */}
        <div className="pt-4 px-4 pb-16">
          {/* Botón de inicio de sesión */}
          <div className="flex justify-end">
            <button 
              className="bg-white text-black font-medium py-2 px-6 rounded-lg flex items-center shadow-md hover:bg-gray-100"
              onClick={() => window.location.href = '/login'}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"></path>
                <polyline points="10 17 15 12 10 7"></polyline>
                <line x1="15" y1="12" x2="3" y2="12"></line>
              </svg>
              Iniciar Sesión
            </button>
          </div>
          
          {/* Título */}
          <div className="text-center py-8 flex justify-center items-center">
            <img 
              src={logo}
              alt="Logo de Aproba" 
              className="h-28" 
              style={{ filter: 'brightness(0) invert(1)' }}
            />
          </div>
        </div>
        
        {/* Contenedor del validador centrado y con ancho responsivo */}
        <div className="mx-auto validator-container">
          <div className="bg-white rounded-lg shadow-xl">
            {/* Encabezado */}
            <div className="p-4 sm:p-6 flex items-center">
              <SearchCheck className="text-blue-600 mr-3 flex-shrink-0" size={24} />
              <h2 className="text-gray-700 text-xl font-medium">Validador de Licencia</h2>
            </div>
            
            {/* Formulario */}
            <div className="p-4 sm:p-6">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="licencia" className="block text-gray-600 mb-2 font-normal">
                    Ingresar Número de Licencia
                  </label>
                  <input
                    id="licencia"
                    type="text"
                    className={`w-full border ${campoVacio ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500`}
                    value={licencia}
                    onChange={handleChange}
                    placeholder="Ingrese el número de licencia"
                    disabled={loading}
                  />
                  {campoVacio && (
                    <p className="text-red-500 text-sm mt-1">Por favor, ingrese un número de licencia.</p>
                  )}
                </div>
                
                <div className="mt-6 mb-10">
                  <button
                    type="submit"
                    className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Validando...' : 'Validar'}
                  </button>
                </div>
              </form>
              
              {error && (
                <div className="mt-4 p-4 rounded-lg bg-red-50">
                  <div className="flex items-center">
                    <XCircle className="text-red-600 flex-shrink-0" size={20} />
                    <span className="ml-2 text-red-800 text-sm sm:text-base">{error}</span>
                  </div>
                </div>
              )}
              
              {mostrarResultado && estado && !error && (
                <div className={`mt-4 p-4 rounded-lg ${estadoConfig[estado].bgColor} ${estadoConfig[estado].borderColor}`}>
                  <div className="flex items-center mb-4">
                    <span className="flex-shrink-0">{estadoConfig[estado].icon}</span>
                    <span className={`ml-2 font-medium ${estadoConfig[estado].textColor} text-sm sm:text-base`}>
                      {estadoConfig[estado].texto}
                    </span>
                  </div>

                  {estado !== 'noEncontrada' && (
                    <div className="space-y-4 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-4">
                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <span className="text-gray-500 text-xs sm:text-sm flex items-center mb-1 sm:mb-0 sm:mr-2 sm:w-36 sm:flex-shrink-0">
                            <User size={16} className="mr-1 flex-shrink-0" />
                            Persona Jurídica:
                          </span>
                          <span className="text-gray-700 text-sm sm:text-base break-words ml-2">{datosFicticios.personaJuridica}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <span className="text-gray-500 text-xs sm:text-sm flex items-center mb-1 sm:mb-0 sm:mr-2 sm:w-36 sm:flex-shrink-0">
                            <CalendarArrowUp size={16} className="mr-1 flex-shrink-0" />
                            Fecha de Emisión:
                          </span>
                          <span className="text-gray-700 text-sm sm:text-base ml-2">{datosFicticios.fechaEmision}</span>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <span className="text-gray-500 text-xs sm:text-sm flex items-center mb-1 sm:mb-0 sm:mr-2 sm:w-36 sm:flex-shrink-0">
                            <Scale size={16} className="mr-1 flex-shrink-0" />
                            Representante Legal:
                          </span>
                          <span className="text-gray-700 text-sm sm:text-base break-words ml-2">{datosFicticios.representanteLegal}</span>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-start">
                          <span className="text-gray-500 text-xs sm:text-sm flex items-center mb-1 sm:mb-0 sm:mr-2 sm:w-36 sm:flex-shrink-0">
                            <CalendarArrowDown size={16} className="mr-1 flex-shrink-0" />
                            Fecha de Vencimiento:
                          </span>
                          <span className="text-gray-700 text-sm sm:text-base ml-2">{datosFicticios.fechaVencimiento}</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Espacio para evitar que el logo se superponga con el contenido */}
        <div className="flex-grow"></div>
        
        {/* Logo de ACOBIR - ahora al final del contenedor, con margen superior */}
        <div className="flex justify-end p-6 mt-8">
          <img 
            src={logoAcobir} 
            alt="Logo ACOBIR" 
            className="w-auto h-auto max-w-full" 
            style={{
              maxWidth: '180px',
              height: 'auto'
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ValidadorPage;