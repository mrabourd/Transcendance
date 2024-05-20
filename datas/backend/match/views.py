from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
# Create your views here.
from .models import User  # Import your User model
User = get_user_model()

@method_decorator(csrf_protect, name='dispatch')
class Subscribe(APIView):
    # Cette méthode gère les requêtes POST
    def post(self, request):
        # Traitement de la requête POST ici
        print(f'user id = {request.user.id}')
        request.user.SetStatus(2)
        return HttpResponse("Subscribe !")

@method_decorator(csrf_protect, name='dispatch')
class Invite(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, req_type, id):
        if req_type == 'send':
            user = request.user  # Assuming request.user is the user sending the invitation
            user.SetStatus(User.USER_STATUS['WAITING_FRIEND'])
            user_invited = get_object_or_404(User, id=id)  # Retrieve the user being invited
            user_invited.invitation_sender = user
            user_invited.save()
            return HttpResponse("Invitation sent!")

        if req_type == 'cancel':
            request.user.SetStatus(User.USER_STATUS['ONLINE'])
            user_invited = get_object_or_404(User, id=id)  # Retrieve the user being invited
            user_invited.invitation_sender = None
            user_invited.save()
            return HttpResponse("Cancel invitation !")

        if req_type == 'deny':
            print("deny invitation: ", id)
            request.user.SetStatus(User.USER_STATUS['ONLINE'])
            return HttpResponse("deny invitation !")

        if req_type == 'accept':
            print("accept invitation: ", id)
            request.user.SetStatus(User.USER_STATUS['PLAYING'])
            return HttpResponse("accept invitation !")