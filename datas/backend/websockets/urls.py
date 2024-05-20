from django.urls import path
from .consumer import ChatConsumer, NotificationConsumer
import uuid


urlpatterns = [
    path('ws/msg/<str:room_name>/', ChatConsumer.as_asgi()),
	path('ws/notify/', NotificationConsumer.as_asgi()),
]
