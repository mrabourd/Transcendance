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
from .models import Tournament
from .serializers import TournamentSerializer
# Create your views here.
from users.models import User  # Import your User model
User = get_user_model()

# @method_decorator(csrf_protect, name='dispatch')
class TournamentView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, req_type, name):
		user = request.user
		tournament_name = name

		if req_type == 'create':
			user.SetStatus(User.USER_STATUS['WAITING_TOURNAMENT'])
			print(f'tournament_name ${tournament_name} tournament_creator = ${user}')

			tournament = Tournament.objects.create(name=tournament_name, user=user, status=2)
			# Creer une entree dans la table match (status = in_progress)
			# creer deux entree dans la table match_points (match_id, user_id)
			# recuperer l'id du match pour le renvoyer


			serializer = TournamentSerializer(tournament)
			return Response(serializer.data)
			
			# response_data = {'message': 'tournament created', 'tournament_name': tournament_name, 'tournament_id'}
			# return JsonResponse(response_data)

		return HttpResponse("Invalid request type.", status=400)