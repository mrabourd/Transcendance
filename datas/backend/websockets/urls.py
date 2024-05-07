from django.urls import path
from .consumer import ChatConsumer


urlpatterns = [
    path('ws/msg/', ChatConsumer.as_asgi()),
]
