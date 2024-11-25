from django.contrib.auth.models import User


def createActivationLink(user: User) -> str:
    pass


def createEmail(status: str, activationLink: str, user: User) -> dict:
    pass


def sendEmail(email: dict) -> bool:
    pass
