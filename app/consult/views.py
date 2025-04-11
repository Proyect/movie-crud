from django.shortcuts import render
from rest_framework import generics, viewsets, permissions, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Movie, Review # Importar Review para Oro
from .serializers import UserSerializer, MovieSerializer, ReviewSerializer # Importar ReviewSerializer para Oro
from .permissions import IsOwnerOrReadOnly # SOLO PARA ORO

# Vista para Registro de Usuarios
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,) # Cualquiera puede registrarse
    serializer_class = UserSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True) # Valida y lanza error si no es válido
        user = serializer.save()
        # Generar tokens JWT para el nuevo usuario
        refresh = RefreshToken.for_user(user)
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data, # Devuelve datos del usuario (sin contraseña)
            "refresh": str(refresh),
            "access": str(refresh.access_token),
        }, status=status.HTTP_201_CREATED)

# ViewSet para CRUD de Películas
class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all().order_by('created_at') # Obtener todas las películas, más nuevas primero
    print(queryset)
    serializer_class = MovieSerializer
    # Permisos: Necesita estar logueado para crear/editar/borrar. Cualquiera puede leer (lista/detalle).
    # Ajusta esto si *todas* las vistas (incluyendo GET) deben estar protegidas.
    # permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    # --- AJUSTE PARA REQUERIMIENTO: TODAS LAS VISTAS PROTEGIDAS ---
    permission_classes = [permissions.IsAuthenticated]
    # --- FIN AJUSTE ---

    # --- SOLO PARA MEDALLA DE ORO: Aplicar permiso de propietario ---
    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy']:
             # Solo el dueño puede editar o borrar
            return [permissions.IsAuthenticated(), IsOwnerOrReadOnly()]
        # Para otras acciones (list, create, retrieve), solo requiere estar autenticado
        return [permissions.IsAuthenticated()]
    # --- FIN SECCIÓN ORO ---

    # Asignar automáticamente el usuario logueado al crear una película
    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)

# --- SOLO PARA MEDALLA DE ORO: Vistas para Reseñas ---
class ReviewListCreateView(generics.ListCreateAPIView):
    serializer_class = ReviewSerializer
    permission_classes = [permissions.IsAuthenticated] # Solo usuarios logueados pueden ver/crear reseñas

    def get_queryset(self):
        # Filtrar reseñas por la película especificada en la URL
        movie_id = self.kwargs['movie_pk']
        return Review.objects.filter(movie_id=movie_id)

    def perform_create(self, serializer):
        # Asignar usuario y película automáticamente
        movie_id = self.kwargs['movie_pk']
        try:
            movie = Movie.objects.get(pk=movie_id)
        except Movie.DoesNotExist:
            raise serializers.ValidationError("Movie not found.") # O usa Http404

        # Validar que el usuario no haya reseñado ya (aunque el serializer y unique_together también ayudan)
        if Review.objects.filter(movie=movie, user=self.request.user).exists():
             raise serializers.ValidationError("You have already reviewed this movie.")

        serializer.save(user=self.request.user, movie=movie)

    # Pasar contexto al serializer para validación 'unique_together' si es necesario
    def get_serializer_context(self):
        context = super().get_serializer_context()
        movie_id = self.kwargs.get('movie_pk')
        if movie_id:
            try:
                 context['movie'] = Movie.objects.get(pk=movie_id)
            except Movie.DoesNotExist:
                 pass # El serializer manejará el error si intenta guardar sin movie válido
        context['request'] = self.request # Necesario para validación unique en serializer
        return context


# Opcional: Vista para Detalle/Editar/Borrar Reseña (si necesitas modificar reseñas)
class ReviewDetailView(generics.RetrieveUpdateDestroyAPIView):
     queryset = Review.objects.all()
     serializer_class = ReviewSerializer
     permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly] # Solo el creador puede modificar/borrar su reseña
     lookup_url_kwarg = 'review_pk' # Nombre del parámetro en la URL

     # Asegurar que la reseña pertenezca a la película correcta (opcional pero bueno)
     def get_object(self):
         obj = super().get_object()
         movie_id = self.kwargs['movie_pk']
         if obj.movie.id != movie_id:
             from django.http import Http404
             raise Http404("Review not found for this movie.")
         return obj

# --- FIN SECCIÓN ORO ---
