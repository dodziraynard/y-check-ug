# Generated by Django 4.1.7 on 2023-09-09 09:30

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('username', models.CharField(max_length=30, unique=True)),
                ('surname', models.CharField(blank=True, max_length=50, null=True)),
                ('other_names', models.CharField(blank=True, max_length=50, null=True)),
                ('phone', models.CharField(blank=True, max_length=20, null=True)),
                ('image', models.ImageField(blank=True, null=True, upload_to='users')),
                ('activated', models.BooleanField(default=False)),
                ('last_login', models.DateTimeField(auto_now=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('is_active', models.BooleanField(default=True)),
                ('is_staff', models.BooleanField(default=False)),
                ('changed_password', models.BooleanField(default=False)),
                ('deleted', models.BooleanField(default=False)),
                ('created_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='created_users', to=settings.AUTH_USER_MODEL)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('updated_by', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='updated_users', to=settings.AUTH_USER_MODEL)),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'permissions': [('reset_password', 'Can reset user password')],
            },
        ),
        migrations.CreateModel(
            name='ActivityLog',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('username', models.CharField(max_length=100)),
                ('action', models.TextField()),
                ('ip', models.CharField(blank=True, max_length=100, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
            ],
        ),
        migrations.CreateModel(
            name='Adolescent',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pid', models.CharField(blank=True, max_length=10, unique=True)),
                ('surname', models.CharField(max_length=50)),
                ('other_names', models.CharField(max_length=50)),
                ('visit_type', models.CharField(blank=True, max_length=50, null=True)),
                ('year', models.CharField(blank=True, max_length=50, null=True)),
                ('consent', models.CharField(blank=True, max_length=50, null=True)),
                ('community', models.CharField(blank=True, max_length=50, null=True)),
                ('picture', models.ImageField(blank=True, null=True, upload_to='images/')),
                ('dob', models.DateField(blank=True, null=True)),
                ('school', models.CharField(blank=True, max_length=50, null=True)),
                ('check_up_location', models.CharField(max_length=50)),
                ('adolescent_type', models.CharField(choices=[('PRIMARY', 'PRIMARY'), ('SECONDARY', 'SECONDARY'), ('COMMUNITY', 'COMMUNITY')], max_length=20)),
                ('gender', models.CharField(blank=True, max_length=50, null=True)),
                ('resident_status', models.CharField(blank=True, max_length=50, null=True)),
                ('questionnaire_completed', models.BooleanField(default=False)),
                ('age_confirmation', models.CharField(blank=True, max_length=50, null=True)),
                ('date', models.DateTimeField(auto_now_add=True)),
                ('created_by', models.ForeignKey(null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='adolescent_created', to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='BasicSchool',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('school_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Community',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('community_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='Option',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('option_id', models.CharField(max_length=255)),
                ('option', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Question',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('cation', models.CharField(blank=True, max_length=200, null=True)),
                ('title', models.CharField(max_length=200)),
                ('type', models.CharField(max_length=100)),
                ('category', models.CharField(choices=[('Home', 'Home'), ('Education and employment', 'Education and employment'), ('Eating', 'Eating'), ('Activities and Peers', 'Activities and Peers'), ('Drugs and alcohol', 'Drugs and alcohol'), ('Sexuality', 'Sexuality'), ('Emotions', 'Emotions'), ('Safety/Security', 'Safety/Security'), ('Oral Hygiene', 'Oral Hygiene'), ('Physical health 1', 'Physical health 1'), ('Physical health 2', 'Physical health 2')], max_length=200)),
                ('subtitle', models.CharField(blank=True, max_length=100, null=True)),
                ('picture', models.ImageField(blank=True, null=True, upload_to='question_pictures/')),
            ],
        ),
        migrations.CreateModel(
            name='SecurityQuestion',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('question', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='SNRSchool',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('school_name', models.CharField(max_length=100)),
            ],
        ),
        migrations.CreateModel(
            name='UserResponse',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('text_response', models.CharField(blank=True, max_length=255, null=True)),
                ('adolescent', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.adolescent')),
                ('option_responses', models.ManyToManyField(blank=True, null=True, to='accounts.option')),
                ('question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.question')),
            ],
        ),
        migrations.CreateModel(
            name='PasswordResetToken',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('token', models.CharField(max_length=64, unique=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='option',
            name='question',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.question'),
        ),
        migrations.CreateModel(
            name='SecurityQuestionAnswer',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('answer', models.CharField(max_length=64)),
                ('security_question', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='accounts.securityquestion')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'security_question')},
            },
        ),
    ]