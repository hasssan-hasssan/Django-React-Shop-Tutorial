from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.models import Product
from base.serializers import ProductSerializer
from base.strConst import *


@api_view(['GET'])
def getProducts(request):
    try:
        products = Product.objects.all().order_by('-createdAt')
        serializer = ProductSerializer(products,
                                       many=True,
                                       context={'request': request})
        return Response(serializer.data)
    except:
        return Response({DETAIL: ERROR_PRODUCTS_NOT_REGISTERED})


@api_view(['GET'])
def getProduct(request, pk):
    try:
        product = Product.objects.get(_id=pk)
        serializer = ProductSerializer(product,
                                       many=False,
                                       context={'request': request})
        return Response(serializer.data)
    except Product.DoesNotExist:
        return Response({DETAIL: ERROR_PRODUCT_NOT_FOUND},
                        status=status.HTTP_404_NOT_FOUND)
