# Generated by Django 5.0.2 on 2024-04-19 17:27

import django.core.validators
import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('labs', '0002_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='department',
            name='department_name',
            field=models.CharField(choices=[('Haematology', 'Haematology'), ('Microbiology', 'Microbiology'), ('Parasitology', 'Parasitology'), ('Clinical Chemistry', 'Clinical Chemistry'), ('Molecular Biology', 'Molecular Biology')], db_index=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='department',
            name='laboratory',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='departments', to='labs.laboratory'),
        ),
        migrations.AlterField(
            model_name='laboratory',
            name='name',
            field=models.CharField(db_index=True, max_length=200, validators=[django.core.validators.MinLengthValidator(10), django.core.validators.MaxLengthValidator(200)]),
        ),
        migrations.AlterField(
            model_name='test',
            name='department',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tests', to='labs.department'),
        ),
        migrations.AlterField(
            model_name='test',
            name='name',
            field=models.CharField(db_index=True, max_length=200),
        ),
        migrations.AlterUniqueTogether(
            name='department',
            unique_together={('laboratory', 'department_name')},
        ),
        migrations.AlterUniqueTogether(
            name='laboratory',
            unique_together={('name',)},
        ),
        migrations.AlterUniqueTogether(
            name='test',
            unique_together={('department', 'name')},
        ),
    ]