from django.contrib.auth import get_user_model
from rest_framework.settings import api_settings
from rest_framework import serializers

User = get_user_model() # Get reference to the model

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('email', 'username', 'password')
        extra_kwargs = {
            'username': {
                'required': False,
                'error_messages': {
                    'unique': 'A user with this username already exists.'
                }
            },
        }

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
        return attrs
    
def create(self, validated_data):
	# Note: it's important to return the created instance here
	# as it will be used by `serializer.data` in our view
	return User.objects.create(**validated_data)

def update(self, instance, validated_data):
# Note: it's important to return the updated instance here
# as it will be used by `serializer.data` in our view
	for attr, value in validated_data.items():
		setattr(instance, attr, value)
	instance.save()
	return instance
    

