# Generated by Django 4.1.7 on 2023-12-09 14:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('setup', '0010_nodeconfig_adolescents_upload_status_message'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nodeconfig',
            name='adolescents_upload_status_message',
            field=models.TextField(blank=True, null=True),
        ),
    ]
