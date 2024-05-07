import json

from channels.db import database_sync_to_async
from channels.generic.websocket import WebsocketConsumer
from django.contrib.auth.models import AnonymousUser

from .models import Message

class ChatConsumer(WebsocketConsumer):
    def connect(self):
        self.accept("Authorization")
        
            

    def disconnect(self, close_code):
        pass

    def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message = text_data_json["message"]

        self.send(text_data=json.dumps({"message": message}))