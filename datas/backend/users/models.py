from django.db import models
from django.contrib.auth.models import AbstractUser
from django.core.validators import MinLengthValidator
import uuid

class User(AbstractUser):

    # USER_STATUS cf. front contstants.js
    USER_STATUS = {
        'OFFLINE' : 0,
        'ONLINE' : 1,
        'PLAYING' : 2,
        'WAITING_PLAYER' : 3,
        'WAITING_FRIEND' : 4,
        'WAITING_TOURNAMENT' : 5
    }


    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    avatar = models.TextField(max_length=500, blank=True, default="/avatars/default.png")
    biography = models.TextField(max_length=500, blank=True)
    status = models.IntegerField(default=0)
    follows = models.ManyToManyField(
        "self",
        related_name="followed_by",
        symmetrical=False,
        blank=True
    )
    blocks = models.ManyToManyField(
        "self",
        related_name="blocked_by",
        symmetrical=False,
        blank=True
    )
    first_name = models.CharField(max_length=30, blank=True, validators=[MinLengthValidator(1)])
    last_name = models.CharField(max_length=150, blank=True, validators=[MinLengthValidator(1)])

    def SetStatus(self, status):
        print(f'{self} status = {status} ')
        self.status = status
        self.save()