from django.urls import path
from .consumer import ChatConsumer, GeneralNotificationConsumer
import uuid


urlpatterns = [
    path('ws/msg/<str:room_name>/', ChatConsumer.as_asgi()),
	path('ws/notify/', GeneralNotificationConsumer.as_asgi()),
]
