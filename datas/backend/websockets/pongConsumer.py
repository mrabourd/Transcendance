

import json
import uuid
import asyncio
import random
from django.db import transaction
from channels.db import database_sync_to_async
from asgiref.sync import sync_to_async
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
	def __init__(self, playerleft=None, playerright=None):
		self._param = {
			"infos": {
				"status":1,
				"winner":None
			},
			"paddles": {
				"speed":3,
				"height":50,
				"width":1.5
			},
			"playerleft": {
				"y": 25,
				"score": 0,
				"id": str(playerleft.my_user_id),
				"username": str(playerleft.alias)
			},
			"playerright": {
				"y": 25,
				"score": 0,
				"id": str(playerright.my_user_id),
				"username": str(playerright.alias)
			},
			"ball": {
				"x": 50,
				"y": 50,
				"r": 1.5,
				"speed": {
					"x": random.uniform(-0.5, 0.5),
					"y": random.uniform(-0.5, 0.5),
				}
			},
			"cooldown": 0  # Temps restant avant que la balle puisse détecter une nouvelle collision
		}
	def reinisialise(self):
		self._param["playerleft"]["y"] = 25
		self._param["playerright"]["y"] = 25
		self._param["ball"]["x"] = 50
		self._param["ball"]["y"] = 50

	def moveUp(self, player):
		self._param[player]["y"] = self._param[player]["y"] - self._param['paddles']["speed"]
		if (self._param[player]["y"] < 0):
			self._param[player]["y"] = 0

	def moveDown(self, player):
		self._param[player]["y"] = self._param[player]["y"] + self._param['paddles']["speed"]
		if self._param[player]["y"] > 100 - self._param['paddles']["height"]:
			self._param[player]["y"] = 100 - self._param['paddles']["height"]

	async def update_ball_position(self):
		ball_radius = self._param['ball']['r'] / 2
		speed_x = self._param['ball']['speed']['x']
		speed_y = self._param['ball']['speed']['y']
		ball_x = self._param['ball']['x']
		ball_y = self._param['ball']['y']

		paddle_height = self._param['paddles']['height']
		paddle_width = self._param['paddles']['width']
		paddle1_y = self._param['playerleft']['y']
		paddle2_y = self._param['playerright']['y']

		self._param['ball']['x'] += speed_x
		self._param['ball']['y'] += speed_y

		# Décrémenter le cooldown
		if self._param['cooldown'] > 0:
			self._param['cooldown'] -= 1
			return

		# Vérifier les collisions avec les paddles
		if ball_x <= paddle_width + ball_radius:
			if paddle1_y <= ball_y <= paddle1_y + paddle_height:
				print("################## COLLIDE LEFT")
				speed_x = -speed_x + random.uniform(-0.1, 0.1)
				speed_x = max(min(speed_x, 0.8), -0.8)
				speed_y += (ball_y - (paddle1_y + paddle_height / 2)) * 0.05
				self._param['cooldown'] = 5  # Activer le cooldown pour éviter les collisions successives

		if ball_x >= 100 - paddle_width - ball_radius:
			if paddle2_y <= ball_y <= paddle2_y + paddle_height:
				print("################## COLLIDE RIGHT")
				speed_x = -speed_x + random.uniform(-0.1, 0.1)
				speed_x = max(min(speed_x, 0.8), -0.8)
				speed_y += (ball_y - (paddle2_y + paddle_height / 2)) * 0.05
				self._param['cooldown'] = 5  # Activer le cooldown pour éviter les collisions successives

		# Vérifier les collisions avec les bords et inverser la direction si nécessaire
		if ball_x <= ball_radius or ball_x >= 100 - ball_radius:
			print("################## COLLIDE WALL")
			self.reinisialise()
			if ball_x <= ball_radius:
				self.add_point("playerright")
			else:
				self.add_point("playerleft")

		if ball_y <= ball_radius or ball_y >= 100 - ball_radius:
			print("################## COLLIDE TOP/BOTTOM")
			if ball_y <= ball_radius :
				ball_y = ball_radius * 2
			else:
				ball_y =  100 - ball_radius * 2
			speed_y = -speed_y + random.uniform(-0.1, 0.1)
			speed_y = max(min(speed_y, 0.8), -0.8)
			self._param['cooldown'] = 5

		# Assurer que la balle ne se déplace pas de manière trop horizontale ou verticale
		if abs(speed_x) < 0.3:
			speed_x = 0.3 if speed_x > 0 else -0.3
		if abs(speed_y) < 0.3:
			speed_y = 0.3 if speed_y > 0 else -0.3

		self._param['ball']['speed']['x'] = speed_x
		self._param['ball']['speed']['y'] = speed_y

		# Vérifier si la balle a été perdue
		#if not (ball_x <= paddle_width + ball_radius or ball_x >= 100 - paddle_width - ball_radius):


	def get_params(self):
		return self._param
	
	def set_status(self, status):
		self._param["infos"]["status"] = status
	
	def get_status(self):
		return self._param["infos"]["status"]

	def set_player_point(self, player, score):
		self._param[player]["score"] = score

	def add_point(self, player):
		self._param[player]["score"] += 1
		if (self._param[player]["score"] >= 3):
			self.set_status(2)

	def __str__(self):
		return str(self._param)


class PongConsumer(AsyncWebsocketConsumer):
	shared_game = {}
	GAME_STATUS = {
		'PENDING' : 0,
		'PLAYING' : 1,
		'ENDED' : 2
	}

	def __init__(self, *args, **kwargs):
		super().__init__(*args, **kwargs)
		self._game = None  # Initialize the game attribute
		self.user = None  # Placeholder for user attribute
		self.game_task = None  # Task for sending game state at intervals

	# recherche si le jeu extiste dans shared_game{}
	@database_sync_to_async
	def load_models(self, match_id, playerleft, playerright):

		if match_id in self.shared_game:
			self._game = self.shared_game[match_id]
			print("EXISTING MODEL in shared_game with status ", self._game["pong"].get_status())
		else:
			# get db infos 

			self.shared_game[match_id] = {
				"pong": PongServer(playerleft, playerright),
				"playerleft":None, #check connection of players
				"playerright":None
			}
			self._game = self.shared_game[match_id]
			self._game["pong"].set_status(self.match.status)
			self._game["pong"].set_player_point("playerleft", playerleft.points)
			self._game["pong"].set_player_point("playerright", playerright.points)

			print("New MODEL with status ", self._game["pong"].get_status())


	async def connect(self):
		self.match_id = self.scope["url_route"]["kwargs"]["match_id"]
		self.user = self.scope["user"]

		if self.user.is_anonymous:
			await self.close()
			return

		self.room_name = f"match_{self.match_id}"
		self.room_group_name = f"pong_{self.match_id}"

		# Validate the match UUID
		try:
			uuid_obj = uuid.UUID(self.match_id)
		except ValueError:
			await self.close()
			return  # Close the connection if UUID is invalid

		try:
			self.match = await database_sync_to_async(get_object_or_404)(Match, match_id=uuid_obj)
		except Http404:
			await self.close()
			return  # Close the connection if Match_id is invalid

		existing_users = await database_sync_to_async(list)(self.match.match_points.all().order_by('my_user_id'))
		self.match_point_1 = existing_users[0]
		self.match_point_2 = existing_users[1]

		# Join room group
		await self.channel_layer.group_add(self.room_group_name,self.channel_name)

		await self.load_models(uuid_obj, self.match_point_1, self.match_point_2)
		self._game[self.get_player_role()] = self.user

		print("roles : playerleft ", self._game["playerleft"])
		print("roles : playerright ", self._game["playerright"])
		await self.accept()

		if self._game["playerleft"] and self._game["playerright"]:
			status = self._game["pong"].get_status()
			if (status == self.GAME_STATUS["PENDING"]):
				self._game["pong"].set_status(self.GAME_STATUS["PLAYING"])
				self.game_task = asyncio.create_task(self.send_game_state_periodically())
			else:
				await self.send_game_state()
		else:
			await self.send_game_state()
	
	async def disconnect(self, code):
		# Cancel the background task if it exists
		await self.save_game_state()
		await self.channel_layer.group_discard(
			self.room_group_name,
			self.channel_name
		)
		player_role = self.get_player_role()
		if player_role:
			self._game[self.get_player_role()] = None
			if (self._game["pong"].get_status() == self.GAME_STATUS["PLAYING"]):
				self._game["pong"].set_status(self.GAME_STATUS["PENDING"])
			if self.game_task:
				await self.cancel_game_task()

	def get_player_role(self):
		params = self._game["pong"].get_params()
		if str(self.user.id) == params["playerleft"]["id"]:
			return "playerleft"
		elif str(self.user.id) == params["playerright"]["id"]:
			return "playerright"
		else:
			return None

	#@channel_session_user
	async def receive(self, text_data):
		if self.get_player_role():
			text_data_json = json.loads(text_data)
			message = text_data_json["message"]
			if message == "moveup":
				self._game["pong"].moveUp(self.get_player_role())
			else:
				self._game["pong"].moveDown(self.get_player_role())

	async def send_game_state_periodically(self):
		status = self._game["pong"].get_status()
		await self.send_game_state()
		if (status != self.GAME_STATUS["PLAYING"]):
			await self.save_game_state()
			await self.cancel_game_task()
			pass
		while True and status == self.GAME_STATUS["PLAYING"]:
			await asyncio.sleep(0.02)  # Interval in seconds
			await self.send_game_state()
			status = self._game["pong"].get_status()
			if (status != self.GAME_STATUS["PLAYING"]):
				await self.save_game_state()
				await self.cancel_game_task()
				break

	async def send_game_state(self):
		game_params = await self._game["pong"].update_ball_position()
		game_params = self._game["pong"].get_params()
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

	async def cancel_game_task(self):
		self.game_task.cancel()
		print("cancel_game_task, try to save")
		await self.send_game_state()
		# si le status est ended > enreister dans la BDD


	async def save_game_state(self):
		print("####################### save_game_state #1")

		try:
			print("save_game_state #2", self.match)
			game_params = self._game["pong"].get_params()
			self.match.status = game_params["infos"]["status"]
			self.match_point_1.points = game_params["playerleft"]["score"]
			self.match_point_2.points = game_params["playerright"]["score"]
			if (game_params["playerleft"]["score"] > game_params["playerright"]["score"]):
				self.match_point_1.result = "win"
				self.match_point_2.result = "loss"
			else:
				self.match_point_2.result = "win"
				self.match_point_1.result = "loss"
			await database_sync_to_async(self.match.save)()
			await database_sync_to_async(self.match_point_1.save)()
			await database_sync_to_async(self.match_point_2.save)()
			print("save_game_state #3", self.match.status)


			# Update or create MatchPoints for playerleft

			print("uppdate game score for playerleft", game_params["playerleft"]["id"], game_params["playerleft"]["score"])
			print("uppdate game score for playerright", game_params["playerright"]["id"], game_params["playerright"]["score"])

			# Update match status

		except Match.DoesNotExist:
			print("Match not found")
			return