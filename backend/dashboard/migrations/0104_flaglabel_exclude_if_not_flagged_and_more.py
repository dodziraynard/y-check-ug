# Generated by Django 5.0.4 on 2024-08-18 19:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0103_remove_flaglabel_exclude_if_not_flagged'),
    ]

    operations = [
        migrations.AddField(
            model_name='flaglabel',
            name='exclude_if_not_flagged',
            field=models.BooleanField(default=False),
        ),
        migrations.AddField(
            model_name='question',
            name='exclude_if_not_flagged',
            field=models.BooleanField(blank=True, default=False, null=True),
        ),
    ]
