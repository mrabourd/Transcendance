# Create your views here.
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework import status
# We import our serializer here
from .serializers import UserSerializer

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

class UserProfileAPIView(APIView):

    def get(self, request, format=None):
        serializer = UserSerializer(instance=request.user)
        return Response(serializer.data)

    def put(self, request, format=None):
       # Note how we pass the `instance` this time
       serializer = UserSerializer(instance=request.user, data=request.data)
       serializer.is_valid(raise_exceptions=True) # Validation

       # Note: we use the same `save()` method we used in the `post()` method
       # of the user registration view to create a new record. The `save()` 
       # method is able to determine that this time we want to update an
       # existing record, because we passed the `instance` during the
       # serializer instantiation above
       serializer.save()

       return Response(serializer.data)