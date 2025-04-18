from django.conf import settings
DETAIL = 'detail'

# User
SUCCESS_NEW_REGISTER = 'Welcome to E-Shop, You should verify your email. Please check your Inbox we sent an activation email.'
ERROR_USER_EXISTS_IS_NOT_ACTIVE = 'Oops, User with this email already exists but is not active. You should verify your email. Please check your Inbox we sent an activation email.'
ERROR_USER_EXISTS_IS_ACTIVE_TOO = 'Oops, User with this email already exists and is active too. Please sign in to your account !'
ERROR_NOT_AUTHORIZED = 'Oops, Not authorized!'
# Product
ERROR_PRODUCT_NOT_FOUND = 'Oops, Product not found!'
ERROR_PRODUCTS_NOT_REGISTERED = 'Oops, No product registered yet!'


# Email
NEW_REGISTER = 'new_register'
IS_NOT_ACTIVE = 'is_not_active'
ERROR_ON_SENDING_EMAIL = 'Oops, there is a problem on sending email!'
EMAIL_SUBJECT = 'E-SHOP | VERIFICATION EMAIL'


def HTML_TEMPLATE_VERIFICATION_EMAIL(status: str, link: str) -> str:
    html_content = """
        <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Verify Your Email</title>
                <style>
                    body {
                        background-color: #03002e; /* Dark blue background */
                        color: #E0E0E0; /* Light text for readability */
                        font-family: Consolas;
                        margin: 0;
                        padding: 0;
                    }

                    .container {
                        text-align: center;
                        padding: 50px;
                    }

                    h1 {
                        color: #090088; /* Bright blue for the title */
                        font-size: 2rem;
                    }

                    .button {
                        display: inline-block;
                        margin-top: 20px;
                        padding: 15px 30px;
                        font-size: 1rem;
                        font-weight: bold;
                        background-color: #02006c; /* Button background */
                        color: #E0E0E0; /* Button text */
                        border: none;
                        border-radius: 5px;
                        cursor: pointer;
                        text-decoration: none;
                    }

                    .button:hover {
                        background-color: #010057; /* Darker blue for hover effect */
                    }
                </style>
            </head>
    """
    html_content += f"""
            <body>
                <div class="container">
                    <h1>Welcome {"" if status is NEW_REGISTER else "back"} to E-Shop!</h1>
                    <p>You have to verify your email to complete your registration.</p>
                    <a href="{link}" class="button">Verify Email</a>
                </div>
            </body>
            </html>

    """
    return html_content







# addOrderItems
QTY = 'qty'
PRICE = 'price'
PAYMENT_METHOD = 'paymentMethod'
ORDER_ITEMS = 'orderItems'
SHIPPING_ADDRESS = 'shippingAddress'
ADDRESS = 'address'
CITY = 'city'
COUNTRY = 'country'
POSTAL_CODE = 'postalCode'
TOTAL_PRICE = 'totalPrice'
TAX_PRICE = 'taxPrice'
SHIPPING_PRICE = 'shippingPrice'
PRODUCT = 'product'
ERROR_ORDER_ITEMS = 'No order items provided!. Please add items to your order.'
ERROR_PAYMENT_METHOD = 'Payment method is required.'
ERROR_PRICES = 'Tax price, shipping price and total price are required.'
REQUIRED_SHIPPING_FIELDS = [ADDRESS, CITY, COUNTRY, POSTAL_CODE]


def ERROR_SHIPPING_ADDRESS_FIELD(field: str):
    return f"Shipping address field '{field}' is required!"


# getOrderById
ERROR_ORDER_NOT_FOUND = 'Oops, Order not found!'

# getMyOrders
ERROR_ORDERS_NOT_FOUND = 'Oops, No orders found for you!'


# IPG constants
MORE_DETAILS = '\nMore details:%(e)s'
FAILED = 'failed'
MERCHANT = 'merchant'
AMOUNT = 'amount'
CALLBACK_URL = 'callbackUrl'
ORDER_ID = 'orderId'
TRACK_ID = 'trackId'
RESULT = 'result'
SUCCESS = 'success'
LINK = 'paymentLink'
STATUS = 'status'
CARD_NO = 'cardNumber'
PAID_AT = 'paidAt'
VERIFIED_AT = 'verifiedAt'
CREATED_AT_Z = 'createdAt'
DESCRIPTION = 'description'
REF_NO = 'refNumber'
MSG = 'message'
INQUIRY = 'inquiry'

IS_PAY_SUCCESSFUL = 'isPaySuccessful'
IS_INQUIRY_SUCCESSFUL = 'isInquirySuccessful'


ZIBAL_DOMAIN_IPG_START_PAY = 'https://gateway.zibal.ir/start/'
ZIBAL_DOMAIN_IPG = 'https://gateway.zibal.ir/v1/'
REQUEST_PATH = 'request/'
VERIFY_PATH = 'verify/'
INQUIRY_PATH = 'inquiry/'


# Error of IPG
UNKNOWN_ERROR = 'Unknown Error!'
ERROR_TRANSACTION_CREATE_DB = "Oops, Transaction didn't store, Contact support!"
ERROR_ORDER_PAID = 'Oops, Order has already been paid!'
ERROR_ZIBAL_SERVER_CONNECTION = 'Oops, The Zibal server connection was not established!'
ERROR_TRANSACTION_PROCESSING = 'Oops, something went wrong on transaction processing!'
ERROR_UPDATE_TRANSACTION = 'Error updating payment entry.'
ERROR_COMPLETE_TRANSACTION_INFO = 'Error complete payment entry info.'
ERROR_TRANSACTION_DETAILS_INVALID = 'Oops, Transaction details are not valid!'
ERROR_TRANSACTION_DETAILS_NOT_FOUND = 'Oops, Transaction details not found!'
ERROR_UNABLE_GENERATE_PAYMENT_TOKEN = 'Oops, Unable to generate payment token. All possibilities used!'
ERROR_GENERATING_PAYMENT_TOKEN = 'Unable to generate and store payment token!'
ERROR_REGISTRATION_PAYMENT_CONFIRMED = "Oops, There was an error registering the payment confirmation. Please try again later or contact support if the issue persists."


def MAKE_PAYMENT_LINK(trackId: str) -> str:
    return f'{ZIBAL_DOMAIN_IPG_START_PAY}{trackId}/'


def PAY_RESULT_REDIRECT(token: str, db_status: bool | None = None) -> str:
    url = f'{settings.FRONTEND_DOMAIN}/pay-result/{token}'
    if db_status is None:
        url += '?db=Null'
    else:
        url += f'?db={db_status}'
    return url


# Signal Constants
def HTML_TEMPLATE_NEW_USER_ALERT(user) -> str:
    html_content = """
    <html>
        <style>
            h3 {
                font-size: 1.5rem;
            }

            td {
                    
                font-size: 1.1rem;
            }
        </style>
    """
    html_content += f"""
        <body style="background-color: #152238; color: #E0E0E0; font-family: 'Consolas'; padding: 20px;">
                <div style="max-width: 600px; margin: 0 auto; background-color: #192841; border-radius: 8px; padding:10px 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
                    <h2 style="
                        padding-bottom:30px;
                        color: #E0E0E0;
                        text-align: center;
                        border-bottom: 2px solid #1c2e4a;">
                        User Details
                    </h2>
                <table style="width: 100%; border-collapse: collapse;">
                    <tbody>
                        <tr>
                            <td style="padding: 12px; color: #B0BEC5; border-bottom: 1px solid #1c2e4a;">Email</td>
                            <td style="padding: 12px; color: #E3F2FD; border-bottom: 1px solid #1c2e4a;">{user.email}</td>
                        </tr>
                        <tr style="background-color: #203354;">
                            <td style="padding: 12px; color: #B0BEC5; border-bottom: 1px solid #1c2e4a;">Name</td>
                            <td style="padding: 12px; color: #E3F2FD; border-bottom: 1px solid #1c2e4a;">{user.first_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 12px; color: #B0BEC5;">Date Joined</td>
                            <td style="padding: 12px; color: #E3F2FD;">{user.date_joined.strftime('%d-%m-%Y %H:%M:%S')}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </body>
    </html>\
    """
    return html_content


def HTML_TEMPLATE_NEW_ORDER_ALERT(user, order, orderItems, itemsPrice) -> str:
    html_content = f"""\
    <html>
    <body style="background-color: #152238; color: #E0E0E0; font-family: 'Consolas'; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #192841; border-radius: 8px; padding:10px 30px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);">
            <h2 style="
                padding-bottom:30px;
                color: #E0E0E0;
                text-align: center;
                border-bottom: 2px solid #1c2e4a;">
                Order Details
            </h2>
                <p style="color: #E3F2FD;">User: {user.username}</p>
                <p style="color: #E3F2FD;">Order ID: #{order._id}</p>
                <hr style="border: 1px solid #1c2e4a; margin: 10px 0;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead>
                        <tr style="background-color: #23395d;">
                            <th style="padding: 12px; text-align: left; color: #FFFFFF; border-bottom: 2px solid #1c2e4a;">Item Name</th>
                            <th style="padding: 12px; text-align: left; color: #FFFFFF; border-bottom: 2px solid #1c2e4a; text-align:center">Quantity</th>
                            <th style="padding: 12px; text-align: left; color: #FFFFFF; border-bottom: 2px solid #1c2e4a; text-align:center">Price</th>
                        </tr>
                    </thead>
                    <tbody>
    """

    for item in orderItems:
        html_content += f"""\
                        <tr style="background-color: #203354;">
                            <td style="padding: 12px; color: #B0BEC5; border-bottom: 1px solid #1c2e4a; vertical-align: middle;">{item.name}</td>
                            <td style="padding: 12px; color: #E3F2FD; border-bottom: 1px solid #1c2e4a; text-align: center; vertical-align: middle;">{item.qty}</td>
                            <td style="padding: 12px; color: #E3F2FD; border-bottom: 1px solid #1c2e4a; text-align: center; vertical-align: middle;">{item.price}</td>
                        </tr>
        """
    html_content += f"""\
                    </tbody>
                </table>
                <hr style="border: 1px solid #1c2e4a; margin: 10px 0;">
                <p style="color: #E3F2FD;">Total Price of Items: {itemsPrice}</p>
            </div>
        </body>
    </html>\
    """
    return html_content




UNEXPECTED_ERROR = 'Unexpected error occurred!'