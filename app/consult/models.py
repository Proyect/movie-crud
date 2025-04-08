
from django.db import models
from django.contrib.auth.models import User
from django.core.validators import MinValueValidator, MaxValueValidator

class Movie(models.Model):
    title = models.CharField(max_length=200)
    director = models.CharField(max_length=100)
    release_date = models.DateField()
    description = models.TextField()
    image_url = models.URLField(max_length=500, blank=True, null=True) # O usa ImageField si subes archivos
    created_by = models.ForeignKey(User, related_name='movies', on_delete=models.CASCADE)
    
    def __str__(self):
        return self.title

# --- SOLO PARA MEDALLA DE ORO ---
class Review(models.Model):
    movie = models.ForeignKey(Movie, related_name='reviews', on_delete=models.CASCADE)
    user = models.ForeignKey(User, related_name='reviews', on_delete=models.CASCADE)
    rating = models.IntegerField(validators=[MinValueValidator(1), MaxValueValidator(5)])
    comment = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        # Asegura que un usuario solo pueda dejar una reseña por película
        unique_together = ('movie', 'user')
        ordering = ['-created_at']

    def __str__(self):
        return f'Review for {self.movie.title} by {self.user.username}'
# --- FIN SECCIÓN ORO ---
