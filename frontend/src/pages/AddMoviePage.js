import React from 'react';
import { useNavigate } from 'react-router-dom';
import MovieForm from '../components/MovieForm'; // Ajusta la ruta si es necesario
import apiClient from '../services/api'; // Tu instancia de Axios configurada
import Container from 'react-bootstrap/Container'; // Para layout y espaciado
import Alert from 'react-bootstrap/Alert'; // Para mostrar errores generales si es necesario

function AddMoviePage() {
  const navigate = useNavigate();
  const [generalError, setGeneralError] = React.useState(null); // Para errores no relacionados a campos

  /**
   * Función que se pasa a MovieForm para ejecutar la llamada API de creación.
   * MovieForm la llamará internamente después de validar sus campos (si aplica validación del lado cliente).
   * Esperamos que MovieForm maneje el estado de carga y muestre los errores de validación específicos del campo.
   * @param {object} formData - Los datos del formulario recolectados por MovieForm.
   * @returns {Promise} - La promesa de la llamada API (para que MovieForm pueda manejar el try/catch).
   */
  const handleCreateMovie = async (formData) => {
    setGeneralError(null); // Limpiar error general previo
    // La lógica de setLoading y setErrors (para campos específicos) debe estar en MovieForm.
    // Esta función solo se enfoca en la llamada API.
    // MovieForm envolverá esto en un try/catch y manejará los errores de validación.
    try {
        const response = await apiClient.post('/movies/', formData);
        return response; // Devuelve la respuesta para que MovieForm pueda llamar a onSuccess
    } catch (error) {
        // Si el error no es de validación de campos (manejado por MovieForm),
        // podríamos mostrar un error general aquí.
        if (!error.response || !error.response.data || typeof error.response.data !== 'object') {
           setGeneralError("An unexpected error occurred while creating the movie. Please try again.");
        }
         // Re-lanzamos el error para que MovieForm también lo reciba y actualice su estado si es necesario.
         throw error;
    }
  };

  /**
   * Función que se pasa a MovieForm para ejecutarla DESPUÉS de una creación exitosa en la API.
   * @param {object} createdMovie - Los datos de la película recién creada devueltos por la API.
   */
  const handleSuccess = (createdMovie) => {
    console.log('Movie created successfully:', createdMovie);
    // Redirigir a la página principal después de crear exitosamente
    navigate('/');
    // Opcionalmente, podrías redirigir a la página de detalles:
    // navigate(`/movies/${createdMovie.id}`);
  };

  return (
    <Container className="mt-4">
      {/* Muestra un error general si existe */}
      {generalError && <Alert variant="danger">{generalError}</Alert>}

      {/*
        Renderiza el componente MovieForm:
        - onSubmit: Le pasa la función que sabe cómo hacer la llamada POST.
        - onSuccess: Le pasa la función que sabe qué hacer después (navegar).
        - isEditing: Le indica que no estamos editando (para el título y el texto del botón).
      */}
      <MovieForm
        onSubmit={handleCreateMovie}
        onSuccess={handleSuccess}
        isEditing={false}
      />
    </Container>
  );
}

export default AddMoviePage;