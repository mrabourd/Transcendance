# Generated by Django 4.2.3 on 2024-05-31 13:01

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('match', '0002_alter_matchpoints_match'),
    ]

    operations = [
        migrations.AddField(
            model_name='match',
            name='users',
            field=models.ManyToManyField(to=settings.AUTH_USER_MODEL),
        ),
    ]
