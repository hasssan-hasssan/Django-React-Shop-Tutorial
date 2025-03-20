from secrets import token_urlsafe
from django.db import models, IntegrityError
from django.contrib.auth.models import User
from base.strConst import ERROR_UNABLE_GENERATE_PAYMENT_TOKEN


# Define the Product model to represent items in the catalog
class Product(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)  # Auto-generated primary key
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # Creator of the product
    name = models.CharField(max_length=200, null=True)  # Name of the product
    image = models.ImageField(null=True, blank=True, upload_to='products/')  # Product image
    brand = models.CharField(max_length=200, null=True, blank=True)  # Product brand
    category = models.CharField(max_length=200, null=True, blank=True)  # Product category
    description = models.TextField(null=True, blank=True)  # Product description
    numReviews = models.IntegerField(null=True, blank=True, db_default=0)  # Number of reviews
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)  # Product rating
    price = models.DecimalField(max_digits=9, decimal_places=2, null=True, blank=True)  # Product price
    countInStock = models.IntegerField(null=True, blank=True, db_default=0)  # Available stock count
    createdAt = models.DateTimeField(auto_now_add=True)  # Creation timestamp

    def __str__(self):
        return str(self.name)  # String representation of the product


# Define the Review model to represent product reviews
class Review(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)  # Auto-generated primary key
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)  # Associated product
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # Reviewer
    name = models.CharField(max_length=200, null=True, blank=True)  # Name of the reviewer
    rating = models.IntegerField(null=True, blank=True, db_default=0)  # Review rating
    comment = models.TextField(null=True, blank=True)  # Review comment
    createdAt = models.DateTimeField(auto_now_add=True)  # Creation timestamp

    def __str__(self):
        return str(self.rating)  # String representation of the review


# Define the Order model to represent purchase orders
class Order(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)  # Auto-generated primary key
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)  # Order's owner
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)  # Payment method used
    taxPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)  # Tax amount
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)  # Shipping cost
    totalPrice = models.DecimalField(max_digits=9, decimal_places=2, null=True, blank=True)  # Total order price
    isPaid = models.BooleanField(db_default=False)  # Payment status
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)  # Payment timestamp
    isDelivered = models.BooleanField(db_default=False)  # Delivery status
    deliveredAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)  # Delivery timestamp
    createdAt = models.DateTimeField(auto_now_add=True)  # Creation timestamp

    def __str__(self):
        return str(self.createdAt)  # String representation of the order


# Define the OrderItem model to represent items in an order
class OrderItem(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)  # Auto-generated primary key
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)  # Associated product
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)  # Associated order
    name = models.CharField(max_length=200, null=True, blank=True)  # Name of the product
    qty = models.IntegerField(null=True, blank=True, db_default=0)  # Quantity ordered
    price = models.DecimalField(max_digits=9, decimal_places=2, null=True, blank=True)  # Price per item
    image = models.CharField(max_length=200, null=True, blank=True)  # Image URL

    def __str__(self):
        return str(self.name)  # String representation of the order item


# Define the ShippingAddress model to store order shipping details
class ShippingAddress(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)  # Auto-generated primary key
    order = models.OneToOneField(Order, on_delete=models.CASCADE, null=True, blank=True)  # Associated order
    address = models.CharField(max_length=200, null=True, blank=True)  # Street address
    city = models.CharField(max_length=200, null=True, blank=True)  # City
    postalCode = models.CharField(max_length=200, null=True, blank=True)  # Postal/ZIP code
    country = models.CharField(max_length=200, null=True, blank=True)  # Country
    shippingPrice = models.DecimalField(max_digits=7, decimal_places=2, null=True, blank=True)  # Shipping cost

    def __str__(self):
        return str(self.address)  # String representation of the address


# Define the Zibal model to store Zibal payment transaction details
class Zibal(models.Model):
    class Meta:
        # Set the plural name for admin interface
        verbose_name_plural = 'Zibal Payments'

    _id = models.AutoField(primary_key=True, editable=False)  # Auto-generated primary key
    trackId = models.IntegerField(unique=True)  # Unique transaction ID
    lastStatus = models.SmallIntegerField(null=True, blank=True)  # Last transaction status
    refNumber = models.BigIntegerField(null=True, blank=True)  # Reference number from Zibal
    amountCreated = models.IntegerField(null=True, blank=True)  # Initial transaction amount
    amountPaid = models.IntegerField(null=True, blank=True)  # Amount paid
    description = models.TextField(null=True, blank=True)  # Transaction description
    cardNumber = models.CharField(max_length=16, null=True, blank=True)  # Card number used
    createdAt_Z = models.DateTimeField(null=True, blank=True)  # Transaction creation timestamp in Zibal
    verifiedAt = models.DateTimeField(null=True, blank=True)  # Verification timestamp
    paidAt = models.DateTimeField(null=True, blank=True)  # Payment timestamp
    createdAt = models.DateTimeField(null=True, blank=True)  # Record creation timestamp
    updatedAt = models.DateTimeField(null=True, blank=True)  # Record update timestamp
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True, blank=True)  # Associated order
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)  # Associated user

    def __str__(self):
        return str(self.trackId)  # String representation of the transaction


# Define the PaymentToken model to store payment tokens for Zibal
class PaymentToken(models.Model):
    class Meta:
        # Set the plural name for admin interface
        verbose_name_plural = 'Zibal Payments Token'

    _id = models.AutoField(primary_key=True, editable=False)  # Auto-generated primary key
    token = models.CharField(max_length=40, unique=True)   # Unique payment token
    trackId = models.CharField(max_length=255)  # Associated transaction track ID
    orderId = models.CharField(max_length=255)  # Associated order ID
    createdAt = models.DateTimeField(auto_now_add=True)  # Creation timestamp

    def __str__(self):
        return self.token  # String representation of the token

    def save(self, *args, **kwargs):
        max_attempts = 5  # Maximum number of attempts to generate a unique token
        attempt = 0

        while attempt < max_attempts:
            try:
                # Generate a secure token
                token = token_urlsafe(30)
                self.token = token
                # Attempt to save the token to the database
                super().save(*args, **kwargs)
                return None
            except IntegrityError:  # Handle collision with an existing token
                attempt += 1
                if attempt == max_attempts:
                    # Raise an error if unable to generate a unique token
                    raise ValueError(ERROR_UNABLE_GENERATE_PAYMENT_TOKEN)
