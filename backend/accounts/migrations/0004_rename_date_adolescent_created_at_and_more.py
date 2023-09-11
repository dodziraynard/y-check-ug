# Generated by Django 4.1.7 on 2023-09-10 08:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0003_user_security_answer_1_user_security_answer_2'),
    ]

    operations = [
        migrations.RenameField(
            model_name='adolescent',
            old_name='date',
            new_name='created_at',
        ),
        migrations.RemoveField(
            model_name='adolescent',
            name='age_confirmation',
        ),
        migrations.RemoveField(
            model_name='adolescent',
            name='resident_status',
        ),
        migrations.RemoveField(
            model_name='adolescent',
            name='year',
        ),
        migrations.AddField(
            model_name='adolescent',
            name='uuid',
            field=models.UUIDField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='uuid',
            field=models.UUIDField(blank=True, null=True),
        ),
    ]
