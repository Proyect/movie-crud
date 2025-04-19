// src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import Alert from 'react-bootstrap/Alert';


function RegisterPage() {
    // --- Estados ---   
    const [email, setEmail] = useState('');
    //const username = email;
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false); // <-- Añadido loading
    const navigate = useNavigate();
    const { login } = useAuth();

    // --- handleChange (simplificado para esta estructura) ---
    // Limpia errores al escribir en CUALQUIER campo
    const clearErrorsOnChange = (fieldName) => {
        if (errors[fieldName] || errors.detail || errors.non_field_errors) {
          setErrors(prevErrors => {
            const newErrors = { ...prevErrors };
            delete newErrors[fieldName];
            // Limpiar también errores relacionados y generales
            delete newErrors.first_name;
            delete newErrors.last_name;
            delete newErrors.password2;
            delete newErrors.detail;
            delete newErrors.non_field_errors;
            return newErrors;
          });
        }
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true); // <-- Activar carga

        if (password !== password2) {
          setErrors({ password2: ["Passwords do not match."] });
          setLoading(false); // <-- Desactivar carga
          return;
        }

         //user sea igual al mail
        const userData = {username: email, email, first_name: firstName, last_name: lastName, password, password2 };

        try {
            const response = await apiClient.post('register/', userData);
            login(response.data);
            navigate('/');
        } catch (err) {
            console.error("Registration failed:", err);
            if (err.response && err.response.data) {
                setErrors(err.response.data);
            } else {
                setErrors({ detail: ['Registration failed. Please try again.'] }); // Usar 'detail'
            }
        } finally {
             setLoading(false); // <-- Desactivar carga
        }
    };

    return (
        // --- JSX Mejorado ---
        <div className="container mt-4">
            <div className="row justify-content-center">
                <div className="col-md-8 col-lg-6">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <form onSubmit={handleSubmit}>
                                <h2 className="card-title text-center mb-4">Registro</h2>

                                {/* Mostrar errores generales */}
                                {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
                                {errors.non_field_errors && <Alert variant="danger">{errors.non_field_errors.join(', ')}</Alert>}
                                

                                {/* Campo Nombre */}
                                <div className="mb-3">
                                    <label htmlFor="firstName" className="form-label">Nombre</label>
                                    <input
                                        type="text"
                                        className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                                        id="firstName"
                                        name="firstName"
                                        value={firstName}
                                         // Llama a setFirstName y limpia errores
                                        onChange={(e) => { setFirstName(e.target.value); clearErrorsOnChange('first_name'); }}
                                        required
                                        disabled={loading}
                                    />
                                    {errors.first_name && <div className="invalid-feedback d-block">{errors.first_name.join(', ')}</div>}
                                </div>

                                {/* Campo Apellido */}
                                <div className="mb-3">
                                    <label htmlFor="lastName" className="form-label">Apellido</label>
                                    <input
                                        type="text" // Corregido
                                        className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                                        id="lastName"
                                        name="lastName"
                                        value={lastName}
                                        // Llama a setLastName y limpia errores
                                        onChange={(e) => { setLastName(e.target.value); clearErrorsOnChange('last_name'); }}
                                        required
                                        disabled={loading}
                                    />
                                    {errors.last_name && <div className="invalid-feedback d-block">{errors.last_name.join(', ')}</div>}
                                </div>

                                {/* Campo Correo */}
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo</label>
                                    <input
                                        type="email"
                                        className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                        id="email"
                                        name="email"
                                        value={email}
                                        // Llama a setEmail y limpia errores
                                        onChange={(e) => { setEmail(e.target.value); clearErrorsOnChange('email'); }}
                                        required
                                        disabled={loading}
                                    />
                                    {errors.email && <div className="invalid-feedback d-block">{errors.email.join(', ')}</div>}
                                </div>

                                {/* Campo Contraseña */}
                                <div className="mb-3">
                                    <label htmlFor="password" className="form-label">Contraseña</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                        id="password"
                                        name="password"
                                        value={password}
                                        // Llama a setPassword y limpia errores
                                        onChange={(e) => { setPassword(e.target.value); clearErrorsOnChange('password'); }}
                                        required
                                        disabled={loading}
                                    />
                                    {errors.password && <div className="invalid-feedback d-block">{errors.password.join(', ')}</div>}
                                </div>

                                {/* Campo Confirmar Contraseña */}
                                <div className="mb-3">
                                    <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                                    <input
                                        type="password"
                                        className={`form-control ${errors.password2 ? 'is-invalid' : ''}`}
                                        id="confirmPassword"
                                        name="password2"
                                        value={password2}
                                        // Llama a setPassword2 y limpia errores
                                        onChange={(e) => { setPassword2(e.target.value); clearErrorsOnChange('password2'); }}
                                        required
                                        disabled={loading}
                                    />
                                    {errors.password2 && <div className="invalid-feedback d-block">{errors.password2.join(', ')}</div>}
                                </div>

                                {/* Botón de Envío */}
                                <div className="d-grid">
                                    <button className="btn btn-primary" type="submit" disabled={loading}>
                                        {loading ? 'Registrando...' : 'Registrar'}
                                    </button>
                                </div>
                            </form>

                            {/* Enlace a Login */}
                            <p className="mt-3 text-center">
                                Tienes Una Cuenta? <Link to="/login">Login </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;