# Generated by Django 4.1.7 on 2024-03-10 23:21

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0078_flagcondition_gender'),
    ]

    operations = [
        migrations.AlterField(
            model_name='flagcondition',
            name='operator',
            field=models.CharField(choices=[('equal_expected_value', 'equal_expected_value'), ('less_than_expected_integer_value', 'less_than_expected_integer_value'), ('q1_q2_difference_is_equal_to_expected_integer_value', 'q1_q2_difference_is_equal_to_expected_integer_value'), ('q1_q2_difference_is_less_than_expected_integer_value', 'q1_q2_difference_is_less_than_expected_integer_value'), ('min_age', 'min_age'), ('range_sum_between', 'range_sum_between'), ('time_difference_between', 'time_difference_between'), ('gender_is', 'gender_is'), ('invoke_bmi_sd_function', 'invoke_bmi_sd_function'), ('group_value_between', 'group_value_between'), ('compute_right_grip_test', 'compute_right_grip_test'), ('compute_left_grip_test', 'compute_left_grip_test'), ('compute_anaemia_status', 'compute_anaemia_status'), ('compute_vision_status', 'compute_vision_status')], max_length=100),
        ),
    ]