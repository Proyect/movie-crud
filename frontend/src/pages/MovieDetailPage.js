import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import apiClient from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import Alert from 'react-bootstrap/Alert';
import Card from 'react-bootstrap/Card'; // Para mostrar detalles
import ListGroup from 'react-bootstrap/ListGroup'; // Para reseñas (Oro)
import Button from 'react-bootstrap/Button'; // Para botones

function MovieDetailPage() {
  const { id } = useParams(); // Obtiene el 'id' de la URL
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, isAuthenticated } = useAuth(); // Obtiene el usuario logueado
  const navigate = useNavigate();

  // Estado para saber si el usuario actual ya ha reseñado (ORO)
  const [userHasReviewed, setUserHasReviewed] = useState(false);

  const fetchMovie = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await apiClient.get(`/movies/${id}/`);
      setMovie(response.data);

      // --- ORO: Verificar si el usuario actual ya hizo una reseña ---
      if (user && response.data.reviews) {
          const reviewed = response.data.reviews.some(review => review.user === user.username); // Asume que el serializer devuelve 'user' como username
          setUserHasReviewed(reviewed);
      }
      // --- FIN ORO ---

    } catch (err) {
      console.error("Error fetching movie details:", err);
      if (err.response && err.response.status === 404) {
        setError('Movie not found.');
      } else {
        setError('Could not fetch movie details.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMovie();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, user]); // Volver a ejecutar si cambia el ID o el usuario (para la lógica de reseñas Oro)

  const handleDelete = async () => {
     if (window.confirm('Are you sure you want to delete this movie?')) {
          try {
              await apiClient.delete(`/movies/${id}/`);
              navigate('/'); // Redirigir a Home después de borrar
          } catch (err) {
              console.error("Error deleting movie:", err);
               setError('Could not delete the movie.');
               if (err.response && err.response.status === 403) {
                   setError('You do not have permission to delete this movie.');
               }
          }
      }
  }

  if (loading) return <div>Loading movie details...</div>;
  if (error) return <Alert variant="danger">{error}</Alert>;
  if (!movie) return <Alert variant="warning">Movie data not available.</Alert>; // Estado por si acaso

  // --- ORO: Condición para mostrar el botón de Editar/Borrar ---
  const isOwner = isAuthenticated && user && user.id === movie.created_by;
  // --- FIN ORO ---

  return (
    <Card>
      {movie.image_url && <Card.Img variant="top" src={movie.image_url} style={{ maxHeight: '400px', objectFit: 'contain' }} />}
      <Card.Body>
        <Card.Title>{movie.title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">Directed by: {movie.director}</Card.Subtitle>
        <Card.Text>Release Date: {new Date(movie.release_date).toLocaleDateString()}</Card.Text>
        <Card.Text>{movie.description}</Card.Text>
        <Card.Text><small className="text-muted">Added by: {movie.created_by_username} on {new Date(movie.created_at).toLocaleDateString()}</small></Card.Text>

         {/* --- ORO: Mostrar Rating Promedio --- */}
         {movie.average_rating !== null && (
             <Card.Text><strong>Average Rating: {movie.average_rating} / 5</strong></Card.Text>
         )}
         {/* --- FIN ORO --- */}


        {/* Botones de Acción */}
        <div className="mb-3">
             {/* --- ORO: Botón Editar Condicional --- */}
             {isOwner && (
                <Link to={`/movies/${id}/edit`} className="btn btn-warning me-2">Edit Movie</Link>
             )}
             {/* --- FIN ORO --- */}

             {/* --- SIN ORO: Botón Editar Siempre Visible (si el permiso lo permite) ---
             <Link to={`/movies/${id}/edit`} className="btn btn-warning me-2">Edit Movie</Link>
             --- FIN SIN ORO --- */}

            {/* --- ORO: Botón Eliminar Condicional --- */}
             {isOwner && (
                <Button variant="danger" onClick={handleDelete} className="me-2">Delete Movie</Button>
             )}
             {/* --- FIN ORO --- */}

            {/* --- ORO: Botón Escribir Reseña Condicional --- */}
            {isAuthenticated && !isOwner && !userHasReviewed && ( // Solo si está logueado, NO es el dueño Y NO ha reseñado
                <Link to={`/movies/${id}/reviews/new`} className="btn btn-success">Write a Review</Link>
            )}
             {/* --- FIN ORO --- */}
        </div>


        {/* --- ORO: Sección de Reseñas --- */}
        <hr />
        <h4>Reviews</h4>
        {movie.reviews && movie.reviews.length > 0 ? (
            <ListGroup variant="flush">
                {movie.reviews.map(review => (
                    <ListGroup.Item key={review.id}>
                        <strong>Rating: {review.rating}/5</strong> by {review.user}
                        <p className="mt-1 mb-0">{review.comment}</p>
                        <small className="text-muted">{new Date(review.created_at).toLocaleString()}</small>
                    </ListGroup.Item>
                ))}
            </ListGroup>
        ) : (
            <p>No reviews yet for this movie.</p>
        )}
        {/* --- FIN ORO --- */}

      </Card.Body>
    </Card>
  );
}

export default MovieDetailPage;