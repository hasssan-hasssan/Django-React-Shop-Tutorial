from django.db.models.signals import pre_save
from django.contrib.auth.models import User
from django.dispatch import receiver


# pre_save is triggered before a model's save() method is called
# Listen for the pre_save signal for the User model
@receiver(pre_save, sender=User)
def updateUsername(sender, instance, **kwargs):
    # The instance represents the User object being saved
    user = instance

    # If the user's email field is not empty, update the username to match the email
    if user.email != '':
        user.username = user.email
        print(user, 'updated!')  # Print a message for debugging or logging purposes
