# Generated by Django 4.1.7 on 2024-04-09 07:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0093_deletionbacklog'),
    ]

    operations = [
        migrations.AlterField(
            model_name='conditiontreatment',
            name='comment',
            field=models.TextField(blank=True, null=True),
        ),
    ]
