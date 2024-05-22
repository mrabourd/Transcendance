from django.urls import path
from .consumer import ChatConsumer, NotificationConsumer
import uuid


urlpatterns = [
    path('ws/msg/<str:friend_id>/', ChatConsumer.as_asgi()),
	path('ws/notify/', NotificationConsumer.as_asgi()),
]
