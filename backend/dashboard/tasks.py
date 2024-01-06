import json
import logging
import requests
from accounts.models import User
from dashboard.models import *
from celery import shared_task
from ycheck.utils.constants import SyncStatus
from setup.models import NodeConfig
from dashboard.models.mixin import UpstreamSyncBaseModel
from django.db.utils import IntegrityError

logger = logging.getLogger(__name__)


@shared_task()
def download_all_setup_data():
    config, _ = NodeConfig.objects.get_or_create()

    config.general_sync_message = "Downloading users"
    config.save()
    logger.debug("Download triggered by: download_users_from_upstream")

    download_entities_from_upstream("facility", Facility)
    download_users_from_upstream()

    config.general_sync_message = "Downloading questions"
    config.save()
    logger.debug("Download triggered by: download_questions_from_upstream")
    download_questions_from_upstream()

    config.general_sync_message = "Downloading facilities"
    config.save()

    config.general_sync_message = "Downloading services"
    config.save()
    downloaded_services = download_entities_from_upstream("service", Service)

    config.general_sync_message = "Downloading flag label"
    config.save()
    downloaded_labels = download_entities_from_upstream("flaglabel", FlagLabel)

    config.general_sync_message = "Downloading flag colours"
    config.save()
    downloaded_colours = download_entities_from_upstream(
        "flagcolor", FlagColor)

    config.general_sync_message = "Downloading flag conditions"
    config.save()
    downloaded_conditions = download_entities_from_upstream(
        "flagcondition", FlagCondition)

    config.general_sync_message = "Downloading checkup locations"
    config.save()
    downloaded_locations = download_entities_from_upstream(
        "checkuplocation", CheckupLocation)

    if all([downloaded_services,
            downloaded_labels, downloaded_colours, downloaded_conditions, downloaded_locations]):
        config.general_sync_message = "Setup entities downloaded"
    else:
        config.general_sync_message = "Some setup entities couldn't be downloaded"

    config.save()


@shared_task()
def download_users_from_upstream():
    config, _ = NodeConfig.objects.get_or_create()
    if not config.up_stream_host:
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
                    UpstreamSyncBaseModel.deserialise_into_object(
                        User, user_dict)
                except IntegrityError as e:
                    user_id = user_dict.get("surname")
                    surname = user_dict.get("other_names")
                    other_names = user_dict.get("id")
                    print("error", user_id, surname,
                          other_names, type(e), str(e))
                    continue
                config.users_download_status_message = f"Downloaded {index}/{total_users}, {int(index/total_users*100)}%"
                config.save()
            config.users_download_status = SyncStatus.COMPLETED.value
        else:
            config.users_download_status_message = "User query request failed."
            config.users_download_status = SyncStatus.FAILED.value
    except Exception as e:
        logger.exception("User download failed with error %s", str(e))
        config.users_download_status_message = f"Error occured: {str(e)}"
        config.users_download_status = SyncStatus.FAILED.value
    finally:
        config.save()


@shared_task()
def download_questions_from_upstream():
    logger.debug("download_questions_from_upstream triggered.")
    config, _ = NodeConfig.objects.get_or_create()
    if not config.up_stream_host:
        logger.info("No host or syncing already in progress.")
        return

    logger.debug("Download questiongroup.")
    download_entities_from_upstream("questiongroup", QuestionGroup)

    logger.debug("Download section.")
    sections_donwnloaded = download_entities_from_upstream("section", Section)
    if not sections_donwnloaded:
        logger.debug("All sections couldn't be downloaded.")
        config.questions_download_status_message = "Couldn't download all sections."
        config.questions_download_status = SyncStatus.FAILED.value
        config.save()
        return False

    url = config.up_stream_host + "/api/sync/download/question/"
    try:
        config.questions_download_status = SyncStatus.PROGRESS.value
        config.save()
        response = requests.get(url)
        if response.status_code == 200:
            users = response.json().get("data")
            total_users = len(users)
            for index, user_dict in enumerate(users, 1):
                UpstreamSyncBaseModel.deserialise_into_object(
                    Question, user_dict)
                config.questions_download_status_message = f"Downloaded {index}/{total_users}, {int(index/total_users*100)}%"
                config.save()

            options_donwnloaded = download_entities_from_upstream(
                "option", Option)
            if not options_donwnloaded:
                config.questions_download_status_message = "Couldn't download all options"
                config.questions_download_status = SyncStatus.FAILED.value

            download_entities_from_upstream("flaglabel", FlagLabel)

            previous_req_donwnloaded = download_entities_from_upstream(
                "previousresponserequirement", PreviousResponseRequirement)
            if not previous_req_donwnloaded:
                config.questions_download_status_message = "Couldn't download previous response requirements for the questions."
                config.questions_download_status = SyncStatus.FAILED.value
            else:
                config.questions_download_status_message = "Questions downloaded."
                config.questions_download_status = SyncStatus.COMPLETED.value
            config.save()
        else:
            config.questions_download_status_message = "User query request failed."
            config.questions_download_status = SyncStatus.FAILED.value
    except Exception as e:
        logger.exception(
            "Error occured while downloading questions: %s", str(e))
        config.questions_download_status_message = f"Error occured: {str(e)}"
        config.questions_download_status = SyncStatus.FAILED.value
    finally:
        config.questions_download_status = SyncStatus.FAILED.value
        config.save()


def download_entities_from_upstream(model_name, model):
    logger.info(f"Tiggered download for {model_name}")

    config, _ = NodeConfig.objects.get_or_create()
    if not config.up_stream_host:
        logger.info("No host or syncing already in progress.")
        return False
    url = config.up_stream_host + f"/api/sync/download/{model_name}/"
    response = requests.get(url)
    if response.status_code == 200:
        data_items = response.json().get("data")
        logger.info("Retrieved %s: %s items", model_name, len(data_items))
        for data_dict in data_items:
            obj = UpstreamSyncBaseModel.deserialise_into_object(
                model, data_dict)
            logger.info("Downloaded %s: %s", model_name, str(obj))
        return True
    return False


def prepare_entity_files(objects: list[UpstreamSyncBaseModel], model_name: str) -> dict | None:
    logger.debug("Upload all %s files triggered.", model_name)
    config, _ = NodeConfig.objects.get_or_create()
    if not config.up_stream_host:
        logger.debug(
            "No hosts configured or %s upload already in process", model_name)
        return

    failed_ids = []
    for item in objects:
        url = config.up_stream_host + \
            f"/api/sync/upload-file/{model_name}/{item.id}"

        fields = item.get_file_fields()
        for field in fields:
            file = getattr(item, field)
            if not file:
                continue
            file = file.path
            files = {'file': open(file, 'rb')}
            values = {"field_name": field}
            response = requests.post(url, files=files, data=values)
            if not (response.status_code == 200 and response.json().get("success")):
                failed_ids.append(item.id)

    objects.exclude(id__in=list(set(failed_ids))).update(synced=True)


def upload_entity_and_update_status(model: UpstreamSyncBaseModel, model_name: str, status_field: str):
    logger.debug("Upload all %s entities triggered.", model_name)

    config, _ = NodeConfig.objects.get_or_create()
    if not config.up_stream_host:
        logger.debug(
            "No hosts configured or %s upload already in process", model_name)
        return
    setattr(config, status_field, SyncStatus.PROGRESS.value)
    setattr(config, f"{status_field}_message", "")
    config.save()

    url = config.up_stream_host + f"/api/sync/upload/{model_name}/"
    objects: list[UpstreamSyncBaseModel] = model.objects.filter(synced=False)
    data = {"data_items": json.dumps([obj.serialise() for obj in objects])}
    response = requests.post(url, data=data)
    if response.status_code == 200:
        response = response.json()
        success_ids = response.get("success_ids", [])
        logger.debug("%s %s entities uploaded successfully",
                     str(len(success_ids)), model_name)

        error_message = response.get("error_message")
        updated_objects = objects.filter(id__in=success_ids)
        if error_message:
            logger.debug("Server errored: %s", error_message)
            setattr(config, f"{status_field}_message", error_message)

        # Now upload files associated with the objects.
        prepare_entity_files(updated_objects, model_name)
    else:
        logger.debug("Request to %s returned %s",
                     url, response.content.decode())
        setattr(config, f"{status_field}_message", response.content.decode())
    setattr(config, status_field, SyncStatus.IDLE.value)
    config.save()


@shared_task()
def upload_treatments():
    upload_entity_and_update_status(
        Treatment, "treatment", "treatments_upload_status")


@shared_task()
def upload_referrals():
    upload_entity_and_update_status(
        Referral, "referral", "referrals_upload_status")


@shared_task()
def upload_adolescents():
    upload_entity_and_update_status(
        Adolescent, "adolescent", "adolescents_upload_status")

    upload_entity_and_update_status(AdolescentResponse, "adolescentresponse", "adolescents_upload_status")
