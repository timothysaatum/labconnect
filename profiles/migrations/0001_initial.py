# Generated by Django 5.0.3 on 2024-05-21 04:52

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DeliveryUserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=7)),
                ('id_number', models.CharField(max_length=50)),
                ('digital_address', models.CharField(max_length=12)),
                ('emmergency_contact', models.CharField(max_length=20)),
                ('bio', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='HealthWorkerProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=7)),
                ('id_number', models.CharField(max_length=50)),
                ('digital_address', models.CharField(max_length=12)),
                ('emmergency_contact', models.CharField(max_length=20)),
                ('bio', models.TextField()),
                ('specialty', models.CharField(max_length=255)),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='LabUserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('gender', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=7)),
                ('id_number', models.CharField(max_length=50)),
                ('digital_address', models.CharField(max_length=12)),
                ('emmergency_contact', models.CharField(max_length=20)),
                ('bio', models.TextField()),
            ],
            options={
                'abstract': False,
            },
        ),
    ]