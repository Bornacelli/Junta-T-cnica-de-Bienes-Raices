import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit, Trash2, ChevronDown, Plus, Filter } from 'lucide-react';
import { ViewCorredorModal, EditCorredorModal, DeleteCorredorModal, CreateCorredorModal } from './CorredoresModals'; // Importamos los modales

const CorredoresList = () => {
  // Estado local para los corredores
  const [corredores, setCorredores] = useState([
    { numLic: '001', personaJuridica: 'Inversiones Inmobiliarias S.A.', fechaEmision: '2023-05-12', fechaVencimiento: '2025-05-12', estatusLicencia: 'Activa', suspendidaHasta: '', representanteLegal: 'María González' },
    { numLic: '002', personaJuridica: 'Bienes Raíces Capital S.R.L.', fechaEmision: '2022-08-15', fechaVencimiento: '2024-08-15', estatusLicencia: 'Suspendida', suspendidaHasta: '2024-06-30', representanteLegal: 'Roberto Méndez' },
    { numLic: '002', personaJuridica: 'Distribuciones Dalase', fechaEmision: '2023-08-15', fechaVencimiento: '2025-08-15', estatusLicencia: 'Cancelada', suspendidaHasta: '', representanteLegal: 'Antonio Parra' },
  ]);
  
  // Estado para filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [filteredCorredores, setFilteredCorredores] = useState(corredores);
  
  // Estados para los modales
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createCorredorModalOpen, setCreateCorredorModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedCorredor, setSelectedCorredor] = useState(null);
  
  // Ref para el dropdown de filtros
  const filterRef = useRef(null);
  
  // Opciones de filtro
  const filterOptions = [
    { label: 'Todos', value: '' },
    { label: 'Activa', value: 'estatusLicencia-Activa' },
    { label: 'Suspendida', value: 'estatusLicencia-Suspendida' },
    { label: 'Cancelada', value: 'estatusLicencia-Cancelada' }
  ];
  
  // Función para obtener las clases de estilo según el estado
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Activa':
        return 'bg-green-100 text-green-600';
      case 'Suspendida':
        return 'bg-yellow-100 text-yellow-400';
      case 'Cancelada':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Efecto para actualizar corredores filtrados cuando cambian los corredores
  useEffect(() => {
    applyFilter(filterBy);
  }, [corredores, filterBy]);

  // Funciones para manejar acciones
  const handleCreateCorredor = () => {
    // Abrir el modal de creación y asegurarse de que selectedCorredor es null
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
  
  const handleSaveCorredor = (corredorData) => {
    if (editModalOpen && selectedCorredor) {
      // Actualizar corredor existente
      setCorredores(prevCorredores => 
        prevCorredores.map(corredor => 
          corredor === selectedCorredor ? corredorData : corredor
        )
      );
      setEditModalOpen(false);
    } else {
      // Crear nuevo corredor
      setCorredores(prevCorredores => [...prevCorredores, corredorData]);
      setCreateCorredorModalOpen(false);
    }
    setSelectedCorredor(null);
  };
  
  const handleConfirmDelete = () => {
    if (selectedCorredor) {
      setCorredores(prevCorredores => 
        prevCorredores.filter(corredor => corredor !== selectedCorredor)
      );
      setDeleteModalOpen(false);
      setSelectedCorredor(null);
    }
  };
  
  // Función para aplicar filtro
  const applyFilter = (filterValue) => {
    setFilterBy(filterValue);
    setFilterOpen(false);
    
    if (!filterValue) {
      setFilteredCorredores(corredores);
      return;
    }
    
    if (filterValue.startsWith('estatusLicencia-')) {
      const statusValue = filterValue.replace('estatusLicencia-', '');
      setFilteredCorredores(corredores.filter(corredor => corredor.estatusLicencia === statusValue));
    }
  };
  
  // Función para dar formato a las fechas
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };
  
  // Función para cerrar el dropdown cuando se hace clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setFilterOpen(false);
      }
    }
    
    // Agregar event listener cuando el componente se monta
    document.addEventListener("mousedown", handleClickOutside);
    
    // Limpiar event listener cuando el componente se desmonta
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [filterRef]);

  return (
    <div className="bg-white p-8 rounded-lg shadow w-100 space">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-gray-600">Lista de Corredores de Bienes</h2>
        <p className="text-gray-500 text-sm">Administración y Configuración de los corredores de bienes del sistema</p>
      </div>
      
      <div className="flex justify-between items-center mb-6">
        <div className="flex-grow"></div>
        <div className="flex space-x-3">
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setFilterOpen(!filterOpen)} 
              className="px-4 py-2 text-sm text-gray-700 flex items-center border border-gray-300 rounded-md"
            >
              Filtrar por <Filter className='ml-2 h-4 w-4 text-gray-500' /> <ChevronDown className="ml-2 h-4 w-4" />
            </button>
            {filterOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-300 rounded-md text-gray-700 shadow-lg z-10">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                    onClick={() => applyFilter(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button 
            onClick={handleCreateCorredor}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-blue-600 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Crear Corredor
          </button>
        </div>
      </div>
      
      {/* Tabla unificada con encabezados alineados con el contenido */}
      <div className="relative">
        <div className="overflow-hidden border border-gray-200 rounded-md">
          <div className="overflow-y-auto" style={{ maxHeight: "330px" }}>
            <table className="w-full">
              <thead className="bg-gray-50 sticky top-0">
                <tr className="text-xs text-gray-500">
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-24">N° Lic</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-48">Persona Jurídica</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-32">Fecha Emisión</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-32">Fecha Vencimiento</th>
                  <th className="py-3 px-4 text-center font-medium tracking-wider w-28">Estatus</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-32">Suspendida Hasta</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-40">Representante Legal</th>
                  <th className="py-3 px-4 text-center font-medium tracking-wider w-28">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredCorredores.map((corredor, index) => (
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
                    <td className="py-3 px-6 w-28 text-center">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleEdit(corredor)} className="text-green-400 hover:text-blue-700">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleView(corredor)} className="text-blue-400 hover:text-blue-600">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(corredor)} className="text-red-500 hover:text-red-700">
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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