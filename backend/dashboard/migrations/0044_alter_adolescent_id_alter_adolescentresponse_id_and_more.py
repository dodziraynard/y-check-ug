# Generated by Django 4.1.7 on 2023-12-06 13:18

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0043_alter_question_caption'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adolescent',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='adolescentresponse',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='checkuplocation',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='facility',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='flagcolor',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='flagcondition',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='flaglabel',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='option',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='previousresponserequirement',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='question',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='referral',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='section',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='service',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='treatment',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
    ]
