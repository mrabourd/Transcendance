from django.urls import path
from . import views
from users.views_login import CustomObtainTokenPairView, CustomTokenRefreshView, GetCSRFTokenView
from users.views_login import UserRegistrationAPIView, MaVueProtegee, GetCSRFTokenView, CustomLogoutView
from users.views_login_42 import login42Callback
from users.views_login2FA import login2FA, login2FA_Verify

from users.views_user import UsersAPIView, FollowUser
from users.views_user import UserDetail

from users.views import ChatMessageHistory

from rest_framework_simplejwt.views import TokenRefreshView, TokenBlacklistView
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.views import LogoutView
import uuid
from rest_framework.urlpatterns import format_suffix_patterns

#from users.views import UserProfileAPIView


urlpatterns = [
    # LOGINS VIEWS
    path('auth/intra_callback/', login42Callback, name="login_42_callback"),
    path('auth/login2FA/', login2FA, name='login2FA'),
    path('auth/verify2FA/', login2FA_Verify, name='login2FA_Verify'),
    path('register/', UserRegistrationAPIView.as_view(), name='user-register'),
    path('login/', CustomObtainTokenPairView.as_view(), name='token_obtain_pair'),
	path('login/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('logout/', CustomLogoutView.as_view(), name='logout'),

    path('get_csrf_token/', GetCSRFTokenView.as_view(), name='get_csrf_token'),
    path('ma_vue_protegee/', MaVueProtegee.as_view(), name='ma_vue_protegee'),

    # USERS VIEWS
	path('all/', UsersAPIView.as_view(), name='users-list'),
	path('list/<str:req_type>/', UsersAPIView.as_view(), name='users-list'),
    path('profile/<uuid:id>/', UserDetail.as_view(), name='profile-id'),

    path('<str:req_type>/<uuid:id>/', FollowUser.as_view(), name='follow_user'),


    path('chat/messages/history/<uuid:friend_id>/', ChatMessageHistory.as_view(),name='history'),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])