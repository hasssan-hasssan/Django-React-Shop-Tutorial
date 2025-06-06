import logging
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.urls import reverse
from django.conf import settings
from django.core.mail import EmailMessage
from base.strConst import (
    EMAIL_SUBJECT, 
    MORE_DETAILS,
    ERROR_ON_SENDING_EMAIL, 
    HTML_TEMPLATE_VERIFICATION_EMAIL, 
)



def createActivationLink(user: User) -> str:
    """
        Function to create an activation link for user email verification
    """
    
    # Generate a refresh token for the user and extract the access token as a string
    token: str = str(RefreshToken.for_user(user).access_token)
    # Build the activation link using the backend domain and the 'verifyEmail' route with the token as a parameter
    link: str = f'{settings.BACKEND_DOMAIN}{reverse("verifyEmail", kwargs={"token": token})}'
    return link  # Return the generated activation link


# Function to construct an email dictionary with necessary details
def createEmail(status: str, activationLink: str, user: User) -> dict:
    """
        Function to construct an email dictionary with necessary details
    """
    
    email: dict = {}  # Initialize an empty dictionary for the email details
    email['subject'] = EMAIL_SUBJECT  # Set the subject of the email
    # Set the body of the email with the status, link, and username
    email['body'] = HTML_TEMPLATE_VERIFICATION_EMAIL(status, activationLink)
    email['to'] = user.email  # Set the recipient's email address
    return email  # Return the constructed email dictionary


def sendEmail(data: dict) -> bool:
    """
        Function to send an email using the provided data
    """
    
    try:
        # Create an email message with the specified subject, body, sender, and recipient
        email = EmailMessage(
            subject=data['subject'],
            body=data['body'],
            # Sender's email address (configured in settings)
            from_email=settings.EMAIL_HOST_USER,
            to=[data['to']]  # Recipient's email address (as a list)
        )
        email.content_subtype = 'html' # Specify that the email body is in HTML format
        email.send()  # Send the email
        return True  # Return True if the email was sent successfully
    except Exception as e:
        # Log an error message if email sending fails
        logging.error(ERROR_ON_SENDING_EMAIL + MORE_DETAILS % {'e': e})
        return False  # Return False to indicate failure
