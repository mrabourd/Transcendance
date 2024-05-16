from django.urls import path
from .consumer import ChatConsumer


urlpatterns = [
    path('ws/msg/<str:room_name>/', ChatConsumer.as_asgi()),
]
