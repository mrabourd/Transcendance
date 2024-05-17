from django.db import models
from django.conf import settings
from users.models import User  # Importer le modèle User depuis l'application users
from django.utils import timezone
# Create your models here.
class Tournament(models.Model):
    name = models.CharField(max_length=100)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)
    status = models.IntegerField()
    # Ajoutez d'autres champs nécessaires pour le modèle Tournament
    
    def __str__(self):
        return self.name

class Match(models.Model):
    tournament = models.ForeignKey(Tournament, null=True, blank=True, on_delete=models.CASCADE)
    created_at = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f'Match {self.pk} in {self.tournament.name}'

class MatchPoints(models.Model):
    match = models.ForeignKey(Match, null=True, blank=True, on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, null=True, blank=True, on_delete=models.CASCADE)
    points = models.IntegerField()

    def __str__(self):
        return f'MatchPoints {self.pk} - Match {self.match.pk} - User {self.user.username}'