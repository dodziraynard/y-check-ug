# Generated by Django 5.0.4 on 2024-06-08 14:30

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0095_alter_summaryflag_comment'),
    ]

    operations = [
        migrations.AddField(
            model_name='adolescent',
            name='process_status',
            field=models.CharField(choices=[('pending', 'pending'), ('completed', 'completed')], default='pending', max_length=50),
        ),
    ]
