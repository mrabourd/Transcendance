from django.db import models
from django.conf import settings
from users.models import User  # Importer le modèle User depuis l'application users
from django.utils import timezone
import uuid

# Create your models here.
class Tournament(models.Model):
    tournament_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.IntegerField()
    # Ajoutez d'autres champs nécessaires pour le modèle Tournament
    
    def __str__(self):
        return self.name

class Match(models.Model):
    match_id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tournament = models.ForeignKey(Tournament, null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    # player1 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="player1")
    # player2 = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name="player2")
  
    # def __str__(self):
    #     return f'Match {self.pk} in {self.tournament.name}'

class MatchPoints(models.Model):
    match = models.ForeignKey(Match, null=True, blank=True, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    points = models.IntegerField()
    alias = models.TextField(max_length=50, blank=True)

    def __str__(self):
        return f'MatchPoints {self.pk} - Match {self.match.pk} - User {self.user.username}'