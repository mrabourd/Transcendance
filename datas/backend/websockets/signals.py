from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
from .models import Notification

@receiver(post_save, sender=Notification)
def notification_created(sender, instance, created, **kwargs):
	if created and instance.type == 'public':
		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(
			'public_room',
			{
				"type": "send_notification",
				"code": instance.code,
				"message": instance.message,
				"link": instance.link,
				"sender": instance.sender.username				
			}
		)
	elif created and instance.type == 'private':
		channel_layer = get_channel_layer()
		async_to_sync(channel_layer.group_send)(
			f"{instance.receiver.id}",
			{
				"type": "send_notification",
				"code": instance.code,
				"message": instance.message,
				"link": instance.link,
				"sender": instance.sender.username
			}
		)