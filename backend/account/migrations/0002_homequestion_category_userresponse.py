# Generated by Django 4.2.3 on 2023-09-04 15:21

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ("account", "0001_initial"),
    ]

    operations = [
        migrations.AddField(
            model_name="homequestion",
            name="category",
            field=models.CharField(
                choices=[
                    ("Home", "Home"),
                    ("Education and employment", "Education and employment"),
                    ("Eating", "Eating"),
                    ("Activities and Peers", "Activities and Peers"),
                    ("Drugs and alcohol", "Drugs and alcohol"),
                    ("Sexuality", "Sexuality"),
                    ("Emotions", "Emotions"),
                    ("Safety/Security", "Safety/Security"),
                    ("Oral Hygiene", "Oral Hygiene"),
                    ("Physical health 1", "Physical health 1"),
                    ("Physical health 2", "Physical health 2"),
                ],
                default="Home",
                max_length=200,
            ),
            preserve_default=False,
        ),
        migrations.CreateModel(
            name="UserResponse",
            fields=[
                (
                    "id",
                    models.BigAutoField(
                        auto_created=True,
                        primary_key=True,
                        serialize=False,
                        verbose_name="ID",
                    ),
                ),
                ("response", models.CharField(blank=True, max_length=255, null=True)),
                (
                    "question_title",
                    models.CharField(blank=True, max_length=255, null=True),
                ),
                (
                    "adolescent",
                    models.ForeignKey(
                        on_delete=django.db.models.deletion.CASCADE,
                        to="account.adolescent",
                    ),
                ),
            ],
        ),
    ]
