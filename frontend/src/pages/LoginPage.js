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
      <div className="container text-center">
            <div className="card p-2 m-2" style={{width: '18rem'}}>
                <div className="card-body">
                    <form action="">
                      <h2 className="card-title">Login</h2>
                     <div className="mb-3">
                        <label  className="form-label">Correo</label>
                        <input type="email" className="form-control" id="email" required/>
                                               
                      </div>
                      <div className="mb-3">
                        <label  className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" required/>
                        
                      </div> 
                      <button className="btn btn-primary w-75" type="submit">Login</button> 
                    </form>
                    
                </div>
            </div>
        </div>
      <p className="mt-3">
        Don't have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default LoginPage;