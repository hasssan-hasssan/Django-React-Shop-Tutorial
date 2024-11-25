from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from django.urls import reverse
from django.conf import settings
from django.core.mail import EmailMessage
from base.views.user_views import verifyEmail
from base.strConst import *


def createActivationLink(user: User) -> str:
    token: str = str(RefreshToken.for_user(user).access_token)
    link: str = f'{settings.BACKEND_DOMAIN}{
        reverse(verifyEmail, kwargs={'token': token})}'
    return link


def createEmail(status: str, activationLink: str, user: User) -> dict:
    email: dict = {}
    email['subject'] = EMAIL_SUBJECT
    email['body'] = EMAIL_BODY(status, activationLink, user.username)
    email['to'] = user.email
    return email


def sendEmail(data: dict) -> bool:
    try:
        email = EmailMessage(
            subject=data['subject'],
            body=data['body'],
            from_email=settings.EMAIL_HOST_USER,
            to=[data['to']]
        )
        email.send()
        return True
    except:
        return False
