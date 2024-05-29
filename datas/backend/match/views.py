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
# Create your views here.
from users.models import User, Invitation  # Import your User model
User = get_user_model()

@method_decorator(csrf_protect, name='dispatch')
class Subscribe(APIView):
    # Cette méthode gère les requêtes POST
    def post(self, request):
        # Traitement de la requête POST ici
        print(f'user id = {request.user.id}')
        request.user.SetStatus(User.USER_STATUS['WAITING_PLAYER'])
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
                return HttpResponse("You have already sent an invitation.", status=400)
            try:
                invitation = Invitation.objects.create(sender=user, receiver=user_invited)
                #user.invitation_sent = invitation
                #user.save()

                notif_message = f'{user.username} has invited {user_invited.username} to play'
                Notification.objects.create(
                    type="private",
                    code="xxx",
                    message=notif_message,
                    sender=user,
                    receiver=user_invited,
                    link=None
                )
                user.SetStatus(User.USER_STATUS['WAITING_FRIEND'])
                return HttpResponse("Invitation sent!")
            except IntegrityError:
                return HttpResponse("An error occurred while sending the invitation.", status=500)

        elif req_type == 'cancel':
            # Vérifier si l'utilisateur a effectivement envoyé une invitation
            if not hasattr(user, 'sent_invitation'):
                return HttpResponse("No invitation to cancel.", status=204)
            user.SetStatus(User.USER_STATUS['ONLINE'])
            user.sent_invitation.delete()
            #user.sent_invitation = None
            #user.save()
            notif_message = f'{user.username} has cancelled his invitation'
            Notification.objects.create(
                type="private",
                code="xxx",
                message=notif_message,
                sender=user,
                receiver=user_invited,
                link=None
            )
            return HttpResponse("invitation cancelled", status=200)

        elif req_type == 'deny':
            # Vérifier si l'utilisateur cible a reçu une invitation
            invitation_sender = user_invited
            invitation = get_object_or_404(Invitation, sender=invitation_sender, receiver=user)
            user.SetStatus(User.USER_STATUS['ONLINE'])
            invitation_sender.SetStatus(User.USER_STATUS['ONLINE'])
            # Envoyer une notification / invitation refusee
            ##### TO DO
            notif_message = f'{user.username} has rejected {invitation_sender.username} invitation'
            Notification.objects.create(
                type="private",
                code="xxx",
                message=notif_message,
                sender=user,
                receiver=invitation_sender,
                link=None
            )
            invitation.delete()
            return HttpResponse("deny invitation!")

        elif req_type == 'accept':
            # Vérifier si l'utilisateur cible a reçu une invitation
            invitation_sender = user_invited
            print(f'invitation_sender ${invitation_sender} invitation_receiver = ${user}')
            
            # Vérifier le statut du demandeur (s'il est en ligne, annuler la demande)
            # S'il est en ligne, cela signifie que l'invitation a été annulée
            if invitation_sender.status == User.USER_STATUS['ONLINE']:
                return JsonResponse({'message': 'La demande a été annulée'}, status=404)

            invitation = get_object_or_404(Invitation, sender=invitation_sender, receiver=user)
            # Creer une entree dans la table match (status = in_progress)
            # creer deux entree dans la table match_points (match_id, user_id)
            # recuperer l'id du match pour le renvoyer
            ##### TO DO
            match_id = 'XXX' 

            user.SetStatus(User.USER_STATUS['PLAYING'])
            invitation_sender.SetStatus(User.USER_STATUS['PLAYING'])

            # Envoyer une notification / invitation acceptee + match_id + lien
            notif_message = f'{user.username} has accepted {invitation_sender.username} invitation'
            Notification.objects.create(
                type="private",
                code="xxx",
                message=notif_message,
                sender=user,
                receiver=invitation_sender,
                link=f"/play/online/{match_id}"
            )

            # supprimer l'invitation 
            invitation.delete()

            response_data = {'message': 'accept invitation!', 'match_id': match_id}
            return JsonResponse(response_data)

        return HttpResponse("Invalid request type.", status=400)