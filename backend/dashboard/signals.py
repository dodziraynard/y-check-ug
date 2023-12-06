import os

from django.db import models
from django.dispatch import receiver

from dashboard.models import Question, Option


@receiver(models.signals.pre_save, sender=Question)
def audo_delete_redundant_audios_images_for_questions(sender, instance, **kwargs):
    if not instance.id:
        return False
    try:
        old_image = Question.objects.get(
            pk=instance.id).image

        old_audio = Question.objects.get(
            pk=instance.id).audio_file

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
def audo_delete_redundant_audios_images_for_questions(sender, instance, **kwargs):
    if not instance.id:
        return False
    try:
        old_image = Option.objects.get(
            pk=instance.id).image

        old_audio = Option.objects.get(
            pk=instance.id).audio_file

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
