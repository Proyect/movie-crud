import React, { useState, useEffect } from 'react';
import apiClient from '../services/api';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // Para Oro (verificar dueño)
import Alert from 'react-bootstrap/Alert';

function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth(); // ORO: obtener usuario logueado

  const fetchMovies = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get('/movies/');
      setMovies(response.data);
    } catch (err) {
      console.error("Error fetching movies:", err);
      setError('Could not fetch movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies();
  }, []); // Cargar al montar el componente

  const handleDelete = async (movieId) => {
      if (window.confirm('Are you sure you want to delete this movie?')) {
          try {
              await apiClient.delete(`/movies/${movieId}/`);
              // Refrescar la lista después de borrar
              // setMovies(movies.filter(movie => movie.id !== movieId)); // Optimista
              fetchMovies(); // O volver a cargar
          } catch (err) {
              console.error("Error deleting movie:", err);
              setError('Could not delete the movie.');
               // Podrías mostrar un error más específico si la API lo devuelve (ej. permiso denegado)
               if (err.response && err.response.status === 403) {
                   setError('You do not have permission to delete this movie.');
               }
          }
      }
  };

  if (loading) return <div>Loading movies...</div>;


  return (
    <div>
      <h1>Movies</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <Link to="/movies/new" className="btn btn-primary mb-3">Add New Movie</Link>
      <div className="row">
        {movies.length > 0 ? (
          movies.map((movie) => (
            <div key={movie.id} className="col-md-4 mb-4">
              <div className="card">
                {movie.image_url && (
                     <img src={movie.image_url} className="card-img-top" alt={movie.title} style={{height: '200px', objectFit: 'cover'}} />
                )}
                <div className="card-body">
                  <h5 className="card-title">{movie.title}</h5>
                  {/* --- SOLO PARA ORO: Mostrar Rating Promedio --- */}
                  {movie.average_rating !== null && (
                      <p className="card-text">
                          Average Rating: {movie.average_rating} / 5
                      </p>
                  )}
                  {/* --- FIN ORO --- */}
                  <Link to={`/movies/${movie.id}`} className="btn btn-info btn-sm me-2">View Details</Link>
                  {/* --- SOLO PARA ORO: Botón Eliminar Condicional --- */}
                  {user && user.id === movie.created_by && (
                       <button onClick={() => handleDelete(movie.id)} className="btn btn-danger btn-sm">Delete</button>
                  )}
                  {/* --- FIN ORO --- */}
                  {/* --- SIN ORO: Botón Eliminar Siempre Visible (si los permisos lo permiten) ---
                   <button onClick={() => handleDelete(movie.id)} className="btn btn-danger btn-sm">Delete</button>
                   --- FIN SIN ORO --- */}
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && <p>No movies found. Add one!</p>
        )}
      </div>
    </div>
  );
}

export default HomePage;