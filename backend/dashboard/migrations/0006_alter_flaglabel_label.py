# Generated by Django 4.1.7 on 2023-09-23 08:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_rename_adolescentsummaryflag_summaryflag'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flaglabel',
            name='label',
            field=models.CharField(db_index=True, max_length=50, unique=True),
        ),
    ]
