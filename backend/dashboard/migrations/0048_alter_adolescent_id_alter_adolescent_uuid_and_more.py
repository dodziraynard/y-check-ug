# Generated by Django 4.1.7 on 2023-12-10 12:26

from django.db import migrations, models
import uuid_extensions


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0047_adolescent_uuid_adolescentresponse_uuid_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adolescent',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='adolescent',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='adolescentresponse',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='adolescentresponse',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='checkuplocation',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='checkuplocation',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='facility',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='facility',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='flagcolor',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='flagcolor',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='flagcondition',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='flagcondition',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='flaglabel',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='flaglabel',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='option',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='option',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='previousresponserequirement',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='previousresponserequirement',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='question',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='referral',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='referral',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='section',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='section',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='service',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
        migrations.AlterField(
            model_name='treatment',
            name='id',
            field=models.CharField(db_index=True, default=uuid_extensions.uuid7, max_length=120, primary_key=True, serialize=False, unique=True),
        ),
        migrations.AlterField(
            model_name='treatment',
            name='uuid',
            field=models.UUIDField(default=uuid_extensions.uuid7, null=True),
        ),
    ]
