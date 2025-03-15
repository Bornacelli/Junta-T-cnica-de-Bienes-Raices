import React, { useState, useEffect } from 'react';
import { X, Briefcase, FileEdit, UserPlus } from 'lucide-react';

// Modal para Ver Corredor de Bienes
export const ViewCorredorModal = ({ isOpen, onClose, corredor }) => {
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

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
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
            <Briefcase className="mr-2 text-blue-500" size={25} />
            Información del Corredor de Bienes
          </h2>
          <div style={{ width: "80%", height: "0.5px", backgroundColor: "#4F81EE", margin: "10px 0 0 0" }}></div>
        </div>
        
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">N° Licencia</h3>
              <p className="text-gray-800">{corredor?.numLic || "N/A"}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Persona Jurídica</h3>
              <p className="text-gray-800">{corredor?.personaJuridica || "N/A"}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha Emisión</h3>
              <p className="text-gray-800">{formatDate(corredor?.fechaEmision)}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Fecha Vencimiento</h3>
              <p className="text-gray-800">{formatDate(corredor?.fechaVencimiento)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Estatus Licencia</h3>
              <p className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${getStatusStyles(corredor?.estatusLicencia)}`}>
                {corredor?.estatusLicencia || "N/A"}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">Suspendida hasta</h3>
              <p className="text-gray-800">{corredor?.estatusLicencia === 'Suspendida' ? formatDate(corredor?.suspendidaHasta) : "N/A"}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-1">Representante Legal</h3>
            <p className="text-gray-800">{corredor?.representanteLegal || "N/A"}</p>
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

// Modal para Editar Corredor de Bienes
export const EditCorredorModal = ({ isOpen, onClose, corredor, onSave }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    numLic: '',
    personaJuridica: '',
    fechaEmision: '',
    fechaVencimiento: '',
    estatusLicencia: 'Activa',
    suspendidaHasta: '',
    representanteLegal: ''
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
    if (corredor) {
      setFormData({
        numLic: corredor.numLic || '',
        personaJuridica: corredor.personaJuridica || '',
        fechaEmision: corredor.fechaEmision ? formatDateForInput(corredor.fechaEmision) : '',
        fechaVencimiento: corredor.fechaVencimiento ? formatDateForInput(corredor.fechaVencimiento) : '',
        estatusLicencia: corredor.estatusLicencia || 'Activa',
        suspendidaHasta: corredor.suspendidaHasta ? formatDateForInput(corredor.suspendidaHasta) : '',
        representanteLegal: corredor.representanteLegal || ''
      });
      setErrors({});
    }
  }, [corredor]);

  if (!isOpen && !isAnimating) return null;

  // Format date string for input fields (YYYY-MM-DD)
  function formatDateForInput(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
  }

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'numLic':
        if (!value) {
          error = 'El número de licencia es requerido';
        }
        break;
      case 'personaJuridica':
        if (!value) {
          error = 'La persona jurídica es requerida';
        }
        break;
      case 'fechaEmision':
        if (!value) {
          error = 'La fecha de emisión es requerida';
        }
        break;
      case 'fechaVencimiento':
        if (!value) {
          error = 'La fecha de vencimiento es requerida';
        } else if (new Date(value) <= new Date(formData.fechaEmision)) {
          error = 'La fecha de vencimiento debe ser posterior a la fecha de emisión';
        }
        break;
      case 'suspendidaHasta':
        if (formData.estatusLicencia === 'Suspendida' && !value) {
          error = 'La fecha de suspensión es requerida cuando el estatus es Suspendida';
        }
        break;
      case 'representanteLegal':
        if (!value) {
          error = 'El representante legal es requerido';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
            <FileEdit className="mr-2 text-blue-500" size={25} />
            Editar Corredor de Bienes
          </h2>
          <div style={{ width: "80%", height: "0.5px", backgroundColor: "#4F81EE", margin: "10px 0 0 0" }}></div>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° Licencia
                </label>
                <input
                  type="text"
                  name="numLic"
                  value={formData.numLic}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.numLiC ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.numLic && (
                  <p className="text-red-500 text-xs mt-1">{errors.numLic}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Persona Jurídica
                </label>
                <input
                  type="text"
                  name="personaJuridica"
                  value={formData.personaJuridica}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.personaJuridica ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.personaJuridica && (
                  <p className="text-red-500 text-xs mt-1">{errors.personaJuridica}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Emisión
                </label>
                <input
                  type="date"
                  name="fechaEmision"
                  value={formData.fechaEmision}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.fechaEmision ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.fechaEmision && (
                  <p className="text-red-500 text-xs mt-1">{errors.fechaEmision}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Vencimiento
                </label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.fechaVencimiento ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.fechaVencimiento && (
                  <p className="text-red-500 text-xs mt-1">{errors.fechaVencimiento}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estatus Licencia
                </label>
                <select
                  name="estatusLicencia"
                  value={formData.estatusLicencia}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Activa">Activa</option>
                  <option value="Suspendida">Suspendida</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suspendida hasta
                </label>
                <input
                  type="date"
                  name="suspendidaHasta"
                  value={formData.suspendidaHasta}
                  onChange={handleChange}
                  disabled={formData.estatusLicencia !== 'Suspendida'}
                  className={`w-full px-3 py-2 border ${errors.suspendidaHasta ? 'border-red-500' : 'border-gray-300'} rounded-md ${formData.estatusLicencia !== 'Suspendida' ? 'bg-gray-100' : ''}`}
                />
                {errors.suspendidaHasta && (
                  <p className="text-red-500 text-xs mt-1">{errors.suspendidaHasta}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Representante Legal
              </label>
              <input
                type="text"
                name="representanteLegal"
                value={formData.representanteLegal}
                onChange={handleChange}
                className={`w-full px-3 py-2 border ${errors.representanteLegal ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                required
              />
              {errors.representanteLegal && (
                <p className="text-red-500 text-xs mt-1">{errors.representanteLegal}</p>
              )}
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

// Modal para Crear Corredor de Bienes Nuevo
export const CreateCorredorModal = ({ isOpen, onClose, onSave }) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [formData, setFormData] = useState({
    numLic: '',
    personaJuridica: '',
    fechaEmision: '',
    fechaVencimiento: '',
    estatusLicencia: 'Activa',
    suspendidaHasta: '',
    representanteLegal: ''
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
        numLic: '',
        personaJuridica: '',
        fechaEmision: '',
        fechaVencimiento: '',
        estatusLicencia: 'Activa',
        suspendidaHasta: '',
        representanteLegal: ''
      });
      setErrors({});
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const validateField = (name, value) => {
    let error = '';
    
    switch (name) {
      case 'numLic':
        if (!value) {
          error = 'El número de licencia es requerido';
        }
        break;
      case 'personaJuridica':
        if (!value) {
          error = 'La persona jurídica es requerida';
        }
        break;
      case 'fechaEmision':
        if (!value) {
          error = 'La fecha de emisión es requerida';
        }
        break;
      case 'fechaVencimiento':
        if (!value) {
          error = 'La fecha de vencimiento es requerida';
        } else if (new Date(value) <= new Date(formData.fechaEmision)) {
          error = 'La fecha de vencimiento debe ser posterior a la fecha de emisión';
        }
        break;
      case 'suspendidaHasta':
        if (formData.estatusLicencia === 'Suspendida' && !value) {
          error = 'La fecha de suspensión es requerida cuando el estatus es Suspendida';
        }
        break;
      case 'representanteLegal':
        if (!value) {
          error = 'El representante legal es requerido';
        }
        break;
      default:
        break;
    }
    
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({ ...prev, [name]: value }));
    
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
            Crear Nuevo Corredor de Bienes
          </h2>
          <div style={{ width: "80%", height: "0.5px", backgroundColor: "#4F81EE", margin: "10px 0 0 0" }}></div>
        </div>
        
        <form onSubmit={handleSubmit} noValidate>
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-800">Información del Corredor</h3>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  N° Licencia
                </label>
                <input
                  type="text"
                  name="numLic"
                  value={formData.numLic}
                  onChange={handleChange}
                  placeholder="Ej: 0123"
                  className={`w-full px-3 py-2 border ${errors.numLic ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.numLic && (
                  <p className="text-red-500 text-xs mt-1">{errors.numLic}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Persona Jurídica
                </label>
                <input
                  type="text"
                  name="personaJuridica"
                  value={formData.personaJuridica}
                  onChange={handleChange}
                  placeholder="Ej: Inversiones ABC S.A."
                  className={`w-full px-3 py-2 border ${errors.personaJuridica ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.personaJuridica && (
                  <p className="text-red-500 text-xs mt-1">{errors.personaJuridica}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Emisión
                </label>
                <input
                  type="date"
                  name="fechaEmision"
                  value={formData.fechaEmision}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.fechaEmision ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.fechaEmision && (
                  <p className="text-red-500 text-xs mt-1">{errors.fechaEmision}</p>
                )}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha Vencimiento
                </label>
                <input
                  type="date"
                  name="fechaVencimiento"
                  value={formData.fechaVencimiento}
                  onChange={handleChange}
                  className={`w-full px-3 py-2 border ${errors.fechaVencimiento ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                  required
                />
                {errors.fechaVencimiento && (
                  <p className="text-red-500 text-xs mt-1">{errors.fechaVencimiento}</p>
                )}
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Estatus Licencia
                </label>
                <select
                  name="estatusLicencia"
                  value={formData.estatusLicencia}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="Activa">Activa</option>
                  <option value="Suspendida">Suspendida</option>
                  <option value="Cancelada">Cancelada</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Suspendida hasta
                </label>
                <input
                  type="date"
                  name="suspendidaHasta"
                  value={formData.suspendidaHasta}
                  onChange={handleChange}
                  disabled={formData.estatusLicencia !== 'Suspendida'}
                  className={`w-full px-3 py-2 border ${errors.suspendidaHasta ? 'border-red-500' : 'border-gray-300'} rounded-md ${formData.estatusLicencia !== 'Suspendida' ? 'bg-gray-100' : ''}`}
                />
                {errors.suspendidaHasta && (
                  <p className="text-red-500 text-xs mt-1">{errors.suspendidaHasta}</p>
                )}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Representante Legal
              </label>
              <input
                type="text"
                name="representanteLegal"
                value={formData.representanteLegal}
                onChange={handleChange}
                placeholder="Ej: Juan Pérez"
                className={`w-full px-3 py-2 border ${errors.representanteLegal ? 'border-red-500' : 'border-gray-300'} rounded-md`}
                required
              />
              {errors.representanteLegal && (
                <p className="text-red-500 text-xs mt-1">{errors.representanteLegal}</p>
              )}
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
export const DeleteCorredorModal = ({ isOpen, onClose, corredor, onConfirm }) => {
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
          <h3 className="text-lg font-medium text-gray-900 mb-2">Eliminar Corredor de Bienes</h3>
          <p className="text-gray-500">
            ¿Está seguro que desea eliminar el corredor <span className="font-medium">{corredor?.personaJuridica}</span> con licencia <span className="font-medium">{corredor?.numLic}</span>?
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
              onConfirm(corredor);
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