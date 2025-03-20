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
    ERROR_TRANSACTION_DETAILS_NOT_FOUND,
    ERROR_REGISTRATION_PAYMENT_CONFIRMED
)


# Define an API endpoint for creating a new order with order items
@api_view(['POST'])  # Endpoint handles POST requests
@permission_classes([IsAuthenticated])  # Requires user authentication to access
def addOrderItems(request):
    user = request.user  # Retrieve the currently authenticated user
    data: dict = request.data  # Extract data from the request body

    # Validate the presence of order items
    # Retrieve the order items from the data
    orderItems = data.get(ORDER_ITEMS, [])
    if not orderItems:
        # Return an error response if no order items are provided
        return Response({DETAIL: ERROR_ORDER_ITEMS}, status=status.HTTP_400_BAD_REQUEST)

    # Validate the presence of a payment method
    paymentMethod = data.get(PAYMENT_METHOD)  # Retrieve the payment method
    if not paymentMethod:
        # Return an error response if payment method is missing
        return Response({DETAIL: ERROR_PAYMENT_METHOD}, status=status.HTTP_400_BAD_REQUEST)

    # Validate the shipping address and ensure all required fields are present
    shippingAddress = data.get(SHIPPING_ADDRESS, {})
    for field in REQUIRED_SHIPPING_FIELDS:
        if not shippingAddress.get(field):
            # Return an error response if a required shipping address field is missing
            return Response({DETAIL: ERROR_SHIPPING_ADDRESS_FIELD(field)}, status=status.HTTP_400_BAD_REQUEST)

    # Validate pricing details (tax, shipping, and total price must be provided)
    taxPrice = data.get(TAX_PRICE)
    shippingPrice = data.get(SHIPPING_PRICE)
    totalPrice = data.get(TOTAL_PRICE)
    if taxPrice is None or shippingPrice is None or totalPrice is None:
        # Return an error response if any price value is missing
        return Response({DETAIL: ERROR_PRICES})

    # [1] Create the order object
    order = Order.objects.create(
        user=user,  # Associate the order with the authenticated user
        paymentMethod=paymentMethod,  # Set the payment method
        taxPrice=taxPrice,  # Set the tax price
        shippingPrice=shippingPrice,  # Set the shipping price
        totalPrice=totalPrice,  # Set the total price
    )

    # [2] Create the shipping address associated with the order
    ShippingAddress.objects.create(
        order=order,  # Link the shipping address to the order
        address=shippingAddress.get(ADDRESS),  # Set the address field
        city=shippingAddress.get(CITY),  # Set the city field
        country=shippingAddress.get(COUNTRY),  # Set the country field
        postalCode=shippingAddress.get(
            POSTAL_CODE),  # Set the postal code field
    )

    # [3] Create order items and associate them with the order
    for item in orderItems:
        # Retrieve the product by its ID
        product = Product.objects.get(_id=item[PRODUCT])
        orderItem = OrderItem.objects.create(
            product=product,  # Associate the order item with the product
            order=order,  # Associate the order item with the order
            name=product.name,  # Set the name of the product
            qty=item.get(QTY),  # Set the quantity of the product
            price=item.get(PRICE),  # Set the price of the product
            image=product.image.url  # Set the product image URL
        )

        # [4] Update the product stock
        # Decrease the product's stock by the ordered quantity
        product.countInStock -= orderItem.qty
        product.save()  # Save the updated product object

    # Serialize the order object to a JSON-compatible format
    serializer = OrderSerializer(order, many=False)
    # Return the serialized order data as a successful response
    return Response(serializer.data)


# Define an API endpoint to retrieve the details of a specific order by its ID
@api_view(['GET'])  # Endpoint supports GET requests
@permission_classes([IsAuthenticated])  # Requires user authentication
def getOrderById(request, pk):
    user = request.user  # Retrieve the currently authenticated user

    try:
        # Attempt to retrieve the order by its primary key (ID)
        order = Order.objects.get(_id=pk)
    except Order.DoesNotExist:
        # Return a 404 response if the order does not exist
        return Response({DETAIL: ERROR_ORDER_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Check if the user is a staff member or the owner of the order
        if user.is_staff or order.user == user:
            # Serialize the order object into a JSON-compatible format
            serializer = OrderSerializer(
                order, many=False, context={'request': request})
            # Return the serialized data as a successful response
            return Response(serializer.data)
        else:
            # Return a 403 response if the user is not authorized to access the order
            return Response({DETAIL: ERROR_NOT_AUTHORIZED}, status=status.HTTP_403_FORBIDDEN)


# Define an API endpoint to retrieve the orders of the authenticated user
@api_view(['GET'])  # Endpoint supports GET requests
# Requires user authentication to access
@permission_classes([IsAuthenticated])
def getMyOrders(request):
    user = request.user  # Retrieve the currently authenticated user

    # Query to fetch all orders associated with the authenticated user
    # Alternative: You can use user.order_set.all() if there's a reverse relation defined
    orders = Order.objects.filter(user=user)

    if not orders:
        # Return a 404 response if no orders are found for the user
        return Response({DETAIL: ERROR_ORDERS_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Serialize the orders into a JSON-compatible format
        serializer = OrderSerializer(orders, many=True)
        # Return the serialized data as a successful response
        return Response(serializer.data)


# Define an API endpoint to handle payment processing for an order
@api_view(['GET'])  # Endpoint supports GET requests
@permission_classes([IsAuthenticated])  # Requires user authentication
def payOrder(request, pk):
    user = request.user  # Retrieve the authenticated user

    try:
        # Attempt to retrieve the order by its primary key (ID) and ensure it belongs to the authenticated user
        order = Order.objects.get(_id=pk, user=user)
    except Order.DoesNotExist:
        # Return a 404 response if the order does not exist
        return Response({DETAIL: ERROR_ORDER_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Proceed if the order exists and hasn't been paid
        if not order.isPaid:
            try:
                # Send a payment request to the Zibal server
                res: dict = zibal_apis.server_apis.request(order)
            except RequestException:
                # Handle connection issues with the Zibal server
                return Response({DETAIL: ERROR_ZIBAL_SERVER_CONNECTION}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                # Process the response from the Zibal server
                result: int = res.get(RESULT)  # Extract the result code
                if result == 100:  # Successful request
                    # Create a transaction record in the database
                    if zibal_apis.database_apis.create(order, user, res):
                        # Retrieve the transaction track ID
                        trackId: str = str(res.get(TRACK_ID))
                        # Return a response with a link to proceed with payment
                        return Response({LINK: MAKE_PAYMENT_LINK(trackId)}, status=status.HTTP_200_OK)
                    else:
                        # Handle errors during transaction creation in the database
                        return Response({DETAIL: ERROR_TRANSACTION_CREATE_DB}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
                else:
                    # Translate the error result code from Zibal into a meaningful message
                    MSG = zibal_apis.server_apis.result_code_translator(result)
                    return Response({DETAIL: MSG}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        else:
            # Return a 400 response if the order is already paid
            return Response({DETAIL: ERROR_ORDER_PAID}, status=status.HTTP_400_BAD_REQUEST)


# Define an API endpoint to handle payment inquiries
@api_view(['GET'])  # Endpoint supports GET requests
# Requires user authentication to access
@permission_classes([IsAuthenticated])
def inquiryPay(request, token):
    user = request.user  # Retrieve the authenticated user making the request

    try:
        # Fetch the payment token, order, and transaction associated with the provided token
        payment_token = PaymentToken.objects.get(token=token)
        order = Order.objects.get(_id=payment_token.orderId, user=user)
        transaction = Zibal.objects.get(trackId=int(
            payment_token.trackId), order=order, user=user)
    except (PaymentToken.DoesNotExist, Order.DoesNotExist, Zibal.DoesNotExist):
        # Handle case where any of the required objects do not exist
        return Response({DETAIL: ERROR_TRANSACTION_DETAILS_NOT_FOUND}, status=status.HTTP_404_NOT_FOUND)
    else:
        # Check if the transaction has already been processed successfully
        if transaction.lastStatus != 0 and transaction.refNumber:
            # Generate a response for an already processed transaction
            response: dict = zibal_apis.server_apis.generate_inquiry_pay_response(
                transaction)
            return Response(response, status=status.HTTP_200_OK)
        else:
            # Handle unprocessed transactions by sending an inquiry to the Zibal server
            try:
                res: dict = zibal_apis.server_apis.inquiry(transaction.trackId)
            except RequestException:
                # Handle connection issues with the Zibal server
                return Response({DETAIL: ERROR_ZIBAL_SERVER_CONNECTION}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            else:
                # Extract the result code from the Zibal server response
                result: int = res.get(RESULT)
                if result == 100:  # If the result indicates successful verification
                    # Mark the transaction as complete in the database
                    if zibal_apis.database_apis.complete(transaction, res):
                        response: dict = zibal_apis.server_apis.generate_inquiry_pay_response(
                            transaction)
                        return Response(response, status=status.HTTP_200_OK)
                    else:
                        # Handle errors in registering the payment as confirmed
                        return Response({DETAIL: ERROR_REGISTRATION_PAYMENT_CONFIRMED})
                else:
                    # Translate the result code into a meaningful message and respond with an error
                    MSG = zibal_apis.server_apis.result_code_translator(result)
                    return Response({DETAIL: MSG}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
