from django.urls import path
from . import views
from users.views import CustomObtainTokenPairView, CustomTokenRefreshView, UserRegistrationAPIView, UsersAPIView, FollowUser
from users.views import MaVueProtegee, GetCSRFTokenView, CustomObtainTokenPairView, UserRegistrationAPIView, UsersAPIView, UserDetail, FollowUser
from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
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
	path('logout/', TokenBlacklistView.as_view(), name='logout'),

	path('all/', UsersAPIView.as_view(), name='users-list'),

    path('ma_vue_protegee/', MaVueProtegee.as_view(), name='ma_vue_protegee'),

    path('profile/<uuid:id>/', UserDetail.as_view(), name='profile-id'),

    path('<str:req_type>/<uuid:id>/', FollowUser.as_view(), name='follow_user'),
    # path('<text:req_type>/<uuid:id>/', FollowUser.as_view(), name='unfollow_user'),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])