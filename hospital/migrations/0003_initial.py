# Generated by Django 5.0.2 on 2024-03-31 07:00

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('hospital', '0002_initial'),
        ('labs', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='sample',
            name='send_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='sample',
            name='tests',
            field=models.ManyToManyField(to='labs.test'),
        ),
        migrations.AddField(
            model_name='ward',
            name='hospital',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hospital.hospital'),
        ),
        migrations.AddField(
            model_name='sample',
            name='ward',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='hospital.ward'),
        ),
    ]