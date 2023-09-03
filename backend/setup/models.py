from django.db import models


class SetupPerm(models.Model):

    class Meta:
        managed = False
        default_permissions = ()
        permissions = [

            ('manage_setup', 'Can manage setup'),
            ('manage_users', 'Can manage users'),
            ('view_main_dashboard', 'Can view main dashboard'),
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
            

            # Appointment Management
            ("schedule_appointment", "Can schedule new appointments"),
            ("view_appointment", "Can view appointments"),
            ("reschedule_appointment", "Can reschedule appointments"),
            ("cancel_appointment", "Can cancel appointments"),


            # Medical Records Management
            ("add_medical_record", "Can add new medical records"),
            ("view_medical_record", "Can view medical records"),
            ("edit_medical_record", "Can edit medical records"),
            ("delete_medical_record", "Can delete medical records"),
            

            # Recommended Actions
            ("recommend_adolescent", "Can recommend adolescent"),


            # Report Management
            ("view_reports", "Can view various system reports"),
            ("generate_reports", "Can generate specific reports"),


            # System Configuration
            ("access_system_config", "Can access system configurations"),
            ("edit_system_config", "Can edit and update system configurations"),







        ]
