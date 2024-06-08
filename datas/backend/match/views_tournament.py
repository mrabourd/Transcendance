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
from .views_match import createMatch
# Create your views here.
from users.models import User  # Import your User model
import json
import requests
User = get_user_model()

def CreateThirdMatch(tournament_id):
	print("CreateThirdMatch")
	tournament_matches = Match.objects.filter(tournament_id=tournament_id, status=2)
	print(f"tournament_matches: {list(tournament_matches)}")

	
	number_of_results = tournament_matches.count()
	if number_of_results == 2:
		# Fetch the first and second matches
		first_match = tournament_matches[0] if tournament_matches.count() > 0 else None
		second_match = tournament_matches[1] if tournament_matches.count() > 1 else None

		if first_match:
			first_match_points = first_match.match_points.all()
			print(f"First match points: {list(first_match_points)}")
		else:
			print("No first match found.")

		if second_match:
			second_match_points = second_match.match_points.all()
			print(f"Second match points: {list(second_match_points)}")
		else:
			print("No second match found.")
	# player_1[0] = "alias / username" # type
	# player_1[1] = "user_alias" # or User
	# player_1[2] = "user_alias" # or User

# @method_decorator(csrf_protect, name='dispatch')
class TournamentView(APIView):
	permission_classes = [IsAuthenticated]
	def get(self, request, req_type):
		if (req_type == "list"):
			tournaments = Tournament.objects.filter(user=request.user, status=0)
		else:
			tournaments = Tournament.objects.filter(tournament_id=req_type)
		serializer = TournamentSerializer(tournaments, many=True)
		return JsonResponse(serializer.data, safe=False, status=200)
	
	def post(self, request, req_type):
		user = request.user
		body_data = json.loads(request.body.decode('utf-8'))
			
		data = {
			'tournament': body_data.get('name'),
			'players': body_data.get('players'),
		}
		players = data['players']
		tournament_name = data['tournament']
		if req_type == 'create':

			# if user.status != User.USER_STATUS['ONLINE']:
			# 	return JsonResponse({'message': 'Vous ne pouvez pas creer de tournoi.'}, status=401)

			# user.SetStatus(User.USER_STATUS['WAITING_TOURNAMENT'])
			print(f'tournament_name ${tournament_name} tournament_creator = ${user}')

			tournament = Tournament.objects.create(name=tournament_name, user=user, status=0)
			# Creer une entree dans la table match (status = in_progress)
			# creer deux entree dans la table match_points (match_id, user_id)
			# recuperer l'id du match pour le renvoyer


			# creer les deux matchs ici
			print(players[0], players[1])
			for i in range(len(players) - 1):
				if (players[i][0] == "username"):
					players[i][1] = user

			match1 = createMatch(user, tournament, players[0], players[1])
			match2 = createMatch(user, tournament, players[2], players[3])
			return Response(tournament.tournament_id)
		return HttpResponse("Invalid request type.", status=400)