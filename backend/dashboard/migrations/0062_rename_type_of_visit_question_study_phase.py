# Generated by Django 4.1.7 on 2024-01-06 15:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0061_alter_previousresponserequirement_question'),
    ]

    operations = [
        migrations.RenameField(
            model_name='question',
            old_name='type_of_visit',
            new_name='study_phase',
        ),
    ]
