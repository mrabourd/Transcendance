from django.contrib.auth import get_user_model
from rest_framework.settings import api_settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
#from users.models import Profile

User = get_user_model() # Get reference to the model

# Custom TokenObtainPairSerializer to include user info

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):


	def validate(self, attrs):
		data = super().validate(attrs)
		refresh = self.get_token(self.user)

		data["refresh"] = str(refresh)
		data["access"] = str(refresh.access_token)
		data["test"] = "value"
		# Add your extra responses here
		data['user'] = ({"username" : self.user.username,
				   		"email" : self.user.email, 
						"first_name" : self.user.first_name, 
						"last_name" :self.user.last_name,
						"id" :self.user.id,
						"avatar" : self.user.avatar if self.user.avatar else None,
						"biography" : self.user.biography,
						"follows" : self.user.follows.all().values_list('id', flat=True),
						"followed_by" : self.user.followed_by.all().values_list('id', flat=True)}
						)

		return data


class UserSerializer(serializers.ModelSerializer):

	class Meta:
		model = User
		fields = ('email', 'username', 'password', 'first_name', 'last_name', 'biography')
		extra_kwargs = {
			'avatar': {'required': False}, # 'avatar' is not required
			'password': {'write_only': True},
			'email': {
				'validators': [UniqueValidator(queryset=User.objects.all())]
			}
		}

	def create(self, validated_data):
		return User.objects.create_user(**validated_data)
	


""" 
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

    
"""