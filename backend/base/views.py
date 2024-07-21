from django.shortcuts import render
from django.http import JsonResponse
from .products import products
from rest_framework.decorators import api_view
from rest_framework.response import Response



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
    return Response(products)