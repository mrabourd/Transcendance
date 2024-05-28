from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from match.views import Subscribe, Invite
from match.views_tournament import Tournament
import uuid

urlpatterns = [
    path('subscribe/', Subscribe.as_view(),name='subscribe'),
    path('invite/<str:req_type>/<uuid:id>/', Invite.as_view(),name='invite'),
    path('tournament/<str:req_type>/<str:name>/', Tournament.as_view(), name='tournament'),

]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])