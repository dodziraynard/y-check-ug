# Generated by Django 4.1.7 on 2023-11-18 21:09

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('setup', '0004_alter_setupperm_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='MobileConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('show_create_account', models.BooleanField(default=False)),
            ],
        ),
    ]
