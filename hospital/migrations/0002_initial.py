# Generated by Django 5.0.2 on 2024-03-31 07:00

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('hospital', '0001_initial'),
        ('labs', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='sample',
            name='lab',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='labs.laboratory'),
        ),
    ]