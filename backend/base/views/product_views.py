import logging
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from base.models import Product
from base.serializers import ProductSerializer
from base.strConst import (
    DETAIL, ERROR_PRODUCT_NOT_FOUND,
    ERROR_PRODUCTS_NOT_REGISTERED, MORE_DETAILS
)


# Define an API endpoint to retrieve all products
@api_view(['GET'])  # Endpoint supports GET requests
def getProducts(request):
    try:
        # Query all products and sort them by creation date in descending order
        products = Product.objects.all().order_by('-createdAt')

        # Serialize the product list into a JSON-compatible format
        serializer = ProductSerializer(
            products, many=True, context={'request': request})

        # Return the serialized data as a successful response
        return Response(serializer.data)
    except Exception as e:
        # Log an error if something goes wrong during product retrieval
        logging.error(ERROR_PRODUCTS_NOT_REGISTERED + MORE_DETAILS % {'e': e})

        # Return an error response indicating that products could not be registered
        return Response({DETAIL: ERROR_PRODUCTS_NOT_REGISTERED})


# Define an API endpoint to retrieve a specific product by its ID
@api_view(['GET'])  # Endpoint supports GET requests
def getProduct(request, pk):
    try:
        # Attempt to retrieve the product by its primary key (ID)
        product = Product.objects.get(_id=pk)

        # Serialize the product object into a JSON-compatible format
        serializer = ProductSerializer(
            product, many=False, context={'request': request})

        # Return the serialized data as a successful response
        return Response(serializer.data)
    except Product.DoesNotExist:
        # Return a 404 response if the product does not exist
        return Response({DETAIL: ERROR_PRODUCT_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
