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

class MatchPointsSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(source='user', read_only=True)

    class Meta:
        model = MatchPoints
        fields = ['user_id', 'points', 'alias']

class MatchSerializer(serializers.ModelSerializer):
    players = MatchPointsSerializer(many=True, read_only=True)

    class Meta:
        model = Match
        fields = ['match_id', 'status', 'tournament', 'created_at', 'players']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        representation['players'] = MatchPointsSerializer(instance.players_set.all(), many=True).data
        return representation