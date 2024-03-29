# Generated by Django 4.1.7 on 2023-12-07 00:40

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0044_alter_adolescent_id_alter_adolescentresponse_id_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='adolescent',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='adolescentresponse',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='checkuplocation',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='facility',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='flagcolor',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='flagcondition',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='flaglabel',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='option',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='previousresponserequirement',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='question',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='referral',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='section',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='service',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='summaryflag',
            name='uuid',
        ),
        migrations.RemoveField(
            model_name='treatment',
            name='uuid',
        ),
    ]
