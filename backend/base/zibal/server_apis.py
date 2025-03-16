import requests
from django.urls import reverse
from django.conf import settings
from base.models import Order, Zibal
from base.strConst import (
    UNKNOWN_ERROR, MERCHANT, AMOUNT, ORDER_ID,
    CALLBACK_URL, ZIBAL_DOMAIN_IPG, REQUEST_PATH,
    TRACK_ID, VERIFY_PATH, INQUIRY_PATH, SUCCESS, MSG, STATUS, REF_NO
)


class ZibalServerAPIs:

    def __init__(self):
        self.merchant = settings.ZIBAL_MERCHANT

    def request(self, order: Order) -> dict:
        data = {}
        data[MERCHANT] = self.merchant
        data[AMOUNT] = int(order.totalPrice * 10)
        data[ORDER_ID] = str(order._id)
        data[CALLBACK_URL] = settings.BACKEND_DOMAIN + reverse('zibalCallback')
        return self.postTo(REQUEST_PATH, data)

    def verify(self, trackId: int) -> dict:
        data = {}
        data[MERCHANT] = self.merchant
        data[TRACK_ID] = trackId
        return self.postTo(VERIFY_PATH, data)

    def inquiry(self, trackId: int) -> dict:
        data = {}
        data[MERCHANT] = self.merchant
        data[TRACK_ID] = trackId
        return self.postTo(INQUIRY_PATH, data)

    def generate_inquiry_pay_response(self, transaction: Zibal) -> dict:
        response = {}
        response[SUCCESS] = transaction.lastStatus in [1]
        response[MSG] = self.payment_status_code_translator(
            transaction.lastStatus)
        response[TRACK_ID] = transaction.trackId
        response[ORDER_ID] = transaction.order._id
        response[STATUS] = transaction.lastStatus
        response[REF_NO] = transaction.refNumber if transaction.refNumber else "N/A"
        return response

    def payment_status_code_translator(self, status: int) -> str:
        code_translator = {
            -1: "Pending payment",
            -2: "Internal error",
            1: "Paid - Confirmed",
            2: "Paid - Unconfirmed",
            3: "Canceled by user",
            4: "Invalid card number",
            5: "Insufficient account balance",
            6: "Incorrect password",
            7: "Request limit exceeded",
            8: "Daily online payment limit exceeded",
            9: "Daily online payment amount exceeded",
            10: "Invalid card issuer",
            11: "Switch error",
            12: "Card not accessible",
            15: "Transaction refunded",
            16: "Transaction being refunded",
            18: "Transaction reversed",
        }
        
        return code_translator.get(status, UNKNOWN_ERROR)

    def result_code_translator(self, result: int) -> str:
        code_translator = {
            100: "Request completed successfully",
            102: "Merchant not found.",
            103: "Merchant is inactive.",
            104: "Invalid merchant.",
            105: "Amount must be greater than 1,000 Rials.",
            106: "Invalid callback URL. (Must start with http or https)",
            113: "Transaction amount exceeds the maximum limit.",
            114: "Invalid national code.",
            201: "Previously confirmed.",
            202: "Order has not been paid or was unsuccessful. Please refer to the status table for more information.",
            203: "Invalid track ID.",
        }
        return code_translator.get(result, UNKNOWN_ERROR)

    def postTo(self, path: str, parameters: dict) -> dict:
        url: str = ZIBAL_DOMAIN_IPG + path
        response = requests.post(url, json=parameters)
        return response.json()
