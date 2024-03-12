from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

""" class User(AbstractUser):
	realname = models.CharField(max_length=255, blank=True, null=True)
    username = models.CharField(max_length=200, blank=True, null=True)
    email = models.CharField(max_length=200, blank=True, null=True)
    created = models.DateTimeField(auto_now_add=True)
    id = models.UUIDField(default=uuid.uuid4, unique=True, primary_key=True, editable=False)

	def __str__(self):
		return self.username """


