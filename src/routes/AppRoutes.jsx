import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { setLogoutFunction } from '../services/ApiService';
import { AuthProvider, useAuth } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import ValidadorPage from '../pages/inicio/ValidadorPage';
import Login from '../auth/Login';
import ForgotPassword from '../auth/ForgotPassword';
import ResetPassword from '../auth/ResetPassword';
import Dashboard from '../pages/Dashboard/Dashboard';
import Layout from '../components/layout/Layout'
import NotificationsPage from '../components/layout/topbar/NotificationsPage';
import Validador from '../pages/validador/Validador';
import Usuarios from '../pages/configuracion/usuarios/Usuarios';
import Corredor from '../pages/configuracion/corredoresdebienesraices/Corredores';
import Archivos from '../pages/configuracion/cargarArchivos/Archivos';
import ProtectedRoute from './ProtectedRoute';

// Este componente configura la función de logout para el servicio API
const ApiConfigSetup = () => {
  const { logout } = useAuth();
  
  useEffect(() => {
    // Establece la función de logout para que el servicio API la pueda usar
    setLogoutFunction(logout);
  }, [logout]);
  
  return null; // No renderiza nada
};

// El componente principal de rutas
function AppRoutes() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <BrowserRouter>
          <ApiConfigSetup />
          
          <Routes>
            {/* Pantalla de login */}
            <Route path="/validadorpage" element={<ValidadorPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            
            {/* Ruta protegida */}
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/notificaciones" element={<NotificationsPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/validador" element={<Validador />} />
                <Route path="/configuracion/archivos" element={<Archivos />} />
                <Route path="/configuracion/corredordebienes" element={<Corredor />} />
                <Route path="/configuracion/usuarios" element={<Usuarios />} />
              </Route>
            </Route>
            
            
            <Route path="/" element={<Navigate to="/validadorpage" replace />} />

            {/* Redirige la raíz al login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Ruta para manejar errores */}
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default AppRoutes;