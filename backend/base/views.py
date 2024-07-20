from django.shortcuts import render
from django.http import JsonResponse
from .products import products



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


def getRoutes(request):
    return JsonResponse(routes, safe=False)


def getProducts(request):
    return JsonResponse(products, safe=False)