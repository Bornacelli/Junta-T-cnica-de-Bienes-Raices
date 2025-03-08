import  { useState, useCallback, useRef } from 'react';
import { Calendar, Upload, X, FileText, File } from 'lucide-react';
import { useEffect } from 'react';

const ContenidoCargaArchivos = () => {
  const [fecha, setFecha] = useState('06/02/2025');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [file, setFile] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState(null);
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
  
  const handleFile = (file) => {
    setFile(file);
    
    // Crear previsualización según el tipo de archivo
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview({
          type: 'image',
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    } else if (file.type === 'application/pdf') {
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview({
          type: 'pdf',
          url: e.target.result
        });
      };
      reader.readAsDataURL(file);
    } else {
      // Para otros tipos de archivos, mostrar un icono genérico
      setPreview({
        type: 'generic',
        name: file.name,
        extension: file.name.split('.').pop()
      });
    }
  };
  
  // Función para manejar la carga del archivo
  const handleUpload = () => {
    console.log('Archivo a cargar:', file);
    console.log('Fecha seleccionada:', fecha);
    // Aquí implementarías la lógica de subida del archivo
    alert("Archivo seleccionado: " + (file ? file.name : "Ninguno"));
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

  return (
    <div className="flex-1 p-6">
      <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
        <h2 className="text-xl font-medium text-gray-700 mb-6 mt-4 mx-4">Carga de Archivos</h2>
        
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
           <input 
             type="file" 
             className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
             onChange={handleFileChange}
           />
         </div>
         
          ) : (
            // Contenedor principal de previsualización - Aumentado en tamaño
            <div className="border border-blue-600 border-dashed rounded-lg h-full min-h-screen relative mx-4">
              <button 
                className="absolute top-2 right-2 bg-red-100 rounded-full p-1 hover:bg-red-200 transition-colors z-10"
                onClick={() => {
                  setFile(null);
                  setPreview(null);
                }}
              >
                <X size={16} className="text-red-500" />
              </button>
              
              {/* Previsualización según tipo de archivo */}
              <div className="h-full w-full flex items-center justify-center">
                {preview?.type === 'image' && (
                  <div className="h-full w-full overflow-hidden flex items-center justify-center p-4">
                    <img 
                      src={preview.url} 
                      alt="Vista previa" 
                      className="max-h-full max-w-full object-contain"
                    />
                  </div>
                )}
                
                {preview?.type === 'pdf' && (
                  <div className="h-full w-full p-2">
                    <iframe 
                      src={preview.url} 
                      className="w-full h-full border-0" 
                      title="Previsualización PDF"
                      style={{ minHeight: "calc(100vh - 250px)" }}
                    />
                  </div>
                )}
                
                {preview?.type === 'generic' && (
                  <div className="flex flex-col items-center justify-center p-4">
                    {preview.extension === 'docx' || preview.extension === 'doc' ? (
                      <FileText size={96} className="text-blue-500 mb-6" />
                    ) : preview.extension === 'xlsx' || preview.extension === 'xls' ? (
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
      onChange={(e) => setFecha(e.target.value)}
      className="w-full py-3 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-600"
      onClick={() => setShowDatePicker(true)}
      readOnly
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
                  className={`w-8 h-8 rounded-full text-sm hover:bg-blue-100
                          ${fecha === formatDate(day) ? 'bg-blue-500 text-white' : 'text-gray-700'}`}
                  onClick={() => {
                    setFecha(formatDate(day));
                    setShowDatePicker(false);
                  }}
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
            className={`px-4 py-2 rounded-lg transition-colors ${
              file 
                ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
            onClick={handleUpload}
            disabled={!file}
          >
            Cargar Archivo
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContenidoCargaArchivos;