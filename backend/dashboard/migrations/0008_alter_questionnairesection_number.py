# Generated by Django 4.1.7 on 2023-09-15 22:20

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0007_rename_order_questionnairesection_number'),
    ]

    operations = [
        migrations.AlterField(
            model_name='questionnairesection',
            name='number',
            field=models.IntegerField(unique=True),
        ),
    ]