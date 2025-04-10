from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RegisterView, MovieViewSet # RegisterView ESTÁ aquí

router = DefaultRouter()
router.register(r'movies', MovieViewSet, basename='movie')

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'), # <--- RUTA DEFINIDA AQUÍ
    path('', include(router.urls)), # Rutas para /movies/
]