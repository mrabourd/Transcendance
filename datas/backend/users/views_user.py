# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status, authentication
# We import our serializer here
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, UpdateUserSerializer, UserSerializer42
from django.contrib.auth import get_user_model, authenticate, logout, login as django_login
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, OutstandingToken
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

import random, string
import os
from django.core.files.base import ContentFile
import json
import requests
from django.http import JsonResponse, HttpResponse
from django.views.generic import View
from django.middleware.csrf import get_token
from django.http import Http404
from django.utils.crypto import get_random_string
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404, redirect
from datetime import timedelta
from django.utils import timezone
from django.core.mail import send_mail, BadHeaderError

import smtplib
import dns.resolver
from django.core.mail import EmailMessage
from smtplib import SMTPException

User = get_user_model()


class UsersAPIView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = UserSerializer

	def get(self, request, req_type):
		if req_type == 'online':
			users = User.objects.exclude(status=0)
		elif req_type == 'all':
			users = User.objects.all()
		elif req_type == 'followed':
			users =  request.user.follows.all()
		if not users:  # Vérifie si la base de données d'utilisateurs est vide
			return Response({"error": "Aucun utilisateur trouvé."}, status=204)
		# Renvoie une réponse avec le code d'état 200 (OK)
		serializer = self.serializer_class(users, many=True)

		return Response(serializer.data, status=200)

class UserDetail(APIView):
	def get_user(self, id):
		try:
			return User.objects.get(id=id)
		except User.DoesNotExist:
			raise Http404

	def get(self, request, id, format=None):
		user = self.get_user(id)
		serializer = UserSerializer(user)

		return Response(serializer.data)

	# permission_classes = [IsAuthenticated]
	def put(self, request, id, format=None):
		user = self.get_user(id)
		if user.id != request.user.id:
			return Response(status=status.HTTP_401_UNAUTHORIZED)
		user_serializer = UserSerializer(user)
		serializer = UpdateUserSerializer(user, data=request.data)
		if serializer.is_valid():
			serializer.save()
			#serializer.update(user, request.data)
			return Response(user_serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FollowUser(APIView):
	permission_classes = [IsAuthenticated]
	
	def current_profile(self):
		try:
			return self.request.data.get('me')
		except User.DoesNotExist:
			raise Http404
			
	def other_profile(self, pk):
		try:
			return User.objects.get(id = pk)
		except User.DoesNotExist:
			raise Http404

	def get(self, request, req_type, id, format=None):    
		pk = id         # Here pk is opposite user's profile ID
		# followType = request.data.get('usertype')
		
		current_profile = request.user
		other_profile = self.other_profile(pk)
		
		if req_type == 'follow':
			# if other_profile.blocked_user.filter(pk = current_profile.id).exists():
			# 	return Response({"Following Fail" : "You can not follow this profile becuase your ID blocked by this user!!"},status=status.HTTP_400_BAD_REQUEST)
			current_profile.follows.add(other_profile)
			return Response(status=status.HTTP_200_OK) 
		
		elif req_type == 'unfollow':
			current_profile.follows.remove(other_profile)
			return Response(status=status.HTTP_200_OK)

			
		elif req_type == 'block':
			current_profile.blocks.add(other_profile)
			return Response(status=status.HTTP_200_OK)
			
		elif req_type == 'unblock':
			current_profile.blocks.remove(other_profile)
			# other_profile.followers.remove(current_profile)
			return Response(status=status.HTTP_200_OK)
			
