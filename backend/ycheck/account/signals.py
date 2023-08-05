from django.db.models.signals import post_save
from .models import Adolescent, ActivityLog, User




def log_created_user(sender, instance, created, **kwargs):
    if created:
        ActivityLog.objects.create(username=instance.username,
        action='User created')



def log_adolescent_update(sender, instance, **kwargs):
    if instance.questionnaire_completed:
        ActivityLog.objects.create(username=instance.last_updated_by.username,
        action=f"Completed questionnaire for adolescent with PID {instance.pid}")
    else:
        ActivityLog.objects.create(username=instance.last_updated_by.username,
        action=f"Updated questionnaire for adolescent with PID {instance.pid}")




post_save.connect(log_created_user, sender=User)
post_save.connect(log_created_user, sender=Adolescent)
