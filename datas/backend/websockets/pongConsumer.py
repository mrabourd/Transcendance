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
User = get_user_model()


class PongConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]
        if isinstance(self.user, AnonymousUser):
            await self.accept()
            await self.send(text_data=json.dumps({"error": "token_not_valid"}))
            await self.close()
            return
        
        # match_id a recuperer dans l'url
        await self.channel_layer.group_add("match_id", self.channel_name)
        
        # fonction pour recup les users associes au mtch_id dans db (dans match point)
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