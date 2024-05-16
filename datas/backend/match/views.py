from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
# Create your views here.
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
            print("invite to play: ", id)
            # enregistrer la personne que j'invite
            request.user.SetStatus(User.USER_STATUS['WAITING_FRIEND'])
            #request.user.invited_user_id = id
            return HttpResponse("Invite to play !")

        if req_type == 'cancel':
            print("cancel invitation: ", id)
            request.user.SetStatus(User.USER_STATUS['ONLINE'])
            return HttpResponse("Cancel invitation !")

        if req_type == 'deny':
            print("deny invitation: ", id)
            request.user.SetStatus(User.USER_STATUS['ONLINE'])
            return HttpResponse("deny invitation !")

        if req_type == 'accept':
            print("accept invitation: ", id)
            request.user.SetStatus(User.USER_STATUS['PLAYING'])
            return HttpResponse("accept invitation !")