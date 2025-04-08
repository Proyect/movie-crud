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
              <Link href="" className="nav-link text-dark"><p className="fs-1 fw-bold">Peliculas</p></Link>
            </div>
            <div className="col navbar-text text-end">
              <ul className="nav justify-content-end">
              {isAuthenticated ? (
              <>
              Welcome, {user?.username || 'User'}!
              
                <li className="nav-item">
                  <link className="nav-link text-dark" href="#">Todas las peliculas</link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link text-dark" href="#">Agregar pelicula</Link>
                </li>
                <li className="nav-item text-dark">
                  <Link className="nav-link" href="#" onClick={handleLogout}>Logout</Link>
                </li>                
               
              </>
               ) : (
                <>
                  <li className="nav-item">
                    <Link className="nav-link text-dark" href="#">Login</Link>
                  </li>
                  <li className="nav-item">
                    <Link className="nav-link text-dark" href="#">Registro</Link>
                  </li>  

                </>
              )} 
              
                                                
                  </ul>
            </div>
          </div> 
          </div>
  );
}

export default Navbar;