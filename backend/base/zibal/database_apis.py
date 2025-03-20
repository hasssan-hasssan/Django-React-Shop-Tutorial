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


# Define a class to handle database operations related to Zibal payments
class ZibalDatabaseAPIs:

    # Method to create a Zibal transaction in the database
    def create(self, order: Order, user: User, data: dict) -> bool:
        try:
            # Create a new Zibal transaction object
            Zibal.objects.create(
                trackId=data.get(TRACK_ID),  # Unique transaction track ID
                lastStatus=0,  # Initial status of the transaction
                amountCreated=int(order.totalPrice * 10),  # Convert total price to an appropriate format
                order=order,  # Associated order
                user=user  # User initiating the transaction
            )
            return True  # Return True if the transaction is successfully created
        except Exception as e:
            # Log an error if transaction creation fails
            logging.error(ERROR_TRANSACTION_CREATE_DB +
                          MORE_DETAILS % {'e': e})
            return False  # Return False to indicate failure

    # Method to update the status of a Zibal transaction
    def update(self, transaction: Zibal, lastStatus: int) -> bool:
        try:
            # Update the last status of the transaction
            transaction.lastStatus = lastStatus
            transaction.save()  # Save the changes to the database
            return True  # Return True if the update is successful
        except Exception as e:
            # Log an error if transaction update fails
            logging.error(ERROR_UPDATE_TRANSACTION + MORE_DETAILS % {'e': e})
            return False  # Return False to indicate failure

    # Method to complete a Zibal transaction by updating its details
    def complete(self, transaction: Zibal, data: dict) -> bool:
        try:
            # Extract relevant data from the input dictionary
            status = data.get(STATUS)
            amount = data.get(AMOUNT)
            description = data.get(DESCRIPTION)
            card_no = data.get(CARD_NO)
            paid_at = data.get(PAID_AT)
            ref_no = data.get(REF_NO)
            verified_at = data.get(VERIFIED_AT)
            created_at_z = data.get(CREATED_AT_Z)

            # Update the transaction fields based on the extracted data
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
            # else:
            #     # Generate a mock reference number for testing
            #     transaction.refNumber = int(str(transaction._id) * 3)
            if verified_at:
                transaction.verifiedAt = self.make_aware(verified_at)
            if created_at_z:
                transaction.createdAt_Z = self.make_aware(created_at_z)

            transaction.save()  # Save the updated transaction details

            # Mark the associated order as paid
            if paid_at:
                transaction.order.paidAt = self.make_aware(paid_at)
                transaction.order.isPaid = True
                transaction.order.save()

            return True  # Return True if the transaction is successfully completed
        except Exception as e:
            # Log an error if transaction completion fails
            logging.error(ERROR_COMPLETE_TRANSACTION_INFO +
                          MORE_DETAILS % {'e': e})
            return False  # Return False to indicate failure

    # Helper method to convert a naive datetime string into an aware datetime object
    def make_aware(self, raw_datetime: str) -> datetime:
        # Parse the raw datetime string into a naive datetime object
        naive_datetime = datetime.strptime(raw_datetime, "%Y-%m-%dT%H:%M:%S.%f")
        # Localize the naive datetime object to the timezone specified in settings
        aware_datetime = pytz.timezone(
            settings.TIME_ZONE).localize(naive_datetime)
        return aware_datetime

    # Method to generate a payment token for a transaction
    def generate_payment_token(self, orderId: str, trackId: str) -> str:
        # Create a new PaymentToken object
        payment_token = PaymentToken.objects.create(
            orderId=orderId,  # Associated order ID
            trackId=trackId   # Associated transaction track ID
        )
        # Return the generated token
        return payment_token.token
