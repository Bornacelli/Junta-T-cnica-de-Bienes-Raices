import { useState } from 'react';
import { SearchCheck, CircleCheck, AlertTriangle, XCircle, CalendarArrowDown, CalendarArrowUp, Scale, User } from 'lucide-react';

const Validador = () => {
  const [licencia, setLicencia] = useState('222');
  const [estado, setEstado] = useState('validada'); // Puede ser: 'validada', 'suspendida', 'cancelada', 'noEncontrada' o null (cuando no hay resultado)
  const [mostrarResultado, setMostrarResultado] = useState(true);
  const [datosFicticios, setDatosFicticios] = useState({
    personaJuridica: 'Inversiones Natasha, S.A.',
    representanteLegal: 'Natasha Sucre',
    fechaEmision: '18/12/2020',
    fechaVencimiento: '18/12/2025'
  });

  const handleChange = (e) => {
    setLicencia(e.target.value);
    setMostrarResultado(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulamos diferentes resultados según el número de licencia ingresado
    if (licencia === '222') {
      setEstado('validada');
      setDatosFicticios({
        personaJuridica: 'Inversiones Natasha, S.A.',
        representanteLegal: 'Natasha Sucre',
        fechaEmision: '18/12/2020',
        fechaVencimiento: '18/12/2025'
      });
    } else if (licencia === '333') {
      setEstado('suspendida');
      setDatosFicticios({
        personaJuridica: 'Comercial Panamá, S.A.',
        representanteLegal: 'Carlos Mendoza',
        fechaEmision: '05/06/2021',
        fechaVencimiento: '05/06/2026'
      });
    } else if (licencia === '444') {
      setEstado('cancelada');
      setDatosFicticios({
        personaJuridica: 'Distribuidora Central, S.A.',
        representanteLegal: 'Luis Gómez',
        fechaEmision: '10/01/2019',
        fechaVencimiento: '10/01/2024'
      });
    } else {
      setEstado('noEncontrada');
      setDatosFicticios({});
    }
    setMostrarResultado(true);
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
            />
          </div>
          
          <div className="mx-4 my-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition-colors duration-200"
            >
              Validar
            </button>
          </div>
        </form>
        
        {mostrarResultado && estado && (
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