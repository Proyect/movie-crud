import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirigir a login después de cerrar sesión
  };

  return (
    
<div className="container-fluid">
            <div className="row navbar-brand">
              <div className="col navbar-text">
                <a href="" className="nav-link text-dark"><p className="fs-1 fw-bold">Peliculas</p></a>
              </div>
              <div className="col navbar-text text-end">
                <ul className="nav justify-content-end">
                  <li className="nav-item">
                    <Link className="nav-link text-dark" href="#">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-dark" href="#">Registro</Link>
                  </li>                                
                </ul>
              </div>
            </div>
          </div>
  );
}

export default Navbar;