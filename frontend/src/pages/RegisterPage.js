//import Alert from 'react-bootstrap/Alert';
import React, { useState } from 'react'; 
import { useNavigate, Link } from 'react-router-dom'; // Añade useNavigate
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../services/api';



function RegisterPage() {
    
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

        const userData = { email, first_name: firstName, last_name: lastName, password, password2 };

        try {
            const response = await apiClient.post('/register/', userData);
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
                    <form action="">
                      <h2 className="card-title">Registro</h2>
                      <div className="mb-3">
                        <label  className="form-label">Nombre</label>
                        <input type="text" className="form-control" id="name" 
                        value={firstName}
                     
                        isInvalid={!!errors.first_name}
                        />                        
                      </div>
                      <div className="mb-3">
                        <label  className="form-label">Apellido</label>
                        <input type="email" className="form-control" id="lastName" 
                        value={lastName}
                      
                        isInvalid={!!errors.last_name}
                        />                        
                      </div>
                      
                     <div className="mb-3">
                        <label  className="form-label">Correo</label>
                        <input type="email" className="form-control" id="email" value={email} 
                        
                      isInvalid={!!errors.email} />                        
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Contraseña</label>
                        <input type="password" className="form-control" id="password" 
                        value={password}
                        
                        isInvalid={!!errors.password}
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label">Confirmar Contraseña</label>
                        <input type="password" className="form-control" id="password2" 
                        value={password2}
                       
                        isInvalid={!!errors.password2} 
                        />
                      </div> 
                      <button className="btn btn-primary w-75" type="submit">
                        Registrar
                        </button> 
                    </form>
                    
                </div>
            </div>

        </div>
             <p className="mt-3">
                Tienes Una Cuenta? <Link to="/login">Login </Link>
             </p>
        </div>
    );
}

export default RegisterPage;