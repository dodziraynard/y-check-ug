# Generated by Django 4.1.7 on 2023-12-10 12:26

from django.db import migrations, models
import uuid_extensions


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0016_user_uuid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='user',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
    ]
