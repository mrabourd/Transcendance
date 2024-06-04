

import json
import uuid
import asyncio
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
from django.shortcuts import get_object_or_404
from django.core.serializers.json import DjangoJSONEncoder
from django.http import Http404
from django.db.models import Min
from django.contrib.auth import get_user_model
#from channels.auth import channel_session_user_from_http, channel_session_user

User = get_user_model()

class PongServer:
	def __init__(self, playerleft_id=None, playerright_id=None):
		self._param = {
			"playerleft": {
				"y": 50,
				"score": 0,
				"player": playerleft_id
			},
			"playerright": {
				"y": 50,
				"score": 0,
				"player": playerright_id
			},
			"ball": {
				"x": 50,
				"y": 50,
				"r": 5,
				"speed": {
					"x": 2,
					"y": 2
				}
			}
		}

	def moveUp(self, player):
		self._param[player]["y"] = self._param[player]["y"] + 5
	
	def moveDown(self, player):
		self._param[player]["y"] = self._param[player]["y"] - 5
	
	def get_params(self):
		return self._param

	def __str__(self):
		return str(self._param)




class PongConsumer(AsyncWebsocketConsumer):
	shared_game = {}			# Holds the shared game object for the match.

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self._game = None  # Initialize the game attribute
		self.user = None  # Placeholder for user attribute
		self.send_game_state_task = None  # Task for sending game state at intervals
# Async Database Methods
	@database_sync_to_async
	def load_models(self, match_id, playerleft, playerright):
		if match_id in self.shared_game:
			self._game = self.shared_game[match_id]
		else:
			match = Match.objects.get(pk=match_id)
			users = match.users.all()
			if len(users) != 2:
				raise ValueError("There must be exactly 2 users in a match")
			
			# Determine playerleft and playerright based on user IDs
			playerleft, playerright = sorted(users, key=lambda u: u.id)
			
			self.shared_game[match_id] = PongServer(playerleft.id, playerright.id)
			self._game = self.shared_game[match_id]




	async def connect(self):
		self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
		self.user = self.scope["user"]

		if self.user.is_anonymous:
			await self.close()
			return

		self.room_name = f"pong_room_{self.match_id}"
		self.room_group_name = f"pong_{self.match_id}"

		# Validate the UUID
		try:
			uuid_obj = uuid.UUID(self.match_id)
		except ValueError:
			await self.close()
			return  # Close the connection if UUID is invalid

		try:
			self.pong_room = await database_sync_to_async(get_object_or_404)(Match, match_id=uuid_obj)
		except Http404:
			await self.close()
			return  # Close the connection if Match_id is invalid

		existing_users = await database_sync_to_async(list)(self.pong_room.users.all())

		# Join room group
		await self.channel_layer.group_add(
			self.room_group_name,
			self.channel_name
		)

		await self.load_models(uuid_obj, existing_users[0].id, existing_users[1].id)
		await self.accept()
		self.send_game_state_task = asyncio.create_task(self.send_game_state_periodically())
	
	async def disconnect(self):
		# Cancel the background task if it exists
		if self.send_game_state_task:
			self.send_game_state_task.cancel()
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)


	def get_player_role(self):
		params = self._game.get_params()
		if self.user.id == params["playerleft"]["player"]:
			return "playerleft"
		else:
			return "playerright"

	#@channel_session_user
	async def receive(self, text_data):
		text_data_json = json.loads(text_data)
		message = text_data_json["message"]

		if (message == "moveup"):
			self._game.moveUp(self.get_player_role())
		else:
			self._game.moveDown(self.get_player_role())

		await self.send_game_state()

	async def send_game_state_periodically(self):
		while True:
			await asyncio.sleep(2)  # Interval in seconds
			await self.send_game_state()

	async def send_game_state(self):
		game_params = self._game.get_params()
		await self.channel_layer.group_send(
			self.room_group_name,
			{
				"type": "pong.datas",
				"game": json.dumps(game_params, cls=DjangoJSONEncoder),  # Use DjangoJSONEncoder
				"user": self.user.id  # Convert user to a serializable type
			}
		)

	async def pong_datas(self, event):
		game = event["game"]
		#Send message to WebSocket
		await self.send(text_data=game)


