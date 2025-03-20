import requests
from django.urls import reverse
from django.conf import settings
from base.models import Order, Zibal
from base.strConst import (
    UNKNOWN_ERROR, MERCHANT, AMOUNT, ORDER_ID,
    CALLBACK_URL, ZIBAL_DOMAIN_IPG, REQUEST_PATH,
    TRACK_ID, VERIFY_PATH, INQUIRY_PATH, SUCCESS, MSG, STATUS, REF_NO
)


# Define a class to handle interactions with the Zibal payment gateway
class ZibalServerAPIs:

    # Initialize the class with the merchant key from settings
    def __init__(self):
        self.merchant = settings.ZIBAL_MERCHANT  # Merchant identifier for Zibal payment gateway

    # Send a payment request to Zibal
    def request(self, order: Order) -> dict:
        data = {}  # Dictionary to hold the request data
        data[MERCHANT] = self.merchant  # Add merchant key
        data[AMOUNT] = int(order.totalPrice * 10)  # Convert the total price to Rials (or required format)
        data[ORDER_ID] = str(order._id)  # Add the order ID
        data[CALLBACK_URL] = settings.BACKEND_DOMAIN + reverse('zibalCallback')  # Callback URL for step two of implement IPG
        return self.postTo(REQUEST_PATH, data)  # Make the POST request to Zibal's payment initiation endpoint

    # Verify the payment status using the transaction's track ID
    def verify(self, trackId: int) -> dict:
        data = {}  # Dictionary to hold the verification request data
        data[MERCHANT] = self.merchant  # Add merchant key
        data[TRACK_ID] = trackId  # Add the track ID of the transaction
        return self.postTo(VERIFY_PATH, data)  # Make the POST request to Zibal's verification endpoint

    # Inquire about the current status of a transaction
    def inquiry(self, trackId: int) -> dict:
        data = {}  # Dictionary to hold the inquiry request data
        data[MERCHANT] = self.merchant  # Add merchant key
        data[TRACK_ID] = trackId  # Add the track ID of the transaction
        return self.postTo(INQUIRY_PATH, data)  # Make the POST request to Zibal's inquiry endpoint

    # Generate a response for payment inquiry using transaction details
    def generate_inquiry_pay_response(self, transaction: Zibal) -> dict:
        response = {}  # Dictionary to hold the inquiry response data
        response[SUCCESS] = transaction.lastStatus in [1]  # Check if the payment was successful
        response[MSG] = self.payment_status_code_translator(transaction.lastStatus)  # Translate payment status code
        response[TRACK_ID] = transaction.trackId  # Add track ID to the response
        response[ORDER_ID] = transaction.order._id  # Add order ID to the response
        response[STATUS] = transaction.lastStatus  # Add transaction status to the response
        response[REF_NO] = transaction.refNumber if transaction.refNumber else "N/A"  # Add reference number or N/A
        return response

    # Translate payment status codes into human-readable messages
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
        # Return the translated message or an unknown error
        return code_translator.get(status, UNKNOWN_ERROR)

    # Translate result codes from Zibal into human-readable messages
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
        # Return the translated message or an unknown error
        return code_translator.get(result, UNKNOWN_ERROR)

    # Send a POST request to a specific Zibal endpoint with given parameters
    def postTo(self, path: str, parameters: dict) -> dict:
        url: str = ZIBAL_DOMAIN_IPG + path  # Construct the full URL for the endpoint
        response = requests.post(url, json=parameters)  # Send the POST request with JSON payload
        return response.json()  # Return the response as a JSON object
