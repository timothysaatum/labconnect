from django.core.cache import cache
from django.utils import timezone
from cryptography.fernet import Fernet
from datetime import timedelta

class KeyManagement:
    KEY_CACHE_NAME = 'encryption_key'
    KEY_ROTATION_INTERVAL = timedelta(days=30)  # Rotate key every 30 days

    @classmethod
    def get_current_key(cls):
        key = cache.get(cls.KEY_CACHE_NAME)
        if not key:
            key = cls.generate_new_key()
        return key

    @classmethod
    def generate_new_key(cls):
        new_key = Fernet.generate_key()
        cache.set(cls.KEY_CACHE_NAME, new_key, timeout=None)
        cls.log_key_generation()
        return new_key

    @classmethod
    def rotate_key_if_needed(cls):
        last_rotation = cache.get('last_key_rotation')
        if not last_rotation or timezone.now() - last_rotation > cls.KEY_ROTATION_INTERVAL:
            cls.generate_new_key()
            cache.set('last_key_rotation', timezone.now())
            cls.log_key_rotation()

    @classmethod
    def log_key_generation(cls):
        
        pass

    @classmethod
    def log_key_rotation(cls):
        
        pass