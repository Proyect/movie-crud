import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import Alert from 'react-bootstrap/Alert'; // Para mostrar errores

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Limpiar errores previos
    if (!username || !password) {
        setError("Username and password are required.");
        return;
    }
    try {
      // Usar el endpoint de SimpleJWT para obtener tokens
      const response = await apiClient.post('/token/', { username, password });
      login(response.data); // Guardar tokens y estado de usuario en el contexto
      navigate('/'); // Redirigir a la página principal
    } catch (err) {
      console.error("Login failed:", err);
      if (err.response && err.response.data && err.response.data.detail) {
          setError(err.response.data.detail); // Error específico de DRF/SimpleJWT
      } else {
          setError('Login failed. Please check your credentials.');
      }
    }
  };

  return (
    <div className="col-md-6 mx-auto">
      <h2>Login</h2>
      {error && <Alert variant="danger">{error}</Alert>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Login</button>
      </form>
      <p className="mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;