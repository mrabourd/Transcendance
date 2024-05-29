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
class CreateMatchView(APIView):
	permission_classes = [IsAuthenticated]

	def post(self, request, id, req_type):
		user = request.user
		# tournament_id = id

		# match = Match.objects.create(tournament=tournament_id, user=user, alias1=user)

		serializer = MatchSerializer(data=request.data)
		return Response(serializer.data)

		return HttpResponse("Invalid request type.", status=400)