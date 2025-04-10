// src/pages/AddReviewPage.js

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import ReviewForm from '../components/ReviewForm'; // Usamos el nuevo formulario
import apiClient from '../services/api';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
import Button from 'react-bootstrap/Button';

function AddReviewPage() {
  const { id: movieId } = useParams(); // Obtiene el 'id' de la película de la URL
  const navigate = useNavigate();

  const [movieTitle, setMovieTitle] = useState('');
  const [loadingMovie, setLoadingMovie] = useState(true);
  const [fetchError, setFetchError] = useState(null);
  const [submitError, setSubmitError] = useState(null); // Para errores generales del POST

  // Cargar el título de la película para mostrarlo (opcional pero bueno para UX)
   useEffect(() => {
        const fetchMovieTitle = async () => {
            setLoadingMovie(true);
            setFetchError(null);
            try {
                const response = await apiClient.get(`/movies/${movieId}/`);
                setMovieTitle(response.data.title);
            } catch (error) {
                console.error("Error fetching movie title:", error);
                 if (error.response && error.response.status === 404) {
                    setFetchError(`Movie with ID ${movieId} not found.`);
                 } else {
                    setFetchError("Could not load movie details.");
                 }
            } finally {
                setLoadingMovie(false);
            }
        };
        fetchMovieTitle();
    }, [movieId]);


  /**
   * Función para manejar el envío de la reseña. Se pasa a ReviewForm.
   * @param {object} reviewData - { rating, comment }
   * @returns {Promise}
   */
  const handleAddReview = async (reviewData) => {
     setSubmitError(null);
    // ReviewForm maneja el estado de carga y errores de validación específicos.
    try {
      // Llama al endpoint de creación de reseñas anidado
      const response = await apiClient.post(`/movies/${movieId}/reviews/`, reviewData);
      return response; // Para que onSuccess se ejecute
    } catch (error) {
       if (!error.response || !error.response.data || typeof error.response.data !== 'object') {
           setSubmitError("An unexpected error occurred while submitting the review.");
       }
       throw error; // Re-lanzar para ReviewForm
    }
  };

  /**
   * Función a ejecutar después de que la reseña se crea exitosamente.
   * @param {object} createdReview - Los datos de la reseña recién creada.
   */
  const handleSuccess = (createdReview) => {
    console.log('Review added successfully:', createdReview);
    // Redirigir de vuelta a la página de detalles de la película
    navigate(`/movies/${movieId}`);
  };

   /**
    * Función para manejar el botón de cancelar.
    */
   const handleCancel = () => {
       navigate(`/movies/${movieId}`); // Volver a detalles
   };


   // --- Renderizado Condicional ---
   if (loadingMovie) {
       return <Container className="text-center mt-5"><Spinner animation="border" /><p>Loading movie details...</p></Container>;
   }

   if (fetchError) {
        return (
            <Container className="mt-4">
                <Alert variant="danger">
                    <Alert.Heading>Error</Alert.Heading>
                    <p>{fetchError}</p>
                    <Button variant="secondary" onClick={() => navigate('/')}>Go Home</Button>
                </Alert>
            </Container>
        );
   }


  return (
    <Container className="mt-4">
      <h2>Add Review for: {movieTitle}</h2>
      <hr/>
      {submitError && <Alert variant="danger">{submitError}</Alert>}
      <ReviewForm
        onSubmit={handleAddReview}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </Container>
  );
}

export default AddReviewPage;