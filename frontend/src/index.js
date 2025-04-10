import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Crearemos este contexto
import 'bootstrap/dist/css/bootstrap.min.css'; // Importar Bootstrap CSS
import './index.css'; 

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> {/* Envolver la App con el proveedor de autenticación */}
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);