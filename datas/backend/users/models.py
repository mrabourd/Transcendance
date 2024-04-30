from django.db import models
from django.contrib.auth.models import AbstractUser
import uuid

class User(AbstractUser):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    avatar = models.TextField(max_length=500, blank=True)
    biography = models.TextField(max_length=500, blank=True)
    status = models.IntegerField(default=0)
    follows = models.ManyToManyField(
        "self",
        related_name="followed_by",
        symmetrical=False,
        blank=True
    )

    def SetStatus(self, status):
        print(f'{self} status = {status} ')
        self.status = status

# class Followed(models.Model):
#     follower = models.ForeignKey(User, related_name='follower', on_delete=models.CASCADE)
#     id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
#     print("id du followed: ",)
#     follower = models.ForeignKey(User, related_name='followed_users', on_delete=models.CASCADE)
#     # followed_user = models.ForeignKey(User, related_name='followers', on_delete=models.CASCADE)
#     created_at = models.DateTimeField(auto_now_add=True)