# Generated by Django 4.2 on 2024-02-28 21:24

from django.db import migrations, models
import uuid_extensions.uuid7


class Migration(migrations.Migration):

    dependencies = [
        ("dashboard", "0072_alter_section_question_type"),
    ]

    operations = [
        migrations.CreateModel(
            name="AppConfiguration",
            fields=[
                (
                    "id",
                    models.CharField(
                        db_index=True,
                        default=uuid_extensions.uuid7,
                        max_length=120,
                        primary_key=True,
                        serialize=False,
                        unique=True,
                    ),
                ),
                (
                    "uuid",
                    models.UUIDField(default=uuid_extensions.uuid7, null=True),
                ),
                ("localnode", models.CharField(blank=True, max_length=100, null=True)),
                ("synced", models.BooleanField(default=False)),
                ("created_at", models.DateTimeField(auto_now_add=True)),
                ("updated_at", models.DateTimeField(auto_now=True)),
                (
                    "android_apk",
                    models.FileField(blank=True, null=True, upload_to="apks/"),
                ),
                ("current_apk_versions", models.CharField(default="", max_length=11)),
            ],
            options={
                "abstract": False,
            },
        ),
    ]
