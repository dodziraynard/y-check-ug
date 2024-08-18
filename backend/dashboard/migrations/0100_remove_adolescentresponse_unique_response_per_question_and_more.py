# Generated by Django 5.0.4 on 2024-08-17 16:38

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0099_computedaverageactivitytime_end_date_and_more'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.RemoveConstraint(
            model_name='adolescentresponse',
            name='Unique response per question',
        ),
        migrations.RemoveConstraint(
            model_name='summaryflag',
            name='Adolescent flag',
        ),
        migrations.AddField(
            model_name='adolescentresponse',
            name='study_phase',
            field=models.CharField(blank=True, choices=[('pilot', 'pilot'), ('implementation', 'implementation'), ('followup', 'followup')], max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='flaglabel',
            name='exclude_study_phase',
            field=models.CharField(blank=True, choices=[('pilot', 'pilot'), ('implementation', 'implementation'), ('followup', 'followup')], max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='question',
            name='exclude_study_phase',
            field=models.CharField(blank=True, choices=[('pilot', 'pilot'), ('implementation', 'implementation'), ('followup', 'followup')], max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='section',
            name='exclude_study_phase',
            field=models.CharField(blank=True, choices=[('pilot', 'pilot'), ('implementation', 'implementation'), ('followup', 'followup')], max_length=50, null=True),
        ),
        migrations.AddField(
            model_name='summaryflag',
            name='study_phase',
            field=models.CharField(blank=True, choices=[('pilot', 'pilot'), ('implementation', 'implementation'), ('followup', 'followup')], max_length=50, null=True),
        ),
        migrations.AddConstraint(
            model_name='adolescentresponse',
            constraint=models.UniqueConstraint(fields=('adolescent', 'question', 'study_phase'), name='unique_response_per_question_per_study_phase.'),
        ),
        migrations.AddConstraint(
            model_name='summaryflag',
            constraint=models.UniqueConstraint(fields=('adolescent', 'label', 'study_phase'), name='unique_summary_flag_per_study_phase'),
        ),
    ]
