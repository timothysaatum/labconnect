from django.apps import AppConfig # type: ignore


class LabsConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'labs'

    def ready(self):
        import labs.signals
