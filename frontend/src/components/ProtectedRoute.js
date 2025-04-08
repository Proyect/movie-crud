import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    // Muestra un spinner o nada mientras se verifica el token inicial
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirige a la página de login si no está autenticado
    return <Navigate to="/login" replace />;
  }

  // Si está autenticado, renderiza el componente hijo (Outlet para rutas anidadas o children)
  return children ? children : <Outlet />;
};

export default ProtectedRoute;