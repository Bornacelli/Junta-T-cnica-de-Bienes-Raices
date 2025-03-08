import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import Login from '../pages/Login';
import Dashboard from '../pages/validador/Dashboard/Dashboard';
import Layout from '../components/layout/layout';

import Validador from '../pages/validador/Validador';
import Usuarios from '../pages/configuracion/usuarios/Usuarios'
import Archivos from '../pages/configuracion/cargarArchivos/Archivos';

import ProtectedRoute from './ProtectedRoute';

function AppRoutes() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Pantalla de login */}
          <Route path="/login" element={<Login />} />

          {/* Ruta protegida */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/validador" element={<Validador />} />
              <Route path="/configuracion/archivos" element={<Archivos />} />
              <Route path="/configuracion/usuarios" element={<Usuarios />} />
              
            </Route>
          </Route>

          {/* Redirige la raíz al login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Ruta para manejar errores */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRoutes;
