from django.db.models.signals import post_save, pre_save
from .models import Adolescent, ActivityLog, User




def log_created_user(sender, instance, created, **kwargs):
    if created:
        username = instance.username if isinstance(instance, User) else instance.last_updated_by.username
        ActivityLog.objects.create(username=username, action='User created')




def log_adolescent_update(sender, instance, **kwargs):
    if instance.questionnaire_completed:
        ActivityLog.objects.create(username=instance.last_updated_by.username,
        action=f"Completed questionnaire for adolescent with PID {instance.pid}")
    else:
        ActivityLog.objects.create(username=instance.last_updated_by.username,
        action=f"Updated questionnaire for adolescent with PID {instance.pid}")



def generate_and_validate_adolescent_pid(sender, instance, **kwargs):
    if not instance.pid:
        prefix = instance.adolescent_type
        max_pid = Adolescent.objects.filter(pid__startswith=prefix).aggregate(max_pid=models.Max('pid'))['max_pid']
        next_pid_number = int(max_pid[2:]) + 1 if max_pid else 1
        instance.pid = f'{prefix}{next_pid_number:05}'

    if Adolescent.objects.exclude(pk=instance.pk).filter(pid=instance.pid).exists():
        raise ValidationError(f"The PID {instance.pid} already exists.")



pre_save.connect(generate_and_validate_adolescent_pid, sender=Adolescent)
post_save.connect(log_created_user, sender=User)
post_save.connect(log_created_user, sender=Adolescent)

