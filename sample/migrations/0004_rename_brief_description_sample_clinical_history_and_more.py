# Generated by Django 5.0.3 on 2024-05-30 09:57

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('sample', '0003_alter_sample_patient_age'),
    ]

    operations = [
        migrations.RenameField(
            model_name='sample',
            old_name='brief_description',
            new_name='clinical_history',
        ),
        migrations.RemoveField(
            model_name='sample',
            name='is_rejected',
        ),
        migrations.AddField(
            model_name='sample',
            name='options',
            field=models.CharField(choices=[('is_received', 'receive sample'), ('is_rejected', 'reject sample')], default='is_received', max_length=30),
            preserve_default=False,
        ),
    ]