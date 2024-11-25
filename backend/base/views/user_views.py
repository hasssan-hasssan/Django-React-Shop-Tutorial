from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from base.serializers import UserSerializer, UserSerializerWithToken
from base.strConst import *
from base import utils


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
    username = data['email']
    password = data['password']
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),
            is_active=False
        )

        # Send activation email
        activationLink: str = utils.createActivationLink(user)
        email: dict = utils.createEmail(NEW_REGISTER, activationLink, user)
        if utils.sendEmail(email):
            return Response({DETAIL: SUCCESS_NEW_REGISTER}, status=status.HTTP_201_CREATED)
        else:
            return Response({DETAIL: ERROR_ON_SENDING_EMAIL}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except:
        user = User.objects.get(username=username)
        if user and not user.is_active:
            # Update user's password
            user.password = make_password(password)
            user.save()

            # Send activation email
            activationLink: str = utils.createActivationLink(user)
            email: dict = utils.createEmail(
                IS_NOT_ACTIVE, activationLink, user)
            if utils.sendEmail(email):
                return Response({DETAIL: ERROR_USER_EXISTS_IS_NOT_ACTIVE}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({DETAIL: ERROR_ON_SENDING_EMAIL}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        elif user and user.is_active:
            return Response({DETAIL: ERROR_USER_EXISTS_IS_ACTIVE_TOO}, status=status.HTTP_400_BAD_REQUEST)


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
