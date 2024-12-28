DETAIL = 'detail'

# User
SUCCESS_NEW_REGISTER = 'Welcome to E-Shop, You should verify your email. Please check your Inbox we sent an activation email.'
ERROR_USER_EXISTS_IS_NOT_ACTIVE = 'Oops, User with this email already exists but is not active. You should verify your email. Please check your Inbox we sent an activation email.'
ERROR_USER_EXISTS_IS_ACTIVE_TOO = 'Oops, User with this email already exists and is active too. Please sign in to your account !'

# Product
ERROR_PRODUCT_NOT_FOUND = 'Oops, Product not found!'
ERROR_PRODUCTS_NOT_REGISTERED = 'Oops, No product registered yet!'


# Email
NEW_REGISTER = 'new_register'
IS_NOT_ACTIVE = 'is_not_active'
ERROR_ON_SENDING_EMAIL = 'Oops, there is a problem on sending email!'
EMAIL_SUBJECT = '[ E-Shop Activation Email ]'


def EMAIL_BODY(status: str, link: str, name: str) -> str:
    return f'Hi {name}, Welcome {"" if status is NEW_REGISTER else "back"} to E-Shop. Please click on below link to active your account in E-Shop.\n\n{link}'


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
