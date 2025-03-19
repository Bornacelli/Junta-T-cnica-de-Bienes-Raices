import { useState } from 'react';
import { SearchCheck, CircleCheck, AlertTriangle, XCircle, CalendarArrowDown, CalendarArrowUp, Scale, User } from 'lucide-react';
import api from '../../services/ApiService'; // Importamos el servicio API que has definido

const Validador = () => {
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

  const handleChange = (e) => {
    setLicencia(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      // Usar la ruta correcta según el error (corredores_traer.php)
      const response = await api.get(`/corredores_traer.php?no_lic=${licencia}`);
      const data = response.data;
      
      console.log("Respuesta de API:", data); // Para depuración
      
      // Procesamos la respuesta de la API basada en el formato JSON real
      if (data && data.id) {
        // Modificación: Si no hay estatus_licencia o está vacío, por defecto será "ACTIVA"
        const estatusLicencia = data.estatus_licencia ? data.estatus_licencia.toUpperCase() : 'ACTIVA';
        
        // Mapeamos el estado según el campo "estatus_licencia"
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
            // Por defecto o cuando explícitamente sea "ACTIVA"
            estadoMapeado = 'validada';
            break;
        }
        
        setEstado(estadoMapeado);
        
        // Procesamos las fechas para asegurar un formato consistente
        const formatearFecha = (fechaStr) => {
          if (!fechaStr || fechaStr === '0000-00-00') return 'No disponible';
          
          // Convertir formato YYYY-MM-DD a DD/MM/YYYY
          try {
            const [year, month, day] = fechaStr.split('-');
            if (year === '0000') return 'No disponible';
            return `${day}/${month}/${year}`;
          } catch (e) {
            return fechaStr; // Si hay error, devolvemos el string original
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
      
      // Proporcionar un mensaje más específico basado en el error
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

  // Configuración para los diferentes estados
  const estadoConfig = {
    validada: {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      icon: <CircleCheck className="text-green-600" size={20} />,
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
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
        <div className="flex items-center mb-6 mt-4 mx-4">
          <SearchCheck className="text-blue-600 mr-2 " size={20} />
          <h2 className="text-gray-700 text-lg font-bold">Validador de Licencia</h2>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-6 mx-4">
            <label htmlFor="licencia" className="block text-gray-600 mb-2 font-normal">
              Ingresar Número de Licencia
            </label>
            <input
              id="licencia"
              type="text"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
              value={licencia}
              onChange={handleChange}
              placeholder="Ingrese el número de licencia"
              disabled={loading}
            />
          </div>
          
          <div className="mx-4 my-4">
            <button
              type="submit"
              className={`w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
              disabled={loading}
            >
              {loading ? 'Validando...' : 'Validar'}
            </button>
          </div>
        </form>
        
        {error && (
          <div className="mx-4 mt-4 p-4 rounded-lg bg-red-50">
            <div className="flex items-center">
              <XCircle className="text-red-600" size={20} />
              <span className="ml-2 text-red-800">{error}</span>
            </div>
          </div>
        )}
        
        {mostrarResultado && estado && !error && (
        <div className={`mx-4 mt-4 p-4 rounded-lg ${estadoConfig[estado].bgColor} ${estadoConfig[estado].borderColor}`}>
            <div className="flex items-center mb-4">
            {estadoConfig[estado].icon}
            <span className={`ml-2 font-medium ${estadoConfig[estado].textColor}`}>
                {estadoConfig[estado].texto}
            </span>
            </div>

            {estado !== 'noEncontrada' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                <div className="flex items-start mb-4">
                    <span className="text-gray-500 text-sm mr-2 flex items-center">
                    <User size={18} className="mr-1" />
                    Persona Jurídica:
                    </span>
                    <span className="text-gray-700">{datosFicticios.personaJuridica}</span>
                </div>

                <div className="flex items-start">
                    <span className="text-gray-500 text-sm mr-2 flex items-center">
                    <CalendarArrowUp size={18} className="mr-1" />
                    Fecha de Emisión:
                    </span>
                    <span className="text-gray-700">{datosFicticios.fechaEmision}</span>
                </div>
                </div>

                <div>
                <div className="flex items-start mb-4">
                    <span className="text-gray-500 text-sm mr-2 flex items-center">
                    <Scale size={18} className="mr-1" />
                    Representante Legal:
                    </span>
                    <span className="text-gray-700">{datosFicticios.representanteLegal}</span>
                </div>

                <div className="flex items-start">
                    <span className="text-gray-500 text-sm mr-2 flex items-center">
                    <CalendarArrowDown size={18} className="mr-1" />
                    Fecha de Vencimiento:
                    </span>
                    <span className="text-gray-700">{datosFicticios.fechaVencimiento}</span>
                </div>
                </div>
            </div>
            )}
        </div>
        )}
      </div>
    </div>
  );
};

export default Validador;