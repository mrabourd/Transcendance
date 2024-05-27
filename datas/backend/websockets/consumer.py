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

from .models import Message, Notification

class ChatConsumer(AsyncWebsocketConsumer):
    
    async def connect(self):
        self.user = self.scope["user"]
        if self.user.is_anonymous:
            await self.close()
        self.friend_id = self.scope["url_route"]["kwargs"]["friend_id"]

        try:
            self.other_user = await User.objects.aget(id=self.friend_id)
        except User.DoesNotExist:
            await self.close()
        
        self.room_name = f"room_{min(self.user.id, self.other_user.id)}_{max(self.user.id, self.other_user.id)}"
        self.room_group_name = f"chat_{self.room_name}"

        # Ensure the chat room exists or create it
        self.chat_room, created = await database_sync_to_async(ChatRoom.objects.get_or_create)(
            name=self.room_name
        )
        if created:
            print("########## ${self.chat_room} created !!!!!")
            await database_sync_to_async(self.chat_room.users.add)(self.user)
            await database_sync_to_async(self.chat_room.users.add)(self.other_user)

        # Join room group
        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name
        )
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


    # Receive message from room group
    @database_sync_to_async
    def save_message(self, message):
        Message.objects.create(message=message, user=self.user, chat_room=self.chat_room)
        return Message.objects.last()

    async def chat_message(self, event):
        message = event["message"]
        user = event["user"]
        save_message = await self.save_message(message)
        
        # Send message to WebSocket
        await self.send(text_data=json.dumps({"message": message, "username": user.username, "user_id" : str(user.id), "avatar" : user.avatar, "created_at": save_message.created_at.strftime("%Y-%m-%d %H:%M:%S")}))


class GeneralNotificationConsumer(AsyncWebsocketConsumer):
	async def connect(self):
		self.user = self.scope["user"]
		if isinstance(self.user, AnonymousUser):
			await self.accept()
			await self.send(text_data=json.dumps({"error": "token_not_valid"}))
			await self.close()
			return
		
		await self.channel_layer.group_add("public_room", self.channel_name)
		await self.channel_layer.group_add(f"{self.user.id}", self.channel_name)

		await self.accept()

	async def disconnect(self, close_code):
		await self.channel_layer.group_discard(
			"public_room", self.channel_name
		)

	async def send_notification(self, event):
		await self.send(text_data=json.dumps({ 
               'code': event['code'],
               'message': event['message'],
               'link': event['link'],
               'sender': event['sender']
            }))

'''
"type": "send_notification",
"code": instance.code,
"message": instance.message,
"link": instance.link,
"sender": instance.sender.username
'''