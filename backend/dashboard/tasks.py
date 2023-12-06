import logging
import requests
from accounts.models import User
from dashboard.models import *
from celery import shared_task
from ycheck.utils.constants import SyncStatus
from setup.models import NodeConfig
from dashboard.models.mixin import UpstreamSyncBaseModel
from django.db.utils import IntegrityError

logger = logging.getLogger("app")


@shared_task()  # Will be run periodically.
def sync_all_data():
    config, _ = NodeConfig.objects.get_or_create()
    can_connect = False
    if config.is_local and config.sync_enabled and config.up_stream_host:
        can_connect = requests.get(config.up_stream_host).status_code == 200

    # If can connect to upstream server
    if can_connect:
        upload_adolescents.delay()
        upload_treatments.delay()
        upload_referrals.delay()
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
def download_all_setup_data():
    config, _ = NodeConfig.objects.get_or_create()

    config.general_sync_message = "Downloading users"
    config.save()
    downloaded_users = download_users_from_upstream()

    config.general_sync_message = "Downloading questions"
    config.save()
    downloaded_questions = download_questions_from_upstream()

    config.general_sync_message = "Downloading facilities"
    config.save()
    downloaded_facilities = download_entities_from_upstream("facility", Facility)

    config.general_sync_message = "Downloading services"
    config.save()
    downloaded_services = download_entities_from_upstream("service", Service)

    config.general_sync_message = "Downloading flag label"
    config.save()
    downloaded_labels = download_entities_from_upstream("flaglabel", FlagLabel)

    config.general_sync_message = "Downloading flag colours"
    config.save()
    downloaded_colours = download_entities_from_upstream("flagcolor", FlagColor)

    config.general_sync_message = "Downloading flag conditions"
    config.save()
    downloaded_conditions = download_entities_from_upstream("flagcondition", FlagCondition)

    config.general_sync_message = "Downloading checkup locations"
    config.save()
    downloaded_locations = download_entities_from_upstream("checkuplocation", CheckupLocation)
    
    if all([downloaded_users, downloaded_questions,downloaded_services, 
            downloaded_labels, downloaded_colours, downloaded_conditions, downloaded_locations]):
        config.general_sync_message = "Setup entities downloaded"
    else:
        config.general_sync_message = "Some setup entities couldn't be downloaded"
    
    config.save()


@shared_task()
def download_users_from_upstream():
    config, _ = NodeConfig.objects.get_or_create()
    if not config.up_stream_host or config.users_download_status == SyncStatus.PROGRESS.value:
        logger.info("No host or syncing already in progress.")
        return
    url = config.up_stream_host + "/api/sync/download/user/"
    try:
        config.users_download_status = SyncStatus.PROGRESS.value
        config.save()
        response = requests.get(url)
        if response.status_code == 200:
            users = response.json().get("data")
            total_users = len(users)
            for index, user_dict in enumerate(users, 1):
                try:
                    UpstreamSyncBaseModel.deserialise_into_object(User, user_dict)
                except IntegrityError as e:
                    print("error", type(e), str(e))
                    continue
                config.users_download_status_message = f"Downloaded {index}/{total_users}, {int(index/total_users*100)}%"
                config.save()
            config.users_download_status = SyncStatus.COMPLETED.value
        else:
            config.users_download_status_message = "User query request failed."
            config.users_download_status = SyncStatus.FAILED.value
    except Exception as e:
        print("error", type(e), str(e))
        config.users_download_status_message = f"Error occured: {str(e)}"
        config.users_download_status = SyncStatus.FAILED.value
    finally:
        config.save()

    
@shared_task()
def download_questions_from_upstream():
    config, _ = NodeConfig.objects.get_or_create()
    if not config.up_stream_host or config.questions_download_status == SyncStatus.PROGRESS.value:
        logger.info("No host or syncing already in progress.")
        return
    
    sections_donwnloaded = download_entities_from_upstream("section", Section)
    if not sections_donwnloaded:
        config.questions_download_status_message = "Couldn't download all sections."
        config.questions_download_status = SyncStatus.FAILED.value
        config.save()
        return

    url = config.up_stream_host + "/api/sync/download/question/"
    try:
        config.questions_download_status = SyncStatus.PROGRESS.value
        config.save()
        response = requests.get(url)
        if response.status_code == 200:
            users = response.json().get("data")
            total_users = len(users)
            for index, user_dict in enumerate(users, 1):
                UpstreamSyncBaseModel.deserialise_into_object(Question, user_dict)
                config.questions_download_status_message = f"Downloaded {index}/{total_users}, {int(index/total_users*100)}%"
                config.save()
            
            options_donwnloaded = download_entities_from_upstream("option", Option)
            if not options_donwnloaded:
                config.questions_download_status_message = "Couldn't download all options"
                config.questions_download_status = SyncStatus.FAILED.value
            
            previous_req_donwnloaded = download_entities_from_upstream("previousresponserequirement", PreviousResponseRequirement)
            if not previous_req_donwnloaded:
                config.questions_download_status_message = "Couldn't download previous response requirements for the questions."
                config.questions_download_status = SyncStatus.FAILED.value
            else:
                config.questions_download_status = SyncStatus.COMPLETED.value
            config.save()
        else:
            config.questions_download_status_message = "User query request failed."
            config.questions_download_status = SyncStatus.FAILED.value
    except Exception as e:
        print("Error", e)
        config.questions_download_status_message = f"Error occured: {str(e)}"
        config.questions_download_status = SyncStatus.FAILED.value
    finally:
        config.questions_download_status = SyncStatus.FAILED.value
        config.save()


def download_entities_from_upstream(entity_name, model):
    config, _ = NodeConfig.objects.get_or_create()
    if not config.up_stream_host or config.questions_download_status == SyncStatus.PROGRESS.value:
        logger.info("No host or syncing already in progress.")
        return False
    url = config.up_stream_host + f"/api/sync/download/{entity_name}/"
    response = requests.get(url)
    if response.status_code == 200:
        data_items = response.json().get("data")
        for data_dict in data_items:
            print("data_dict", data_dict)
            obj = UpstreamSyncBaseModel.deserialise_into_object(model, data_dict)
            print("Downloaded ", obj)
        return True
    return False

@shared_task()
def upload_adolescents():
    config, _ = NodeConfig.objects.get_or_create()
    if config.adolescents_sync_status == SyncStatus.PROGRESS.value:
        return


@shared_task()
def upload_treatments():
    config, _ = NodeConfig.objects.get_or_create()
    if config.treatments_sync_status == SyncStatus.PROGRESS.value:
        return


@shared_task()
def upload_referrals():
    config, _ = NodeConfig.objects.get_or_create()
    if config.referrals_sync_status == SyncStatus.PROGRESS.value:
        return
