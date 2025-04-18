import logging
import os
from django.db.models.signals import pre_save, post_save, post_delete
from django.dispatch import Signal
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.core.mail import send_mail
from django.conf import settings
from base.models import Product
from base.strConst import (
    HTML_TEMPLATE_NEW_USER_ALERT,
    HTML_TEMPLATE_NEW_ORDER_ALERT,
    ERROR_ON_SENDING_EMAIL,
    MORE_DETAILS,
)


# pre_save is triggered before a model's save() method is called
# Listen for the pre_save signal for the User model
@receiver(pre_save, sender=User)
def updateUsername(sender, instance, **kwargs):
    # The instance represents the User object being saved
    user = instance

    # If the user's email field is not empty, update the username to match the email
    if user.email != '':
        user.username = user.email
        # Print a message for debugging or logging purposes
        # print(user, 'updated!')


# Signal to trigger an alert whenever a new user is created
@receiver(post_save, sender=User)
def newUserAlert(sender, instance, created, **kwargs):
    user = instance  # Get the instance of the user being created
    if created:  # Check if this is a newly created user (not an update)
        # Generate the HTML content for the email notification
        html_content = HTML_TEMPLATE_NEW_USER_ALERT(user)
        try:
            # Send a notification email to the admin for the new user
            send_mail(
                "E-SHOP | NEW USER",  # Subject of the email
                "",  # Plain text content (not provided in this case)
                settings.EMAIL_HOST_USER,  # Sender's email address
                ["admin@e.com"],  # Recipient email(s)
                html_message=html_content,  # HTML content of the email
            )
        except Exception as e:
            # Log an error if the email fails to send
            logging.error(ERROR_ON_SENDING_EMAIL + MORE_DETAILS % {'e': e})


# Custom signal to handle order creation
order_created = Signal()


# Signal handler to trigger an alert when an order is created
@receiver(order_created)
def newOrderAlert(sender, **kwargs):
    # Retrieve order and user information from the signal arguments
    order = kwargs.get("order")
    user = kwargs.get("user")

    # Get all items in the order and calculate the total price
    orderItems = order.orderitem_set.all()
    itemsPrice = sum(item.qty * item.price for item in orderItems)

    # Generate the HTML content for the email notification
    html_content = HTML_TEMPLATE_NEW_ORDER_ALERT(
        user, order, orderItems, itemsPrice)

    try:
        # Send a notification email to the admin about the new order
        send_mail(
            "E-SHOP | NEW ORDER",  # Subject of the email
            "",  # Plain text content (not provided in this case)
            settings.EMAIL_HOST_USER,  # Sender's email address
            ["admin@e.com"],  # Recipient email(s)
            html_message=html_content,  # HTML content of the email
        )
    except Exception as e:
        # Log an error if the email fails to send
        logging.error(ERROR_ON_SENDING_EMAIL + MORE_DETAILS % {'e': e})


@receiver(post_delete, sender=Product)
def delete_product_image(sender, instance, **kwargs):
    # Check if the instance has an image file
    if instance.image:
        image_path = instance.image.path  # Get the image file path
        # Check if the file exists and delete it
        if os.path.exists(image_path):
            os.remove(image_path)
