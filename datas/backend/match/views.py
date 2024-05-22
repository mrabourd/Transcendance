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
# Create your views here.
from users.models import User, Invitation  # Import your User model
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

    def post(self, request, req_type, id):
        user = request.user  # L'utilisateur faisant la demande
        user_invited = get_object_or_404(User, id=id)  # L'utilisateur cible de l'action

        if req_type == 'send':
            
            # Vérifier si l'utilisateur a déjà envoyé une invitation
            if hasattr(user, 'sent_invitation'):
                print(user.sent_invitation.delete())
                return HttpResponse("You have already sent an invitation.", status=400)

            try:
                invitation = Invitation.objects.create(sender=user, receiver=user_invited)
                user.invitation_sent = invitation
                user.SetStatus(User.USER_STATUS['WAITING_FRIEND'])
                user.save()
                return HttpResponse("Invitation sent!")
            except IntegrityError:
                return HttpResponse("An error occurred while sending the invitation.", status=500)

        elif req_type == 'cancel':
            # Vérifier si l'utilisateur a effectivement envoyé une invitation
            if not hasattr(user, 'sent_invitation'):
                return HttpResponse("No invitation to cancel.", status=400)

            user.SetStatus(User.USER_STATUS['ONLINE'])
            user.save()
            user.invitation_sent.delete()

            return HttpResponse("Cancel invitation!")

        elif req_type == 'deny':
            # Vérifier si l'utilisateur cible a reçu une invitation
            invitation = get_object_or_404(Invitation, id=id, receiver=user)
            invitation.delete()
            user.SetStatus(User.USER_STATUS['ONLINE'])
            return HttpResponse("deny invitation!")

        elif req_type == 'accept':
            # Vérifier si l'utilisateur cible a reçu une invitation
            invitation = get_object_or_404(Invitation, id=id, receiver=user)
            user.SetStatus(User.USER_STATUS['PLAYING'])
            return HttpResponse("accept invitation!")

        return HttpResponse("Invalid request type.", status=400)