from django.apps import AppConfig
from django.db.utils import OperationalError



class AccountsConfig(AppConfig):
    name = 'accounts'

    def ready(self):
        import accounts.signals
        try:
            from .models import SecurityQuestion
            questions = [
                "What is your mother's maiden name?",
                "What was the name of your first pet?"
            ]

            for question_text in questions:
                SecurityQuestion.objects.get_or_create(question=question_text)
        except OperationalError:
            pass