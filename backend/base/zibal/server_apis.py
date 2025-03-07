import requests
from django.urls import reverse
from django.conf import settings
from base.models import Order
from base.strConst import (
    UNKNOWN_ERROR, MERCHANT, AMOUNT, ORDER_ID, CALLBACK_URL, ZIBAL_DOMAIN_IPG, REQUEST_PATH
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
