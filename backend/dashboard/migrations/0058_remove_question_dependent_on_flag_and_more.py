# Generated by Django 4.1.7 on 2024-01-01 01:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0057_alter_question_dependent_on_flag'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='question',
            name='dependent_on_flag',
        ),
        migrations.RemoveField(
            model_name='question',
            name='expected_flag_color',
        ),
        migrations.AddField(
            model_name='previousresponserequirement',
            name='dependent_on_flag',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='dashboard.flagcolor'),
        ),
        migrations.AddField(
            model_name='previousresponserequirement',
            name='expected_flag_color',
            field=models.CharField(blank=True, choices=[('#808080', 'GREY'), ('#ff0000', 'RED'), ('#ffa500', 'ORANGE'), ('#00ff00', 'GREEN')], max_length=10, null=True),
        ),
    ]
