# Generated by Django 4.2.3 on 2024-05-29 10:49

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('match', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='alias1',
            field=models.TextField(blank=True, max_length=50),
        ),
        migrations.AddField(
            model_name='match',
            name='alias2',
            field=models.TextField(blank=True, max_length=50),
        ),
    ]
