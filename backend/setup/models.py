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
            


            # Medical Records Management
            ("add_medical_record", "Can add new medical records"),
            ("view_medical_record", "Can view medical records"),
            ("edit_medical_record", "Can edit medical records"),
            ("delete_medical_record", "Can delete medical records"),
            

            # Recommended Actions
            ("recommend_adolescent", "Can recommend adolescent"),

        ]
