# Generated by Django 5.1.1 on 2024-10-14 08:10

import django.db.models.deletion
import uuid
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('delivery', '0001_initial'),
        ('labs', '0001_initial'),
        ('modelmixins', '0001_initial'),
    ]

    operations = [
        migrations.CreateModel(
            name='Patient',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('patient_id', models.CharField(max_length=100, unique=True)),
                ('full_name', models.CharField(max_length=255)),
                ('date_of_birth', models.DateField()),
                ('gender', models.CharField(max_length=10)),
                ('contact_number', models.CharField(max_length=15)),
                ('email', models.EmailField(max_length=254)),
                ('address', models.TextField(blank=True, null=True)),
                ('health_insuarance', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Notification',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('title', models.CharField(max_length=200)),
                ('message', models.CharField(max_length=150)),
                ('is_read', models.BooleanField(default=False)),
                ('is_hidden', models.BooleanField(default=False)),
                ('date_added', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='modelmixins.facility')),
            ],
        ),
        migrations.CreateModel(
            name='Referral',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('facility_type', models.CharField(choices=[('Laboratory', 'Laboratory'), ('Hospital', 'Hospital')], max_length=255)),
                ('patient_name', models.CharField(max_length=200)),
                ('patient_age', models.DateField()),
                ('patient_sex', models.CharField(choices=[('Male', 'Male'), ('Female', 'Female')], max_length=20)),
                ('clinical_history', models.TextField(blank=True, null=True)),
                ('attachment', models.URLField()),
                ('requires_phlebotomist', models.BooleanField(default=False)),
                ('sender_full_name', models.CharField(blank=True, max_length=200, null=True)),
                ('sender_phone', models.CharField(blank=True, max_length=20, null=True)),
                ('sender_email', models.EmailField(blank=True, max_length=254, null=True)),
                ('referral_status', models.CharField(choices=[('Request Made', 'Request Made'), ('Sample Received by Delivery', 'Sample Received by Delivery'), ('Sample Received by Lab', 'Sample Received by Lab'), ('Testing Sample', 'Testing Sample'), ('Request Completed', 'Request Completed'), ('Request Accepted', 'Request Accepted')], max_length=100)),
                ('date_referred', models.DateTimeField(auto_now_add=True)),
                ('delivery', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to='delivery.delivery')),
                ('referring_facility', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='referrals', to='modelmixins.facility')),
                ('to_laboratory', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='modelmixins.facility')),
            ],
        ),
        migrations.CreateModel(
            name='Sample',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('sample_status', models.CharField(choices=[('Pending', 'Pending'), ('Received', 'Received'), ('Processed', 'Processed'), ('Rejected', 'Rejected')], db_index=True, default='Pending', max_length=50)),
                ('rejection_reason', models.TextField(blank=True, null=True)),
                ('date_collected', models.DateTimeField(auto_now_add=True)),
                ('date_modified', models.DateTimeField(auto_now=True)),
                ('referral', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='samples', to='sample.referral')),
                ('sample_type', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='modelmixins.sampletype')),
            ],
        ),
        migrations.CreateModel(
            name='SampleTest',
            fields=[
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('Pending', 'Pending'), ('Received', 'Received'), ('Processed', 'Processed'), ('Rejected', 'Rejected')], db_index=True, default='Pending', max_length=50)),
                ('result', models.URLField(blank=True, null=True)),
                ('date_completed', models.DateTimeField(blank=True, null=True)),
                ('sample', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sample_tests', to='sample.sample')),
                ('test', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sample_tests', to='labs.test')),
            ],
        ),
        migrations.CreateModel(
            name='SampleTrackingHistory',
            fields=[
                ('id', models.UUIDField(db_index=True, default=uuid.uuid4, editable=False, primary_key=True, serialize=False)),
                ('status', models.CharField(choices=[('Request Made', 'Request Made'), ('Sample Received by Delivery', 'Sample Received by Delivery'), ('Sample Received by Lab', 'Sample Received by Lab'), ('Testing Sample', 'Testing Sample'), ('Request Completed', 'Request Completed'), ('Request Accepted', 'Request Accepted')], db_index=True, max_length=50)),
                ('location', models.CharField(blank=True, max_length=255, null=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
                ('sample', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tracking_history', to='sample.sample')),
            ],
            options={
                'verbose_name_plural': 'Sample Tracking Histories',
            },
        ),
    ]
