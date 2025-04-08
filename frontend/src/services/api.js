import axios from 'axios';

// URL base de tu API Django
const API_BASE_URL = 'http://localhost:8000/api'; // Cambia si es necesario

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token JWT a las cabeceras de todas las solicitudes
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // O donde almacenes el token
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401 (Token inválido/expirado) - Opcional pero recomendado
// Esto requeriría una función `logout` global, usualmente del AuthContext
/*
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Aquí podrías llamar a una función global de logout
      console.error("Unauthorized access - 401. Logging out.");
      // logoutUser(); // Importada desde AuthContext o similar
      // window.location.href = '/login'; // Redirección forzada
    }
    return Promise.reject(error);
  }
);
*/

export default apiClient;