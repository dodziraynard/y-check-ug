# Generated by Django 4.1.7 on 2024-03-19 10:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('setup', '0014_alter_setupperm_options'),
    ]

    operations = [
        migrations.AlterField(
            model_name='nodeconfig',
            name='up_stream_host',
            field=models.URLField(blank=True, default='', null=True),
        ),
    ]