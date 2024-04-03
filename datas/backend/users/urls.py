from django.urls import path
from users.views import CustomObtainTokenPairView, UserRegistrationAPIView
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.views import LogoutView

#from users.views import UserProfileAPIView


urlpatterns = [
    path('login/', CustomObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',
         UserRegistrationAPIView.as_view(),
         name='user-register'),
	path('logout/', LogoutView.as_view(), name='logout'),

	
]
