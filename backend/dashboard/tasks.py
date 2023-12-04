import logging
import requests
from celery import shared_task
from ycheck.utils.constants import SyncStatus
from setup.models import NodeConfig


logger = logging.getLogger("app")


@shared_task()  # Will be run periodically.
def sync_data():
    config, _ = NodeConfig.objects.get_or_create()
    can_connect = False
    if config.is_local and config.sync_enabled and config.up_stream_host:
        can_connect = requests.get(config.up_stream_host).status_code == 200

    # If can connect to up-stream server
    if can_connect:
        sync_adolescents.delay()
        sync_treatments.delay()
        sync_referrals.delay()
        sync_users.delay()
    elif config.is_local and config.sync_enabled:
        config.general_sync_message = "Couldn't connect to upstream server."
        config.save()
    elif config.is_local and not config.up_stream_host:
        config.general_sync_message = "No upstream host configured."
        config.save()
    elif config.is_local and not config.sync_enabled:
        config.general_sync_message = "Syncing is disabled."
        config.save()


@shared_task()
def sync_users():
    config, _ = NodeConfig.objects.get_or_create()
    if config.users_sync_status == SyncStatus.PROGRESS.value:
        return


@shared_task()
def sync_adolescents():
    config, _ = NodeConfig.objects.get_or_create()
    if config.adolescents_sync_status == SyncStatus.PROGRESS.value:
        return


@shared_task()
def sync_treatments():
    config, _ = NodeConfig.objects.get_or_create()
    if config.treatments_sync_status == SyncStatus.PROGRESS.value:
        return


@shared_task()
def sync_referrals():
    config, _ = NodeConfig.objects.get_or_create()
    if config.referrals_sync_status == SyncStatus.PROGRESS.value:
        return
