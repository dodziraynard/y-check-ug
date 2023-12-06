# Generated by Django 4.1.7 on 2023-12-01 22:33

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('setup', '0006_alter_setupperm_options'),
    ]

    operations = [
        migrations.CreateModel(
            name='NodeConfig',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('node_name', models.CharField(default='Node1', max_length=100)),
                ('is_local', models.BooleanField(default=False)),
                ('up_stream_host', models.URLField(blank=True, null=True)),
                ('sync_enabled', models.BooleanField(default=True)),
                ('adolescents_sync_status', models.CharField(max_length=200)),
                ('treatments_sync_status', models.CharField(max_length=200)),
                ('referrals_sync_status', models.CharField(max_length=200)),
                ('users_sync_status', models.CharField(choices=[('idle', 'idle'), ('progress', 'progress'), ('completed', 'completed')], max_length=100)),
                ('general_sync_message', models.TextField(blank=True, null=True)),
            ],
        ),
    ]