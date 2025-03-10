import React, { useState, useEffect } from 'react';
import { X, User, UserRoundPen, UserPlus } from 'lucide-react';

// Modal para Ver Usuario
export const ViewUserModal = ({ isOpen, onClose, user }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Allow time for exit animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;
  
  // Function to get status styling based on status value
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

  return (
    <div
      className={`fixed inset-0 modal-backdrop flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div
        className={`bg-white rounded-lg shadow-lg w-4/5 max-w-lg p-6 relative transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        onClick={(e) => e.stopPropagation()}
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
              <p className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getStatusStyles(user?.status)}`}>
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    type: 'Cliente',
    status: 'Activo'
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Allow time for exit animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
      setErrors({});
    }
  }, [user]);

  if (!isOpen && !isAnimating) return null;

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)) {
          error = 'Solo se permiten letras y espacios';
        }
        break;
      case 'code':
        if (!/^\d+$/.test(value)) {
          error = 'Solo se permiten números';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Formato de correo inválido';
        }
        break;
      case 'phone':
        if (!/^\d+$/.test(value)) {
          error = 'Solo se permiten números';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar según el tipo de campo
    if (name === 'phone' || name === 'code') {
      // Solo permitir números
      if (/^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Validar y actualizar errores
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    let formErrors = {};
    let isValid = true;
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(formErrors);
    
    if (isValid) {
      onSave(formData);
    }
  };

  return (
    <div 
      className={`fixed inset-0 modal-backdrop flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-lg w-4/5 p-6 relative transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <UserRoundPen className="mr-2 text-blue-500" size={25} />
            Editar Usuario
          </h2>
          <div style={{ width: "80%", height: "0.5px", backgroundColor: "#4F81EE", margin: "10px 0 0 0" }}></div>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
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
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
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
                  className={`w-full px-3 py-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  inputMode="numeric"
                  required
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                )}
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
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  inputMode="numeric"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
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
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    email: '',
    phone: '',
    type: 'Cliente',
    status: 'Activo'
  });
  
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Allow time for exit animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

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
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'name':
        if (!/^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(value)) {
          error = 'Solo se permiten letras y espacios';
        }
        break;
      case 'code':
        if (!/^\d+$/.test(value)) {
          error = 'Solo se permiten números';
        }
        break;
      case 'email':
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Formato de correo inválido';
        }
        break;
      case 'phone':
        if (!/^\d+$/.test(value)) {
          error = 'Solo se permiten números';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Validar según el tipo de campo
    if (name === 'phone' || name === 'code') {
      // Solo permitir números
      if (/^\d*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Validar y actualizar errores
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validar todos los campos antes de enviar
    let formErrors = {};
    let isValid = true;
    
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) {
        formErrors[key] = error;
        isValid = false;
      }
    });
    
    setErrors(formErrors);
    
    if (isValid) {
      onSave(formData);
    }
  };

  return (
    <div 
      className={`fixed inset-0 modal-backdrop flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-lg w-4/5 p-6 relative transition-all duration-300 ${isOpen ? 'opacity-100 scale-100 translate-y-0' : 'opacity-0 scale-95 translate-y-8'}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-700 flex items-center">
            <UserPlus className="mr-2 text-blue-500" size={25} />
            Crear un Usuario Nuevo
          </h2>
          <div style={{ width: "80%", height: "0.5px", backgroundColor: "#4F81EE", margin: "10px 0 0 0" }}></div>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
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
                  className={`w-full px-3 py-2 border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">{errors.name}</p>
                )}
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
                  className={`w-full px-3 py-2 border ${errors.code ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  inputMode="numeric"
                  required
                />
                {errors.code && (
                  <p className="text-red-500 text-xs mt-1">{errors.code}</p>
                )}
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
                  className={`w-full px-3 py-2 border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="000000"
                  className={`w-full px-3 py-2 border ${errors.phone ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  inputMode="numeric"
                  required
                />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                )}
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
  const [isAnimating, setIsAnimating] = useState(false);
  
  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
    } else {
      // Allow time for exit animation
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;
  
  return (
    <div 
      className={`fixed inset-0 modal-backdrop flex items-center justify-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100 backdrop-blur-sm bg-black/50' : 'opacity-0'}`}
      onClick={onClose}
    >
      <div 
        className={`bg-white rounded-lg shadow-lg w-4/5 max-w-md p-6 transition-all duration-300 ${isOpen ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
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