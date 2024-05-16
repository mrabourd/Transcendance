# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status, authentication
# We import our serializer here
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, UpdateUserSerializer, UserSerializer42
from django.contrib.auth import get_user_model, authenticate, logout
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenBlacklistView
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken, OutstandingToken
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

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

User = get_user_model()

class GetCSRFTokenView(View):
	def get(self, request, *args, **kwargs):
		csrf_token = get_token(request)
		return JsonResponse({'csrf_token': csrf_token})

class UsersAPIView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = UserSerializer

	def get(self, request):
		users = User.objects.all()
		#print(users)
		if not users:  # Vérifie si la base de données d'utilisateurs est vide
			#print('not user')
			return Response({"error": "Aucun utilisateur trouvé."}, status=status.HTTP_404_NOT_FOUND)  # Renvoie une réponse avec le code d'erreur 404 (NotFound)

		serializer = self.serializer_class(users, many=True)
		#print(serializer)
		return Response(serializer.data, status=200)  # Renvoie une réponse avec le code d'état 200 (OK)


class CustomTokenRefreshView(TokenRefreshView):
	permission_classes = [AllowAny]
	serializer_class = CustomTokenObtainPairSerializer
	def get (self, request):
		return Response('ok')
	
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

@method_decorator(csrf_protect, name='dispatch')
class MaVueProtegee(View):
    # Cette méthode gère les requêtes POST
    def post(self, request):
        # Traitement de la requête POST ici
        return HttpResponse("Requête POST protégée reçue avec succès.")

class CustomLogoutView(APIView):
    def post(self, request, *args, **kwargs):
        try:
            #refresh_token = request.data
            #print('refresh_token.refresh')
            #print(refresh_token['refresh'])
            #access_token = AccessToken(refresh_token['refresh'])
            #user = access_token.payload.get('user_id')
            # Assurez-vous que l'utilisateur existe et est authentifié
            if request.user and request.user.is_authenticated:
                print('>>>> user.SetStatus >> offline ')
                request.user.SetStatus(User.USER_STATUS['OFFLINE'])
                print('>>>> logout')
                logout(request)
                print('>>>> RefreshToken')
                token = RefreshToken(request.data.get('refresh'))
                print('>>>> blacklist')
                token.blacklist()
                #token = OutstandingToken.objects.get(token=refresh_token)
                #token.blacklist()
                response = Response({"message": "User logged out successfully."}, status=status.HTTP_200_OK)
                response.delete_cookie('csrftoken')
				#response.delete_cookie("refresh_token")
                return response
            else:
                return Response({"error": "User not authenticated."}, status=status.HTTP_401_UNAUTHORIZED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)


# Dans cet exemple, nous avons étendu la vue CustomObtainTokenPairView 
# en surchargeant sa méthode post. Après avoir obtenu le token JWT 
# en appelant la méthode parente super().post(), 
# nous vérifions si la connexion est réussie (indiquée par un code d'état HTTP 200).
# Si c'est le cas, nous ajoutons le cookie CSRF à la réponse en utilisant 
# la fonction get_token(request) pour obtenir le jeton CSRF.
class CustomObtainTokenPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer
    
    def authenticate_user(self, username, password):
        return authenticate(username=username, password=password)

    def post(self, request, *args, **kwargs):
        # Récupère les données du corps de la requête
        username = request.data.get('username')
        password = request.data.get('password')

        # Authentification de l'utilisateur
        user = self.authenticate_user(username, password)
        if user and user.is_authenticated:
            print('############ user is_authenticated ')
        # Si l'utilisateur est authentifié
        if user is not None and user.is_authenticated:
            response = super().post(request, *args, **kwargs)
            if response.status_code == 200:
                # Mettre à jour le statut de l'utilisateur
                user.SetStatus(User.USER_STATUS['ONLINE'])
                print('############ SET STATUS LOGIN')
                # Ajouter le jeton CSRF à la réponse
                response['X-CSRFToken'] = get_token(request)
                response['Access-Control-Allow-Headers'] = 'accept, authorization, content-type, user-agent, x-csrftoken, x-requested-with'
                response['Access-Control-Expose-Headers'] = 'Set-Cookie, X-CSRFToken'
                response['Access-Control-Allow-Credentials'] = True
                return response
        else:
            return Response({"error": "Sorry, no account was found with the provided username and password"}, status=status.HTTP_401_UNAUTHORIZED)

class UserRegistrationAPIView(APIView):
	# Note: we have to specify the following policy to allow 
	# anonymous users to call this endpoint
	permission_classes = [AllowAny]

	def post(self, request, format=None):
		# Pass user-submitted data to the serializer
		serializer = UserSerializer(data=request.data)

		# Next, we trigger validation with `raise_exceptions=True`
		# which will abort the request and return user-friendly
		# error messages if the validation fails
		serializer.is_valid(raise_exception=True)

		serializer.save()

		# Let's update the response code to 201 to follow the standards
		return Response(serializer.data, status=status.HTTP_201_CREATED)

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
			# other_profile.followers.remove(current_profile)
			return Response(status=status.HTTP_200_OK)

			
		elif req_type == 'block':
			current_profile.blocks.add(other_profile)
			# other_profile.followers.remove(current_profile)
			return Response(status=status.HTTP_200_OK)
			
		elif req_type == 'unblock':
			current_profile.blocks.remove(other_profile)
			# other_profile.followers.remove(current_profile)
			return Response(status=status.HTTP_200_OK)
			
		# elif req_type == 'accept':
		# 	current_profile.followers.add(other_profile)
		# 	other_profile.following.add(current_profile)
		# 	current_profile.panding_request.remove(other_profile)
		# 	return Response({"Accepted" : "Follow request successfuly accespted!!"},status=status.HTTP_200_OK)
		
		# elif req_type == 'decline':
		# 	current_profile.panding_request.remove(other_profile)
		# 	return Response({"Decline" : "Follow request successfully declined!!"},status=status.HTTP_200_OK)
		
		# elif req_type == 'remove':     # You can remove your follower
		# 	current_profile.followers.remove(other_profile)
		# 	other_profile.following.remove(current_profile)
		# 	return Response({"Remove Success" : "Successfuly removed your follower!!"},status=status.HTTP_200_OK)

def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

# def update_user(request, user_id):
# 	try:
# 		user = User.objects.get(id=user_id)
# 		user.username = 

def check_user_existence(user_id):
    # Utilisez la méthode exists() pour vérifier si un utilisateur avec cet ID existe
    user_exists = User.objects.filter(id=user_id).exists()

    return user_exists

@api_view(['GET', 'POST'])
def intraCallback(request):
	
	get_token_path = "https://api.intra.42.fr/oauth/token"
	if request.method == 'POST':
		
		# Convertir la chaîne JSON en objet Python
		body_data = json.loads(request.body.decode('utf-8'))
		
		data = {
			'grant_type': 'authorization_code',
			'client_id': os.environ.get("API42_CLIENT_ID"),
			'client_secret': os.environ.get("API42_SECRET"),
			'code': body_data.get('code'),
			'redirect_uri': os.environ.get("API42_REDIRECT_URI"),
		}

	else:
		return JsonResponse({'error': 'Method not allowed'}, status=405)
	# print("Data", data)
	r = requests.post(get_token_path, data=data)
	if r.json().get('error'):
		return  Response(r.json())
	# print("r: ", r)
	token = r.json()['access_token']
	headers = {"Authorization": "Bearer %s" % token}
	# print("headers: ", headers)

	user_response = requests.get("https://api.intra.42.fr/v2/me", headers=headers)
	user_response_json = user_response.json()

	# print("user_response_json: ", user_response_json)
	av_1 = user_response_json['image']
	av_2 = av_1['versions']
	avatar_url = av_2['small']
	# print(f"avatar_url: [{avatar_url}]")

	user_id = user_response_json['id']

	if check_user_existence(user_id):
		user = User.objects.get(id=user_id)
		user.username=user_response_json['login'],
		user.first_name=user_response_json['first_name'],
		user.last_name=user_response_json['last_name'],
		user.email=user_response_json['email'],
		user.avatar=avatar_url,

	# user = User.objects.create_user(
	# 	id=user_response_json['id'],
	# 	username=user_response_json['login'],
	# 	first_name=user_response_json['first_name'],
	# 	last_name=user_response_json['last_name'],
	# 	email=user_response_json['email'],
	# 	avatar=avatar_url,
	# )

	else:
		user, created = User.objects.create_user(
			id=user_id,
			username=user_response_json['login'],
			first_name=user_response_json['first_name'],
			last_name=user_response_json['last_name'],
			email=user_response_json['email'],
			avatar=avatar_url,
		)



	serializer = UserSerializer(user)


	user_info = {}
	token_info = get_tokens_for_user(user)  

	user_info = {"refresh": token_info["refresh"],
		"access": token_info["access"],
		"user": serializer.data,
		
	}

	# print("user info: ", user_info)
	response = Response(user_info)
	response['X-CSRFToken'] = get_token(request)  # Récupère le jeton CSRF et l'ajoute à l'en-tête de la réponse
	response['Access-Control-Allow-Headers'] = 'accept, authorization, content-type, user-agent, x-csrftoken, x-requested-with'
	response['Access-Control-Expose-Headers'] = 'Set-Cookie, X-CSRFToken'
	response['Access-Control-Allow-Credentials'] = True

	# Retourner la réponse JSON
	return response

	# return HttpResponse("User %s %s" % (user, "created now" if created else "found"))


# class ProfilePatchView(APIView):
#     permission_classes = [IsAuthenticated]
#     serializer = UserSerializer
#     def patch(self, request):
#         users = User.objects.all()
# 		serializer = self.serializer(users, many=True)
# 		return Response(serializer.data)
