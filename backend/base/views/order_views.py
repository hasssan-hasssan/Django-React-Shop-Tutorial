from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from base.models import Product, Order, OrderItem, ShippingAddress
from base.serializers import OrderSerializer
from base.strConst import (
    DETAIL, ORDER_ITEMS, PAYMENT_METHOD, QTY, PRICE,
    PRODUCT, SHIPPING_ADDRESS, ADDRESS, CITY, COUNTRY,
    POSTAL_CODE, TOTAL_PRICE, TAX_PRICE,
    SHIPPING_PRICE,
    REQUIRED_SHIPPING_FIELDS,
    ERROR_ORDER_ITEMS,
    ERROR_PAYMENT_METHOD,
    ERROR_SHIPPING_ADDRESS_FIELD,
    ERROR_PRICES,
    ERROR_ORDER_NOT_FOUND,
    ERROR_NOT_AUTHORIZED
)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItems(request):
    user = request.user
    data: dict = request.data

    # Validate orderItems
    orderItems = data.get(ORDER_ITEMS, [])
    if not orderItems:
        return Response({DETAIL: ERROR_ORDER_ITEMS}, status=status.HTTP_400_BAD_REQUEST)

    # Validate paymentMethod
    paymentMethod = data.get(PAYMENT_METHOD)
    if not paymentMethod:
        return Response({DETAIL: ERROR_PAYMENT_METHOD}, status=status.HTTP_400_BAD_REQUEST)

    # Validate shippingAddress
    shippingAddress = data.get(SHIPPING_ADDRESS, {})
    for field in REQUIRED_SHIPPING_FIELDS:
        if not shippingAddress.get(field):
            return Response({DETAIL: ERROR_SHIPPING_ADDRESS_FIELD(field)}, status=status.HTTP_400_BAD_REQUEST)

    # Validate prices
    taxPrice = data.get(TAX_PRICE)
    shippingPrice = data.get(SHIPPING_PRICE)
    totalPrice = data.get(TOTAL_PRICE)

    if taxPrice is None or shippingPrice is None or totalPrice is None:
        return Response({DETAIL: ERROR_PRICES})

    # [1] Create Order
    order = Order.objects.create(
        user=user,
        paymentMethod=paymentMethod,
        taxPrice=taxPrice,
        shippingPrice=shippingPrice,
        totalPrice=totalPrice,
    )

    # [2] Create ShippingAddress
    ShippingAddress.objects.create(
        order=order,
        address=shippingAddress.get(ADDRESS),
        city=shippingAddress.get(CITY),
        country=shippingAddress.get(COUNTRY),
        postalCode=shippingAddress.get(POSTAL_CODE),
    )

    # [3] Create OrderItem and set Order to OrderItems relationships
    for item in orderItems:
        product = Product.objects.get(_id=item[PRODUCT])
        orderItem = OrderItem.objects.create(
            product=product,
            order=order,
            name=product.name,
            qty=item.get(QTY),
            price=item.get(PRICE),
            image=product.image.url
        )

        # [4] Update stock
        product.countInStock -= orderItem.qty
        product.save()

    serializer = OrderSerializer(order, many=False)
    return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrderById(request, pk):
    user = request.user
    try:
        order = Order.objects.get(_id=pk)
    except Order.DoesNotExist:
        return Response({DETAIL: ERROR_ORDER_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
    else:
        if user.is_staff or order.user == user:
            serializer = OrderSerializer(order, many=False)
            return Response(serializer.data)
        else:
            return Response({DETAIL: ERROR_NOT_AUTHORIZED}, status=status.HTTP_403_FORBIDDEN)
