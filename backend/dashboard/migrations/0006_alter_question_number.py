# Generated by Django 4.1.7 on 2023-09-15 22:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0005_rename_order_question_number_alter_question_caption_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='question',
            name='number',
            field=models.IntegerField(unique=True),
        ),
    ]