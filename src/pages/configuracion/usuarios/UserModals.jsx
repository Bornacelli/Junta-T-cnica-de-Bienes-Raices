import React, { useState, useEffect } from 'react';
import { X, User, UserRoundPen, UserPlus } from 'lucide-react';

// Modal para Ver Usuario


export const ViewUserModal = ({ isOpen, onClose, user }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 modal-backdrop flex items-center justify-center z-50"
      onClick={onClose} // Cierra el modal al hacer clic en el fondo
    >
      <div
        className="bg-white rounded-lg shadow-lg w-4/5 max-w-lg p-6 relative"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <User className="mr-2 text-blue-500" size={25} />
            Información del Usuario
          </h2>
          <div style={{ width: "80%", height: "0.5px", backgroundColor: "#4F81EE", margin: "10px 0 0 0" }}></div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Nombre Completo</h3>
              <p className="text-gray-800">{user?.name || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">N° Documento de Identidad</h3>
              <p className="text-gray-800">{user?.code || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Correo Electrónico</h3>
              <p className="text-blue-500">{user?.email || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Teléfono</h3>
              <p className="text-gray-800">{user?.phone || "N/A"}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Tipo de Usuario</h3>
              <p className="text-gray-800">{user?.type || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estado</h3>
              <p className="inline-block px-3 py-1 text-xs rounded-full bg-green-100 text-green-600 font-medium">
                {user?.status || "N/A"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};


// Modal para Editar Usuario
export const EditUserModal = ({ isOpen, onClose, user, onSave }) => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    type: 'Cliente',
    status: 'Activo'
  });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        code: user.code || '',
        email: user.email || '',
        phone: user.phone || '',
        type: user.type || 'Cliente',
        status: user.status || 'Activo'
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50"
    
    onClick={onClose}>
      <div className="bg-white rounded-lg shadow-lg w-4/5 p-6 relative"
      onClick={(e) => e.stopPropagation()} 
      >
        {/* <button 
          onClick={onClose} 
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button> */}
        
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <UserRoundPen className="mr-2 text-blue-500" size={25} />
            Editar Usuario
          </h2>
          <div style={{ width: "80%", height: "0.5px", backgroundColor: "#4F81EE", margin: "10px 0 0 0" }}></div>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre Completo
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° Documento de Identidad
                </label>
                <input
                  type="text"
                  name="code"
                  value={formData.code}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Usuario
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Administrador">Administrador</option>
                  <option value="Cliente">Cliente</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Activo">Activo</option>
                  <option value="Inactivo">Inactivo</option>
                </select>
              </div>
            </div>
          </div>
          
          <div className="mt-8 flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
            >
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Modal para Crear Usuario Nuevo
export const CreateUserModal = ({ isOpen, onClose, onSave }) => {
    // Estado inicial siempre vacío para el modal de creación
    const [formData, setFormData] = useState({
      name: '',
      code: '',
      email: '',
      phone: '',
      type: 'Cliente',
      status: 'Activo'
    });
  
    // Asegurarse de que los campos estén vacíos cuando se abre el modal
    useEffect(() => {
      if (isOpen) {
        setFormData({
          name: '',
          code: '',
          email: '',
          phone: '',
          type: 'Cliente',
          status: 'Activo'
        });
      }
    }, [isOpen]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData(prev => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = (e) => {
      e.preventDefault();
      onSave(formData);
      // No es necesario resetear el formulario aquí porque el efecto lo hará cuando se vuelva a abrir
    };
  
    if (!isOpen) return null;
  
    return (
      <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50"
      onClick={onClose}
      >
        <div className="bg-white rounded-lg shadow-lg w-4/5 p-6 relative"
            onClick={(e) => e.stopPropagation()} 
        >
          {/* <button 
            onClick={onClose} 
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button> */}
          
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-gray-700 flex items-center">
              <UserPlus className="mr-2 text-blue-500" size={25} />
              Crear un Usuario Nuevo
            </h2>
            <div style={{ width: "80%", height: "0.5px", backgroundColor: "#4F81EE", margin: "10px 0 0 0" }}></div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-800">Información del Usuario</h3>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre Completo
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Juan Pérez"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    N° Documento de Identidad
                  </label>
                  <input
                    type="text"
                    name="code"
                    value={formData.code}
                    onChange={handleChange}
                    placeholder="00000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="correo@mail.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="text"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="000000"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tipo de Usuario
                  </label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Administrador">Administrador</option>
                    <option value="Cliente">Cliente</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div className="mt-8 flex justify-end space-x-4">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              >
                Cerrar
              </button>
              <button
                type="submit"
                className="bg-blue-500 text-white px-6 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                Finalizar Registro
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

// Modal para Confirmar Eliminación
export const DeleteUserModal = ({ isOpen, onClose, user, onConfirm }) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 modal-backdrop flex items-center justify-center z-50"
    onClick={onClose}
    >
      <div className="bg-white rounded-lg shadow-lg w-4/5 max-w-md p-6"
        onClick={(e) => e.stopPropagation()} 
      >
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <X size={24} className="text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Eliminar Usuario</h3>
          <p className="text-gray-500">
            ¿Está seguro que desea eliminar el usuario <span className="font-medium">{user?.name}</span>?
            Esta acción no se puede deshacer.
          </p>
        </div>
        
        <div className="mt-6 flex justify-center space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(user);
              onClose();
            }}
            className="px-6 py-2 bg-red-600 border border-transparent rounded-md text-white hover:bg-red-700"
          >
            Eliminar
          </button>
        </div>
      </div>
    </div>
  );
};

