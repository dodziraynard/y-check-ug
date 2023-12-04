from django.db import models

from ycheck.utils.constants import SyncStatus


class MobileConfig(models.Model):
    show_create_account = models.BooleanField(default=False)


class NodeConfig(models.Model):

    SYNC_STATUS = [
        (SyncStatus.IDLE.value, SyncStatus.IDLE.value),
        (SyncStatus.PROGRESS.value, SyncStatus.PROGRESS.value),
        (SyncStatus.COMPLETED.value, SyncStatus.COMPLETED.value),
    ]

    node_name = models.CharField(max_length=100, default="Node1")
    is_local = models.BooleanField(default=False)
    up_stream_host = models.URLField(null=True, blank=True)
    sync_enabled = models.BooleanField(default=True)

    adolescents_sync_status = models.CharField(max_length=200)
    treatments_sync_status = models.CharField(max_length=200)
    referrals_sync_status = models.CharField(max_length=200)
    users_sync_status = models.CharField(max_length=100, choices=SYNC_STATUS)

    general_sync_message = models.TextField(null=True, blank=True)


class SetupPerm(models.Model):

    class Meta:
        managed = False
        default_permissions = ()
        permissions = [
            ('manage_setup', 'Can manage setup'),
            ('manage_users', 'Can manage users'),
            ('view_dashboard', 'Can view dashboard'),
            ('view_system_configuration', 'Can view system configuration'),
            ("access_all_referrals", "Can access all referrals"),
            ("access_all_patients", "Can access all patients"),
            ("access_treatments", "Can access all treatment records"),

            # User
            ("view_user", "Can view user"),
            ("add_user", "Can add user"),
            ("edit_user", "Can edit user"),
            ("delete_user", "Can delete user"),

            # Patient Management
            ("add_patient", "Can add new patient records"),
            ("view_patient", "Can view patient records"),
            ("edit_patient", "Can edit existing patient records"),
            ("delete_patient", "Can delete patient records"),

            # System configuration
            ("manage_service", "Can manage services"),
            ("manage_facility", "Can manage facility"),
            ("edit_system_config", "Can edit and update system configurations"),
        ]
