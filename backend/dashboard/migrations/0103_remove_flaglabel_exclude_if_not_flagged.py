# Generated by Django 5.0.4 on 2024-08-18 18:17

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0102_flaglabel_exclude_if_not_flagged_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='flaglabel',
            name='exclude_if_not_flagged',
        ),
    ]
