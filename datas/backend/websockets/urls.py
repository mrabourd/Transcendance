from django.urls import path
from .consumer import ChatConsumer
import uuid


urlpatterns = [
    path('ws/msg/<str:room_name>/', ChatConsumer.as_asgi()),
	#path('ws/notify/<uuid:id>/', PushConsumer.as_asgi()),
]
