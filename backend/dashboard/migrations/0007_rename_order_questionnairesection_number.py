# Generated by Django 4.1.7 on 2023-09-15 22:20

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0006_alter_question_number'),
    ]

    operations = [
        migrations.RenameField(
            model_name='questionnairesection',
            old_name='order',
            new_name='number',
        ),
    ]
