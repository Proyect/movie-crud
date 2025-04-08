import React, { createContext, useState, useContext, useEffect } from 'react';
import apiClient from '../services/api';
import { jwtDecode } from 'jwt-decode'; // Necesitarás: npm install jwt-decode

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken'));
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Para saber si se está verificando el token inicial

  useEffect(() => {
    const initializeAuth = async () => {
      if (accessToken) {
        try {
            // Decodificar token para obtener info básica (expiración, id usuario, etc.)
            const decodedToken = jwtDecode(accessToken);
            const currentTime = Date.now() / 1000;

            if (decodedToken.exp > currentTime) {
                // Token válido, podríamos buscar info del usuario si no la tenemos
                // O simplemente asumir que está logueado basado en el token
                setUser({ id: decodedToken.user_id, username: decodedToken.username /* u otra info del token */ });
                apiClient.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
            } else {
                 // Token expirado, intentar refrescar o limpiar
                 console.log("Access token expired");
                 logout(); // O intentar refrescar si implementas refresh token logic
            }
        } catch (error) {
          console.error("Invalid token:", error);
          logout(); // Limpiar si el token es inválido
        }
      }
      setLoading(false); // Terminar carga inicial
    };
    initializeAuth();
  }, [accessToken]); // Ejecutar solo cuando cambie el token

  const login = (tokens) => {
    localStorage.setItem('accessToken', tokens.access);
    localStorage.setItem('refreshToken', tokens.refresh);
    setAccessToken(tokens.access);
    setRefreshToken(tokens.refresh);
    apiClient.defaults.headers.common['Authorization'] = `Bearer ${tokens.access}`;
    // Decodificar para obtener datos básicos del usuario
    try {
        const decoded = jwtDecode(tokens.access);
        setUser({ id: decoded.user_id, username: decoded.username /* ... */ });
    } catch (e) {
        console.error("Error decoding token on login", e)
        setUser(null); // Fallback
    }
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setAccessToken(null);
    setRefreshToken(null);
    setUser(null);
    delete apiClient.defaults.headers.common['Authorization'];
    // Forzar redirección si es necesario, aunque el routing se encargará
    // window.location.href = '/login';
  };

  const value = {
    accessToken,
    refreshToken,
    user,
    isAuthenticated: !!user, // Más fiable que solo !!accessToken
    loading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook personalizado para usar el contexto fácilmente
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};