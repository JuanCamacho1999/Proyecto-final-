
from rest_framework import serializers
from .models import Room, AdditionalService, Guest, Reservation, Invoice

class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = '__all__'

class AdditionalServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdditionalService
        fields = '__all__'

class GuestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Guest
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = ['guest', 'room', 'check_in', 'check_out', 'services']

    def create(self, validated_data):
        services_data = validated_data.pop('services', [])
        reservation = Reservation.objects.create(**validated_data)
        reservation.services.set(services_data)  
        return reservation

class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'


# serializers.py
# serializers.py
from django.contrib.auth.models import User
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'email', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

from django.contrib.auth.models import Group

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = User.objects.filter(username=data['username']).first()
        if user is None or not user.check_password(data['password']):
            raise serializers.ValidationError('Invalid username or password')
        
        # Obtener el primer grupo asignado al usuario (puedes cambiar la lógica)
        group = user.groups.first()
        role = group.name if group else 'customer'  # Por defecto, customer si no tiene grupo

        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'role': role,  # Agregar rol a la respuesta
        }
#ss