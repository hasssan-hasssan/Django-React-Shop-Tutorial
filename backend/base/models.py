from secrets import token_urlsafe
from django.db import models, IntegrityError
from django.contrib.auth.models import User
from base.strConst import ERROR_UNABLE_GENERATE_PAYMENT_TOKEN


class Product(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True)
    image = models.ImageField(null=True, blank=True, upload_to='products/')
    brand = models.CharField(max_length=200, null=True, blank=True)
    category = models.CharField(max_length=200, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    numReviews = models.IntegerField(null=True, blank=True, db_default=0)
    rating = models.DecimalField(
        max_digits=3, decimal_places=2, null=True, blank=True)
    price = models.DecimalField(
        max_digits=9, decimal_places=2, null=True, blank=True)
    countInStock = models.IntegerField(null=True, blank=True, db_default=0)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.name)


class Review(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    rating = models.IntegerField(null=True, blank=True, db_default=0)
    comment = models.TextField(null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.rating)


class Order(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    paymentMethod = models.CharField(max_length=200, null=True, blank=True)
    taxPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)
    totalPrice = models.DecimalField(
        max_digits=9, decimal_places=2, null=True, blank=True)
    isPaid = models.BooleanField(db_default=False)
    paidAt = models.DateTimeField(auto_now_add=False, null=True, blank=True)
    isDelivered = models.BooleanField(db_default=False)
    deliveredAt = models.DateTimeField(
        auto_now_add=False, null=True, blank=True)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.createdAt)


class OrderItem(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    product = models.ForeignKey(Product, on_delete=models.SET_NULL, null=True)
    order = models.ForeignKey(Order, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=200, null=True, blank=True)
    qty = models.IntegerField(null=True, blank=True, db_default=0)
    price = models.DecimalField(
        max_digits=9, decimal_places=2, null=True, blank=True)
    image = models.CharField(max_length=200, null=True, blank=True)

    def __str__(self):
        return str(self.name)


class ShippingAddress(models.Model):
    _id = models.AutoField(primary_key=True, editable=False)
    order = models.OneToOneField(
        Order, on_delete=models.CASCADE, null=True, blank=True)
    address = models.CharField(max_length=200, null=True, blank=True)
    city = models.CharField(max_length=200, null=True, blank=True)
    postalCode = models.CharField(max_length=200, null=True, blank=True)
    country = models.CharField(max_length=200, null=True, blank=True)
    shippingPrice = models.DecimalField(
        max_digits=7, decimal_places=2, null=True, blank=True)

    def __str__(self):
        return str(self.address)


class Zibal(models.Model):
    class Meta:
        verbose_name_plural = 'Zibal Payments'

    _id = models.AutoField(primary_key=True, editable=False)
    trackId = models.IntegerField(unique=True)
    lastStatus = models.SmallIntegerField(null=True, blank=True)
    refNumber = models.BigIntegerField(null=True, blank=True)
    amountCreated = models.IntegerField(null=True, blank=True)
    amountPaid = models.IntegerField(null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    cardNumber = models.CharField(max_length=16, null=True, blank=True)
    createdAt_Z = models.DateTimeField(null=True, blank=True)
    verifiedAt = models.DateTimeField(null=True, blank=True)
    paidAt = models.DateTimeField(null=True, blank=True)
    createdAt = models.DateTimeField(null=True, blank=True)
    updatedAt = models.DateTimeField(null=True, blank=True)
    # multiplexingInfos = models.JSONField(null=True, blank=True)
    # wage = models.SmallIntegerField(null=True, blank=True)
    order = models.ForeignKey(
        Order, on_delete=models.SET_NULL, null=True, blank=True)
    user = models.ForeignKey(
        User, on_delete=models.SET_NULL, null=True, blank=True)

    def __str__(self):
        return str(self.trackId)


class PaymentToken(models.Model):
    class Meta:
        verbose_name_plural = 'Zibal Payments Token'

    _id = models.AutoField(primary_key=True, editable=False)
    token = models.CharField(max_length=40, unique=True)
    trackId = models.CharField(max_length=255)
    orderId = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.token

    def save(self, *args, **kwargs):
        max_attempts = 5
        attempt = 0

        while attempt < max_attempts:
            try:
                token = token_urlsafe(30)
                self.token = token
                super().save(*args, **kwargs)
                return None
            except IntegrityError:
                attempt += 1
                if attempt == max_attempts:
                    raise ValueError(ERROR_UNABLE_GENERATE_PAYMENT_TOKEN)
