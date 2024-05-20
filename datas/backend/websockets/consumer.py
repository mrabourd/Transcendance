import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required

#from channels.auth import channel_session_user_from_http, channel_session_user

User = get_user_model()

from .models import Message, Notification

class ChatConsumer(AsyncWebsocketConsumer):
	
	async def connect(self):
		self.user = self.scope["user"]
		self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
		self.room_group_name = f"chat_{self.room_name}"

		print(self.user)
		# Join room group
		await self.channel_layer.group_add(self.room_group_name, self.channel_name)

		await self.accept()

	#@channel_session_user
	async def disconnect(self, close_code):
		# Leave room group
		await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

	# Receive message from WebSocket
	#@channel_session_user
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json["message"]

		# Send message to room group
		await self.channel_layer.group_send(
			self.room_group_name, {"type": "chat.message", "message": message, "user": self.user}
		)
		#new_notif = Notification(message=message)
		#await self.create_notification(new_notif) """
		# Save message to database
		#await self.save_message(message)


	# Receive message from room group
	async def chat_message(self, event):
		message = event["message"]
		# Send message to WebSocket
		await self.send(text_data=json.dumps({"message": message, "user": self.user.username}))


class NotificationConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user = self.scope["user"]
		self.group_name = 'public_room'
		await self.channel_layer.group_add(
			self.group_name,
			self.channel_name
		)
		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			self.group_name,
			self.channel_name
		)

	async def send_notification(self, event):
		await self.send(text_data=json.dumps({ 'message': event['message'] }))
