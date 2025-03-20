import logging 
from requests.exceptions import RequestException
from django.http import HttpResponseRedirect 
from rest_framework import status 
from rest_framework.response import Response
from rest_framework.decorators import (api_view, permission_classes, authentication_classes,)  
from base.zibal import zibal_apis  
from base.models import Zibal, Order 
from base.strConst import (  
    SUCCESS, TRACK_ID, ORDER_ID, STATUS, DETAIL, MORE_DETAILS,
    ERROR_TRANSACTION_PROCESSING, PAY_RESULT_REDIRECT, RESULT
)


# Define an API view for handling Zibal payment gateway callbacks
@api_view(["GET"])  # API view supports GET requests
@permission_classes([])  # No specific permissions are required for this view
@authentication_classes([])  # No authentication is required for this view
def zibalCallback(request):
    try:
        # Extract and validate callback parameters from the GET request
        _success: bool = request.GET.get(SUCCESS) == "1"  # Payment success status
        _trackId: int = int(request.GET.get(TRACK_ID))  # Track ID of the transaction
        _orderId: int = int(request.GET.get(ORDER_ID))  # Order ID associated with the transaction
        _status: int = int(request.GET.get(STATUS))  # Status code from the callback

        # Fetch the corresponding Order and Zibal transaction objects
        order = Order.objects.get(_id=_orderId)  # Retrieve the order by its ID
        transaction = Zibal.objects.get(order=order, trackId=_trackId)  # Retrieve the transaction based on the order and track ID
    except Exception as e:
        # Log any errors during parameter extraction or object retrieval
        logging.error(ERROR_TRANSACTION_PROCESSING + MORE_DETAILS % {"e": e})
        # Return a response indicating a bad request
        return Response({DETAIL: ERROR_TRANSACTION_PROCESSING}, status=status.HTTP_400_BAD_REQUEST)
    else:
        # Handle a successful payment callback
        if _success:
            try:
                # Verify the transaction with the Zibal server
                res: dict = zibal_apis.server_apis.verify(transaction.trackId)
            except RequestException:
                # Handle verification request failure
                db_status: bool = zibal_apis.database_apis.update(transaction, _status)  # Update the transaction in the database
                token: str = zibal_apis.database_apis.generate_payment_token(str(order._id), str(transaction.trackId))  # Generate a payment token
                # Redirect to the payment result page with the token and database status
                return HttpResponseRedirect(PAY_RESULT_REDIRECT(token, db_status))
            else:
                # Process the response from the Zibal server
                result: int = res.get(RESULT)  # Extract the result code from the response
                if result == 100:  # Transaction verified successfully
                    db_status: bool = zibal_apis.database_apis.complete(transaction, res)  # Mark the transaction as completed
                    token: str = zibal_apis.database_apis.generate_payment_token(str(order._id), str(transaction.trackId))  # Generate a payment token
                    return HttpResponseRedirect(PAY_RESULT_REDIRECT(token, db_status) )  # Redirect to the payment result page
                else:
                    # Handle unsuccessful transaction verification
                    db_status: bool = zibal_apis.database_apis.update(transaction, _status)  # Update the transaction in the database
                    token: str = zibal_apis.database_apis.generate_payment_token(str(order._id), str(transaction.trackId))  # Generate a payment token
                    return HttpResponseRedirect(PAY_RESULT_REDIRECT(token, db_status))  # Redirect to the payment result page
        else:
            # Handle unsuccessful payment status
            db_status: bool = zibal_apis.database_apis.update(transaction, _status)  # Update the transaction in the database
            token: str = zibal_apis.database_apis.generate_payment_token(str(order._id), str(transaction.trackId))  # Generate a payment token
            return HttpResponseRedirect(PAY_RESULT_REDIRECT(token, db_status))  # Redirect to the payment result page
