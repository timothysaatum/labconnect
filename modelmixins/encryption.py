from django.db import models
from django.conf import settings
from Crypto.Cipher import AES
from Crypto.Util.Padding import pad, unpad
from cryptography.fernet import Fernet
import base64
from Crypto.Random import get_random_bytes
from .key_management import KeyManagement




class AESEncryptedField(models.TextField):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.key = settings.ENCRYPTION_KEY.encode()[:32]  # Ensure key is 32 bytes

    def get_key(self):
        return base64.urlsafe_b64decode(KeyManagement.get_current_key())[:32]

    def from_db_value(self, value, expression, connection):
        if value is None:
            return value
        try:

            # key = self.get_key()
            encrypted_data = base64.b64decode(value)
            iv = encrypted_data[:16]
            ciphertext = encrypted_data[16:]
            cipher = AES.new(self.key, AES.MODE_CBC, iv)
            decrypted = unpad(cipher.decrypt(ciphertext), AES.block_size)
            return decrypted.decode('utf-8')
        except Exception as e:
            print(f"Decryption error: {e}")
            return None

    def to_python(self, value):
        return self.from_db_value(value, None, None)

    def get_prep_value(self, value):
        if value is None:
            return value
        
        # KeyManagement.rotate_key_if_needed()
        # key = self.get_key()
        value = str(value)
        value = str(value)
        iv = get_random_bytes(16)
        cipher = AES.new(self.key, AES.MODE_CBC, iv)
        encrypted_data = cipher.encrypt(pad(value.encode(), AES.block_size))
        return base64.b64encode(iv + encrypted_data).decode()



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

