import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.contrib.auth import get_user_model
from django.contrib.auth.decorators import login_required
from users.serializers import UserSerializer
from channels.db import database_sync_to_async
from django.contrib.auth.models import AnonymousUser
#from channels.auth import channel_session_user_from_http, channel_session_user
from .models import ChatRoom
from .pong import Game, Player
User = get_user_model()

onlineGames = []

class PongConsumer(AsyncWebsocketConsumer):
	
	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self.game = None


	async def connect(self):
		self.user = self.scope["user"]

		if isinstance(self.user, AnonymousUser):
			await self.accept()
			await self.send(text_data=json.dumps({"error": "token_not_valid"}))
			await self.close()
			return
		
		# match_id a recuperer dans l'url
		self.match_id = self.scope['url_route']['kwargs']['match_id']
		await self.channel_layer.group_add(self.match_id, self.channel_name)

		self.game = next(x for x in onlineGames if x.match_id == self.match_id)
		if self.game is None:
			self.game = Game(self.match_id)
			onlineGames.append(self.game)
		
		if self.match_id.split('---')[0] == str(self.user.id):
			self.game.player1 = Player (self.user.id, self.user.username)
			self.game.player1.ws = self
		elif self.match_id.split('---')[1] == str(self.user.id):
			self.game.player2 = Player (self.user.id, self.user.username)
			self.game.player2.ws = self
			# verif si les deux users sont la
		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			"match_id", self.channel_name
		)

	async def send_notification(self, event):
		await self.send(text_data=json.dumps({ 'message': event['message'] }))



	# INSPI:
	# https://github1s.com/MatPizzolo/ft_transcendence/blob/main/backend/server/ws_api/consumers/gameconsumer2.py

	# Creer PONG en ython dans un autre fichier.