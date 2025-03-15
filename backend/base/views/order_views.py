from requests import RequestException
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from base.zibal import zibal_apis
from base.models import Product, Order, OrderItem, ShippingAddress, PaymentToken, Zibal
from base.serializers import OrderSerializer
from base.strConst import (
    DETAIL, ORDER_ITEMS, PAYMENT_METHOD, QTY, PRICE,
    PRODUCT, SHIPPING_ADDRESS, ADDRESS, CITY, COUNTRY,
    POSTAL_CODE, TOTAL_PRICE, TAX_PRICE,
    SHIPPING_PRICE,
    REQUIRED_SHIPPING_FIELDS,
    RESULT, TRACK_ID, LINK, MAKE_PAYMENT_LINK,
    ERROR_ORDER_ITEMS,
    ERROR_PAYMENT_METHOD,
    ERROR_SHIPPING_ADDRESS_FIELD,
    ERROR_PRICES,
    ERROR_ORDER_NOT_FOUND,
    ERROR_NOT_AUTHORIZED,
    ERROR_ORDERS_NOT_FOUND,
    ERROR_ORDER_PAID,
    ERROR_TRANSACTION_CREATE_DB,
    ERROR_ZIBAL_SERVER_CONNECTION,
    ERROR_TRANSACTION_DETAILS_NOT_FOUND
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
            serializer = OrderSerializer(
                order, many=False, context={'request': request})
            return Response(serializer.data)
        else:
            return Response({DETAIL: ERROR_NOT_AUTHORIZED}, status=status.HTTP_403_FORBIDDEN)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user
    # orders = user.order_set.all()
    orders = Order.objects.filter(user=user)
    if not orders:
        return Response({DETAIL: ERROR_ORDERS_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
    else:
        serializer = OrderSerializer(orders, many=True)
        return Response(serializer.data)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def payOrder(request, pk):
    user = request.user

    try:
        order = Order.objects.get(_id=pk, user=user)
    except Order.DoesNotExist:
        return Response({DETAIL: ERROR_ORDER_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
    else:
        if not order.isPaid:
            try:
                res: dict = zibal_apis.server_apis.request(order)
            except RequestException:
                return Response({DETAIL: ERROR_ZIBAL_SERVER_CONNECTION}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                result: int = res.get(RESULT)
                if result == 100:
                    if zibal_apis.database_apis.create(order, user, res):
                        trackId: str = str(res.get(TRACK_ID))
                        return Response({LINK: MAKE_PAYMENT_LINK(trackId)}, status=status.HTTP_200_OK)
                    else:
                        return Response({DETAIL: ERROR_TRANSACTION_CREATE_DB}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    MSG = zibal_apis.server_apis.result_code_translator(result)
                    return Response({DETAIL: MSG}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            return Response({DETAIL: ERROR_ORDER_PAID}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def inquiryPay(request, token):
    user = request.user
    
    try:
        payment_token = PaymentToken.objects.get(token=token)
        order = Order.objects.get(_id=payment_token.orderId, user=user)
        transaction = Zibal.objects.get(trackId=int(payment_token.trackId), order=order, user=user)
    except (PaymentToken.DoesNotExist , Order.DoesNotExist, Zibal.DoesNotExist):
        return Response({DETAIL: ERROR_TRANSACTION_DETAILS_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
    else:
        if transaction.lastStatus != 0 and transaction.refNumber:
            response: dict = zibal_apis.server_apis.generate_inquiry_pay_response(transaction)
            return Response(response, status=status.HTTP_200_OK)
        else:
            # TODO : Send inquiry pay request
            pass