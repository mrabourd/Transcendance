from django.urls import path
from users.views import CustomObtainTokenPairView, UserRegistrationAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.decorators.csrf import csrf_exempt



urlpatterns = [
    path('login/', csrf_exempt(CustomObtainTokenPairView.as_view()), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',
         UserRegistrationAPIView.as_view(),
         name='user-register'),
]
