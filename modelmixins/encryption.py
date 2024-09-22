from django.db import models
from django.conf import settings
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from cryptography.fernet import Fernet
import base64

class AESEncryptedField(models.TextField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.key = settings.ENCRYPTION_KEY.encode()  # Make sure to set this in your settings.py

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        try:
            iv = base64.b64decode(value[:24])
            encrypted_data = base64.b64decode(value[24:])
            cipher = AES.new(self.key, AES.MODE_CBC, iv)
            decrypted = unpad(cipher.decrypt(encrypted_data), AES.block_size)
            return decrypted.decode('utf-8')
        except Exception:
            return None

    def to_python(self, value):
        return self.from_db_value(value, None, None)

    def get_prep_value(self, value):
        if value is None:
            return value
        value = str(value)
        iv = AES.new(self.key, AES.MODE_CBC).iv
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        encrypted_data = cipher.encrypt(pad(value.encode(), AES.block_size))
        return base64.b64encode(iv).decode() + base64.b64encode(encrypted_data).decode()

class FernetEncryptedField(models.TextField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fernet = Fernet(settings.FERNET_KEY)  # Make sure to set this in your settings.py

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        try:
            return self.fernet.decrypt(value.encode()).decode()
        except Exception:
            return None

    def to_python(self, value):
        return self.from_db_value(value, None, None)

    def get_prep_value(self, value):
        if value is None:
            return value
        return self.fernet.encrypt(str(value).encode()).decode()