# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
# We import our serializer here
from .serializers import UserSerializer, CustomTokenObtainPairSerializer, UpdateUserSerializer, UserSerializer42
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt, csrf_protect
from django.middleware.csrf import get_token
from django.contrib.auth.decorators import login_required
from rest_framework.decorators import api_view

User = get_user_model()
import json
import requests
from django.http import JsonResponse, HttpResponse
from django.views.generic import View
from django.middleware.csrf import get_token
from django.http import Http404
from django.utils.crypto import get_random_string
from django.utils.decorators import method_decorator
from django.shortcuts import get_object_or_404, redirect


class GetCSRFTokenView(View):
	def get(self, request, *args, **kwargs):
		csrf_token = get_token(request)
		return JsonResponse({'csrf_token': csrf_token})

class UsersAPIView(APIView):
	permission_classes = [IsAuthenticated]
	serializer_class = UserSerializer

	def get(self, request):
		users = User.objects.all()
		if not users:  # Vérifie si la base de données d'utilisateurs est vide
			return Response({"error": "Aucun utilisateur trouvé."}, status=404)  # Renvoie une réponse avec le code d'erreur 404 (NotFound)

		serializer = self.serializer_class(users, many=True)
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
		serializer = UpdateUserSerializer(user, data=request.data)
		if serializer.is_valid():
			serializer.save()
			return Response(serializer.data)
		return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@method_decorator(csrf_protect, name='dispatch')
class MaVueProtegee(View):
    # Cette méthode gère les requêtes POST
    def post(self, request):
        # Traitement de la requête POST ici
        return HttpResponse("Requête POST protégée reçue avec succès.")

# Dans cet exemple, nous avons étendu la vue CustomObtainTokenPairView 
# en surchargeant sa méthode post. Après avoir obtenu le token JWT 
# en appelant la méthode parente super().post(), 
# nous vérifions si la connexion est réussie (indiquée par un code d'état HTTP 200).
# Si c'est le cas, nous ajoutons le cookie CSRF à la réponse en utilisant 
# la fonction get_token(request) pour obtenir le jeton CSRF.
class CustomObtainTokenPairView(TokenObtainPairView):
	permission_classes = [AllowAny]
	serializer_class = CustomTokenObtainPairSerializer

	def post(self, request, *args, **kwargs):
		# Appel de la méthode parente pour obtenir le token d'authentification JWT
		response = super().post(request, *args, **kwargs)
		
		# Si la connexion est réussie, ajout du cookie CSRF à la réponse
		if response.status_code == 200:
			response['X-CSRFToken'] = get_token(request)  # Récupère le jeton CSRF et l'ajoute à l'en-tête de la réponse
			response['Access-Control-Allow-Headers'] = 'accept, authorization, content-type, user-agent, x-csrftoken, x-requested-with'
			response['Access-Control-Expose-Headers'] = 'Set-Cookie, X-CSRFToken'
			response['Access-Control-Allow-Credentials'] = True
			
			return response

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

	def post(self, request, req_type, id, format=None):    
		pk = id         # Here pk is opposite user's profile ID
		# followType = request.data.get('usertype')
		
		current_profile = request.user
		other_profile = self.other_profile(pk)
		
		if req_type == 'follow':
			# if other_profile.blocked_user.filter(pk = current_profile.id).exists():
			# 	return Response({"Following Fail" : "You can not follow this profile becuase your ID blocked by this user!!"},status=status.HTTP_400_BAD_REQUEST)
			current_profile.follows.add(other_profile)
			return Response({"Following" : "Following success!!"}, status=status.HTTP_200_OK) 
		
		elif req_type == 'unfollow':
			current_profile.follows.remove(other_profile)
			# other_profile.followers.remove(current_profile)
			return Response({"Unfollow" : "Unfollow success!!"},status=status.HTTP_200_OK)
			
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

@api_view(['GET', 'POST'])
def intraCallback(request):
	
	get_token_path = "https://api.intra.42.fr/oauth/token"
	if request.method == 'POST':
		
		# Convertir la chaîne JSON en objet Python
		body_data = json.loads(request.body.decode('utf-8'))
		
		data = {
			'grant_type': body_data.get('grant_type'),
			'client_id': body_data.get('client_id'),
			'client_secret': body_data.get('client_secret'),
			'code': body_data.get('code'),
			'redirect_uri': body_data.get('redirect_uri'),
		}

	else:
		return JsonResponse({'error': 'Method not allowed'}, status=405)
	print("Data", data)
	r = requests.post(get_token_path, data=data)
	print("r: ", r)
	token = r.json()['access_token']
	headers = {"Authorization": "Bearer %s" % token}
	print("headers: ", headers)
	
	user_response = requests.get("https://api.intra.42.fr/v2/me", headers=headers)
	user_response_json = user_response.json()
	
	user, created = User.objects.get_or_create(
		id=user_response_json['id'],
		username=user_response_json['login'],
		first_name=user_response_json['first_name'],
		last_name=user_response_json['last_name'],
		email=user_response_json['email'],
	)

	serializer = UserSerializer(user)


	user_info = {}
	token_info = get_tokens_for_user(user)
	# user_info["refresh"] = token_info["refresh"]
	# user_info["access"] = token_info["access"]
	# user_info["user"] = user
	user_info = {"refresh": token_info["refresh"],
		"access": token_info["access"],
		"user": serializer.data,
		
	}

	print("user info: ", user_info)
	# Let's update the response code to 201 to follow the standards
	# response_data = {
	# 	"user_info": user_info
	# }

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
