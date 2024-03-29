# Generated by Django 4.1.7 on 2024-03-24 22:38

from django.db import migrations


def compute_and_store_age_for_adolescents(apps, schema_editor):
    if schema_editor.connection.alias != "default":
        return
    Adolescent = apps.get_model('dashboard', 'Adolescent')
    for adolescent in Adolescent.objects.all():
        adolescent.save()


class Migration(migrations.Migration):

    dependencies = [
        ('dashboard', '0087_adolescent_age'),
    ]

    operations = [
        migrations.RunPython(compute_and_store_age_for_adolescents),
    ]
