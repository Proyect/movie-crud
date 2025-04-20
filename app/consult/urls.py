from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MovieViewSet,ReviewListCreateView, ReviewDetailView  

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'), # <--- RUTA DEFINIDA AQUÍ
    path('', include(router.urls)), # Rutas para /movies/
     # --- URLs para Reseñas (Anidadas) ---
    path('movies/<int:movie_pk>/reviews/', 
    ReviewListCreateView.as_view(), name='movie-review-list-create'),
]