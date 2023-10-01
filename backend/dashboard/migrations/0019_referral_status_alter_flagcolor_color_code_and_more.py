# Generated by Django 4.1.7 on 2023-10-01 10:13

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0018_summaryflag_label_summaryflag_adolescent flag'),
    ]

    operations = [
        migrations.AddField(
            model_name='referral',
            name='status',
            field=models.CharField(choices=[(1, 1), (2, 2), (3, 3)], default=1, max_length=100),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='flagcolor',
            name='color_code',
            field=models.CharField(choices=[('#ff0000', 'RED'), ('#ffa500', 'ORANGE'), ('#00ff00', 'GREEN')], max_length=10),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='computed_color_code',
            field=models.CharField(choices=[('#ff0000', 'RED'), ('#ffa500', 'ORANGE'), ('#00ff00', 'GREEN')], max_length=10),
        ),
        migrations.AlterField(
            model_name='summaryflag',
            name='updated_color_code',
            field=models.CharField(blank=True, choices=[('#ff0000', 'RED'), ('#ffa500', 'ORANGE'), ('#00ff00', 'GREEN')], max_length=10, null=True),
        ),
    ]
