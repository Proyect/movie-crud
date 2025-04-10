// src/pages/EditMoviePage.js

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MovieForm from '../components/MovieForm'; // Reutilizamos el formulario
import apiClient from '../services/api';
import Container from 'react-bootstrap/Container';
import Alert from 'react-bootstrap/Alert';
import Spinner from 'react-bootstrap/Spinner'; // Para indicar carga inicial
import Button from 'react-bootstrap/Button';

function EditMoviePage() {
  const { id } = useParams(); // Obtiene el 'id' de la URL (definido en App.js como /movies/:id/edit)
  const navigate = useNavigate();

  // Estado para almacenar los datos iniciales de la película a editar
  const [initialMovieData, setInitialMovieData] = useState(null);
  // Estado para la carga inicial de datos
  const [loadingInitial, setLoadingInitial] = useState(true);
  // Estado para errores durante la carga inicial
  const [fetchError, setFetchError] = useState(null);
   // Estado para errores generales durante el envío (PUT) que no maneje MovieForm
  const [submitError, setSubmitError] = useState(null);

  // Función para cargar los datos de la película usando useCallback para optimización leve
  const fetchMovieData = useCallback(async () => {
    setLoadingInitial(true);
    setFetchError(null);
    try {
      const response = await apiClient.get(`/movies/${id}/`);
      setInitialMovieData(response.data);
    } catch (error) {
      console.error("Error fetching movie data for editing:", error);
      if (error.response && error.response.status === 404) {
        setFetchError(`Movie with ID ${id} not found.`);
      } else if (error.response && error.response.status === 403) {
         setFetchError('You do not have permission to edit this movie.'); // Mensaje específico si backend devuelve 403
      }
      else {
        setFetchError("Failed to load movie data. Please try again.");
      }
      setInitialMovieData(null); // Asegurarse que no haya datos viejos si falla
    } finally {
      setLoadingInitial(false);
    }
  }, [id]); // Depende del 'id' de la URL

  // useEffect para llamar a fetchMovieData cuando el componente se monta o el 'id' cambia
  useEffect(() => {
    fetchMovieData();
  }, [fetchMovieData]);

  /**
   * Función que se pasa a MovieForm para ejecutar la llamada API de actualización (PUT).
   * @param {object} formData - Los datos actualizados del formulario.
   * @returns {Promise} - La promesa de la llamada API (para que MovieForm maneje try/catch/loading).
   */
  const handleUpdateMovie = async (formData) => {
     setSubmitError(null); // Limpiar error general previo
    // MovieForm manejará el estado de carga y errores de validación específicos.
    // Esta función solo se enfoca en la llamada PUT.
    try {
        // Usamos PUT para actualizar completamente el recurso (PATCH para actualizaciones parciales)
        const response = await apiClient.put(`/movies/${id}/`, formData);
        return response; // Devuelve la respuesta para onSuccess
    } catch (error) {
         // Si el error no es de validación (manejado por MovieForm), mostrar aquí.
         if (!error.response || !error.response.data || typeof error.response.data !== 'object') {
             if (error.response && error.response.status === 403) {
                 setSubmitError('Update failed: You do not have permission to edit this movie.');
             } else {
                setSubmitError("An unexpected error occurred while updating the movie.");
             }
         }
         throw error; // Re-lanzar para que MovieForm lo capture
    }
  };

  /**
   * Función que se pasa a MovieForm para ejecutarla DESPUÉS de una actualización exitosa.
   * @param {object} updatedMovie - Los datos de la película actualizada devueltos por la API.
   */
  const handleSuccess = (updatedMovie) => {
    console.log('Movie updated successfully:', updatedMovie);
    // Redirigir a la página de detalles de la película actualizada
    navigate(`/movies/${id}`);
  };

   /**
    * Función para manejar el botón de cancelar.
    */
   const handleCancel = () => {
       // Navegar de vuelta a la página de detalles sin guardar cambios
       navigate(`/movies/${id}`);
   };

  // Renderizado condicional mientras se cargan los datos iniciales
  if (loadingInitial) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading movie data...</span>
        </Spinner>
        <p>Loading movie data...</p>
      </Container>
    );
  }

  // Renderizado si hubo un error al cargar los datos iniciales
  if (fetchError) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
            <Alert.Heading>Error Loading Movie</Alert.Heading>
            <p>{fetchError}</p>
             <Button variant="secondary" onClick={() => navigate('/')}>Go Home</Button>
        </Alert>
      </Container>
    );
  }

   // Renderizado si, por alguna razón, no se cargaron los datos (poco probable si no hubo error)
   if (!initialMovieData) {
     return (
        <Container className="mt-4">
            <Alert variant="warning">Could not load movie data.</Alert>
             <Button variant="secondary" onClick={() => navigate('/')}>Go Home</Button>
        </Container>
     )
   }


  // Renderizado principal: Mostrar el formulario una vez cargados los datos
  return (
    <Container className="mt-4">
       {/* Mostrar error general del envío PUT si existe */}
       {submitError && <Alert variant="danger">{submitError}</Alert>}

      {/* Renderiza MovieForm pasándole los datos iniciales y las funciones correspondientes */}
      <MovieForm
        onSubmit={handleUpdateMovie}
        onSuccess={handleSuccess}
        initialData={initialMovieData} // Pasa los datos cargados para pre-rellenar
        isEditing={true}              // Indica que estamos en modo edición
        onCancel={handleCancel}         // Pasa la función para el botón Cancelar
      />
    </Container>
  );
}

export default EditMoviePage;