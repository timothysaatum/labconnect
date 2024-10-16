# Generated by Django 5.1.1 on 2024-10-14 08:10

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('hospital', '0002_initial'),
        ('labs', '0001_initial'),
        ('modelmixins', '0001_initial'),
        ('sample', '0001_initial'),
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.AddField(
            model_name='branch',
            name='branch_manager',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='branchmanagerinvitation',
            name='branch',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='labs.branch'),
        ),
        migrations.AddField(
            model_name='branchmanagerinvitation',
            name='sender',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='branchtest',
            name='branch',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='labs.branch'),
        ),
        migrations.AddField(
            model_name='laboratory',
            name='created_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='branch',
            name='laboratory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='branches', to='labs.laboratory'),
        ),
        migrations.AddField(
            model_name='result',
            name='branch',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='results', to='labs.branch'),
        ),
        migrations.AddField(
            model_name='result',
            name='hospital',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='results', to='hospital.hospital'),
        ),
        migrations.AddField(
            model_name='result',
            name='sample',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='sample.sample'),
        ),
        migrations.AddField(
            model_name='result',
            name='send_by',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='sender', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='test',
            name='branch',
            field=models.ManyToManyField(db_index=True, related_name='tests', through='labs.BranchTest', to='labs.branch'),
        ),
        migrations.AddField(
            model_name='test',
            name='sample_type',
            field=models.ManyToManyField(to='modelmixins.sampletype'),
        ),
        migrations.AddField(
            model_name='result',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='results', to='labs.test'),
        ),
        migrations.AddField(
            model_name='branchtest',
            name='test',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='branch_test', to='labs.test'),
        ),
        migrations.AlterUniqueTogether(
            name='laboratory',
            unique_together={('created_by', 'name')},
        ),
        migrations.AlterUniqueTogether(
            name='branch',
            unique_together={('accreditation_number', 'branch_name', 'digital_address')},
        ),
    ]
