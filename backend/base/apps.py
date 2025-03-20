from django.apps import AppConfig


# Define the BaseConfig class to configure the 'base' application
class BaseConfig(AppConfig):
    # Specify the default type for primary key fields in models
    default_auto_field = 'django.db.models.BigAutoField'

    # Name of the application; should match the folder name
    name = 'base'

    # Override the ready() method to execute startup code
    def ready(self):
        # Import the signals module to connect signal handlers to their respective signals
        import base.signals

