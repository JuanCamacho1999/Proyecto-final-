from rest_framework import status, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Login
from .serializers import UserSerializer
from django.shortcuts import get_object_or_404

@api_view(['GET', 'POST'])
def register(request):
    if request.method == 'GET':
        users = Login.objects.all()
        users_serializer = UserSerializer(users, many=True)
        return Response(users_serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'POST':
        users_serializer = UserSerializer(data=request.data)
        try:
            users_serializer.is_valid(raise_exception=True)
            user = users_serializer.save()
            return Response({
                'message': 'Usuario creado correctamente!',
                'user': UserSerializer(user).data
            }, status=status.HTTP_201_CREATED)
        except serializers.ValidationError as e:
            return Response({
                'message': 'Error al crear usuario',
                'errors': e.detail
            }, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET', 'PUT', 'DELETE'])
def login(request, pk=None):
    user = get_object_or_404(Login, id=pk)
    
    if request.method == 'GET':
        user_serializer = UserSerializer(user)
        return Response(user_serializer.data, status=status.HTTP_200_OK)
    
    elif request.method == 'PUT':
        # Usar partial=True para permitir actualizaciones parciales
        user_serializer = UserSerializer(user, data=request.data, partial=True)
        if user_serializer.is_valid():
            updated_user = user_serializer.save()
            return Response(UserSerializer(updated_user).data, status=status.HTTP_200_OK)
        return Response(user_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    elif request.method == 'DELETE':
        user.delete()
        return Response({
            'message': 'Usuario eliminado correctamente!'
        }, status=status.HTTP_200_OK)
