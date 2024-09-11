import os

from django.db import models
from django.dispatch import receiver

from dashboard.cache import Cache
from dashboard.models import (
    Question,
    Option,
    Adolescent,
    ConditionTreatment,
    DeletionBackLog,
    PreviousResponseRequirement,
    FlagCondition,
    FlagColor,
)

cache = Cache()


@receiver(models.signals.pre_save, sender=Question)
def auto_delete_redundant_audios_images_for_questions(sender, instance,
                                                      **kwargs):
    if not instance.id:
        return False
    try:
        old_image = Question.objects.get(pk=instance.id).image

        old_audio = Question.objects.get(pk=instance.id).audio_file

    except Question.DoesNotExist:
        return False

    # Delete old image
    new_image = instance.image
    if not old_image == new_image and old_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)

    # Delete old audio
    new_audio = instance.audio_file
    if not old_audio == new_audio and old_audio:
        if os.path.isfile(old_audio.path):
            os.remove(old_audio.path)


@receiver(models.signals.pre_save, sender=Option)
def auto_delete_redundant_audios_images_for_questions(sender, instance,
                                                      **kwargs):
    if not instance.id:
        return False
    try:
        old_image = Option.objects.get(pk=instance.id).image

        old_audio = Option.objects.get(pk=instance.id).audio_file

    except Option.DoesNotExist:
        return False

    # Delete old image
    new_image = instance.image
    if not old_image == new_image and old_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)

    # Delete old audio
    new_audio = instance.audio_file
    if not old_audio == new_audio and old_audio:
        if os.path.isfile(old_audio.path):
            os.remove(old_audio.path)


@receiver(models.signals.pre_save, sender=Adolescent)
def auto_delete_redundant_images_for_adolescent(sender, instance, **kwargs):
    if not instance.id:
        return False
    try:
        old_image = Adolescent.objects.get(pk=instance.id).picture

    except Adolescent.DoesNotExist:
        return False

    # Delete old image
    new_image = instance.picture
    if not old_image == new_image and old_image:
        if os.path.isfile(old_image.path):
            os.remove(old_image.path)


@receiver(models.signals.post_delete, sender=ConditionTreatment)
@receiver(models.signals.post_delete, sender=Adolescent)
def create_sync_deletion_backlog(sender, instance, **kwargs):
    DeletionBackLog.objects.create(model_name=str(sender.__name__).lower(),
                                   object_id=instance.id)


@receiver(models.signals.post_delete, sender=PreviousResponseRequirement)
@receiver(models.signals.post_delete, sender=Adolescent)
@receiver(models.signals.post_delete, sender=Question)
@receiver(models.signals.post_delete, sender=FlagCondition)
@receiver(models.signals.post_delete, sender=FlagColor)
@receiver(models.signals.post_save, sender=Question)
@receiver(models.signals.post_save, sender=Option)
@receiver(models.signals.post_save, sender=Adolescent)
@receiver(models.signals.post_save, sender=PreviousResponseRequirement)
def delete_summary_flag(sender, instance, **kwargs):
    cache.delete_with_matching_pattern("summaryflag*")
