# Generated by Django 4.1.7 on 2023-09-23 08:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0010_alter_summaryflag_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='summaryflag',
            name='updated_color_code',
            field=models.CharField(blank=True, max_length=10, null=True),
        ),
    ]