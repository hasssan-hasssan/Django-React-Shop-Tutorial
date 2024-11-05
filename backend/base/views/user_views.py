from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from base.serializers import UserSerializer, UserSerializerWithToken
from django.contrib.auth.hashers import make_password
from base.strConst import *


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
        )
        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except:
        message = {DETAILS: ERROR_USER_ALREADY_EXISTS}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    data = request.data

    user.first_name = data['name']
    user.email = data['email']
    user.username = data['email']
    if data['password'] != '':
        user.password = make_password(data['password'])
    user.save()
    serializer = UserSerializerWithToken(user, many=False)
    return Response(serializer.data)
