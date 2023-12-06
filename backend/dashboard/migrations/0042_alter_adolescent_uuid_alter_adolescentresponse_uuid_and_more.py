# Generated by Django 4.1.7 on 2023-12-06 02:51

from django.db import migrations, models
import uuid


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0040_facility_created_at_facility_localnode_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='adolescent',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='adolescentresponse',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='checkuplocation',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='facility',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='flagcolor',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='flagcondition',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='flaglabel',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='option',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='previousresponserequirement',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='question',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='referral',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='section',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='service',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
        migrations.AlterField(
            model_name='treatment',
            name='uuid',
            field=models.UUIDField(db_index=True, default=uuid.uuid4),
        ),
    ]