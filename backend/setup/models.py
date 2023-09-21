from django.db import models


class SetupPerm(models.Model):

    class Meta:
        managed = False
        default_permissions = ()
        permissions = [
            ('manage_setup', 'Can manage setup'),
            ('manage_users', 'Can manage users'),
            ('view_dashboard', 'Can view dashboard'),
            ('view_system_configuration', 'Can view system configuration'),
            ("manage_tasks", "Can manage tasks"),
            ("manage_other_report", "Can manage other reports"),
            ("manage_roles", "Can manage roles"),

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

            # System Configuration
            ("access_system_config", "Can access system configurations"),
            ("edit_system_config", "Can edit and update system configurations"),
        ]
