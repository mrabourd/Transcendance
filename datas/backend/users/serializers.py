from django.contrib.auth import get_user_model
from rest_framework.settings import api_settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
#from users.models import Profile

User = get_user_model() # Get reference to the model


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

	@classmethod
	def get_token(cls, user):
		token = super(CustomTokenObtainPairSerializer, cls).get_token(user)
		print(token)
		print("User: ", user)

		# Add custom claims
		token['username'] = user.username
		token['email'] = user.email
		return token
    
class UserSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ('email', 'username', 'password', 'first_name', 'last_name')
		extra_kwargs = {
			'password': {'write_only': True},
			'email': {
				'validators': [UniqueValidator(queryset=User.objects.all())]
			}
		}

	def create(self, validated_data):
		return User.objects.create_user(**validated_data)
	

""" class ProfileSerializer(serializers.ModelSerializer):

	class Meta:
		model = Profile
		fields = ('user', 'follows')
		extra_kwargs = {
			'follows': {'required': False}
		} """
""" 	def create(self, validated_data):
		return Profile.objects.create(**validated_data)
	
	def update(self, instance, validated_data):
		for attr, value in validated_data.items():
			setattr(instance, attr, value)
		instance.save()
		return instance """
	



""" 
def update(self, instance, validated_data):
# Note: it's important to return the updated instance here
# as it will be used by `serializer.data` in our view
	for attr, value in validated_data.items():
		setattr(instance, attr, value)
	instance.save()
	return instance 
    

def validate_password(self, value):
		if len(value) < 8:
			raise serializers.ValidationError( 
				'The password must be at least 8 characters long.')
		return value
        

def validate_email(self, value):
        # Skip validation if no value provided
        if value is None:
            return value
	
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                'A user with this email address already exists.')

        # Note: it's important to return the value at the end of this method
        return value

    
def validate(self, attrs):
        # Here we don't need to check whether a user with the given
        # email or username exists, as this would have already
        # been done by the one of our `validate_...` methods
        email, username = attrs.get('email', None), attrs.get('username', None)
        if email is None and username is None:
            # Here is how we raise an error with a dict value
            raise serializers.ValidationError({
                api_settings.NON_FIELD_ERRORS_KEY: 
                    'Either an email or a username must be provided.'
            })
        # If we reached this line, then at least one field was provided.
        # Since username is a non-nullable model field, we use the email
        # as a value for it, and vice versa.
        if username is None:
            attrs['username'] = email
        if email is None:
            attrs['email'] = username
        # Note: it's important to return attrs at the end of this method
        return attrs """