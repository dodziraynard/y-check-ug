# Generated by Django 4.1.7 on 2023-11-19 16:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0030_question_to_be_confirmed_alter_adolescent_consent'),
    ]

    operations = [
        migrations.AddField(
            model_name='flagcondition',
            name='name',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='flagcolor',
            name='color_code',
            field=models.CharField(choices=[('#808080', 'GREY'), ('#ff0000', 'RED'), ('#ffa500', 'ORANGE'), ('#00ff00', 'GREEN')], max_length=10),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='computed_color_code',
            field=models.CharField(choices=[('#808080', 'GREY'), ('#ff0000', 'RED'), ('#ffa500', 'ORANGE'), ('#00ff00', 'GREEN')], max_length=10),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='updated_color_code',
            field=models.CharField(blank=True, choices=[('#808080', 'GREY'), ('#ff0000', 'RED'), ('#ffa500', 'ORANGE'), ('#00ff00', 'GREEN')], max_length=10, null=True),
        ),
    ]
