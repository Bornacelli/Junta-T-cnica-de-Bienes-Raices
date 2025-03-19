import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit, Trash2, ChevronDown, Plus, Filter, Search } from 'lucide-react';
import { ViewCorredorModal, EditCorredorModal, DeleteCorredorModal, CreateCorredorModal } from './CorredoresModals';
import api from '../../../services/ApiService'; // Importamos la instancia de axios que has creado

const CorredoresList = () => {
  // Estado local para los corredores
  const [corredores, setCorredores] = useState([]);
  
  // Estado para controlar la carga
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estado para filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCorredores, setFilteredCorredores] = useState([]);
  
  // Estados para los modales
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createCorredorModalOpen, setCreateCorredorModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCorredor, setSelectedCorredor] = useState(null);
  
  // Refs para los dropdowns
  const filterRef = useRef(null);
  
  // Opciones de filtro
  const filterOptions = [
    { label: 'Todos', value: '' },
    { label: 'Activa', value: 'estatusLicencia-Activa' },
    { label: 'Suspendida', value: 'estatusLicencia-Suspendida' },
    { label: 'Cancelada', value: 'estatusLicencia-Cancelada' }
  ];
  
  // Función para obtener los corredores desde la API
  // Función para obtener los corredores desde la API
// Función para obtener los corredores desde la API
const fetchCorredores = async () => {
  try {
    setLoading(true);
    setError(null);
    const response = await api.get('/corredores_traertodos.php');
    
    // Mapear los campos del backend a los nombres usados en el componente
    const mappedCorredores = response.data.map(item => ({
      numLic: item.no_lic_pj, // N° Lic PJ
      personaJuridica: item.listado_persona_juridica,
      fechaEmision: item.emision,
      fechaVencimiento: item.vencimiento,
      estatusLicencia: item.estatus_licencia,
      suspendidaHasta: item.suspendidos_hasta_fecha,
      representanteLegal: item.representante_legal,
      noLic: item.no_lic 
    }));
    
    setCorredores(mappedCorredores);
    setLoading(false);
  } catch (err) {
    setError('Error al cargar los datos. Por favor, intente de nuevo más tarde.');
    setLoading(false);
    console.error('Error fetching corredores:', err);
  }
};

  // Cargar los datos al montar el componente
  useEffect(() => {
    fetchCorredores();
  }, []);
  
  // Función para obtener las clases de estilo según el estado
  // Función para obtener las clases de estilo según el estado
const getStatusStyles = (status) => {
  // Asegúrate de que la comparación sea insensible a mayúsculas/minúsculas
  const statusLower = status?.toLowerCase();
  
  if (statusLower === 'activa') {
    return 'bg-green-100 text-green-600';
  } else if (statusLower === 'suspendida') {
    return 'bg-yellow-100 text-yellow-400';
  } else if (statusLower === 'cancelada') {
    return 'bg-red-100 text-red-600';
  } else {
    return 'bg-gray-100 text-gray-600';
  }
};
  
  // Efecto para aplicar filtros y búsqueda cuando cambian los corredores, el filtro o la búsqueda
  useEffect(() => {
    let result = corredores; // Ya están mapeados con los nombres correctos
    
    // Aplicar filtro por estado
    if (filterBy && filterBy.startsWith('estatusLicencia-')) {
      const statusValue = filterBy.replace('estatusLicencia-', '');
      result = result.filter(corredor => corredor.estatusLicencia === statusValue);
    }
    
    // Aplicar búsqueda
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(corredor => 
        (corredor.numLic && corredor.numLic.toLowerCase().includes(query)) ||
        (corredor.personaJuridica && corredor.personaJuridica.toLowerCase().includes(query)) ||
        (corredor.representanteLegal && corredor.representanteLegal.toLowerCase().includes(query)) ||
        (corredor.estatusLicencia && corredor.estatusLicencia.toLowerCase().includes(query)) ||
        (corredor.fechaEmision && new Date(corredor.fechaEmision).toLocaleDateString().includes(query)) ||
        (corredor.fechaVencimiento && new Date(corredor.fechaVencimiento).toLocaleDateString().includes(query)) ||
        (corredor.suspendidaHasta && new Date(corredor.suspendidaHasta).toLocaleDateString().includes(query))
      );
    }
    
    setFilteredCorredores(result);
  }, [corredores, filterBy, searchQuery]);

  // Funciones para manejar acciones
  const handleCreateCorredor = () => {
    setSelectedCorredor(null);
    setCreateCorredorModalOpen(true);
  };

  const handleEdit = (corredor) => {
    setSelectedCorredor(corredor);
    setEditModalOpen(true);
  };

  const handleView = (corredor) => {
    setSelectedCorredor(corredor);
    setViewModalOpen(true);
  };

  const handleDelete = (corredor) => {
    setSelectedCorredor(corredor);
    setDeleteModalOpen(true);
  };
  
  const handleSaveCorredor = async (corredorData) => {
    try {
      if (editModalOpen && selectedCorredor) {
        // Actualizar corredor existente
        await api.put(`/api/corredores/${selectedCorredor.id}`, corredorData);
        setEditModalOpen(false);
      } else {
        // Crear nuevo corredor
        await api.post('/api/corredores', corredorData);
        setCreateCorredorModalOpen(false);
      }
      // Refrescar la lista después de guardar
      fetchCorredores();
      setSelectedCorredor(null);
    } catch (err) {
      console.error('Error al guardar los datos:', err);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };
  
  const handleConfirmDelete = async () => {
    if (selectedCorredor) {
      try {
        await api.delete(`/api/corredores/${selectedCorredor.id}`);
        setDeleteModalOpen(false);
        setSelectedCorredor(null);
        // Refrescar la lista después de eliminar
        fetchCorredores();
      } catch (err) {
        console.error('Error al eliminar el corredor:', err);
        // Aquí podrías mostrar un mensaje de error al usuario
      }
    }
  };
  
  // Función para aplicar filtro
  const applyFilter = (filterValue) => {
    setFilterBy(filterValue);
    setFilterOpen(false);
  };
  
  // Función para manejar la búsqueda
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };
  
  // Función para limpiar los filtros
  const clearFilters = () => {
    setFilterBy('');
    setSearchQuery('');
  };
  
  // Función para dar formato a las fechas
  // Función para dar formato a las fechas
const formatDate = (dateString) => {
  if (!dateString) return "-";
  
  // Validar si la fecha es válida antes de formatearla
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "-"; // Si la fecha es inválida
  
  return date.toLocaleDateString();
};
  
  // Función para cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  return (
    <div className="bg-white p-8 rounded-lg shadow w-100 space">
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-600">Lista de Corredores de Bienes</h2>
        <p className="text-gray-500 text-sm">Administración y Configuración de los corredores de bienes del sistema</p>
      </div>
      
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        {/* Buscador */}
        <div className="relative w-full md:w-80">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar por licencia, nombre, representante..."
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-800 text-sm"
              value={searchQuery}
              onChange={handleSearch}
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute inset-y-0 right-5 left-20 pr-3 flex items-center text-gray-400 hover:text-gray-500"
              >
                <span className="text-sm">×</span>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabla unificada con encabezados alineados con el contenido */}
      <div className="relative">
        <div className="overflow-hidden border border-gray-200 rounded-md">
          <div className="overflow-y-auto" style={{ maxHeight: "330px" }}>
          <table className="w-full">
          <thead className="bg-gray-50 sticky top-0">
  <tr className="text-xs text-gray-500">
    <th className="py-3 px-4 text-left font-medium tracking-wider w-24">N° Lic PJ</th>
    <th className="py-3 px-4 text-left font-medium tracking-wider w-48">Persona Jurídica</th>
    <th className="py-3 px-4 text-left font-medium tracking-wider w-32">Fecha Emisión</th>
    <th className="py-3 px-4 text-left font-medium tracking-wider w-32">Fecha Vencimiento</th>
    <th className="py-3 px-4 text-center font-medium tracking-wider w-28">Estatus</th>
    <th className="py-3 px-4 text-left font-medium tracking-wider w-32">Suspendida Hasta</th>
    <th className="py-3 px-4 text-left font-medium tracking-wider w-40">Representante Legal</th>
    <th className="py-3 px-4 text-left font-medium tracking-wider w-24">N° Lic</th>
  </tr>
</thead>
<tbody>
  {loading ? (
    <tr>
      <td colSpan="8" className="py-4 text-center">
        Cargando usuarios...
      </td>
    </tr>
  ) : error ? (
    <tr>
      <td colSpan="8" className="py-8 text-center text-red-500 text-sm">
        {error}
      </td>
    </tr>
  ) : filteredCorredores.length > 0 ? (
    filteredCorredores.map((corredor, index) => (
      <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
        <td className="py-3 px-4 text-left text-sm text-gray-500 w-24">{corredor.numLic}</td>
        <td className="py-3 px-4 text-left text-sm font-medium text-gray-900 w-48">{corredor.personaJuridica}</td>
        <td className="py-3 px-4 text-left text-sm text-gray-500 w-32">{formatDate(corredor.fechaEmision)}</td>
        <td className="py-3 px-4 text-left text-sm text-gray-500 w-32">{formatDate(corredor.fechaVencimiento)}</td>
        <td className="py-3 px-4 text-center w-28">
          <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyles(corredor.estatusLicencia)}`}>
            {corredor.estatusLicencia}
          </span>
        </td>
        <td className="py-3 px-4 text-left text-sm text-gray-500 w-32">{formatDate(corredor.suspendidaHasta)}</td>
        <td className="py-3 px-4 text-left text-sm text-gray-600 w-40">{corredor.representanteLegal}</td>
        <td className="py-3 px-4 text-left text-sm text-gray-500 w-24">{corredor.noLic}</td>
      </tr>
    ))
  ) : (
    <tr>
      <td colSpan="8" className="py-8 text-center text-gray-500 text-sm">
        No se encontraron corredores que coincidan con los criterios de búsqueda.
      </td>
    </tr>
  )}
</tbody>
</table>
          </div>
        </div>
      </div>
      
      {/* Modales */}
      <ViewCorredorModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        corredor={selectedCorredor} 
      />
      
      <EditCorredorModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        corredor={selectedCorredor}
        onSave={handleSaveCorredor}
      />
      
      <DeleteCorredorModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        corredor={selectedCorredor}
        onConfirm={handleConfirmDelete}
      />
      
      <CreateCorredorModal 
        isOpen={createCorredorModalOpen}
        onClose={() => setCreateCorredorModalOpen(false)}
        onSave={handleSaveCorredor}
      />
    </div>
  );
};

export default CorredoresList;