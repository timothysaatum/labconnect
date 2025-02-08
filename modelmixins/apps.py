from django.apps import AppConfig
# from django.db.models.signals import pre_save


class ModelmixinsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modelmixins'

    # def ready(self):
    #     from sample.models import Sample  # import your model
    #     pre_save.connect(self.rotate_key_if_needed, sender=Sample)

    # def rotate_key_if_needed(self, sender, **kwargs):
    #     from .key_management import KeyManagement
    #     KeyManagement.rotate_key_if_needed()
