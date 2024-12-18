from rest_framework import serializers
from .models import Login


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = Login
        fields = '__all__'
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate_email(self, value):
        # Verificar si el correo electrónico ya existe
        if Login.objects.filter(email=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este correo electrónico.")
        return value

    def validate_username(self, value):
        # Verificar si el nombre de usuario ya existe
        if Login.objects.filter(username=value).exists():
            raise serializers.ValidationError("Ya existe un usuario con este nombre de usuario.")
        return value

    def create(self, validated_data):
        # Usar el método create_user para manejar la creación segura del usuario
        user = Login.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            name=validated_data.get('name', ''),
            last_name=validated_data.get('last_name', ''),
            dni=validated_data.get('dni', ''),
            password=validated_data['password']
        )
        return user
