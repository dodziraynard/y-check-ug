# Generated by Django 4.1.7 on 2024-02-05 21:26

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0065_adolescent_lang_iso_option_audio_file_fat_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flagcondition',
            name='expected_integer_value',
            field=models.DecimalField(blank=True, decimal_places=2, max_digits=20, null=True),
        ),
    ]
