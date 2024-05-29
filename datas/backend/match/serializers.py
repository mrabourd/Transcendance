from django.contrib.auth import get_user_model
from rest_framework.settings import api_settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from django.core.validators import MinLengthValidator
from match.models import Tournament, Match, MatchPoints
from websockets.models import Message
from django.core.exceptions import ObjectDoesNotExist
User = get_user_model() # Get reference to the model


class TournamentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tournament
        fields = ['tournament_id', 'name', 'status', 'user', 'created_at']
        read_only_fields = ['tournament_id', 'created_at']