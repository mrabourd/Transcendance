from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from websockets.models import Notification
from .models import Tournament, Match, MatchPoints
from .serializers import TournamentSerializer
import json
import requests
# Create your views here.
from users.models import User  # Import your User model
User = get_user_model()

# @method_decorator(csrf_protect, name='dispatch')

# def seachUser(players):
# 	i = 0
# 	for player in players:
# 		if player[1] == "username":
# 			return i
# 		i =+ 1

def createMatch(user, tournament, player1, player2):
	user = user
	# recuperer l'objet tournoi
	match = Match.objects.create(tournament=tournament)

	# user en user ou en alias, a checker
	for player in player1:
		if player1[1] == 'username':
			match_point1 = MatchPoints.objects.create(match=match, user=user, points=0)
		else:
			match_point1 = MatchPoints.objects.create(match=match, alias=player1, points=0)

	for player in player2:
		if player1[1] == 'username':
			match_point2 = MatchPoints.objects.create(match=match, user=user, points=0)
		else:
			match_point2 = MatchPoints.objects.create(match=match, alias=player2, points=0)

	# renvoyer l'id du match:

	return match
# return HttpResponse("Invalid request type.", status=400)
