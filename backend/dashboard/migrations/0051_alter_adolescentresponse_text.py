# Generated by Django 4.1.7 on 2023-12-11 23:10

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0050_alter_adolescentresponse_text'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adolescentresponse',
            name='text',
            field=models.CharField(blank=True, default='', max_length=200, null=True),
        ),
    ]
