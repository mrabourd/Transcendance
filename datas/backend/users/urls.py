from django.urls import path
from users.views import GetCSRFTokenView, CustomObtainTokenPairView, UserRegistrationAPIView, UsersAPIView, UserDetail
from rest_framework_simplejwt.views import TokenRefreshView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.views import LogoutView
import uuid 
from rest_framework.urlpatterns import format_suffix_patterns

#from users.views import UserProfileAPIView


urlpatterns = [
    path('get_csrf_token/', GetCSRFTokenView.as_view(), name='get_csrf_token'),
    path('login/', CustomObtainTokenPairView.as_view(), name='token_obtain_pair'),
    path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/',
         UserRegistrationAPIView.as_view(),
         name='user-register'),
	path('logout/', LogoutView.as_view(), name='logout'),

	path('all/', UsersAPIView.as_view(), name='users-list'),

    path('profile/<uuid:id>/', UserDetail.as_view(), name='profile-id')
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])