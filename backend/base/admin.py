from django.contrib import admin
from .models import *


@admin.register(Zibal)
class ZibalAdmin(admin.ModelAdmin):
    readonly_fields = (
        'trackId', 'lastStatus', 'refNumber', 'amountCreated',
        'amountPaid', 'description', 'cardNumber', 'createdAt_Z',
        'verifiedAt', 'paidAt', 'createdAt', 'updatedAt', 'order', 'user'
    )


@admin.register(PaymentToken)
class PaymentTokenAdmin(admin.ModelAdmin):
    readonly_fields = ('token', 'trackId', 'orderId')


admin.site.register(Product)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
