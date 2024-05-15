from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from match.views import Subscribe, Invite
import uuid

urlpatterns = [
    path('subscribe/', Subscribe.as_view(),name='subscribe'),
    path('invite/<uuid:id>/', Invite.as_view(),name='invite'),
    
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])