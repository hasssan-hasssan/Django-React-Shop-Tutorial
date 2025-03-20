from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.conf import settings
from django.http import HttpResponseRedirect
from base.serializers import UserSerializer, UserSerializerWithToken
from base.strConst import (
    NEW_REGISTER, DETAIL,
    IS_NOT_ACTIVE,
    SUCCESS_NEW_REGISTER,
    ERROR_ON_SENDING_EMAIL,
    ERROR_USER_EXISTS_IS_NOT_ACTIVE,
    ERROR_USER_EXISTS_IS_ACTIVE_TOO
)
from base import utils
import jwt


# Define an API endpoint to retrieve the profile of the authenticated user
@api_view(['GET'])  # Endpoint supports GET requests
@permission_classes([IsAuthenticated])  # Requires user authentication
def getUserProfile(request):
    user = request.user  # Retrieve the authenticated user
    serializer = UserSerializer(user, many=False)  # Serialize the user's data
    # Return the serialized data as a response
    return Response(serializer.data)


# Define an API endpoint to retrieve all registered users (for admin use only)
@api_view(['GET'])  # Endpoint supports GET requests
@permission_classes([IsAdminUser])  # Requires admin-level permissions
def getUsers(request):
    users = User.objects.all()  # Retrieve all users from the database
    # Serialize the list of users
    serializer = UserSerializer(users, many=True)
    # Return the serialized data as a response
    return Response(serializer.data)


# Define an API endpoint to register a new user
@api_view(['POST'])  # Endpoint supports POST requests
def registerUser(request):
    data = request.data  # Extract user registration data from the request body
    username = data['email']  # Get the user's email as the username
    password = data['password']  # Get the user's password

    try:
        # Create a new user with the provided data
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password']),  # Hash the password
            is_active=False  # Set the user as inactive until email verification
        )

        # Send an activation email
        activationLink: str = utils.createActivationLink(
            user)  # Generate the activation link
        email: dict = utils.createEmail(
            NEW_REGISTER, activationLink, user)  # Create the email content
        if utils.sendEmail(email):  # Send the activation email
            return Response({DETAIL: SUCCESS_NEW_REGISTER}, status=status.HTTP_201_CREATED)
        else:
            return Response({DETAIL: ERROR_ON_SENDING_EMAIL}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    except Exception as e:
        # Handle cases where the user already exists but is not active
        user = User.objects.get(username=username)
        if user and not user.is_active:
            # Update the user's password and resend the activation email
            user.password = make_password(password)
            user.save()
            activationLink: str = utils.createActivationLink(user)
            email: dict = utils.createEmail(
                IS_NOT_ACTIVE, activationLink, user)
            if utils.sendEmail(email):
                return Response({DETAIL: ERROR_USER_EXISTS_IS_NOT_ACTIVE}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({DETAIL: ERROR_ON_SENDING_EMAIL}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        elif user and user.is_active:
            # Handle cases where the user is already active
            return Response({DETAIL: ERROR_USER_EXISTS_IS_ACTIVE_TOO}, status=status.HTTP_400_BAD_REQUEST)


# Define an API endpoint to update the profile of the authenticated user
@api_view(['PUT'])  # Endpoint supports PUT requests
@permission_classes([IsAuthenticated])  # Requires user authentication
def updateUserProfile(request):
    user = request.user  # Retrieve the authenticated user
    data = request.data  # Extract profile update data from the request body

    # Update user fields with the provided data
    user.first_name = data['name']
    user.email = data['email']
    user.username = data['email']
    if data['password'] != '':  # Update the password if provided
        user.password = make_password(data['password'])
    user.save()  # Save the updated user object

    # Serialize the updated user object with a token
    serializer = UserSerializerWithToken(user, many=False)
    # Return the serialized data as a response
    return Response(serializer.data)


# Define an API endpoint to verify a user's email using a token
@api_view(['GET'])  # Endpoint supports GET requests
def verifyEmail(request, token):
    try:
        # Decode the JWT token to retrieve the user payload
        payload = jwt.decode(
            jwt=token,
            key=settings.SECRET_KEY,
            algorithms=[settings.SIMPLE_JWT['ALGORITHM']]
        )
    except Exception as e:
        # Redirect to the frontend login page with an invalid token message if decoding fails
        return HttpResponseRedirect(f'{settings.FRONTEND_DOMAIN}/login?token=invalid')
    else:
        # Activate the user if the token is valid
        user = User.objects.get(id=payload['user_id'])
        user.is_active = True
        user.save()
        # Redirect to the frontend login page with a valid token message
        return HttpResponseRedirect(f'{settings.FRONTEND_DOMAIN}/login?token=valid')
