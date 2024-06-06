from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated
from django.db import IntegrityError
from django.db.models import Q
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
from websockets.models import Notification
from .models import Match, MatchPoints
from .serializers import MatchSerializer
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




class MatchList(APIView):
	# Cette méthode gère les requêtes POST
	def post(self, request, req_type):
		current_user = request.user

		# Filtrer les matchs dont le statut est 0
		if req_type == 'pending':
			matches = Match.objects.exclude(status=2)
		else:
			matches = Match.objects()

		# Filtrer les matchs pour lesquels l'utilisateur actuel a des points de match
		matches_with_user_points = matches.filter(match_points__user=current_user).distinct()

		# Sérialiser les résultats
		serializer = MatchSerializer(matches_with_user_points, many=True)
		return JsonResponse(serializer.data, safe=False, status=200)

def createMatch(user, tournament, player1, player2):
	user = user
	# recuperer l'objet tournoi
	match = Match.objects.create(tournament=tournament)

	# user en user ou en alias, a checker
	#for player in player1:
	if player1[0] == 'username':
		match_point1 = MatchPoints.objects.create(
			match=match, 
			my_user_id=str(player1[1].id), 
			alias=player1[2], 
			user=player1[1], 
			points=0)
	else:
		match_point1 = MatchPoints.objects.create(match=match, alias=player1[1], points=0)
	

	#for player in player2:
	if player2[0] == 'username':
		match_point2 = MatchPoints.objects.create(
			match=match,
			my_user_id=str(player2[1].id), 
			alias=player2[2], 
			user=player2[1],
			points=0)
	else:
		match_point2 = MatchPoints.objects.create(match=match, alias=player2[1], points=0)
	# renvoyer l'id du match:
	
	match.match_points.add(match_point1)
	match.match_points.add(match_point2)
	return match
# return HttpResponse("Invalid request type.", status=400)


class MatchHistory(APIView):

	# def get(self, request, id):

	# 	stat = {
	# 		'total': '6',
	# 		'win': '5',
	# 		'lost': '1'
	# 	}
	# 	match = [
	# 		{
	# 		'date': '21-04-2024',
	# 		'player_1': 'toto',
	# 		'player_2': 'me',
	# 		'score_player_1': '5',
	# 		'score_player_2': '2',
	# 		'victory': 'toto',
	# 		},
	# 		{
	# 		'date': '22-04-2024',
	# 		'player_1': 'titi',
	# 		'player_2': 'me',
	# 		'score_player_1': '2',
	# 		'score_player_2': '5',
	# 		'victory': 'me',
	# 		},
	# 		{
	# 		'date': '23-04-2024',
	# 		'player_1': 'titi',
	# 		'player_2': 'me',
	# 		'score_player_1': '2',
	# 		'score_player_2': '5',
	# 		'victory': 'me',
	# 		}
	# 	]
	# 	match_stat = {
	# 		"stats": [],
	# 		"matchs": match

	# 	}

	# 	return Response(match_stat)

	def get(self, request, id):
		current_user = User.objects.get(id=id)
		
		matches = Match.objects.filter(status=2)

		# Filtrer les matchs pour lesquels l'utilisateur actuel a des points de match
		matches_with_user_points = matches.filter(match_points__user=current_user).distinct()
		number_of_matches = matches_with_user_points.count()

		won_matches_count = matches_with_user_points.filter(match_points__result='win').distinct().count()

		# Compter le nombre de matchs perdus
		lost_matches_count = matches_with_user_points.filter(match_points__result='loss').distinct().count()

		serializer = MatchSerializer(matches_with_user_points, many=True)
		matchs = serializer.data
		
		stat = {
			'total': number_of_matches,
			'win': won_matches_count,
			'lost': lost_matches_count
		}

		match_stat = {
			"stats": stat,
			"matchs": matchs
		}

		# Sérialiser les résultats
		return JsonResponse(match_stat, safe=False, status=200)