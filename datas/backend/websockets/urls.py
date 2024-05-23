from django.urls import path
from .consumer import ChatConsumer, GeneralNotificationConsumer
import uuid


urlpatterns = [
	path('ws/notify/', GeneralNotificationConsumer.as_asgi()),
    path('ws/msg/<str:friend_id>/', ChatConsumer.as_asgi()),
]
