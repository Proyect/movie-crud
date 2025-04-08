import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'; // Crearemos este componente
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MovieDetailPage from './pages/MovieDetailPage';
import AddMoviePage from './pages/AddMoviePage';
import EditMoviePage from './pages/EditMoviePage';
import AddReviewPage from './pages/AddReviewPage'; // ORO
import ProtectedRoute from './components/ProtectedRoute';
import NotFoundPage from './pages/NotFoundPage'; // Página para rutas no encontradas

function App() {
  return (
    <>
      <Navbar /> {/* El Navbar se muestra en todas las páginas */}
      <div className="container mt-4"> {/* Contenedor principal de Bootstrap */}
        <Routes>
          {/* Rutas Públicas */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas Protegidas */}
          <Route element={<ProtectedRoute />}> {/* Envuelve las rutas protegidas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/movies/new" element={<AddMoviePage />} />
            <Route path="/movies/:id" element={<MovieDetailPage />} />
            <Route path="/movies/:id/edit" element={<EditMoviePage />} />
            {/* --- RUTAS ORO --- */}
            <Route path="/movies/:id/reviews/new" element={<AddReviewPage />} />
            {/* --- FIN RUTAS ORO --- */}
          </Route>

          {/* Ruta Catch-all para 404 */}
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </div>
    </>
  );
}

export default App;