from django.urls import path
from . import views
from rest_framework.urlpatterns import format_suffix_patterns
from match.views import Subscribe

urlpatterns = [
    path('subscribe/', Subscribe.as_view(),name='subscribe'),
]

urlpatterns = format_suffix_patterns(urlpatterns, allowed=['json', 'html'])