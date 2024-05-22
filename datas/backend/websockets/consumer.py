import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from users.serializers import UserSerializer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
#from channels.auth import channel_session_user_from_http, channel_session_user

User = get_user_model()

from .models import Message, Notification

class ChatConsumer(AsyncWebsocketConsumer):
	
	async def connect(self):
		self.user = self.scope["user"]
		if self.user.is_anonymous:
			await self.close()
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
	@database_sync_to_async
	def save_message(self, message):
		Message.objects.create(message=message, user=self.user)
		return Message.objects.last()

	async def chat_message(self, event):
		message = event["message"]
		user = event["user"]
		save_message = await self.save_message(message)
		
		# Send message to WebSocket
		await self.send(text_data=json.dumps({"message": message, "username": user.username, "user_id" : str(user.id), "avatar" : user.avatar, "created_at": save_message.created_at.strftime("%Y-%m-%d %H:%M:%S")}))


class NotificationConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user = self.scope["user"]
		if self.user.is_anonymous:
			await self.close()
		#self.group_name = str(self.scope["user"].pk)  # Setting the group name as the pk of the user primary key as it is unique to each user. The group name is used to communicate with the user.
		#async_to_sync(self.channel_layer.group_add)(self.group_name, self.channel_name)
		self.group_name = 'public_room'
		if isinstance(self.user, AnonymousUser):
			await self.accept()
			await self.send(text_data=json.dumps({"error": "token_not_valid"}))
			await self.close()
			return
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
