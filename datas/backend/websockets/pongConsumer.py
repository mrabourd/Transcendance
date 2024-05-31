import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from users.serializers import UserSerializer
from django.contrib.auth.models import AnonymousUser

#from channels.auth import channel_session_user_from_http, channel_session_user
from match.models import Match, MatchPoints
from websockets.models import ChatRoom
from .pong import Game, Player

import json
from uuid import UUID
from rest_framework.test import APIRequestFactory
from users.views_login import CustomLogoutView
from rest_framework import status
from channels.db import database_sync_to_async
from django.contrib.auth import get_user_model
#from channels.auth import channel_session_user_from_http, channel_session_user

User = get_user_model()


class PongConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
		self.user = self.scope["user"]
		if self.user.is_anonymous:
			await self.close()

		self.room_name = f"pong_room_{self.match_id}"
		self.room_group_name = f"pong_{self.match_id}"

		# Ensure the chat room exists or create it
		self.pong_room, created = await database_sync_to_async(Match.objects.get_or_create)(
			match_id=self.match_id
		)

		if created:
			print(f">>>>>>>>>>>> ${self.match_id} created !!!!!")
			match_points = await database_sync_to_async(MatchPoints.objects.filter)(match_id=self.match_id)
			users = await database_sync_to_async(list)(match_points.values_list('user', flat=True))
			# Ajouter les utilisateurs à la chat room
			for user_id in users:
				print(f'>>>>>>>>>>>> user.add {user}')
				user = await database_sync_to_async(User.objects.get)(id=user_id)
				await database_sync_to_async(self.pong_room.users.add)(user)
		else:
			existing_users = await database_sync_to_async(list)(self.pong_room.users.all())
			print(f">>>>>>>>>>>> ${self.match_id} exists !!!!!")
			print(f'>>>>>>>>>>>> existing_users {existing_users}')

		# Join room group
		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)
		await self.accept()
		#@channel_session_user

	async def disconnect(self, close_code):
		# Leave room group
		print(f'>>>>>>>>>>>> pong disconnected ....')
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

	async def chat_message(self, event):
		message = event["message"]
		# Send message to WebSocket
		await self.send(text_data=json.dumps({"message": message}))

