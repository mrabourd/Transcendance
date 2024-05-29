from django.urls import path
# from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from match.views_invite import Subscribe, Invite
from match.views_tournament import TournamentView
from match.views_match import CreateMatchView
import uuid

urlpatterns = [
    path('subscribe/', Subscribe.as_view(),name='subscribe'),
    path('invite/<str:req_type>/<uuid:id>/', Invite.as_view(),name='invite'),
    path('tournament/<str:req_type>/<str:name>/', TournamentView.as_view(), name='tournament'),
    path('<uuid:tournament_id>/<str:name>/', CreateMatchView.as_view(), name='match'),

]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])