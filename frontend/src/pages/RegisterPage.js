// ... (imports similares a LoginPage)

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; 
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';
import Alert from 'react-bootstrap/Alert';


function RegisterPage() {
   // const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [errors, setErrors] = useState({}); // Objeto para errores específicos de campo
    const navigate = useNavigate();
    const { login } = useAuth(); // Loguear automáticamente después del registro

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({}); // Clear previous errors

        const userData = {  email, first_name: firstName, last_name: lastName, password, password2 };

        try {
            const response = await apiClient.post('register/', userData);
            // Registro exitoso, DRF devuelve los tokens
            login(response.data); // Usar los tokens devueltos para iniciar sesión
            navigate('/'); // Redirigir a la página principal
        } catch (err) {
            console.error("Registration failed:", err);
            if (err.response && err.response.data) {
                // DRF devuelve errores de validación como un objeto
                setErrors(err.response.data);
            } else {
                setErrors({ non_field_errors: ['Registration failed. Please try again.'] });
            }
        }
    };

    return (
        <div className="col-md-6 mx-auto">
            <div className="container">
            <div className="card p-2 m-2" style={{width: '18rem'}}>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                      {/* Mostrar errores generales */}
                      {errors.detail && <Alert variant="danger">{errors.detail}</Alert>}
                                {errors.non_field_errors && <Alert variant="danger">{errors.non_field_errors.join(', ')}</Alert>}
                      <h2 className="card-title">Registro</h2>
                      
                      <div className="mb-3">
                        <label  className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="firstName" name="firstName"
                        value={firstName}
                        onChange={(e) => { setFirstName(e.target.value); setErrors(p => ({...p, first_name: null})); }} 
                        />                        
                      </div>
                      
                      <div className="mb-3">
                        <label  className="form-label">Apellido</label>
                        <input type="text" className="form-control" id="lastName" 
                         value={lastName}
                         onChange={(e) => { setLastName(e.target.value); setErrors(p => ({...p, last_name: null})); }}
                        />   
                        {errors.last_name && <div className="invalid-feedback">{errors.last_name.join(', ')}</div>}                      </div>
                      
                     <div className="mb-3">
                        <label  className="form-label">Correo</label>
                        <input type="email" className="form-control" id="email" 
                        value={email}
                        onChange={(e) => { setEmail(e.target.value); setErrors(p => ({...p, email: null})); }}
                        required/> 
                        {errors.email && <div className="invalid-feedback">{errors.email.join(', ')}</div>}                       
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="password" name="password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setErrors(p => ({...p, password: null})); }}
                        required />
                        {errors.password && <div className="invalid-feedback">{errors.password.join(', ')}</div>}
                      </div>

                      <div className="mb-3">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input type="password" className="form-control" id="password2" name="password2"
                        value={password2}
                        onChange={(e) => { setPassword2(e.target.value); setErrors(p => ({...p, password2: null})); }}
                        required />
                        {errors.password2 && <div className="invalid-feedback">{errors.password2.join(', ')}</div>}
                      </div> 

                      <button className="btn btn-primary w-75" type="submit">Registro</button> 
                    </form>
                    
                </div>
            </div>

        </div>
             <p className="mt-3">
                Already have an account? <Link to="/login">Login here</Link>
             </p>
        </div>
    );
}

export default RegisterPage;