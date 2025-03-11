import logging
import pytz
from datetime import datetime
from django.conf import settings
from django.contrib.auth.models import User
from base.models import Order, Zibal, PaymentToken
from base.strConst import (
    TRACK_ID, ERROR_TRANSACTION_CREATE_DB, MORE_DETAILS,
    ERROR_UPDATE_TRANSACTION, STATUS, AMOUNT, DESCRIPTION, CARD_NO, PAID_AT,
    REF_NO, VERIFIED_AT, CREATED_AT_Z, ERROR_COMPLETE_TRANSACTION_INFO
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

    def update(self, transaction: Zibal, lastStatus: int) -> bool:
        try:
            transaction.lastStatus = lastStatus
            transaction.save()
            return True
        except Exception as e:
            logging.error(ERROR_UPDATE_TRANSACTION + MORE_DETAILS % {'e': e})
            return False

    def complete(self, transaction: Zibal, data: dict) -> bool:
        try:
            status = data.get(STATUS)
            amount = data.get(AMOUNT)
            description = data.get(DESCRIPTION)
            card_no = data.get(CARD_NO)
            paid_at = data.get(PAID_AT)
            ref_no = data.get(REF_NO)
            verified_at = data.get(VERIFIED_AT)
            created_at_z = data.get(CREATED_AT_Z)

            if status:
                transaction.lastStatus = status

            if amount:
                transaction.amountPaid = amount

            if description:
                transaction.description = description

            if card_no:
                transaction.cardNumber = card_no

            if paid_at:
                transaction.paidAt = paid_at

            if ref_no:
                transaction.refNumber = ref_no
            else:
                # Just for test
                transaction.refNumber = int(str(transaction._id)*3)

            if verified_at:
                transaction.verifiedAt = self.make_aware(verified_at)

            if created_at_z:
                transaction.createdAt_Z = self.make_aware(created_at_z)

            transaction.save()

            # Change order status into paid
            if paid_at:
                transaction.order.paidAt = self.make_aware(paid_at)
                transaction.order.isPaid = True
                transaction.order.save()

            return True
        except Exception as e:
            logging.error(ERROR_COMPLETE_TRANSACTION_INFO +
                          MORE_DETAILS % {'e': e})
            return False

    def make_aware(self, raw_datetime: str) -> datetime:
        naive_datetime = datetime.strptime(raw_datetime, "%Y-%m-%dT%H:%M:%S.%f")
        aware_datetime = pytz.timezone(settings.TIME_ZONE).localize(naive_datetime)
        return aware_datetime

    def generate_payment_token(self, orderId: str, trackId: str) -> str:
        payment_token = PaymentToken.objects.create(
            orderId=orderId, trackId=trackId
        )
        return payment_token.token
