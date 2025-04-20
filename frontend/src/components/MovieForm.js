// src/components/MovieForm.js

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types'; // Buena práctica para definir tipos de props
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner'; // Para indicar carga

function MovieForm({ onSubmit, onSuccess, initialData = null, isEditing = false, onCancel }) {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState({
    title: '',
    director: '',
    release_date: '',
    description: '',
    image_url: ''
  });

  // Estado para errores de validación (devueltos por el backend)
  const [errors, setErrors] = useState({});
  // Estado para indicar si la petición está en curso
  const [loading, setLoading] = useState(false);
  // Estado para errores generales que no son de validación de campos
  const [submitError, setSubmitError] = useState(null);

  // Efecto para pre-rellenar el formulario cuando se edita
  useEffect(() => {
    if (isEditing && initialData) {
      setFormData({
        title: initialData.title || '',
        director: initialData.director || '',
        // Formatear la fecha a YYYY-MM-DD para el input type="date"
        release_date: initialData.release_date ? new Date(initialData.release_date).toISOString().split('T')[0] : '',
        description: initialData.description || '',
        image_url: initialData.image_url || ''
      });
    } else {
      // Si no estamos editando o no hay datos iniciales, resetear (útil si el componente se reutiliza sin desmontarse)
       setFormData({
        title: '', director: '', release_date: '', description: '', image_url: ''
       });
    }
    // Limpiar errores al cambiar entre modo edición/creación o al recibir nuevos datos iniciales
    setErrors({});
    setSubmitError(null);
  }, [initialData, isEditing]); // Depende de initialData y isEditing

  // Manejador para cambios en los inputs del formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
    // Limpiar el error específico del campo cuando el usuario empieza a modificarlo
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: null
      }));
    }
     // Limpiar error general al empezar a editar
     setSubmitError(null);
  };

  // Manejador para el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevenir recarga de página
    setLoading(true);   // Indicar que la petición ha comenzado
    setErrors({});      // Limpiar errores de validación previos
    setSubmitError(null); // Limpiar errores generales previos

    try {
      const response = await onSubmit(formData);

      if (onSuccess) {
        onSuccess(response.data); // Pasar los datos de respuesta (la película creada/actualizada)
      }

    } catch (error) {
      console.error("Error submitting form:", error);
      // Verificar si el error contiene datos de respuesta y es un objeto (errores de validación de DRF)
      if (error.response && error.response.data && typeof error.response.data === 'object') {
        setErrors(error.response.data); // Establecer los errores de validación en el estado
      } else {
        // Si no son errores de validación, mostrar un error general
        setSubmitError(error.message || "An unexpected error occurred. Please try again.");
      }
    } finally {
      // Asegurarse de que el estado de carga se desactive, incluso si hubo un error
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit} noValidate> {/* noValidate evita validaciones HTML5 por defecto */}
      <h2 className="mb-4">{isEditing ? 'Editar Pelicula' : 'Agregar Nueva Pelicula'}</h2>

      {/* Mostrar error general si existe */}
      {submitError && <Alert variant="danger">{submitError}</Alert>}
      {/* Mostrar errores de DRF que no pertenecen a ningún campo (ej. 'non_field_errors') */}
      {errors.non_field_errors && <Alert variant="danger">{errors.non_field_errors.join(', ')}</Alert>}
      {errors.detail && <Alert variant="danger">{errors.detail}</Alert>} {/* Para errores genéricos de DRF */}


      {/* Campo Title */}
      <Form.Group className="mb-3" controlId="formMovieTitle">
        <Form.Label>Titulo</Form.Label>
        <Form.Control
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          isInvalid={!!errors.title} // Marcar como inválido si hay error para este campo
          required // Añadir validación básica HTML5 si se desea (aunque confiamos en backend)
        />
        {/* Mostrar mensaje de error específico para este campo */}
        <Form.Control.Feedback type="invalid">
          {errors.title?.join(', ')} {/* Usar optional chaining y join por si es un array */}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Campo Director */}
      <Form.Group className="mb-3" controlId="formMovieDirector">
        <Form.Label>Director</Form.Label>
        <Form.Control
          type="text"
          name="director"
          value={formData.director}
          onChange={handleChange}
          isInvalid={!!errors.director}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.director?.join(', ')}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Campo Release Date */}
      <Form.Group className="mb-3" controlId="formMovieReleaseDate">
        <Form.Label>Fecha de Lanzamiento</Form.Label>
        <Form.Control
          type="date"
          name="release_date"
          value={formData.release_date}
          onChange={handleChange}
          isInvalid={!!errors.release_date}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.release_date?.join(', ')}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Campo Description */}
      <Form.Group className="mb-3" controlId="formMovieDescription">
        <Form.Label>Descripcion</Form.Label>
        <Form.Control
          as="textarea"
          rows={4}
          name="description"
          value={formData.description}
          onChange={handleChange}
          isInvalid={!!errors.description}
          required
        />
        <Form.Control.Feedback type="invalid">
          {errors.description?.join(', ')}
        </Form.Control.Feedback>
      </Form.Group>

      {/* Campo Image URL */}
      <Form.Group className="mb-3" controlId="formMovieImageUrl">
        <Form.Label>Imagen URL</Form.Label>
        <Form.Control
          type="url"
          name="image_url"
          value={formData.image_url}
          onChange={handleChange}
          isInvalid={!!errors.image_url}
          placeholder="https://example.com/image.jpg"
          // No lo marcamos como 'required' ya que es opcional en el modelo
        />
        <Form.Control.Feedback type="invalid">
          {errors.image_url?.join(', ')}
        </Form.Control.Feedback>
        <Form.Text className="text-muted">
            Optional. Agregar la direccion web (e.g., https://...).
        </Form.Text>
      </Form.Group>

      {/* Botones */}
      <div className="d-flex justify-content-end"> {/* Alinear botones a la derecha */}
          {/* Botón Cancelar (usa la función onCancel pasada por props) */}
          {onCancel && (
             <Button variant="secondary" onClick={onCancel} disabled={loading} className="me-2">
                Cancel
             </Button>
          )}

          {/* Botón de Envío */}
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? ( // Mostrar spinner si está cargando
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-1"
                />
                {isEditing ? 'Actualizando...' : 'Agregando...'}
              </>
            ) : ( // Mostrar texto normal si no está cargando
              isEditing ? 'Actualizar Pelicula' : 'Agregar Pelicula'
            )}
          </Button>
      </div>
    </Form>
  );
}

// Definición de PropTypes para validación y documentación
MovieForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,     // Función a ejecutar al enviar (llamada API)
  onSuccess: PropTypes.func,               // Función a ejecutar si onSubmit tiene éxito
  initialData: PropTypes.object,           // Datos iniciales para modo edición
  isEditing: PropTypes.bool,               // Flag para indicar si es modo edición
  onCancel: PropTypes.func                 // Función a ejecutar al pulsar Cancelar
};

export default MovieForm;