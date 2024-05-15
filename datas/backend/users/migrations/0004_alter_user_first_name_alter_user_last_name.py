# Generated by Django 4.2.3 on 2024-05-03 11:52

import django.core.validators
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('users', '0003_alter_user_status'),
    ]

    operations = [
        migrations.AlterField(
            model_name='user',
            name='first_name',
            field=models.CharField(blank=True, max_length=30, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
        migrations.AlterField(
            model_name='user',
            name='last_name',
            field=models.CharField(blank=True, max_length=150, validators=[django.core.validators.MinLengthValidator(1)]),
        ),
    ]