# Generated by Django 5.0.4 on 2024-08-18 16:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0101_referral_study_phase'),
    ]

    operations = [
        migrations.AddField(
            model_name='flaglabel',
            name='exclude_if_not_flagged',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='final_color_code',
            field=models.CharField(blank=True, choices=[('#808080', 'GREY'), ('#3c4e77', 'DARK_BLUE'), ('#ff0000', 'RED'), ('#ffa500', 'ORANGE'), ('#00ff00', 'GREEN')], default='#808080', max_length=10, null=True),
        ),
    ]