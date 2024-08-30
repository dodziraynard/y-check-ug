# Generated by Django 5.1 on 2024-08-30 21:30

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0105_alter_facility_options_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='question',
            name='related_label',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='questions', to='dashboard.flaglabel'),
        ),
    ]
