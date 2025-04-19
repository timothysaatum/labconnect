from django.conf import settings
import pyotp



def generateotp():

    secret_key = pyotp.random_base32()
    totp = pyotp.TOTP(secret_key, interval=180, digits=6)
    otp = totp.now()

    return otp


