from django.contrib.auth import get_user_model
from rest_framework.settings import api_settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.core.validators import MinLengthValidator

#from users.models import Profile
# from .models import Followed

User = get_user_model() # Get reference to the model

# Custom TokenObtainPairSerializer to include user info

class CustomTokenRefreshSerializer(TokenRefreshSerializer):

	def validate(self, attrs):
		data = super().validate(attrs)
		return data

""" 	@classmethod
	def get_token(self, user):
		token = super().get_token(user)

		# Add custom claims
		token['id'] = user.id
		# ...

		return token """

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
	
	def validate(self, attrs):
		data = super().validate(attrs)
		refresh = self.get_token(self.user)

		data["refresh"] = str(refresh)
		data["access"] = str(refresh.access_token)
		# data["test"] = "value"
		# Add your extra responses here
		data['user'] = ({"username" : self.user.username,
				   		"email" : self.user.email,
						"first_name" : self.user.first_name,
						"last_name" :self.user.last_name,
						"id" :self.user.id,
						"avatar" : self.user.avatar,
						"biography" : self.user.biography,
						"status" : self.user.status,
						"follows" : self.user.follows.all().values_list('id', flat=True),
						"followed_by" : self.user.followed_by.all().values_list('id', flat=True),
						"blocks" : self.user.blocks.all().values_list('id', flat=True),
						"blocked_by" : self.user.blocked_by.all().values_list('id', flat=True),
						})
		return data

class UserSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ('id', 'email', 'avatar', 'username', 'password', 'first_name', 'last_name', 'biography', "status", "follows", "followed_by", "blocks", "blocked_by", 'otp', 'otp_expiry_time')
		extra_kwargs = {
			'avatar': {'required': False}, # 'avatar' is not required
			'password': {'write_only': True},
			'follows': {'required': False},
			'followed_by': {'required': False},
			'blocks': {'required': False},
			'blocked_by': {'required': False},
			'status': {'required': False},
			'email': {
				'validators': [UniqueValidator(queryset=User.objects.all())]
			},
			'otp': {'required': False},
			'otp_expiry_time': {'required': False}
		}

	def create(self, validated_data):
		return User.objects.create_user(**validated_data)


class UserSerializer42(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ('id', 'email', 'username', 'first_name', 'last_name', 'biography', "status", "follows", "followed_by", "blocks", "blocked_by")
		extra_kwargs = {
			'avatar': {'required': False}, # 'avatar' is not required
			'follows': {'required': False},
			'followed_by': {'required': False},
			'blocks': {'required': False},
			'blocked_by': {'required': False},
			'status': {'required': False},
			'email': {
				'validators': [UniqueValidator(queryset=User.objects.all())]
			}
		}

	def create(self, validated_data):
		return User.objects.create_user(**validated_data)

class UpdateUserSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ('avatar', 'username', 'first_name', 'last_name', 'biography', 'email')
		extra_kwargs = {
            'avatar': {'required': False},
            'username': {'validators': [UniqueValidator(queryset=User.objects.all())]},
            'email': {'validators': [UniqueValidator(queryset=User.objects.all())]}
        }

	def update(self, instance, validated_data):
		instance.avatar = validated_data['avatar']
		instance.username = validated_data['username']
		instance.first_name = validated_data['first_name']
		instance.last_name = validated_data['last_name']
		instance.email = validated_data['email']
		instance.biography = validated_data['biography']

		instance.save()

		return instance
