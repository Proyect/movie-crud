from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView, # Vista para obtener tokens (Login)
    TokenRefreshView,    # Vista para refrescar tokens
)

urlpatterns = [
    path('admin/', admin.site.urls),
    # URLs de Autenticación JWT (Login y Refresh)
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
   
    #path('api/', include('consult.urls')), 
]

