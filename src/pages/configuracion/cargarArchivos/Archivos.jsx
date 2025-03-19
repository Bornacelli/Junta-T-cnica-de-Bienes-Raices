import { useState, useCallback, useRef, useEffect } from 'react';
import { Calendar, Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react';
import api from '../../../services/ApiService';

function ContenidoCargaArchivos() {
  const [fecha, setFecha] = useState(() => {
    const today = new Date();
    return `${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`;
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationType, setNotificationType] = useState('success'); // 'success' o 'error'
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const datePickerRef = useRef(null);
  const inputRef = useRef(null);
  
  // Estado para el calendario
  const [currentMonth, setCurrentMonth] = useState(2); // Febrero
  const [currentYear, setCurrentYear] = useState(2025);
  
  // Cerrar el datepicker al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (datePickerRef.current && !datePickerRef.current.contains(event.target) && 
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  
  // Auto-ocultar la notificación después de 5 segundos
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);
  
  // Manejo de carga de archivos
  const handleDrag = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);
  
  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  }, []);
  
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };
  
  const validateFile = (file) => {
    // Verificar que sea un archivo Excel
    const validTypes = ['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
    
    if (!validTypes.includes(file.type)) {
      showErrorNotification('El archivo debe ser un documento Excel (.xls o .xlsx)');
      return false;
    }
    
    // Verificar tamaño del archivo (por ejemplo, máximo 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB en bytes
    if (file.size > maxSize) {
      showErrorNotification('El archivo excede el tamaño máximo permitido (10MB)');
      return false;
    }
    
    return true;
  };
  
  const handleFile = (file) => {
    // Validar que sea un archivo Excel
    if (!validateFile(file)) {
      return;
    }
    
    setFile(file);
    
    // Crear previsualización según el tipo de archivo
    if (file.type === 'application/vnd.ms-excel' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      setPreview({
        type: 'generic',
        name: file.name,
        extension: file.name.split('.').pop()
      });
    } else {
      // Para otros tipos de archivos (no deberían llegar aquí debido a la validación)
      setPreview({
        type: 'generic',
        name: file.name,
        extension: file.name.split('.').pop()
      });
    }
  };
  
  // Función para mostrar notificación de éxito
  const showSuccessNotification = (message) => {
    setNotificationType('success');
    setNotificationMessage(message);
    setShowNotification(true);
  };
  
  // Función para mostrar notificación de error
  const showErrorNotification = (message) => {
    setNotificationType('error');
    setNotificationMessage(message);
    setShowNotification(true);
  };
  
  // Función para convertir fecha de DD/MM/YYYY a formato ISO (YYYY-MM-DD)
  const convertDateFormat = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };

// Validar si la fecha ingresada es válida (formato DD/MM/YYYY) y no es futura
const isValidDate = (dateString) => {
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (!regex.test(dateString)) return false;
  
  const [, day, month, year] = dateString.match(regex);
  const dayNum = parseInt(day, 10);
  const monthNum = parseInt(month, 10);
  const yearNum = parseInt(year, 10);
  
  // Verificar rangos
  if (monthNum < 1 || monthNum > 12) return false;
  
  const daysInMonth = new Date(yearNum, monthNum, 0).getDate();
  if (dayNum < 1 || dayNum > daysInMonth) return false;
  
  // Verificar años razonables (entre 2000 y 2100)
  if (yearNum < 2000 || yearNum > 2100) return false;
  
  // Verificar que la fecha no sea futura
  const inputDate = new Date(yearNum, monthNum - 1, dayNum);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Resetear la hora para comparar solo fechas
  
  if (inputDate > today) return false;
  
  return true;
};

// Función para formatear cualquier fecha en DD/MM/YYYY
const formatDateString = (dateString) => {
  if (!dateString) return '';
  
  // Si ya es una fecha en formato DD/MM/YYYY, devolverla formateada
  const regex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  if (regex.test(dateString)) {
    const [, day, month, year] = dateString.match(regex);
    return `${day.padStart(2, '0')}/${month.padStart(2, '0')}/${year}`;
  }
  
  // Intentar parsear como fecha
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '';
  
  return `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
};

// Modificar el handleChange para la fecha:
const handleDateChange = (e) => {
  const input = e.target.value;
  setFecha(input);
  
  // Si la fecha es válida, actualizar el calendario
  if (isValidDate(input)) {
    const [day, month, year] = input.split('/').map(num => parseInt(num, 10));
    setCurrentMonth(month);
    setCurrentYear(year);
  }
};

useEffect(() => {
  if (isValidDate(fecha)) {
    const [day, month, year] = fecha.split('/').map(num => parseInt(num, 10));
    setCurrentMonth(month);
    setCurrentYear(year);
  }
}, [fecha]);
  
  // Función para manejar la carga del archivo a la API
  const handleUpload = async () => {
    if (!file) return;
    
    setIsLoading(true);
    
    try {
      // Crear un FormData para enviar el archivo
      const formData = new FormData();
      formData.append('file', file);
      formData.append('actualizado_hasta', convertDateFormat(fecha));
      
      // Enviar a la API
      const response = await api.post('/corredores_cargar_excel.php', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      // Procesar respuesta exitosa
      console.log('Respuesta de la API:', response.data);
      showSuccessNotification(`Archivo "${file.name}" cargado exitosamente.`);
      
      // Limpiar el archivo y la previsualización
      setFile(null);
      setPreview(null);
      
    } catch (error) {
      console.error('Error al cargar el archivo:', error);
      
      // Mostrar mensaje de error específico si viene de la API
      if (error.response && error.response.data && error.response.data.message) {
        showErrorNotification(error.response.data.message);
      } else {
        showErrorNotification('Error al cargar el archivo. Por favor intente nuevamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };


 // Generar días del mes actual
const generateDays = () => {
  const daysInMonth = new Date(currentYear, currentMonth, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth - 1, 1).getDay();
  
  // Ajustar para que la semana comience el lunes (0 = lunes, 6 = domingo)
  const firstDayAdjusted = firstDay === 0 ? 6 : firstDay - 1;
  
  // Crear array con días vacíos para alinear el calendario
  const emptyDays = Array(firstDayAdjusted).fill(null);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  
  return [...emptyDays, ...days];
};

// Verificar si una fecha es futura
const isFutureDate = (day) => {
  const today = new Date();
  const checkDate = new Date(currentYear, currentMonth - 1, day);
  return checkDate > today;
};

  // Formatear fecha seleccionada
  const formatDate = (day) => {
    return `${day.toString().padStart(2, '0')}/${currentMonth.toString().padStart(2, '0')}/${currentYear}`;
  };
  
  // Manejar navegación del calendario
  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };
  
  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };
  
  // Obtener nombre del mes actual
  const getMonthName = (month) => {
    const monthNames = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    return monthNames[month - 1];
  };

  // Componente de notificación
  const Notification = () => {
    if (!showNotification) return null;
    
    const isSuccess = notificationType === 'success';
    
    return (
      <div className={`fixed top-5 right-0 flex items-center p-4 mb-4 rounded-lg shadow-lg z-50 ${
        isSuccess ? 'text-green-800 bg-green-50' : 'text-red-800 bg-red-50'
      }`} role="alert">
        <div className={`inline-flex items-center justify-center flex-shrink-0 w-8 h-8 rounded-lg ${
          isSuccess ? 'text-green-500 bg-green-100' : 'text-red-500 bg-red-100'
        }`}>
          {isSuccess ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
        </div>
        <div className="ml-3 text-sm font-medium mr-10">
          {notificationMessage}
        </div>
        <button 
          type="button" 
          className={`ml-auto -mx-1.5 -my-1.5 rounded-lg focus:ring-2 p-1.5 inline-flex items-center justify-center h-8 w-8 ${
            isSuccess 
              ? 'bg-green-50 text-green-500 focus:ring-green-400 hover:bg-green-200' 
              : 'bg-red-50 text-red-500 focus:ring-red-400 hover:bg-red-200'
          }`}
          onClick={() => setShowNotification(false)}
        >
          <X size={16} />
        </button>
      </div>
    );
  };

  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
        <h2 className="text-xl font-medium text-gray-700 mb-6 mt-4 mx-4">Carga de Archivos</h2>
        
        {/* Notificación fuera del flujo normal para posición fija */}
        <Notification />
        
        {/* Área principal con previsualización aumentada */}
        <div className="flex-grow mb-6">
          <h3 className="text-base font-medium text-gray-700 mb-2 mx-4 mb-6">Vista Previa del Documento</h3>
          
          {/* Área de carga de archivos con previsualización */}
          {!file ? (
           <div 
             className={`border-1 border-dashed border-blue-500 mx-4 pb-8 pt-8 ${dragActive ? 'border-blue-500 bg-blue-100' : 'border-blue-500 bg-blue-50'} 
                      rounded-lg flex flex-col items-center justify-center h-full min-h-screen relative`}
             style={{ borderColor: '#3368DB' }}
             onDragEnter={handleDrag}
             onDragLeave={handleDrag}
             onDragOver={handleDrag}
             onDrop={handleDrop}
           >
             <Upload className="text-gray-400 mb-4" size={40} />
             <p className="text-gray-500 text-center">
               Haga clic para agregar <span className="text-gray-400">o arrastre y suelte</span>
             </p>
             <p className="text-gray-400 text-sm mt-2">
               Solo archivos Excel (.xls, .xlsx)
             </p>
             <input 
               type="file" 
               className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
               onChange={handleFileChange}
               accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
             />
           </div>
         
          ) : (
            // Contenedor principal de previsualización - Aumentado en tamaño
            <div className="border border-blue-600 border-dashed rounded-lg h-full min-h-screen relative mx-4">
              <button 
                className="absolute top-1 right-2 ml-1 bg-red-100 rounded-full p-1 hover:bg-red-200 transition-colors z-10"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                <X size={16} className="text-red-500 " />
              </button>
              
              {/* Previsualización según tipo de archivo - Solo Excel */}
              <div className="h-full w-full flex items-center justify-center">
                {preview?.type === 'generic' && (
                  <div className="flex flex-col items-center justify-center p-4">
                    {preview.extension === 'xlsx' || preview.extension === 'xls' ? (
                      <File size={96} className="text-green-500 mb-6" />
                    ) : (
                      <File size={96} className="text-gray-500 mb-6" />
                    )}
                    <p className="font-medium text-gray-800 text-lg">{file.name}</p>
                    <p className="text-sm text-gray-500 mt-2">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="mb-6 mx-4">
          <label className="block text-gray-700 mb-2 text-lg">Acta actualizada hasta:</label>
          <div className="relative w-full max-w-md">
          <input
  ref={inputRef}
  type="text"
  value={fecha}
  onChange={handleDateChange}
  onBlur={() => {
    if (isValidDate(fecha)) {
      setFecha(formatDateString(fecha));
    } else {
      // Si la fecha no es válida o es futura, revertir a la fecha actual
      const today = new Date();
      setFecha(`${today.getDate().toString().padStart(2, '0')}/${(today.getMonth() + 1).toString().padStart(2, '0')}/${today.getFullYear()}`);
      showErrorNotification('Fecha inválida o futura. Se ha restablecido a la fecha actual.');
    }
  }}
  className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
  onClick={() => setShowDatePicker(true)}
  placeholder="DD/MM/AAAA"
/>
            <div 
              className="absolute inset-y-0 right-0 flex items-center px-4 bg-gray-100 rounded-r-lg border-l border-gray-300 cursor-pointer"
              onClick={() => setShowDatePicker(!showDatePicker)}
            >
              <Calendar className="text-gray-500" size={20} />
            </div>
            
            {showDatePicker && (
              <div
                ref={datePickerRef}
                className="absolute top-full mt-1 left-0 bg-white border border-gray-200 shadow-lg rounded-lg overflow-hidden z-10"
              >
                <div className="p-2 bg-blue-500 text-white flex justify-between items-center">
                  <button
                    className="p-1 rounded hover:bg-blue-600"
                    onClick={handlePrevMonth}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <span>{getMonthName(currentMonth)} {currentYear}</span>
                  <button
                    className="p-1 rounded hover:bg-blue-600"
                    onClick={handleNextMonth}
                  >
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                <div className="p-2">
                  <div className="grid grid-cols-7 gap-1">
                    {['Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa', 'Do'].map((day, i) => (
                      <div key={i} className="text-center text-xs text-gray-500 p-1">{day}</div>
                    ))}
                    {generateDays().map((day, i) => (
                      day ? (
                        <button
                          key={i}
                          className={`w-8 h-8 rounded-full text-sm 
                                    ${fecha === formatDate(day) ? 'bg-blue-500 text-white' : 'text-gray-700'}
                                    ${isFutureDate(day) ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-blue-100'}`}
                          onClick={() => {
                            if (!isFutureDate(day)) {
                              setFecha(formatDate(day));
                              setShowDatePicker(false);
                            }
                          }}
                          disabled={isFutureDate(day)}
                        >
                          {day}
                        </button>
                      ) : (
                        <div key={i} className="w-8 h-8"></div>
                      )
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex justify-end mb-6">
          <button 
            className={`px-4 py-2 rounded-lg transition-colors flex items-center ${
              file 
                ? isLoading 
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleUpload}
            disabled={!file || isLoading}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Cargando...
              </>
            ) : (
              'Cargar Archivo'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContenidoCargaArchivos;