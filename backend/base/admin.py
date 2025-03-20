from django.contrib import admin
from .models import (
    Zibal, PaymentToken, Product,
    Review, Order, OrderItem, ShippingAddress
)


# Register the Zibal model with the admin site and define a custom admin interface
@admin.register(Zibal)
class ZibalAdmin(admin.ModelAdmin):
    # Make the following fields read-only in the admin interface
    readonly_fields = (
        'trackId',       # The unique track ID for the transaction
        'lastStatus',    # The last status of the transaction
        'refNumber',     # The reference number provided by the payment gateway
        'amountCreated',  # The amount initially created for the transaction
        'amountPaid',    # The amount actually paid by the user
        'description',   # Description or notes for the transaction
        'cardNumber',    # The card number used for the transaction
        'createdAt_Z',   # The date and time the transaction was created (Zibal-specific)
        'verifiedAt',    # The date and time the transaction was verified
        'paidAt',        # The date and time the payment was made
        'createdAt',     # The date and time the record was created
        'updatedAt',     # The date and time the record was last updated
        'order',         # The associated order
        'user'           # The user who made the transaction
    )


# Register the PaymentToken model with the admin site and define a custom admin interface
@admin.register(PaymentToken)
class PaymentTokenAdmin(admin.ModelAdmin):
    # Make the following fields read-only in the admin interface
    readonly_fields = (
        'token',     # The unique payment token
        'trackId',   # The track ID associated with the token
        'orderId'    # The order ID associated with the payment
    )


# Register additional models with the admin site using default configurations
admin.site.register(Product)          # Register the Product model
admin.site.register(Review)           # Register the Review model
admin.site.register(Order)            # Register the Order model
admin.site.register(OrderItem)        # Register the OrderItem model
admin.site.register(ShippingAddress)  # Register the ShippingAddress model
