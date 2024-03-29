# Generated by Django 4.1.7 on 2023-12-01 22:40

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0004_remove_user_uuid'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='localnode',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AddField(
            model_name='user',
            name='synced',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='user',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
    ]
