from django.urls import path
from .consumer import ChatConsumer


urlpatterns = [
    path('msg/', ChatConsumer.as_asgi()),
]