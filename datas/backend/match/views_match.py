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
			matches = Match.objects.filter(status=0)
		else:
			matches = Match.objects()

		# Filtrer les matchs pour lesquels l'utilisateur actuel a des points de match
		matches_with_user_points = matches.filter(players__user=current_user).distinct()

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
		match_point1 = MatchPoints.objects.create(match=match, alias=player1[1].username, user=player1[1], points=0)
		match.users.add(player1[1])
	else:
		match_point1 = MatchPoints.objects.create(match=match, alias=player1[1], points=0)

	#for player in player2:
	if player2[0] == 'username':
		match_point2 = MatchPoints.objects.create(match=match, alias=player2[1].username, user=player2[1], points=0)
		match.users.add(player2[1])
	else:
		match_point2 = MatchPoints.objects.create(match=match, alias=player2[1], points=0)
	# renvoyer l'id du match:
	return match
# return HttpResponse("Invalid request type.", status=400)


class MatchHistory(APIView):

	# def current_profile(self):
	# 	try:
	# 		return self.request.data.get('me')
	# 	except User.DoesNotExist:
	# 		raise Http404
			
	# def other_profile(self, pk):
	# 	try:
	# 		return User.objects.get(id = pk)
	# 	except User.DoesNotExist:
	# 		raise Http404

	def get(self, request, id):
		# pk = id
		# other_profile = self.other_profile(pk)
		# current_profile = request.user
		# # current_profile[0] = 'username'
		# # other_profile[0] = 'username'

		# match1 = createMatch(current_profile, None, current_profile, other_profile)
		# # match2 = createMatch(id, None, id, "002")
		match = {
			'date': '21-04-2024',
			'id': '0001',
			'friend': 'toto',
			'victory': 'toto',
		}
		# renvoyer les deux id
		# match1.match_id + match2.match_id
		return Response(match)