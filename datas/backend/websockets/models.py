from django.db import models
from django.contrib.auth import get_user_model

User = get_user_model()

class Message(models.Model):
	message = models.JSONField()
	user = models.ForeignKey(to=User, on_delete=models.CASCADE, null=True, blank=True)
	created_at = models.DateTimeField(auto_now_add=True)

# 1. 👇 Add the following line
class Notification(models.Model):
    message = models.CharField(max_length=100)
    #sender = models.ForeignKey(to=User, on_delete=models.CASCADE, null=True, blank=True)
    #type = models.CharField(max_length=100)