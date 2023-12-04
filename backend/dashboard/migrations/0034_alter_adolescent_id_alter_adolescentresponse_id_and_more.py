# Generated by Django 4.1.7 on 2023-12-04 23:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0033_alter_adolescent_uuid_alter_adolescentresponse_uuid_and_more'),
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
            model_name='referral',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
        migrations.AlterField(
            model_name='treatment',
            name='id',
            field=models.BigAutoField(db_index=True, primary_key=True, serialize=False),
        ),
    ]
