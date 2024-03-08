from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _



class ClientManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):
        """
        Creates and saves a User with the given email, date of
        birth and password.
        """
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=self.normalize_email(email),
            **extra_fields,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, phone_number, password=None):
        """
        Creates and saves a superuser with the given email, date of
        birth and password.
        """
        user = self.create_user(
            email,
            password=password,
            phone_number=phone_number,
        )
        user.is_admin = True
        user.is_staff = True
        is_active = True
        user.save(using=self._db)
        return user
