import logging
from requests.exceptions import RequestException
from django.http import HttpResponseRedirect
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from base.zibal import zibal_apis
from base.models import Zibal, Order
from base.strConst import (
    SUCCESS, TRACK_ID, ORDER_ID, STATUS, DETAIL, MORE_DETAILS,
    ERROR_TRANSACTION_PROCESSING, PAY_RESULT_REDIRECT, RESULT
)


@api_view(['GET'])
@permission_classes([])
@authentication_classes([])
def zibalCallback(request):
    try:
        _success: bool = request.GET.get(SUCCESS) == '1'
        _trackId: int = int(request.GET.get(TRACK_ID))
        _orderId: int = int(request.GET.get(ORDER_ID))
        _status: int = int(request.GET.get(STATUS))

        order = Order.objects.get(_id=_orderId)
        transaction = Zibal.objects.get(order=order, trackId=_trackId)
    except Exception as e:
        logging.error(ERROR_TRANSACTION_PROCESSING + MORE_DETAILS % {'e': e})
        return Response({DETAIL: ERROR_TRANSACTION_PROCESSING}, status=status.HTTP_400_BAD_REQUEST)
    else:
        if _success:
            try:
                res: dict = zibal_apis.server_apis.verify(transaction.trackId)
            except RequestException:
                db_status: bool = zibal_apis.database_apis.update(transaction, _status)
                token: str = zibal_apis.database_apis.generate_payment_token(str(order._id), str(transaction.trackId))
                return HttpResponseRedirect(PAY_RESULT_REDIRECT(token, db_status))
            else:
                result: int = res.get(RESULT)
                if result == 100:
                    db_status: bool = zibal_apis.database_apis.complete(transaction, res)
                    token: str = zibal_apis.database_apis.generate_payment_token(str(order._id), str(transaction.trackId))
                    return HttpResponseRedirect(PAY_RESULT_REDIRECT(token, db_status))
                else:
                    db_status: bool = zibal_apis.database_apis.update(transaction, _status)
                    token: str = zibal_apis.database_apis.generate_payment_token(str(order._id), str(transaction.trackId))
                    return HttpResponseRedirect(PAY_RESULT_REDIRECT(token, db_status))
        else:
            db_status: bool = zibal_apis.database_apis.update(transaction, _status)
            token: str = zibal_apis.database_apis.generate_payment_token(str(order._id), str(transaction.trackId))
            return HttpResponseRedirect(PAY_RESULT_REDIRECT(token, db_status))
