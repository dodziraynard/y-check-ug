# Generated by Django 4.1.7 on 2024-03-18 13:04

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0021_alter_user_content_hash'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='content_hash',
            field=models.CharField(blank=True, max_length=128, null=True),
        ),
    ]
