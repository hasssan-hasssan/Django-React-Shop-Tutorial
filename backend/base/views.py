from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.contrib.auth.models import User
from rest_framework.response import Response
from rest_framework import status
from .models import Product
from .serializers import ProductSerializer, UserSerializer


routes = [
    '/api/v1/products/',
    '/api/v1/products/create',

    '/api/v1/products/upload/',

    '/api/v1/products/<id>/reviews/',

    '/api/v1/products/top/',
    '/api/v1/products/<id>/',

    '/api/v1/products/delete/<id>/',
    '/api/v1/products/<update>/<id>/',
]


@api_view(['GET'])
def getRoutes(request):
    return Response(routes)


@api_view(['GET'])
def getProducts(request):
    products = Product.objects.all().order_by('-createdAt')
    serializer = ProductSerializer(
        products, many=True, context={'request': request})
    return Response(serializer.data)


@api_view(['GET'])
def getProduct(request, pk):
    product = Product.objects.get(_id=pk)
    serializer = ProductSerializer(
        product, many=False, context={'request': request})
    return Response(serializer.data)


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
