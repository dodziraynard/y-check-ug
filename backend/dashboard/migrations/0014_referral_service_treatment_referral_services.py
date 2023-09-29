# Generated by Django 4.1.7 on 2023-09-27 00:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('dashboard', '0013_facility'),
    ]

    operations = [
        migrations.CreateModel(
            name='Referral',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('referral_reason', models.TextField()),
                ('service_type', models.CharField(max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('adolescent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.adolescent')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.facility')),
            ],
        ),
        migrations.CreateModel(
            name='Service',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(db_index=True, max_length=200)),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
        ),
        migrations.CreateModel(
            name='Treatment',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('total_service_cost', models.DecimalField(decimal_places=2, max_digits=10)),
                ('date_of_service', models.DateField()),
                ('picture_confirmed', models.BooleanField()),
                ('full_treatment_received', models.BooleanField()),
                ('provided_treaments', models.TextField()),
                ('is_referred', models.TextField()),
                ('no_referral_reason', models.TextField()),
                ('reamrks', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True, db_index=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('adolescent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.adolescent')),
                ('created_by', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
                ('referral', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='dashboard.referral')),
            ],
        ),
        migrations.AddField(
            model_name='referral',
            name='services',
            field=models.ManyToManyField(to='dashboard.service'),
        ),
    ]