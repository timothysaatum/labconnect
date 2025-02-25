from django.apps import AppConfig


class ModelmixinsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'modelmixins'

    def ready(self):
        import modelmixins.signals