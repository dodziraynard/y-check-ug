# Generated by Django 4.1.7 on 2023-11-17 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0028_adolescent_grade_adolescent_residential_status_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='adolescent',
            name='leaves_in_catchment',
            field=models.CharField(blank=True, max_length=200, null=True),
        ),
    ]
