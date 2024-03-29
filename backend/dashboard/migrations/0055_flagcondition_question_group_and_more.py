# Generated by Django 4.1.7 on 2023-12-30 15:48

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0054_questiongroup_question_dependent_on_flag_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='flagcondition',
            name='question_group',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='flag_conditions', to='dashboard.questiongroup'),
        ),
        migrations.AddField(
            model_name='question',
            name='util_function_tag',
            field=models.CharField(blank=True, choices=[('bmi_height', 'bmi_height'), ('bmi_weight', 'bmi_weight')], max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='flagcondition',
            name='operator',
            field=models.CharField(choices=[('equal_expected_value', 'equal_expected_value'), ('less_than_expected_integer_value', 'less_than_expected_integer_value'), ('q1_q2_difference_is_equal_to_expected_integer_value', 'q1_q2_difference_is_equal_to_expected_integer_value'), ('q1_q2_difference_is_less_than_expected_integer_value', 'q1_q2_difference_is_less_than_expected_integer_value'), ('min_age', 'min_age'), ('range_sum_between', 'range_sum_between'), ('gender_is', 'gender_is'), ('invoke_bmi_sd_function', 'invoke_bmi_sd_function'), ('group_value_between', 'group_value_between')], max_length=100),
        ),
        migrations.AlterField(
            model_name='flagcondition',
            name='question1',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='flag1s', to='dashboard.question'),
        ),
        migrations.AlterField(
            model_name='question',
            name='question_type',
            field=models.TextField(choices=[('pre_screening', 'pre_screening'), ('practice', 'practice'), ('survey', 'survey'), ('survey_feedback', 'survey_feedback'), ('physical_assessment', 'physical_assessment'), ('lab_assessment', 'lab_assessment'), ('clinical_assessment', 'clinical_assessment')]),
        ),
    ]
