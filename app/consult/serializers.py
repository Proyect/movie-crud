from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from django.db.models import Avg # Para Oro
from .models import Movie, Review # Importa Review para Oro

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password")

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'password', 'password2')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True},
            'email': {'required': True}
        }

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        # Puedes añadir validación de email único aquí si quieres, aunque el modelo ya lo hace.
        if User.objects.filter(email=attrs['email']).exists():
             raise serializers.ValidationError({"email": "Email already exists."})
        if User.objects.filter(username=attrs['username']).exists():
             raise serializers.ValidationError({"username": "Username already exists."})
        return attrs

    def create(self, validated_data):
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data['email'],
            first_name=validated_data['first_name'],
            last_name=validated_data['last_name']
        )
        # Usa set_password para hashear correctamente con BCrypt (configurado en settings.py)
        user.set_password(validated_data['password'])
        user.save()
        return user

# --- SOLO PARA MEDALLA DE ORO ---
class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.ReadOnlyField(source='user.username') # Mostrar username en lugar de ID

    class Meta:
        model = Review
        fields = ('id', 'user', 'rating', 'comment', 'created_at', 'movie') # Incluir movie es útil para el contexto, pero a menudo se omite si está en la URL
        read_only_fields = ('movie', 'user') # El usuario y la película se asignan en la vista

    def validate_rating(self, value):
        if not 1 <= value <= 5:
            raise serializers.ValidationError("Rating must be between 1 and 5.")
        return value

    def validate(self, data):
         # Validar que el usuario no haya reseñado ya esta película (aunque unique_together lo hace en DB)
         # Se necesita el contexto de la vista para obtener movie y user
         request = self.context.get('request')
         movie = self.context.get('movie')
         if request and movie:
             if Review.objects.filter(movie=movie, user=request.user).exists():
                 # Si es una actualización (PUT/PATCH), se permite. Si es creación (POST), no.
                 if request.method == 'POST':
                     raise serializers.ValidationError("You have already reviewed this movie.")
         return data

# --- FIN SECCIÓN ORO ---

class MovieSerializer(serializers.ModelSerializer):
    # Mostrar username en lugar de ID, solo lectura
    created_by_username = serializers.ReadOnlyField(source='created_by.username')
    # --- SOLO PARA MEDALLA DE ORO ---
    reviews = ReviewSerializer(many=True, read_only=True) # Anidar reseñas en detalle de película
    average_rating = serializers.SerializerMethodField() # Campo calculado
    # --- FIN SECCIÓN ORO ---

    class Meta:
        model = Movie
        fields = [
            'id', 'title', 'director', 'release_date', 'description', 'image_url',
            'created_by', 'created_by_username', 'created_at', 'updated_at',
            'reviews', 'average_rating' # Campos Oro
        ]
        # El usuario se asigna automáticamente en la vista al crear/actualizar
        read_only_fields = ('created_by',)

    # --- SOLO PARA MEDALLA DE ORO ---
    def get_average_rating(self, obj):
        # Calcula el promedio de ratings para esta película
        average = obj.reviews.aggregate(Avg('rating')).get('rating__avg')
        if average is None:
            return None
        return round(average, 1) # Redondear a 1 decimal
    # --- FIN SECCIÓN ORO ---

    # Añadir validaciones a nivel de serializer si es necesario
    def validate_title(self, value):
        if len(value) < 2:
            raise serializers.ValidationError("Title must be at least 2 characters long.")
        return value
    # Añade más validaciones para director, release_date, etc.