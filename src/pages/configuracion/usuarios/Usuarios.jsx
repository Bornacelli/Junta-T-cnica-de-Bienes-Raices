import React, { useState, useEffect, useRef } from 'react';
import { Eye, Edit, Trash2, ChevronDown, Plus, Filter, ToggleLeft, ToggleRight } from 'lucide-react';
import { ViewUserModal, EditUserModal, DeleteUserModal, CreateUserModal, PasswordModal } from './UserModals'; // Importamos los modales
import api from '../../../services/ApiService';

const UsersList = () => {
  
  // Estado los usuarios
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false); // Estado para controlar carga durante acciones
  
  // Estado para filtros
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterBy, setFilterBy] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  
  // Estados para los modales
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  
  // Ref para el dropdown de filtros
  const filterRef = useRef(null);
  
  // Opciones de filtro
  const filterOptions = [
    { label: 'Todos', value: '' },
    { label: 'Administrador', value: 'ADMINISTRADOR' },
    { label: 'Cliente', value: 'Cliente' },
    { label: 'Activo', value: 'status-Activo' },
    { label: 'Inactivo', value: 'status-Inactivo' }
  ];


// endpoints separados
const handleToggleStatusSafe = async (userToToggle) => {
  if (!userToToggle || !userToToggle.usu_id) {
    console.error('Error: No se proporcionó usuario válido para toggle');
    return;
  }
  
  try {
    setActionLoading(true);
    
    // Guarda el ID del usuario de forma segura
    const userId = userToToggle.usu_id;
    const isCurrentlyActive = userToToggle.usu_estado === 1;
    
    console.log(`${isCurrentlyActive ? 'Inactivando' : 'Activando'} usuario con ID:`, userId);
    
    // Determinar qué endpoint usar basado en el estado actual
    const endpoint = isCurrentlyActive 
      ? '/usuario_inactivar.php'  // Si está activo, lo inactivamos
      : '/usuario_activar.php';   // Si está inactivo, lo activamos
    
    // Llamar a la API correspondiente
    const response = await api.post(endpoint, {
      usu_id: userId
    });
    
    console.log(`Respuesta de ${isCurrentlyActive ? 'inactivación' : 'activación'}:`, response);
    
    // Actualizar estado local de forma segura
    setUsers(prevUsers => {
      return prevUsers.map(u => {
        if (u.usu_id === userId) {
          const newState = u.usu_estado === 1 ? 0 : 1;
          console.log(`Cambiando estado de usuario ${userId} de ${u.usu_estado} a ${newState}`);
          return {...u, usu_estado: newState};
        }
        return u;
      });
    });
    
    // Actualizar lista filtrada también
    setFilteredUsers(prevUsers => {
      return prevUsers.map(u => {
        if (u.usu_id === userId) {
          const newState = u.usu_estado === 1 ? 0 : 1;
          return {...u, usu_estado: newState};
        }
        return u;
      });
    });
    
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    setError('Error al cambiar el estado del usuario. Intente nuevamente.');
  } finally {
    setActionLoading(false);
  }
};
  
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
  
  // Función para cargar los usuarios desde la API
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Verificar si hay token disponible
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No hay token de autenticación disponible');
        setLoading(false);
        return;
      }
      
      console.log('Fetching users with token:', token.substring(0, 10) + '...');
      
      const response = await api.get('/usuario_traertodos.php');
      console.log('API response:', response);
      
      if (response.data) {
        // Verificar si la respuesta tiene un formato esperado
        if (Array.isArray(response.data)) {
          console.log('Usuarios obtenidos:', response.data.length);
          setUsers(response.data);
        } else if (response.data.usuarios && Array.isArray(response.data.usuarios)) {
          // Algunas APIs devuelven los datos en un objeto con una propiedad
          console.log('Usuarios obtenidos (desde propiedad usuarios):', response.data.usuarios.length);
          setUsers(response.data.usuarios);
        } else {
          console.error('Formato de respuesta inesperado:', response.data);
          setError('El formato de la respuesta de la API no es el esperado');
          setUsers([]);
        }
      } else {
        console.error('No se recibieron datos de la API');
        setError('No se recibieron datos de la API');
        setUsers([]);
      }
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
      if (error.response) {
        console.error('Detalles del error:', error.response.status, error.response.data);
        if (error.response.status === 401) {
          setError('Error de autenticación: Token inválido o expirado');
        } else {
          setError(`Error al obtener usuarios: ${error.response.status} - ${error.response.statusText}`);
        }
      } else if (error.request) {
        setError('No se pudo conectar con el servidor. Verifique su conexión a internet.');
      } else {
        setError(`Error inesperado: ${error.message}`);
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };
  
  // Cargar los usuarios cuando el componente se monta
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Efecto para actualizar usuarios filtrados cuando cambian los usuarios
  useEffect(() => {
    if (users.length > 0) {
      applyFilter(filterBy);
    }
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

  // Nueva función para inactivar/activar usuario
  // Función modificada para el cambio de estado
const handleToggleStatus = async (user, event) => {
  // Importante: detener la propagación del evento para que no afecte a otros handlers
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }
  
  try {
    setActionLoading(true);
    
    // Llamar a la API para cambiar estado
    const response = await api.post('/usuario_inactivar.php', {
      usu_id: user.usu_id
    });
    
    console.log('Respuesta de inactivación:', response);
    
    // Actualizar estado local inmediatamente
    setUsers(prevUsers => 
      prevUsers.map(u => {
        if (u.usu_id === user.usu_id) {
          return {...u, usu_estado: u.usu_estado === 1 ? 0 : 1};
        }
        return u;
      })
    );
    
  } catch (error) {
    console.error('Error al cambiar estado:', error);
    setError(error.response?.data?.message || "Error al cambiar el estado");
  } finally {
    setActionLoading(false);
  }
};

  // Función para generar una contraseña aleatoria
  const generateRandomPassword = (length = 8) => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()";
    let password = "";
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    return password;
  };
  
  const handleSaveUser = async (userData) => {
    try {
      console.log('userData recibido:', userData);
      
      // Generar contraseña automáticamente solo para nuevos usuarios
      const randomPassword = !editModalOpen ? generateRandomPassword(10) : null;
      
      // Transformar los datos del formulario al formato que espera la API
      const apiData = {
        usu_nombre: userData.name,
        usu_documento: userData.code,
        usu_correo: userData.email,
        usu_telefono: userData.phone,
        usu_rol: userData.type,
        // usu_estado: userData.status ? (String(userData.status).toLowerCase() === 'activo' ? 1 : 0) : 0
      };
      
      // Añadir password solo para usuarios nuevos
      if (randomPassword) {
        apiData.usu_password = randomPassword;
      }
      
      console.log('Enviando datos a API:', apiData);
      
      if (editModalOpen && selectedUser) {
        // Añadir el ID del usuario para la actualización
        apiData.usu_id = selectedUser.usu_id;
        apiData.usu_estado = selectedUser.usu_estado;
        
        console.log('Actualizando usuario con ID:', selectedUser.usu_id);
        
        try {
          // Actualizar usuario existente
          const response = await api.put(`/usuario_modificar.php`, apiData);
          console.log('Respuesta de actualización:', response);
          
          await fetchUsers();
          setEditModalOpen(false);
          return { error: false };
        } catch (updateError) {
          console.error('Error al actualizar usuario:', updateError);
          
          // Detectar error de duplicación
          if (updateError.response && updateError.response.status === 409) {
            return { 
              error: true, 
              message: "Ya existe un usuario con este correo o número de documento" 
            };
          }
          
          // Otros errores de la API
          if (updateError.response && updateError.response.data && updateError.response.data.message) {
            return { error: true, message: updateError.response.data.message };
          }
          
          throw updateError; // Relanzar para que lo capture el bloque catch general
        }
      } else {
        // Lógica para crear un nuevo usuario (sin cambios)
        const response = await api.post('/usuario_insertar.php', apiData);
        console.log('Respuesta de creación:', response);
        
        // Guardar la contraseña y mostrar modal
        setGeneratedPassword(randomPassword);
        setCreateUserModalOpen(false);
        setPasswordModalOpen(true);
        
        await fetchUsers();
        return { error: false };
      }
    } catch (error) {
      console.error('Error al guardar usuario:', error);
      
      // Extraer el mensaje de error
      let errorMessage = "Error al guardar el usuario";
      
      if (error.response) {
        console.error('Detalles del error:', error.response.status, error.response.data);
        
        // Respuesta específica para errores comunes
        if (error.response.status === 409) {
          errorMessage = "Ya existe un usuario con este correo o número de documento";
        } else if (error.response.status === 400) {
          errorMessage = "Datos de usuario inválidos";
        } else if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return { error: true, message: errorMessage };
    } finally {
      // Si ocurre un error grave, asegurarse de limpiar
      if (!editModalOpen) {
        setSelectedUser(null);
      }
    }
  };
  
  const handleConfirmDelete = async () => {
    if (selectedUser) {
      try {
        await api.delete(`/ruta_eliminacion_usuario.php?id=${selectedUser.id}`); // Ajusta la ruta según tu API
        // Recargar los usuarios después de eliminar
        await fetchUsers();
        setDeleteModalOpen(false);
        setSelectedUser(null);
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
        // Aquí podrías manejar errores o mostrar notificaciones
      }
    }
  };
  
  // Función para aplicar filtro
  const applyFilter = (filterValue) => {
    if (!Array.isArray(users) || users.length === 0) {
      setFilteredUsers([]);
      return;
    }
    
    setFilterBy(filterValue);
    setFilterOpen(false);
    
    if (!filterValue) {
      setFilteredUsers([...users]);
      return;
    }
    
    if (filterValue.startsWith('status-')) {
      const statusValue = filterValue.replace('status-', '');
      const isActive = statusValue === 'Activo';
      
      setFilteredUsers(users.filter(user => {
        const userIsActive = user.usu_estado === 1 || user.usu_estado === '1';
        return (isActive && userIsActive) || (!isActive && !userIsActive);
      }));
    } else {
      setFilteredUsers(users.filter(user => user.usu_rol === filterValue));
    }
  };
  
  // Función para recargar los datos
  const handleRefresh = () => {
    fetchUsers();
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
        <div className="flex-grow">
          {error && <p className="text-red-500 text-sm">{error} <button onClick={handleRefresh} className="text-blue-500 ml-2 underline">Reintentar</button></p>}
        </div>
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
                  <th className="py-3 px-4 text-center font-medium tracking-wider w-36">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-4 text-center">
                      Cargando usuarios...
                    </td>
                  </tr>
                ) : filteredUsers.length > 0 ? (
                  filteredUsers.map((user, index) => (
                    <tr key={index} className="border-t border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-left text-sm text-gray-500 w-32">{user.usu_documento || ''}</td>
                      <td className="py-3 px-4 text-left text-sm font-medium text-gray-900 w-48">{user.usu_nombre || ''}</td>
                      <td className="py-3 px-4 text-left text-sm text-blue-500 w-56">{user.usu_correo || ''}</td>
                      <td className="py-3 px-4 text-left text-sm text-gray-500 w-28">{user.usu_telefono || ''}</td>
                      <td className="py-3 px-4 text-left text-sm text-gray-600 w-36">{user.usu_rol || ''}</td>
                      <td className="py-3 px-4 text-center w-24">
                        <span className={`px-3 py-1 text-xs rounded-full font-medium ${getStatusStyles(user.usu_estado === 1 ? 'Activo' : 'Inactivo')}`}>
                          {user.usu_estado === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      

<td className="py-3 px-4 w-36 text-center">
  <div className="flex justify-center space-x-3">

  
    {/* Botón de Editar */}
    <button 
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleEdit(user);
      }} 
      className="text-green-400 hover:text-green-700" 
      title="Editar usuario"
    >
      <Edit className="h-4 w-4" />
    </button>
    
    {/* Botón de Ver */}
    <button 
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleView(user);
      }} 
      className="text-blue-400 hover:text-blue-600"
      title="Ver detalles"
    >
      <Eye className="h-4 w-4" />
    </button>

      {/* Botón cambiar estado */}
    <button 
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleToggleStatusSafe(user);
      }} 
      className={`${user.usu_estado === 1 ? 'text-red-500 hover:text-red-700' : 'text-green-500 hover:text-green-700'}`}
      disabled={actionLoading}
      title={user.usu_estado === 1 ? "Inactivar usuario" : "Activar usuario"}
    >
      {user.usu_estado === 1 ? 
        <ToggleLeft className="h-4 w-4" /> : 
        <ToggleRight className="h-4 w-4" />
      }
    </button>
    
    {/* Botón de Eliminar */}
    {/* <button 
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        e.preventDefault();
        handleDelete(user);
      }} 
      className="text-red-500 hover:text-red-700"
      title="Eliminar usuario"
    >
      <Trash2 className="h-4 w-4" />
    </button> */}
    
    
  </div>
</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-4 text-center">
                      {error ? 'Error al cargar usuarios' : 'No se encontraron usuarios.'}
                    </td>
                  </tr>
                )}
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
  onToggleStatus={handleToggleStatusSafe} // Usar la función segura
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
        onSave={async (userData) => {
          const result = await handleSaveUser(userData);
          return result;
        }}
      />
  
      <PasswordModal 
        isOpen={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
        password={generatedPassword}
      />
    </div>
  );
}

export default UsersList