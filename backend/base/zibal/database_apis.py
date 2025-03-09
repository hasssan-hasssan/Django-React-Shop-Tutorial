import logging
from django.contrib.auth.models import User
from base.models import Order, Zibal, PaymentToken
from base.strConst import (
    TRACK_ID, ERROR_TRANSACTION_CREATE_DB, MORE_DETAILS
)


class ZibalDatabaseAPIs:

    def create(self, order: Order, user: User, data: dict) -> bool:
        try:
            Zibal.objects.create(
                trackId=data.get(TRACK_ID),
                lastStatus=0,
                amountCreated=int(order.totalPrice * 10),
                order=order,
                user=user
            )
            return True
        except Exception as e:
            logging.error(ERROR_TRANSACTION_CREATE_DB +
                          MORE_DETAILS % {'e': e})
            return False

    def generate_payment_token(self, orderId: str, trackId: str) -> str:
        payment_token = PaymentToken.objects.create(
            orderId=orderId, trackId=trackId
        )
        return payment_token.token
