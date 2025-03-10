import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit, Trash2, ChevronDown, Plus, Filter } from 'lucide-react';
import { ViewUserModal, EditUserModal, DeleteUserModal, CreateUserModal } from './UserModals'; // Importamos los modales

const UsersList = () => {
  // Estado local para los usuarios
  const [users, setUsers] = useState([
    { code: '00000000000', name: 'Melissa Castro', email: 'melicadmin@emp.co', phone: '33333333', type: 'Administrador', status: 'Activo' },
    { code: '00000000000', name: 'Melissa Castro', email: 'melicadmin@emp.co', phone: '33333333', type: 'Administrador', status: 'Activo' },
  ]);
  
  // Estado para filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(users);
  
  // Estados para los modales
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Ref para el dropdown de filtros
  const filterRef = useRef(null);
  
  // Opciones de filtro
  const filterOptions = [
    { label: 'Todos', value: '' },
    { label: 'Administrador', value: 'Administrador' },
    { label: 'Cliente', value: 'Cliente' },
    { label: 'Activo', value: 'status-Activo' },
    { label: 'Inactivo', value: 'status-Inactivo' }
  ];
  
  // Función para obtener las clases de estilo según el estado
  const getStatusStyles = (status) => {
    switch (status) {
      case 'Activo':
        return 'bg-green-100 text-green-600';
      case 'Inactivo':
        return 'bg-red-100 text-red-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };
  
  // Efecto para actualizar usuarios filtrados cuando cambian los usuarios
  useEffect(() => {
    applyFilter(filterBy);
  }, [users, filterBy]);

  // Funciones para manejar acciones
  const handleCreateUser = () => {
    // Abrir el modal de creación y asegurarse de que selectedUser es null
    setSelectedUser(null);
    setCreateUserModalOpen(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setEditModalOpen(true);
  };

  const handleView = (user) => {
    setSelectedUser(user);
    setViewModalOpen(true);
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setDeleteModalOpen(true);
  };
  
  const handleSaveUser = (userData) => {
    if (editModalOpen && selectedUser) {
      // Actualizar usuario existente
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user === selectedUser ? userData : user
        )
      );
      setEditModalOpen(false);
    } else {
      // Crear nuevo usuario
      setUsers(prevUsers => [...prevUsers, userData]);
      setCreateUserModalOpen(false);
    }
    setSelectedUser(null);
  };
  
  const handleConfirmDelete = () => {
    if (selectedUser) {
      setUsers(prevUsers => 
        prevUsers.filter(user => user !== selectedUser)
      );
      setDeleteModalOpen(false);
      setSelectedUser(null);
    }
  };
  
  // Función para aplicar filtro
  const applyFilter = (filterValue) => {
    setFilterBy(filterValue);
    setFilterOpen(false);
    
    if (!filterValue) {
      setFilteredUsers(users);
      return;
    }
    
    if (filterValue.startsWith('status-')) {
      const statusValue = filterValue.replace('status-', '');
      setFilteredUsers(users.filter(user => user.status === statusValue));
    } else {
      setFilteredUsers(users.filter(user => user.type === filterValue));
    }
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
        <h2 className="text-xl font-semibold text-gray-600">Lista de Usuarios</h2>
        <p className="text-gray-500 text-sm">Administración y Configuración de los usuarios del sistema</p>
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
            onClick={handleCreateUser}
            className="bg-blue-500 text-white px-4 py-2 rounded-md flex items-center text-sm hover:bg-blue-600 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" /> Crear Usuario
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
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-32">Código</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-48">Nombre Completo</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-56">Correo Electrónico</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-28">Teléfono</th>
                  <th className="py-3 px-4 text-left font-medium tracking-wider w-36">Tipo de Usuario</th>
                  <th className="py-3 px-4 text-center font-medium tracking-wider w-24">Estado</th>
                  <th className="py-3 px-4 text-center font-medium tracking-wider w-28">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-4 text-left text-sm text-gray-500 w-32">{user.code}</td>
                    <td className="py-3 px-4 text-left text-sm font-medium text-gray-900 w-48">{user.name}</td>
                    <td className="py-3 px-4 text-left text-sm text-blue-500 w-56">{user.email}</td>
                    <td className="py-3 px-4 text-left text-sm text-gray-500 w-28">{user.phone}</td>
                    <td className="py-3 px-4 text-left text-sm text-gray-600 w-36">{user.type}</td>
                    <td className="py-3 px-4 text-center w-24">
                      <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyles(user.status)}`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="py-3 px-6 w-28 text-center">
                      <div className="flex justify-center space-x-4">
                        <button onClick={() => handleEdit(user)} className="text-green-400 hover:text-blue-700">
                          <Edit className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleView(user)} className="text-blue-400 hover:text-blue-600">
                          <Eye className="h-5 w-5" />
                        </button>
                        <button onClick={() => handleDelete(user)} className="text-red-500 hover:text-red-700">
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
      <ViewUserModal 
        isOpen={viewModalOpen} 
        onClose={() => setViewModalOpen(false)} 
        user={selectedUser} 
      />
      
      <EditUserModal 
        isOpen={editModalOpen} 
        onClose={() => setEditModalOpen(false)} 
        user={selectedUser}
        onSave={handleSaveUser}
      />
      
      <DeleteUserModal 
        isOpen={deleteModalOpen} 
        onClose={() => setDeleteModalOpen(false)} 
        user={selectedUser}
        onConfirm={handleConfirmDelete}
      />
      
      <CreateUserModal 
        isOpen={createUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
        onSave={handleSaveUser}
      />
    </div>
  );
};

export default UsersList;