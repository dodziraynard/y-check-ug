# Generated by Django 4.1.7 on 2023-12-09 14:13

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0014_remove_user_uuid'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='id',
            field=models.CharField(db_index=True, default=uuid.uuid4, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
    ]
