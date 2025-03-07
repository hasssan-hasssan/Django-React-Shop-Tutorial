import logging
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from base.models import Zibal, Order
from base.strConst import (
    SUCCESS, TRACK_ID, ORDER_ID, STATUS, DETAIL, MORE_DETAILS,
    ERROR_TRANSACTION_PROCESSING
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
        # TODO : Verify transaction
        pass
