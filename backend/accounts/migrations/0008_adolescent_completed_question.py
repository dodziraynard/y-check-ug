# Generated by Django 4.1.7 on 2023-09-15 21:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0007_alter_adolescent_pid'),
    ]

    operations = [
        migrations.AddField(
            model_name='adolescent',
            name='completed_question',
            field=models.BooleanField(default=False),
        ),
    ]