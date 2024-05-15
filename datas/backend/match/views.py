from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.http import JsonResponse, HttpResponse
from django.utils.decorators import method_decorator

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
# Create your views here.

@method_decorator(csrf_protect, name='dispatch')
class Subscribe(APIView):
    # Cette méthode gère les requêtes POST
    def post(self, request):
        # Traitement de la requête POST ici
        print(f'user id = {request.user.id}')
        request.user.SetStatus(2)
        return HttpResponse("Subscribe !")

# @method_decorator(csrf_protect, name='dispatch')
class Invite(APIView):
    print("invite to play")

    def get(self, request, id):
        print("friend_id: ", id)
        return HttpResponse("Invite to play !")