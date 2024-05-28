from django.contrib.auth import get_user_model
from rest_framework.settings import api_settings
from rest_framework import serializers
from rest_framework.validators import UniqueValidator
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer, TokenRefreshSerializer
from django.core.validators import MinLengthValidator
from users.models import User, Invitation
from websockets.models import Message
from django.core.exceptions import ObjectDoesNotExist
User = get_user_model() # Get reference to the model




class InvitationSerializer(serializers.ModelSerializer):
    sender = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())
    receiver = serializers.PrimaryKeyRelatedField(queryset=User.objects.all())

    class Meta:
        model = Invitation
        fields = ['id', 'sender', 'receiver', 'created_at']


class UserSerializer(serializers.ModelSerializer):
    invitation_sent = InvitationSerializer(read_only=True)
    received_invitations = InvitationSerializer(many=True, read_only=True)

    class Meta:
        model = User
        fields = ('id', 'email', 'avatar', 'username', 'password', 'first_name', 'last_name', 'biography', "status", "invitation_sent", "received_invitations", "follows", "followed_by", "blocks", "blocked_by", 'otp')
        extra_kwargs = {
            'avatar': {'required': False}, # 'avatar' is not required
            'password': {'write_only': True},
            'follows': {'required': False},
            'followed_by': {'required': False},
            'blocks': {'required': False},
            'blocked_by': {'required': False},
            'status': {'required': False},
            'invitation_sent': {'required': False},
            'received_invitations': {'required': False},
            'email': {
                'validators': [UniqueValidator(queryset=User.objects.all())]
            },
            'otp': {'required': False},
            'otp_expiry_time': {'required': False},
            'id': {'read_only': True},  # Définir le champ 'id' en lecture seule
        }

    def create(self, validated_data):
        return User.objects.create_user(**validated_data)

    def to_representation(self, instance):
        print(">>>>>>>>>>>>>>>>>>>> INIVTAION <<<<<<<<<<<<<<<<<<<<<<<")
        print("instance", instance)
        representation = super().to_representation(instance)
        try:
            representation['invitation_sent'] = instance.sent_invitation.receiver.id
        except ObjectDoesNotExist:
            representation['invitation_sent'] = None        
        
        
       #try:
       #     representation['invitation_sent'] = instance.sent_invitation.receiver.id if instance.sent_invitation else None
        #print("instance.sent_invitation ", instance.sent_invitation)
        #if instance.sent_invitation:
            #print("instance.sent_invitation,receiver ", instance.sent_invitation.receiver)
            #print("instance.sent_invitation,receiver.id ", instance.sent_invitation.receiver.id)
        representation['received_invitations'] = [
            {
                'id': invitation.id,
                'sender': invitation.sender.id,
                'created_at': invitation.created_at
            }
            for invitation in instance.received_invitations.all()
        ]
        return representation


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):    
    def validate(self, attrs):
        data = super().validate(attrs)
        refresh = self.get_token(self.user)

        data["refresh"] = str(refresh)
        data["access"] = str(refresh.access_token)
        data['user'] = UserSerializer().to_representation(self.user)

        return data

class UpdateUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('avatar', 'username', 'first_name', 'last_name', 'biography', 'email')
        extra_kwargs = {
            'avatar': {'required': False},
        }

    def validate(self, attrs):
        username = attrs.get('username', None)
        email = attrs.get('email', None)
        
        if username and User.objects.exclude(pk=self.instance.pk).filter(username=username).exists():
            raise serializers.ValidationError("Ce nom d'utilisateur est déjà utilisé.")
        
        if email and User.objects.exclude(pk=self.instance.pk).filter(email=email).exists():
            raise serializers.ValidationError("Cet email est déjà utilisé.")
        
        return attrs

    def update(self, instance, validated_data):
        instance.avatar = validated_data.get('avatar', instance.avatar)
        instance.username = validated_data.get('username', instance.username)
        instance.first_name = validated_data.get('first_name', instance.first_name)
        instance.last_name = validated_data.get('last_name', instance.last_name)
        instance.email = validated_data.get('email', instance.email)
        instance.biography = validated_data.get('biography', instance.biography)
        instance.save()

        return instance

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = ['id', 'chat_room', 'message', 'user', 'created_at']
        read_only_fields = ['id', 'created_at']