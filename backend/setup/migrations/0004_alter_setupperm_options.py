# Generated by Django 4.1.7 on 2023-10-07 08:37

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('setup', '0003_alter_setupperm_options'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='setupperm',
            options={'default_permissions': (), 'managed': False, 'permissions': [('manage_setup', 'Can manage setup'), ('manage_users', 'Can manage users'), ('view_dashboard', 'Can view dashboard'), ('view_system_configuration', 'Can view system configuration'), ('manage_tasks', 'Can manage tasks'), ('manage_other_report', 'Can manage other reports'), ('manage_roles', 'Can manage roles'), ('access_all_referrals', 'Can access all referrals'), ('view_user', 'Can view user'), ('add_user', 'Can add user'), ('edit_user', 'Can edit user'), ('delete_user', 'Can delete user'), ('add_patient', 'Can add new patient records'), ('view_patient', 'Can view patient records'), ('edit_patient', 'Can edit existing patient records'), ('delete_patient', 'Can delete patient records'), ('manage_service', 'Can manage services'), ('manage_facility', 'Can manage facility'), ('edit_system_config', 'Can edit and update system configurations')]},
        ),
    ]