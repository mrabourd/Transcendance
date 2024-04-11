# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
# We import our serializer here
from .serializers import UserSerializer, CustomTokenObtainPairSerializer
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework.permissions import IsAuthenticated
from django.views.decorators.csrf import csrf_exempt

from django.contrib.auth.decorators import login_required

User = get_user_model()

from django.http import JsonResponse
from django.views.generic import View
from django.middleware.csrf import get_token
class GetCSRFTokenView(View):
    def get(self, request, *args, **kwargs):
        csrf_token = get_token(request)
        return JsonResponse({'csrf_token': csrf_token})


class UsersAPIView(APIView):
	permission_classes = [IsAuthenticated]
	serializer = UserSerializer
	def get(self, request):
		users = User.objects.all()
		serializer = self.serializer(users, many=True)
		return Response(serializer.data)



# We extend the TokenObtainPairView to use our custom serializer
class CustomObtainTokenPairView(TokenObtainPairView):
    permission_classes = [AllowAny]
    serializer_class = CustomTokenObtainPairSerializer

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

