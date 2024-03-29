# Generated by Django 4.1.7 on 2023-09-23 07:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0003_flagcolor_color_name'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flagcondition',
            name='operator',
            field=models.CharField(choices=[('equal_expected_value', 'equal_expected_value'), ('less_than_expected_integer_value', 'less_than_expected_integer_value'), ('q1_q2_difference_is_equal_to_expected_integer_value', 'q1_q2_difference_is_equal_to_expected_integer_value'), ('q1_q2_difference_is_less_than_expected_integer_value', 'q1_q2_difference_is_less_than_expected_integer_value'), ('min_age', 'min_age'), ('gender_is', 'gender_is')], max_length=100),
        ),
    ]
