# Generated by Django 4.1.7 on 2023-09-23 08:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0009_remove_summaryflag_adolescen flag_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='summaryflag',
            name='name',
            field=models.CharField(db_index=True, max_length=50),
        ),
    ]