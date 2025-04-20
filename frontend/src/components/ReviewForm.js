// src/components/ReviewForm.js

import React, { useState } from 'react';
import PropTypes from 'prop-types'; // Para definir los tipos de las props

// Importar componentes de React Bootstrap
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner';
// import Card from 'react-bootstrap/Card'; // Opcional si quieres el estilo de tarjeta aquí

function ReviewForm({ movieTitle, onSubmit, onSuccess, onCancel, initialData = null, isEditing = false }) {
  // --- Estados ---
  // Estado para el rating (calificación). Iniciamos vacío o con datos iniciales.
  const [rating, setRating] = useState(initialData?.rating || '');
  // Estado para el comentario. Iniciamos vacío o con datos iniciales.
  const [comment, setComment] = useState(initialData?.comment || '');
  // Estado para errores de validación (objeto)
  const [errors, setErrors] = useState({});
  // Estado para indicar carga
  const [loading, setLoading] = useState(false);
  // Estado para errores generales del envío
  const [submitError, setSubmitError] = useState(null);

  // --- Manejador de Envío ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setSubmitError(null);

    // Validación simple en frontend (backend DEBE validar también)
    const ratingValue = parseInt(rating, 10);
    let validationErrors = {};
    if (isNaN(ratingValue) || ratingValue < 1 || ratingValue > 5) {
      validationErrors.rating = ["Please select a rating between 1 and 5."];
    }
    if (!comment || comment.trim().length < 5) { // Ejemplo: mínimo 5 caracteres
       validationErrors.comment = ["Comment must be at least 5 characters long."];
    }

    if (Object.keys(validationErrors).length > 0) {
        setErrors(validationErrors);
        setLoading(false);
        return; // Detener si hay errores de validación frontend
    }


    try {
      // Llama a la función onSubmit pasada por props (que contiene la llamada API POST o PUT)
      const reviewData = { rating: ratingValue, comment: comment.trim() };
      const response = await onSubmit(reviewData);

      // Si tuvo éxito, llama a onSuccess (generalmente para navegar)
      if (onSuccess) {
        onSuccess(response.data);
      }
      // Opcional: Limpiar formulario después de éxito si es para crear
      if (!isEditing) {
        setRating('');
        setComment('');
      }

    } catch (error) {
      console.error("Error submitting review:", error);
      // Manejo de errores de la API (validación o generales)
      if (error.response && error.response.data && typeof error.response.data === 'object') {
        setErrors(error.response.data);
      } else if (error.response && error.response.status === 400 && error.response.data?.detail) {
          setSubmitError(error.response.data.detail); // Ej: "Ya has reseñado"
      }
      else {
        setSubmitError(error.message || "An unexpected error occurred submitting the review.");
      }
    } finally {
      setLoading(false); // Desactivar carga
    }
  };

  // --- Manejadores de Cambio para Inputs ---
  const handleRatingChange = (e) => {
      setRating(e.target.value);
      // Limpiar error específico al cambiar
      if (errors.rating) {
          setErrors(prev => ({...prev, rating: null}));
      }
      setSubmitError(null); // Limpiar error general
  };

  const handleCommentChange = (e) => {
      setComment(e.target.value);
      // Limpiar error específico al cambiar
      if (errors.comment) {
          setErrors(prev => ({...prev, comment: null}));
      }
       setSubmitError(null); // Limpiar error general
  };


  // --- Renderizado JSX ---
  return (
    // Puedes envolverlo en una Card si quieres ese estilo aquí mismo
    // <Card className="p-3">
    //   <Card.Body>
        <Form onSubmit={handleSubmit} noValidate>
          {/* Título - Usa el movieTitle pasado por props */}
          <h3>{isEditing ? 'Edit Review' : `Write a Review for ${movieTitle || 'this movie'}`}</h3>
          <hr />

          {/* Mostrar errores generales o de validación no asociados a campos */}
          {submitError && <Alert variant="danger" className="mt-2">{submitError}</Alert>}
          {errors.non_field_errors && <Alert variant="danger" className="mt-2">{errors.non_field_errors.join(', ')}</Alert>}
          {errors.detail && <Alert variant="danger" className="mt-2">{errors.detail}</Alert>}
          {errors.user && <Alert variant="danger" className="mt-2">{errors.user.join(', ')}</Alert>} {/* Para el error "already reviewed" */}


          {/* Campo Calificación (Rating) - Usando un Select */}
          <Form.Group className="mb-3" controlId="reviewRating">
            <Form.Label>Rating</Form.Label>
            <Form.Select
              name="rating"
              value={rating}
              onChange={handleRatingChange}
              isInvalid={!!errors.rating}
              required
              disabled={loading}
              aria-label="Select movie rating"
            >
              <option value="" disabled>Select a rating (1-5)</option>
              <option value="1">1 - Terrible</option>
              <option value="2">2 - Poor</option>
              <option value="3">3 - Average</option>
              <option value="4">4 - Good</option>
              <option value="5">5 - Excellent</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              {errors.rating?.join(', ')}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Campo Comentarios - Usando Textarea */}
          <Form.Group className="mb-3" controlId="reviewComment">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              rows={4} // Ajusta el número de filas según necesites
              name="comment"
              value={comment}
              onChange={handleCommentChange}
              isInvalid={!!errors.comment}
              required
              disabled={loading}
              placeholder="Write your review here..."
            />
            <Form.Control.Feedback type="invalid">
              {errors.comment?.join(', ')}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Botones de Acción */}
          <div className="d-flex justify-content-end mt-3">
            {/* Botón Cancelar (opcional, solo si se pasa la función onCancel) */}
            {onCancel && (
              <Button variant="secondary" onClick={onCancel} disabled={loading} className="me-2">
                Cancel
              </Button>
            )}
            {/* Botón Enviar Reseña */}
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                  <span className="ms-1">{isEditing ? 'Updating...' : 'Submitting...'}</span>
                </>
              ) : (
                isEditing ? 'Update Review' : 'Submit Review'
              )}
            </Button>
          </div>
        </Form>
    //   </Card.Body>
    // </Card>
  );
}

// Definición de PropTypes para buena práctica y documentación
ReviewForm.propTypes = {
  movieTitle: PropTypes.string,             // Título opcional de la película para mostrar
  onSubmit: PropTypes.func.isRequired,      // Función para ejecutar la llamada API (POST/PUT)
  onSuccess: PropTypes.func,                // Función a ejecutar en caso de éxito
  onCancel: PropTypes.func,                 // Función para el botón Cancelar
  initialData: PropTypes.shape({            // Datos iniciales para editar
      rating: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      comment: PropTypes.string
  }),
  isEditing: PropTypes.bool                 // Flag para saber si estamos editando
};

export default ReviewForm;