# Generated by Django 4.1.7 on 2024-04-09 05:36

import dashboard.models.mixin
from django.db import migrations, models
import uuid_extensions.uuid7


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0092_referral_is_onsite_and_more'),
    ]

    operations = [
        migrations.CreateModel(
            name='DeletionBackLog',
            fields=[
                ('id', models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True)),
                ('uuid', models.UUIDField(default=uuid_extensions.uuid7, null=True)),
                ('localnode', models.CharField(blank=True, max_length=100, null=True)),
                ('synced', models.BooleanField(default=False)),
                ('content_hash', models.CharField(blank=True, max_length=128, null=True)),
                ('model_name', models.CharField(max_length=100)),
                ('object_id', models.CharField(max_length=120)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'abstract': False,
            },
            bases=(dashboard.models.mixin.UpstreamSyncMethodsModel, models.Model),
        ),
    ]
